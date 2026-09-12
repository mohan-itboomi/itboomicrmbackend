const express = require('express');
const controller = require('../controllers/moduleController');

module.exports = ({ auth, projectManager }) => {
  const router = express.Router({ mergeParams: true });
  router.get('/:projectId/modules', auth, controller.getModules);
  router.post('/:projectId/modules', auth, projectManager, controller.createProjectModule);
  return router;
};