const { Project, User, Bug } = require("../models");
const generateProjectId = async () => {
  const prefix = "PRJ-" + new Date().getFullYear() + "-";
  let sequence = await Project.countDocuments({
    projectCode: { $regex: "^" + prefix },
  });
  let projectCode;
  do {
    sequence += 1;
    projectCode = prefix + String(sequence).padStart(4, "0");
  } while (await Project.exists({ projectCode }));
  return projectCode;
};
const getProjects = ({ query = {}, page = 1, limit = 20, user }) => {
  const filter = { isDeleted: false, archived: false };
  if (user?.role === "bd") filter.businessDevelopmentOwner = user._id;
  else if (user?.role === "team-lead")
    filter.$or = [{ members: user._id }, { teamLead: user._id }];
  if (query.search)
    filter.$and = [
      ...(filter.$and || []),
      {
        $or: ["name", "code", "description"].map((k) => ({
          [k]: { $regex: query.search, $options: "i" },
        })),
      },
    ];
  if (query.status)
    filter.status = query.status.includes(",")
      ? { $in: query.status.split(",") }
      : query.status;
  return Promise.all([
    Project.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Project.countDocuments(filter),
  ]).then(async ([items, total]) => {
    const bugCounts = await Bug.aggregate([
      { $match: { projectId: { $in: items.map((item) => item._id) } } },
      { $group: { _id: "$projectId", count: { $sum: 1 } } },
    ]);
    const counts = new Map(
      bugCounts.map((item) => [String(item._id), item.count]),
    );
    return {
      items: items.map((item) => {
        const data = item.toObject();
        const projectCreatedAt = data.createdAt;
        const projectUpdatedAt = data.updatedAt || projectCreatedAt;
        data.phases = (data.phases || []).map((phase) => ({
          ...phase,
          createdAt: phase.createdAt || projectCreatedAt,
          updatedAt: phase.updatedAt || projectUpdatedAt,
        }));
        return { ...data, bugCount: counts.get(String(item._id)) || 0 };
      }),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  });
};


const getProjectById = async (id, user) => {
  const filter = { _id: id, isDeleted: false };
  if (user?.role === "bd") filter.businessDevelopmentOwner = user._id;
  else if (user?.role === "team-lead")
    filter.$or = [{ members: user._id }, { teamLead: user._id }];
  return Project.findOne(filter)
    .populate("members", "name email role")
    .populate("businessDevelopmentOwner projectLead", "name email role")
    .populate("phases.owner", "name email role");
};
const createProject = (data) => Project.create(data);
const updateProject = (id, data) =>
  Project.findByIdAndUpdate(id, data, { new: true, runValidators: true });
const updateScope = (id, scope) =>
  Project.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { scope },
    { new: true, runValidators: true },
  );
const updateFrd = async (id, frd, userId) => {
  const project = await Project.findOne({ _id: id, isDeleted: false });
  if (!project) return null;
  const previous = Array.isArray(project.frd)
    ? project.frd
    : project.frd?.content
      ? [project.frd]
      : [];
  project.frd = [
    ...previous,
    {
      ...frd,
      approvedBy: frd.approvedAt ? userId : undefined,
      approvedAt: frd.approvedAt ? new Date() : undefined,
    },
  ];
  return project.save();
};
const deleteFrd = (id, frdId) =>
  Project.findOneAndUpdate(
    { _id: id, isDeleted: false, "frd._id": frdId },
    { $pull: { frd: { _id: frdId } } },
    { new: true },
  );
const addPhase = (id, phase) =>
  Project.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $push: { phases: phase } },
    { new: true, runValidators: true },
  );
const updatePhase = (id, phaseId, phase) =>
  Project.findOneAndUpdate(
    { _id: id, isDeleted: false, "phases._id": phaseId },
    {
      $set: {
        ...Object.fromEntries(
          Object.entries(phase).map(([key, value]) => [
            `phases.$.${key}`,
            value,
          ]),
        ),
        "phases.$.updatedAt": new Date(),
      },
    },
    { new: true, runValidators: true },
  );

const deletePhase = (id, phaseId) =>
  Project.findOneAndUpdate(
    { _id: id, isDeleted: false, "phases._id": phaseId },
    { $pull: { phases: { _id: phaseId } } },
    { new: true },
  );

  
const addMember = async (id, userId) => {
  if (!(await User.exists({ _id: userId, isDeleted: false })))
    throw Object.assign(new Error("Employee not found"), { status: 404 });
  return Project.findByIdAndUpdate(
    id,
    { $addToSet: { members: userId } },
    { new: true },
  );
};
const removeMember = (id, userId) =>
  Project.findByIdAndUpdate(id, { $pull: { members: userId } }, { new: true });
const deleteProject = (id, userId) =>
  Project.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: userId,
      archived: true,
    },
    { new: true },
  );
module.exports = {
  generateProjectId,
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  updateScope,
  updateFrd,
  deleteFrd,
  addPhase,
  updatePhase,
  deletePhase,
  addMember,
  removeMember,
  deleteProject,
  list: getProjects,
  findById: getProjectById,
  create: createProject,
  update: updateProject,
  remove: deleteProject,
};
