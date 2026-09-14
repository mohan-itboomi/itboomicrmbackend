const service = require("../services/moduleService");
const getModules = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: await service.list({
        query: { ...req.query, projectId: req.params.projectId || req.query.projectId },
        page: +req.query.page || 1,
        limit: +req.query.limit || 20,
      }),
    });
  } catch (e) {
    next(e);
  }
};
const getModuleById = async (req, res, next) => {
  try {
    const data = await service.findById(req.params.id);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Module not found" });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};
const createModule = async (req, res, next) => {
  try {
    const data = await service.create({ ...req.body, createdBy: req.user._id });
    res
      .status(201)
      .json({ success: true, message: "Module created successfully", data });
  } catch (e) {
    next(e);
  }
};
const updateModule = async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, req.body);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Module not found" });
    res.json({ success: true, message: "Module updated successfully", data });
  } catch (e) {
    next(e);
  }
};
const deleteModule = async (req, res, next) => {
  try {
    const data = await service.remove(req.params.id, req.user._id);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Module not found" });
    res.json({ success: true, message: "Module deleted successfully", data });
  } catch (e) {
    next(e);
  }
};
const updateProjectModule = async (req, res, next) => {
  try {
    const data = await service.updateModuleInProject(req.params.projectId, req.params.id, req.body);
    if (!data) return res.status(404).json({ success: false, message: "Module not found in project" });
    res.json({ success: true, message: "Module updated successfully", data });
  } catch (e) { next(e); }
};
const deleteProjectModule = async (req, res, next) => {
  try {
    const data = await service.deleteModuleInProject(req.params.projectId, req.params.id, req.user._id);
    if (!data) return res.status(404).json({ success: false, message: "Module not found in project" });
    res.json({ success: true, message: "Module deleted successfully", data });
  } catch (e) { next(e); }
};
const createProjectModule = async (req, res, next) => {
  try {
    const data = await service.create({ ...req.body, projectId: req.params.projectId, createdBy: req.user._id });
    res.status(201).json({ success: true, message: "Module created successfully", data });
  } catch (e) {
    next(e);
  }
};
module.exports = {
  getModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
  createProjectModule,
  updateProjectModule,
  deleteProjectModule,
};
