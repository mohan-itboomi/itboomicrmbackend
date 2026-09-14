const { User, Project, Task, Bug, WorkSession, DailyWork } = require('../models');

const dayRange = value => {
  const start = value ? new Date(value) : new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { $gte: start, $lt: end };
};

const summary = async date => {
  const today = dayRange(date);
  const [employees, activeEmployees, projects, onboardProjects, tasks, bugs, employeeDirectory, working, activeSessions, projectTime, employeeTime, activeWork, bugsByProject, taskBreakdown] = await Promise.all([
    User.countDocuments({ isDeleted: false }),
    User.countDocuments({ isDeleted: false, status: 'Active' }),
    Project.countDocuments({ isDeleted: false }),
    Project.find({ isDeleted: false, status: 'On Board' }).select('_id name client startDate endDate duration priority status').sort({ endDate: 1, name: 1 }).lean(),
    Task.countDocuments({ isDeleted: false }),
    Task.countDocuments({ isDeleted: false, category: 'Bug Fixing' }),
    User.find({ isDeleted: false, status: 'Active' }).select('_id name email role').sort({ name: 1 }).lean(),
    DailyWork.aggregate([{ $match: { date: today } }, { $group: { _id: null, minutes: { $sum: '$totalWorkingMinutes' }, taskMinutes: { $sum: '$totalTaskMinutes' } } }]),
    WorkSession.distinct('employeeId', { status: { $in: ['Running', 'Paused'] } }),
    WorkSession.aggregate([{ $match: { createdAt: today } }, { $group: { _id: '$projectId', minutes: { $sum: '$durationMinutes' } } }, { $lookup: { from: 'projects', localField: '_id', foreignField: '_id', as: 'project' } }, { $unwind: { path: '$project', preserveNullAndEmptyArrays: true } }, { $project: { _id: 1, name: '$project.name', minutes: 1 } }]),
    WorkSession.aggregate([{ $match: { createdAt: today } }, { $group: { _id: '$employeeId', minutes: { $sum: '$durationMinutes' } } }, { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'employee' } }, { $unwind: { path: '$employee', preserveNullAndEmptyArrays: true } }, { $project: { _id: 1, name: '$employee.name', minutes: 1 } }]),
    WorkSession.aggregate([{ $match: { status: { $in: ['Running', 'Paused'] } } }, { $lookup: { from: 'users', localField: 'employeeId', foreignField: '_id', as: 'employee' } }, { $unwind: { path: '$employee', preserveNullAndEmptyArrays: true } }, { $lookup: { from: 'tasks', localField: 'taskId', foreignField: '_id', as: 'task' } }, { $unwind: { path: '$task', preserveNullAndEmptyArrays: true } }, { $lookup: { from: 'projects', localField: 'projectId', foreignField: '_id', as: 'project' } }, { $unwind: { path: '$project', preserveNullAndEmptyArrays: true } }, { $project: { _id: 1, employeeId: 1, employeeName: '$employee.name', taskId: 1, taskTitle: '$task.title', taskCategory: '$task.category', projectName: '$project.name', startedAt: 1, status: 1 } }, { $sort: { startedAt: 1 } }]),
    Bug.aggregate([{ $group: { _id: '$projectId', count: { $sum: 1 } } }, { $lookup: { from: 'projects', localField: '_id', foreignField: '_id', as: 'project' } }, { $unwind: { path: '$project', preserveNullAndEmptyArrays: true } }, { $project: { _id: 1, name: '$project.name', count: 1 } }, { $sort: { count: -1 } }]),
    Task.aggregate([{ $match: { isDeleted: false } }, { $group: { _id: { category: '$category', status: '$status' }, count: { $sum: 1 } } }]),
  ]);
  const [taskStatus, overdue] = await Promise.all([
    Task.aggregate([{ $match: { isDeleted: false } }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
    Task.countDocuments({ isDeleted: false, dueDate: { $lt: new Date(), $exists: true }, status: { $nin: ['Completed', 'Cancelled'] } }),
  ]);
  return { onboardProjects, counts: { employees, activeEmployees, projects, onboardProjects: onboardProjects.length, tasks, bugs, overdueTasks: overdue, activeTimers: activeSessions.length }, taskStatus, taskBreakdown, workingHours: working[0] || { minutes: 0, taskMinutes: 0 }, projectTime, employeeTime, employeeDirectory, activeWork, bugsByProject };
};

module.exports = { summary };
