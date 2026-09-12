const service = require("../services/employeeService");
const generateEmployeeId = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: { employeeId: await service.generateEmployeeId() },
    });
  } catch (e) {
    next(e);
  }
};
const getEmployeeDropdown = async (req, res, next) => {
  try {
    res.json({ success: true, data: await service.getEmployeeDropdown() });
  } catch (e) {
    next(e);
  }
};
const getEmployees = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: await service.getEmployees({
        query: req.query,
        page: +req.query.page || 1,
        limit: +req.query.limit || 20,
      }),
    });
  } catch (e) {
    next(e);
  }
};
const getEmployeeById = async (req, res, next) => {
  try {
    const data = await service.getEmployeeById(req.params.id);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};
const createEmployee = async (req, res, next) => {
  try {
    res
      .status(201)
      .json({
        success: true,
        message: "Employee created successfully",
        data: await service.createEmployee(req.body),
      });
  } catch (e) {
    next(e);
  }
};
const updateEmployee = async (req, res, next) => {
  try {
    const data = await service.updateEmployee(req.params.id, req.body);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};
const updateStatus = async (req, res, next) => {
  try {
    if (!["Active", "Inactive"].includes(req.body.status))
      return res
        .status(400)
        .json({ success: false, message: "Status must be Active or Inactive" });
    const data = await service.updateStatus(req.params.id, req.body.status);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};
const deleteEmployee = async (req, res, next) => {
  try {
    const data = await service.deleteEmployee(req.params.id, req.user._id);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};
module.exports = {
  generateEmployeeId,
  getEmployeeDropdown,
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  updateStatus,
  deleteEmployee,
};
