const express = require('express');
const controller = require('../controllers/timerController');

module.exports = ({ auth }) => {
  const router = express.Router();
  router.get('/current', auth, controller.current);
  router.get('/paused', auth, controller.paused);
  router.get('/overview', auth, controller.overview);
  router.post('/start', auth, controller.start);
  router.post('/pause', auth, controller.pause);
  router.post('/resume', auth, controller.resume);
  router.post('/complete', auth, controller.complete);
  router.get('/tasks/:taskId', auth, controller.taskHistory);
  router.get('/projects/:projectId/summary', auth, controller.projectSummary);
  return router;
};