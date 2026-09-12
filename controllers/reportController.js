const service = require('../services/reportService');
const respond = action => async (req, res, next) => { try { res.json({ success: true, data: await action(req) }); } catch (error) { next(error); } };
module.exports = {
  daily: respond(req => service.daily(req.query.from, req.query.to, req.user)),
  employee: respond(req => service.employee(req.params.employeeId, req.query.from, req.query.to, req.user)),
  project: respond(req => service.project(req.params.projectId, req.query.from, req.query.to, req.user)),
  timesheet: respond(req => service.timesheet(req.query, req.user)),
  bugAnalytics: respond(req => service.bugAnalytics(req.query.from, req.query.to, req.query.projectId, req.user)),
  exportTimesheet: async (req, res, next) => { try { const rows = await service.timesheet(req.query, req.user); res.type('text/csv').attachment('timesheet.csv').send(service.csv(rows)); } catch (error) { next(error); } },
};