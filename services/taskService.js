const { Task, User, Project, Module } = require("../models");

const normalizeTaskData = (data = {}) => {
  const normalized = { ...data };
  for (const field of ["moduleId", "phaseId", "parentTaskId", "assignedTo"]) {
    if (normalized[field] === "" || normalized[field] === null) {
      delete normalized[field];
    }
  }
  return normalized;
};

const recalculateProgress = async (projectId) => {
  const [modules, tasks] = await Promise.all([
    Module.find({ projectId, isDeleted: { $ne: true } }).select("_id phaseId").lean(),
    Task.find({ projectId, isDeleted: false }).select("_id moduleId parentTaskId completionPercentage status").lean(),
  ]);
  const childrenByParent = new Map();
  for (const task of tasks) {
    if (!task.parentTaskId) continue;
    const parentId = String(task.parentTaskId);
    const children = childrenByParent.get(parentId) || [];
    children.push(task);
    childrenByParent.set(parentId, children);
  }
  const calculatedProgress = new Map();
  const calculateTaskProgress = (task, visited = new Set()) => {
    const taskId = String(task._id);
    if (visited.has(taskId)) return Number(task.completionPercentage) || 0;
    const children = childrenByParent.get(taskId) || [];
    if (!children.length) {
      const percentage = Number(task.completionPercentage) || 0;
      calculatedProgress.set(taskId, percentage);
      return percentage;
    }
    const nextVisited = new Set(visited).add(taskId);
    const percentage = Math.round(
      children.reduce((sum, child) => sum + calculateTaskProgress(child, nextVisited), 0) /
        children.length,
    );
    calculatedProgress.set(taskId, percentage);
    return percentage;
  };
  for (const task of tasks) calculateTaskProgress(task);
  const taskUpdates = tasks
    .filter((task) => (childrenByParent.get(String(task._id)) || []).length)
    .map((task) => ({
      updateOne: {
        filter: { _id: task._id },
        update: {
          completionPercentage: calculatedProgress.get(String(task._id)) || 0,
          status:
            (calculatedProgress.get(String(task._id)) || 0) >= 100
              ? "Completed"
              : (calculatedProgress.get(String(task._id)) || 0) > 0
                ? "In Progress"
                : "Pending",
        },
      },
    }));
  if (taskUpdates.length) await Task.bulkWrite(taskUpdates);

  const moduleProgress = new Map();
  for (const module of modules) {
    const topLevelTasks = tasks.filter(
      (task) =>
        String(task.moduleId) === String(module._id) && !task.parentTaskId,
    );
    const percentage = topLevelTasks.length
      ? Math.round(
          topLevelTasks.reduce(
            (sum, task) => sum + (calculatedProgress.get(String(task._id)) || 0),
            0,
          ) / topLevelTasks.length,
        )
      : 0;
    moduleProgress.set(String(module._id), percentage);
    await Module.updateOne({ _id: module._id }, { completionPercentage: percentage, status: percentage >= 100 ? "Completed" : percentage > 0 ? "In Progress" : "Planned" });
  }
  const project = await Project.findById(projectId).select("phases");
  if (!project) return;
  for (const phase of project.phases || []) {
    const phaseModules = modules.filter((module) => String(module.phaseId) === String(phase._id));
    const percentage = phaseModules.length ? Math.round(phaseModules.reduce((sum, module) => sum + (moduleProgress.get(String(module._id)) || 0), 0) / phaseModules.length) : 0;
    phase.completionPercentage = percentage;
    phase.status = percentage >= 100 ? "Completed" : percentage > 0 ? "In Progress" : "Planned";
  }
  const phasePercentages = (project.phases || []).map((phase) => Number(phase.completionPercentage) || 0);
  project.completionPercentage = phasePercentages.length ? Math.round(phasePercentages.reduce((sum, value) => sum + value, 0) / phasePercentages.length) : 0;
  project.markModified("phases");
  await project.save();
};

const getTasks = ({ query = {}, page = 1, limit = 20, user }) => {
  const filter = { isDeleted: false };
  const canViewAll = ["admin", "bd", "team-lead", "project-coordinator"].includes(user?.role);
  if (!canViewAll) filter.assignedTo = user._id;
  if (query.search) filter.$or = ["title", "description"].map((key) => ({ [key]: { $regex: query.search, $options: "i" } }));
  for (const key of ["status", "category", "projectId", "moduleId", "parentTaskId", "priority"]) if (query[key]) filter[key] = query[key];
  if (canViewAll && query.assignedTo) filter.assignedTo = query.assignedTo;
  return Promise.all([
    Task.find(filter).populate("projectId", "name").populate("moduleId", "name phaseId").populate("parentTaskId", "title").populate("assignedTo", "name email").skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 }),
    Task.countDocuments(filter),
  ]).then(([items, total]) => ({ items, page, limit, total, totalPages: Math.ceil(total / limit) }));
};
const getTaskById = (id) => Task.findById(id).populate("projectId", "name").populate("moduleId", "name phaseId").populate("parentTaskId", "title").populate("assignedTo", "name email").populate("createdBy", "name email");
const validateAssignment = async (projectId, assignedTo) => { if (!assignedTo) return; if (!await User.exists({ _id: assignedTo, isDeleted: false, status: "Active" })) throw Object.assign(new Error("Assigned employee not found"), { status: 404 }); if (!await Project.exists({ _id: projectId, members: assignedTo, isDeleted: false })) throw Object.assign(new Error("Employee must be assigned to the project first"), { status: 400 }); };
const createTask = async (data) => { const normalizedData = normalizeTaskData(data); await validateAssignment(normalizedData.projectId, normalizedData.assignedTo); const task = await Task.create(normalizedData); await recalculateProgress(normalizedData.projectId); return task; };
const updateTask = async (id, data, user) => { const task = await Task.findOneAndUpdate(user?.role === "admin" ? { _id: id } : { _id: id, assignedTo: user?._id }, normalizeTaskData(data), { new: true, runValidators: true }); if (task) await recalculateProgress(task.projectId); return task; };
const assignTask = async (id, assignedTo) => { const task = await Task.findOne({ _id: id, isDeleted: false }); if (!task) return null; await validateAssignment(task.projectId, assignedTo); return Task.findOneAndUpdate({ _id: id, isDeleted: false }, { assignedTo }, { new: true, runValidators: true }); };
const updateStatus = async (id, status) => { const task = await Task.findOneAndUpdate({ _id: id, isDeleted: false }, { status, ...(status === "Completed" ? { completionPercentage: 100, completedAt: new Date() } : {}) }, { new: true, runValidators: true }); if (task) await recalculateProgress(task.projectId); return task; };
const updateProgress = async (id, completionPercentage) => { const value = Math.max(0, Math.min(100, Number(completionPercentage) || 0)); const task = await Task.findOneAndUpdate({ _id: id, isDeleted: false }, { completionPercentage: value, ...(value === 100 ? { status: "Completed", completedAt: new Date() } : {}) }, { new: true, runValidators: true }); if (task) await recalculateProgress(task.projectId); return task; };
const deleteTask = async (id, userId) => { const task = await Task.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date(), deletedBy: userId, status: "Cancelled" }, { new: true }); if (task) await recalculateProgress(task.projectId); return task; };
module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask, assignTask, updateStatus, updateProgress, recalculateProgress, list: getTasks, findById: getTaskById, create: createTask, update: updateTask, remove: deleteTask };