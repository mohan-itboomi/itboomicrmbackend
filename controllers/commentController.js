const service = require("../services/commentService");
const getComments = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: await service.list({
        query: req.query,
        page: +req.query.page || 1,
        limit: +req.query.limit || 20,
      }),
    });
  } catch (e) {
    next(e);
  }
};
const getCommentById = async (req, res, next) => {
  try {
    const data = await service.findById(req.params.id);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};
const createComment = async (req, res, next) => {
  try {
    const data = await service.create({ ...req.body, userId: req.user._id });
    res
      .status(201)
      .json({ success: true, message: "Comment created successfully", data });
  } catch (e) {
    next(e);
  }
};
const updateComment = async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, req.body);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    res.json({ success: true, message: "Comment updated successfully", data });
  } catch (e) {
    next(e);
  }
};
const deleteComment = async (req, res, next) => {
  try {
    const data = await service.remove(req.params.id, req.user._id);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    res.json({ success: true, message: "Comment deleted successfully", data });
  } catch (e) {
    next(e);
  }
};
module.exports = {
  getComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};
