const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);
module.exports = mongoose.models.Comment || mongoose.model("Comment", schema);
