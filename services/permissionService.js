const { Role, Permission } = require('../models');

const listPermissions = () => Permission.find().sort({ module: 1, action: 1, name: 1 });
const listRoles = () => Role.find().populate('permissions').sort({ name: 1 });
const updateRolePermissions = (roleId, permissions) => Role.findByIdAndUpdate(roleId, { permissions }, { new: true, runValidators: true }).populate('permissions');
const createPermission = data => Permission.create(data);
const createRole = data => Role.create(data);

module.exports = { listPermissions, listRoles, updateRolePermissions, createPermission, createRole };