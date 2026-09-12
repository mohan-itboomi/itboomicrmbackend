const { EODReport } = require("../models");
const canViewAll = (user) =>
  ["admin", "project-coordinator", "team-lead"].includes(user?.role);
const withDetails = (query) =>
  query
    .populate("employeeId", "name email employeeId role")
    .populate("completedTasks", "title status")
    .populate("inProgressTasks", "title status");

const getEODReports = ({ query = {}, page = 1, limit = 20, user }) => {
  const filter = {};
  if (canViewAll(user) && query.employeeId) filter.employeeId = query.employeeId;
  if (!canViewAll(user)) filter.employeeId = user._id;
  if (query.status) filter.status = query.status;
  return Promise.all([
    withDetails(EODReport.find(filter))
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ date: -1 }),
    EODReport.countDocuments(filter),
  ]).then(([items, total]) => ({
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  }));
};
const getEODReportById = (id, user) => {
  const filter = canViewAll(user)
    ? { _id: id }
    : { _id: id, employeeId: user._id };
  return withDetails(EODReport.findOne(filter));
};
const createEODReport = (data) => EODReport.create(data);
const updateEODReport = (id, data, user) => {
  const filter = canViewAll(user)
    ? { _id: id }
    : { _id: id, employeeId: user._id };
  return withDetails(
    EODReport.findOneAndUpdate(filter, data, {
      new: true,
      runValidators: true,
    }),
  );
};
const deleteEODReport = (id, user) => {
  const filter = canViewAll(user)
    ? { _id: id }
    : { _id: id, employeeId: user._id };
  return EODReport.findOneAndDelete(filter);
};
module.exports = {
  getEODReports,
  getEODReportById,
  createEODReport,
  updateEODReport,
  deleteEODReport,
  list: getEODReports,
  findById: getEODReportById,
  create: createEODReport,
  update: updateEODReport,
  remove: deleteEODReport,
};
