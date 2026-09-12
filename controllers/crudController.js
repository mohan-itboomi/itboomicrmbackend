const crudController = (service, label) => ({
  list: async (req, res) =>
    res.json({
      success: true,
      data: await service.list({
        query: req.query,
        page: Math.max(1, Number(req.query.page) || 1),
        limit: Math.min(100, Number(req.query.limit) || 20),
      }),
    }),
  get: async (req, res) => {
    const item = await service.findById(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: `${label} not found` });
    return res.json({ success: true, data: item });
  },
  create: async (req, res) =>
    res
      .status(201)
      .json({
        success: true,
        message: `${label} created`,
        data: await service.create({ ...req.body, createdBy: req.user?._id }),
      }),
  update: async (req, res) =>
    res.json({
      success: true,
      message: `${label} updated`,
      data: await service.update(req.params.id, req.body),
    }),
  remove: async (req, res) =>
    res.json({
      success: true,
      message: `${label} deleted`,
      data: await service.remove(req.params.id, req.user?._id),
    }),
});

module.exports = crudController;
