const express = require('express');
const controller = require('../controllers/reportController');
module.exports = ({ auth }) => {
  const router = express.Router();
  router.get('/daily', auth, controller.daily);
  router.get('/employees/:employeeId', auth, controller.employee);
  router.get('/projects/:projectId', auth, controller.project);
  router.get('/timesheets', auth, controller.timesheet);
  router.get('/bugs/analytics', auth, controller.bugAnalytics);
  router.get('/timesheets/export', auth, controller.exportTimesheet);
  return router;
};