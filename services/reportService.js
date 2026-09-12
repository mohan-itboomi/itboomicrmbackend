const { User, Task, WorkSession, PauseSession, DailyWork } = require('../models');
const canViewAll = user => ['admin', 'project-coordinator', 'team-lead'].includes(user?.role);

const range = (from, to) => {
  const start = from ? new Date(from) : new Date(new Date().setHours(0, 0, 0, 0));
  const end = to ? new Date(to) : new Date();
  end.setHours(23, 59, 59, 999);
  return { $gte: start, $lte: end };
};

const daily = async (from, to, user) => {
  const filter = { date: range(from, to) };
  if (!canViewAll(user)) filter.employeeId = user._id;
  return DailyWork.find(filter).populate('employeeId', 'name email employeeId').sort({ date: -1 });
};
const employee = async (employeeId, from, to, user) => {
  const targetEmployeeId = canViewAll(user) ? employeeId : user._id;
  const [employeeUser, sessions, days] = await Promise.all([
    User.findById(targetEmployeeId).select('name email employeeId role'),
    WorkSession.find({ employeeId: targetEmployeeId, createdAt: range(from, to) }).populate('taskId', 'title projectId').sort({ createdAt: -1 }),
    DailyWork.find({ employeeId: targetEmployeeId, date: range(from, to) }).sort({ date: -1 }),
  ]);
  return { user: employeeUser, sessions, days };
};
const project = async (projectId, from, to, user) => {
  const filter = { projectId, createdAt: range(from, to) };
  if (!canViewAll(user)) filter.employeeId = user._id;
  return WorkSession.find(filter).populate('taskId', 'title assignedTo').populate('employeeId', 'name email').sort({ createdAt: -1 });
};
const addPauseMinutes = async sessions => {
  const sessionIds = sessions.map(session => session._id);
  const pauses = await PauseSession.aggregate([
    { $match: { workSessionId: { $in: sessionIds } } },
    { $group: { _id: '$workSessionId', minutes: { $sum: { $ifNull: ['$durationMinutes', 0] } } } },
  ]);
  const pauseBySession = new Map(pauses.map(item => [String(item._id), item.minutes]));
  return sessions.map(session => ({
    ...session.toObject(),
    pauseMinutes: pauseBySession.get(String(session._id)) || 0,
  }));
};
const timesheet = async (query = {}, user) => {
  const filter = { createdAt: range(query.from, query.to) };
  if (canViewAll(user) && query.employeeId) filter.employeeId = query.employeeId;
  if (!canViewAll(user)) filter.employeeId = user._id;
  if (query.projectId) filter.projectId = query.projectId;
  const sessions = await WorkSession.find(filter).populate('employeeId', 'name email').populate('taskId', 'title').populate('projectId', 'name').sort({ createdAt: -1 });
  return addPauseMinutes(sessions);
};
const bugAnalytics = async (from, to, projectId, user) => {
  const createdAt = range(from, to);
  const bugFilter = canViewAll(user) ? { createdAt } : { createdAt, $or: [{ reportedBy: user._id }, { assignedTo: user._id }] };
  if (projectId) bugFilter.projectId = projectId;
  const sessionEmployeeFilter = canViewAll(user) ? {} : { 'sessions.employeeId': user._id };
  const [total, status, byProject, byReporter, byAssignee, time] = await Promise.all([
    require('../models').Bug.countDocuments(bugFilter),
    require('../models').Bug.aggregate([{ $match: bugFilter }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
    require('../models').Bug.aggregate([{ $match: bugFilter }, { $group: { _id: '$projectId', count: { $sum: 1 } } }, { $lookup: { from: 'projects', localField: '_id', foreignField: '_id', as: 'project' } }, { $unwind: { path: '$project', preserveNullAndEmptyArrays: true } }, { $project: { _id: 1, name: '$project.name', count: 1 } }, { $sort: { count: -1 } }]),
    require('../models').Bug.aggregate([{ $match: bugFilter }, { $group: { _id: '$reportedBy', count: { $sum: 1 } } }, { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'employee' } }, { $unwind: { path: '$employee', preserveNullAndEmptyArrays: true } }, { $project: { _id: 1, name: '$employee.name', count: 1 } }, { $sort: { count: -1 } }]),
    require('../models').Bug.aggregate([{ $match: bugFilter }, { $group: { _id: '$assignedTo', count: { $sum: 1 } } }, { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'employee' } }, { $unwind: { path: '$employee', preserveNullAndEmptyArrays: true } }, { $project: { _id: 1, name: '$employee.name', count: 1 } }, { $sort: { count: -1 } }]),
    require('../models').Bug.aggregate([{ $match: { ...bugFilter, taskId: { $ne: null } } }, { $lookup: { from: 'worksessions', localField: 'taskId', foreignField: 'taskId', as: 'sessions' } }, { $unwind: { path: '$sessions', preserveNullAndEmptyArrays: true } }, { $match: sessionEmployeeFilter }, { $group: { _id: null, minutes: { $sum: { $ifNull: ['$sessions.durationMinutes', 0] } } } }]),
  ]);
  return { total, status, byProject, byReporter, byAssignee, bugWorkMinutes: time[0]?.minutes || 0 };
};
const csv = rows => {
  const header = 'employee,task,project,start,end,pauseMinutes,durationMinutes,status';
  const escape = value => `"${String(value || '').replace(/"/g, '""')}"`;
  return [header, ...rows.map(row => [row.employeeId?.name, row.taskId?.title, row.projectId?.name, row.startTime?.toISOString(), row.endTime?.toISOString(), row.pauseMinutes, row.durationMinutes, row.status].map(escape).join(','))].join('\n');
};

module.exports = { daily, employee, project, timesheet, bugAnalytics, csv };