const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    bugCode: { type: String, unique: true, sparse: true },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Open", "Assigned", "In Progress", "Fixed", "Retest", "Passed", "Rejected", "Closed"],
      default: "Open",
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    attachments: [String],
    startedAt: Date,
    completedAt: Date,
  },
  { timestamps: true },
);
module.exports = mongoose.models.Bug || mongoose.model("Bug", schema);
