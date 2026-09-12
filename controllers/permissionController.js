const service = require('../services/permissionService');
const response = action => async (req, res, next) => { try { res.json({ success: true, data: await action(req) }); } catch (error) { next(error); } };
module.exports = {
  listPermissions: response(() => service.listPermissions()),
  listRoles: response(() => service.listRoles()),
  updateRolePermissions: response(req => service.updateRolePermissions(req.params.id, req.body.permissions || [])),
  createPermission: async (req, res, next) => { try { res.status(201).json({ success: true, data: await service.createPermission(req.body) }); } catch (error) { next(error); } },
  createRole: async (req, res, next) => { try { res.status(201).json({ success: true, data: await service.createRole(req.body) }); } catch (error) { next(error); } },
};