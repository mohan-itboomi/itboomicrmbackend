const service = require('../services/timerService');

const handle = (action, status = 200) => async (req, res, next) => {
  try {
    const data = await action(req);
    res.status(status).json({ success: true, data });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ success: false, message: error.message });
    next(error);
  }
};

module.exports = {
  start: handle(req => service.start(req.body.taskId, req.user._id), 201),
  pause: handle(req => service.pause(req.user._id, req.body.reason)),
  resume: handle(req => service.resume(req.user._id, req.body.workSessionId)),
  complete: handle(req => service.complete(req.user._id, req.body.taskId, req.body.completedDescription, req.body.challengesNotes)),
  current: handle(req => service.current(req.user._id)),
  paused: handle(req => service.paused(req.user._id)),
  overview: handle(req => service.overview(req.user)),
  taskHistory: handle(req => service.taskHistory(req.params.taskId, req.user._id)),
  projectSummary: handle(req => service.projectSummary(req.params.projectId, req.user)),
};