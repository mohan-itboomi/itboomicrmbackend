const { Comment } = require("../models");
const getComments = ({ query = {}, page = 1, limit = 20 }) => {
  const filter = {};
  if (query.taskId) filter.taskId = query.taskId;
  return Promise.all([
    Comment.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Comment.countDocuments(filter),
  ]).then(([items, total]) => ({
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  }));
};
const getCommentById = (id) => Comment.findById(id);
const createComment = (data) => Comment.create(data);
const updateComment = (id, data) =>
  Comment.findByIdAndUpdate(id, data, { new: true, runValidators: true });
const deleteComment = (id, userId) => Comment.findByIdAndDelete(id);
module.exports = {
  getComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
  list: getComments,
  findById: getCommentById,
  create: createComment,
  update: updateComment,
  remove: deleteComment,
};
