const express = require('express');
const controller = require('../controllers/permissionController');
module.exports = ({ auth, admin }) => {
  const router = express.Router();
  router.get('/permissions', auth, admin, controller.listPermissions);
  router.post('/permissions', auth, admin, controller.createPermission);
  router.get('/roles', auth, admin, controller.listRoles);
  router.post('/roles', auth, admin, controller.createRole);
  router.patch('/roles/:id/permissions', auth, admin, controller.updateRolePermissions);
  return router;
};