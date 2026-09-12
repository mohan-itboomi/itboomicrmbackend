const { Module } = require("../models");

const normalizeModuleData = (data = {}) => {
	const normalized = { ...data };
	if (normalized.phaseId === "" || normalized.phaseId === null) {
		delete normalized.phaseId;
	}
	return normalized;
};

const getModules = ({ query = {}, page = 1, limit = 20 }) => {
	const filter = {};
	if (query.search)
		filter.$or = ["name", "description"].map((key) => ({
			[key]: { $regex: query.search, $options: "i" },
		}));
	if (query.status) filter.status = query.status;
	if (query.projectId) filter.projectId = query.projectId;
	return Promise.all([
		Module.find(filter)
			.skip((page - 1) * limit)
			.limit(limit)
			.sort({ createdAt: -1 }),
		Module.countDocuments(filter),
	]).then(([items, total]) => ({
		items,
		page,
		limit,
		total,
		totalPages: Math.ceil(total / limit),
	}));
};
const getModuleById = (id) => Module.findById(id);
const createModule = (data) => Module.create(normalizeModuleData(data));
const updateModule = (id, data) =>
	Module.findByIdAndUpdate(id, normalizeModuleData(data), {
		new: true,
		runValidators: true,
	});
const deleteModule = (id, userId) =>
	Module.findByIdAndUpdate(
		id,
		{ isDeleted: true, deletedAt: new Date(), deletedBy: userId },
		{ new: true },
	);
module.exports = {
	getModules,
	getModuleById,
	createModule,
	updateModule,
	deleteModule,
	list: getModules,
	findById: getModuleById,
	create: createModule,
	update: updateModule,
	remove: deleteModule,
};
