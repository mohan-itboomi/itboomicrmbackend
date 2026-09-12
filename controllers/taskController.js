const service = require("../services/taskService");
const getTasks = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: await service.list({
        query: req.query,
        page: +req.query.page || 1,
        limit: +req.query.limit || 20,
        user: req.user,
      }),
    });
  } catch (e) {
    next(e);
  }
};
const getTaskById = async (req, res, next) => {
  try {
    const data = await service.findById(req.params.id);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};
const createTask = async (req, res, next) => {
  try {
    const data = await service.create({ ...req.body, createdBy: req.user._id });
    res
      .status(201)
      .json({ success: true, message: "Task created successfully", data });
  } catch (e) {
    next(e);
  }
};
const updateTask = async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, req.body, req.user);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    res.json({ success: true, message: "Task updated successfully", data });
  } catch (e) {
    next(e);
  }
};
const deleteTask = async (req, res, next) => {
  try {
    const data = await service.remove(req.params.id, req.user._id);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    res.json({ success: true, message: "Task deleted successfully", data });
  } catch (e) {
    next(e);
  }
};
const workflow = method => async (req, res, next) => {
  try {
    const data = await method(req);
    if (!data) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, data });
  } catch (e) {
    if (e.status) return res.status(e.status).json({ success: false, message: e.message });
    next(e);
  }
};
const assignTask = workflow(req => service.assignTask(req.params.id, req.body.assignedTo));
const updateStatus = workflow(req => service.updateStatus(req.params.id, req.body.status));
const updateProgress = workflow(req => service.updateProgress(req.params.id, req.body.completionPercentage));
module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask, assignTask, updateStatus, updateProgress };
