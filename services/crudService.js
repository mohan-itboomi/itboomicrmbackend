const createCrudService = (Model, searchableFields = []) => ({
  list: async ({ query = {}, page = 1, limit = 20 }) => {
    const filter = {};
    if (query.search && searchableFields.length) filter.$or = searchableFields.map((field) => ({ [field]: { $regex: query.search, $options: 'i' } }));
    if (query.status) filter.status = query.status;
    if (query.projectId) filter.projectId = query.projectId;
    const [items, total] = await Promise.all([
      Model.find(filter).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 }),
      Model.countDocuments(filter)
    ]);
    return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
  },
  findById: (id) => Model.findById(id),
  create: (payload) => Model.create(payload),
  update: (id, payload) => Model.findByIdAndUpdate(id, payload, { new: true, runValidators: true }),
  remove: (id, userId) => Model.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date(), deletedBy: userId }, { new: true })
});

module.exports = createCrudService;
