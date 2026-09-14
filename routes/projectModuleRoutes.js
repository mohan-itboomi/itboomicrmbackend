const express = require('express');
const controller = require('../controllers/moduleController');
const taskController = require('../controllers/taskController');

module.exports = ({ auth, projectManager, moduleDeleteManager, taskManager }) => {
  const router = express.Router({ mergeParams: true });
  router.get('/:projectId/modules', auth, controller.getModules);
  router.post('/:projectId/modules', auth, projectManager, controller.createProjectModule);
  router.put('/:projectId/modules/:id', auth, projectManager, controller.updateProjectModule);
  router.delete('/:projectId/modules/:id', auth, moduleDeleteManager, controller.deleteProjectModule);
  router.put('/:projectId/tasks/:id', auth, taskManager, taskController.updateTask);
  router.delete('/:projectId/tasks/:id', auth, taskManager, taskController.deleteTask);
  return router;
};