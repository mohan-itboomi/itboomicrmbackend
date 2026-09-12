const { Task, Bug, WorkSession, PauseSession, DailyWork } = require('../models');

const fail = (message, status = 400) => Object.assign(new Error(message), { status });

const getRunningSession = employeeId =>
  WorkSession.findOne({ employeeId, status: 'Running' }).sort({ createdAt: -1 });

const getTask = async (taskId, employeeId) => {
  const task = await Task.findOne({ _id: taskId, isDeleted: false });
  if (!task) throw fail('Task not found', 404);
  if (task.assignedTo && String(task.assignedTo) !== String(employeeId)) {
    throw fail('You can only track time for an assigned task', 403);
  }
  return task;
};

const minutesBetween = (start, end) => Math.max(0, Math.floor((end - start) / 60000));

const updateDailyWork = async (employeeId, date, taskMinutes, breakMinutes) => {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  await DailyWork.findOneAndUpdate(
    { employeeId, date: day },
    { $inc: { totalTaskMinutes: taskMinutes, totalBreakMinutes: breakMinutes } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
};

const start = async (taskId, employeeId) => {
  const task = await getTask(taskId, employeeId);
  const running = await getRunningSession(employeeId);
  if (running) throw fail('You already have an active timer', 409);
  if (task.status === 'Completed' || task.status === 'Cancelled') {
    throw fail('Completed or cancelled tasks cannot be started');
  }
  const now = new Date();
  const session = await WorkSession.create({
    taskId,
    projectId: task.projectId,
    employeeId,
    startTime: now,
    startedAt: now,
    status: 'Running',
  });
  await Task.findByIdAndUpdate(taskId, { status: 'In Progress', startDate: task.startDate || now });
  await Bug.updateMany({ taskId }, { $set: { startedAt: now, status: 'In Progress' } });
  return session;
};

const pause = async (employeeId, reason) => {
  const session = await getRunningSession(employeeId);
  if (!session) throw fail('No active timer found', 404);
  const openPause = await PauseSession.findOne({ workSessionId: session._id, endTime: null });
  if (openPause) throw fail('Timer is already paused', 409);
  const now = new Date();
  const pauseSession = await PauseSession.create({
    workSessionId: session._id,
    taskId: session.taskId,
    employeeId,
    startTime: now,
    reason,
  });
  session.status = 'Paused';
  await session.save();
  await Task.findByIdAndUpdate(session.taskId, { status: 'Paused' });
  return pauseSession;
};

const resume = async (employeeId, workSessionId) => {
  const session = await WorkSession.findOne({ _id: workSessionId, employeeId, status: 'Paused' });
  if (!session) throw fail('No active timer found', 404);
  const openPause = await PauseSession.findOne({ workSessionId: session._id, endTime: null }).sort({ startTime: -1 });
  if (!openPause) throw fail('Timer is not paused', 409);
  const now = new Date();
  openPause.endTime = now;
  openPause.durationMinutes = minutesBetween(openPause.startTime, now);
  await openPause.save();
  session.status = 'Running';
  await session.save();
  await Task.findByIdAndUpdate(session.taskId, { status: 'In Progress' });
  return session;
};

const stop = async employeeId => {
  const session = await getRunningSession(employeeId);
  if (!session) throw fail('No active timer found', 404);
  const now = new Date();
  const openPause = await PauseSession.findOne({ workSessionId: session._id, endTime: null });
  let breakMinutes = 0;
  if (openPause) {
    openPause.endTime = now;
    openPause.durationMinutes = minutesBetween(openPause.startTime, now);
    breakMinutes = openPause.durationMinutes;
    await openPause.save();
  }
  const pauses = await PauseSession.find({ workSessionId: session._id });
  breakMinutes = pauses.reduce((total, item) => total + (item.durationMinutes || 0), 0);
  const durationMinutes = Math.max(0, minutesBetween(session.startedAt || session.startTime, now) - breakMinutes);
  session.endTime = now;
  session.endedAt = now;
  session.durationMinutes = durationMinutes;
  session.status = 'Completed';
  await session.save();
  await Task.findByIdAndUpdate(session.taskId, { $inc: { actualMinutes: durationMinutes }, status: 'In Progress' });
  await updateDailyWork(employeeId, session.startedAt || session.startTime, durationMinutes, breakMinutes);
  return session;
};

const complete = async (employeeId, taskId, completedDescription, challengesNotes) => {
  const task = await Task.findOne({ _id: taskId, assignedTo: employeeId, isDeleted: false });
  if (!task) throw fail('Task is not assigned to this employee', 403);
  const session = await WorkSession.findOne({ employeeId, taskId, status: { $in: ['Running', 'Paused'] } }).sort({ createdAt: -1 });
  if (!session) {
    const completedAt = new Date();
    await Task.findByIdAndUpdate(taskId, { status: 'Completed', completionPercentage: 100, completedDescription, challengesNotes, completedAt });
    await Bug.updateMany({ taskId }, { $set: { completedAt, status: 'Fixed' } });
    await recalculateProgress(task.projectId);
    return { task, session: null };
  }
  const now = new Date();
  const openPause = await PauseSession.findOne({ workSessionId: session._id, endTime: null });
  if (openPause) {
    openPause.endTime = now;
    openPause.durationMinutes = minutesBetween(openPause.startTime, now);
    await openPause.save();
  }
  const pauses = await PauseSession.find({ workSessionId: session._id });
  const breakMinutes = pauses.reduce((total, item) => total + (item.durationMinutes || 0), 0);
  const durationMinutes = Math.max(0, minutesBetween(session.startedAt || session.startTime, now) - breakMinutes);
  session.endTime = now;
  session.endedAt = now;
  session.durationMinutes = durationMinutes;
  session.status = 'Completed';
  await session.save();
  await Task.findByIdAndUpdate(taskId, { status: 'Completed', completionPercentage: 100, completedDescription, challengesNotes, completedAt: now, $inc: { actualMinutes: durationMinutes } });
  await Bug.updateMany({ taskId }, { $set: { completedAt: now, status: 'Fixed' } });
  await updateDailyWork(employeeId, session.startedAt || session.startTime, durationMinutes, breakMinutes);
  await recalculateProgress(task.projectId);
  return { task, session };
};

const current = async employeeId => {
  const session = await getRunningSession(employeeId);
  if (!session) return null;
  const [pauseSession, pauses] = await Promise.all([
    PauseSession.findOne({ workSessionId: session._id, endTime: null }).sort({ startTime: -1 }),
    PauseSession.find({ workSessionId: session._id, endTime: { $ne: null } }).select('durationMinutes'),
  ]);
  await session.populate('taskId', 'title projectId');
  return {
    session,
    paused: Boolean(pauseSession),
    pauseSession,
    pausedMinutes: pauses.reduce((total, item) => total + (item.durationMinutes || 0), 0),
  };
};

const paused = async employeeId => WorkSession.find({ employeeId, status: 'Paused' }).sort({ updatedAt: -1 }).populate('taskId', 'title projectId');

const taskHistory = (taskId, employeeId) =>
  WorkSession.find({ taskId, employeeId }).sort({ createdAt: -1 }).populate('employeeId', 'name email');

const projectSummary = async (projectId, user) => {
  const canViewAll = ['admin', 'bd', 'team-lead', 'project-coordinator'].includes(user?.role);
  const taskFilter = { projectId, isDeleted: false };
  if (!canViewAll) taskFilter.assignedTo = user._id;
  const tasks = await Task.find(taskFilter)
    .populate('assignedTo', 'name email')
    .populate('moduleId', 'name')
    .sort({ category: 1, createdAt: -1 });
  const taskIds = tasks.map(task => task._id);
  const [sessions, bugTasks] = await Promise.all([
    WorkSession.find({ taskId: { $in: taskIds } }).sort({ startTime: -1 }),
    Bug.find({ taskId: { $in: taskIds } }).select('taskId'),
  ]);
  const bugTaskIds = new Set(bugTasks.map(bug => String(bug.taskId)));
  const pauses = await PauseSession.find({ workSessionId: { $in: sessions.map(session => session._id) } }).sort({ startTime: 1 });
  const taskRows = tasks.map(task => {
    const taskSessions = sessions.filter(session => String(session.taskId) === String(task._id));
    return {
      task,
      category: task.category || (bugTaskIds.has(String(task._id)) ? 'Bug Fixing' : 'Project Implementation'),
      sessions: taskSessions.map(session => ({
        session,
        pauses: pauses.filter(pause => String(pause.workSessionId) === String(session._id)),
      })),
      totalMinutes: taskSessions.reduce((total, session) => total + (session.durationMinutes || 0), 0),
    };
  });
  const totals = taskRows.reduce((result, row) => {
    result[row.category] = (result[row.category] || 0) + row.totalMinutes;
    return result;
  }, { 'Project Implementation': 0, 'Bug Fixing': 0 });
  return { tasks: taskRows, totals, overall: totals['Project Implementation'] + totals['Bug Fixing'] };
};

const overview = async user => {
  if (!['admin', 'team-lead', 'project-coordinator'].includes(user?.role)) {
    throw fail('Timer overview is restricted to team leads and project coordinators', 403);
  }
  const sessions = await WorkSession.find({ status: { $in: ['Running', 'Paused'] } })
    .sort({ updatedAt: -1 })
    .populate('employeeId', 'name email employeeId role')
    .populate('taskId', 'title')
    .populate('projectId', 'name');
  const sessionIds = sessions.map(session => session._id);
  const pauses = await PauseSession.find({ workSessionId: { $in: sessionIds } })
    .sort({ startTime: -1 })
    .select('workSessionId startTime endTime durationMinutes reason');
  return sessions.map(session => ({
    session,
    pauses: pauses.filter(pause => String(pause.workSessionId) === String(session._id)),
  }));
};

module.exports = { start, pause, resume, stop, complete, current, paused, taskHistory, projectSummary, overview };