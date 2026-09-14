const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    taskCode: { type: String, unique: true, sparse: true, trim: true },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
    phaseId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    parentTaskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    }, 
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["Project Implementation", "Testing", "Bug Fixing"],
      default: "Project Implementation",
      index: true,
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "In Progress",
        "Paused",
        "Testing",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },
    estimatedMinutes: { type: Number, min: 0 },
    actualMinutes: { type: Number, default: 0, min: 0 },
    dueDate: Date,
    completionPercentage: { type: Number, min: 0, max: 100, default: 0 },
    expectedWork: String,
    startDate: Date,
    completedDescription: String,
    challengesNotes: String,
    completedAt: Date,
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);
module.exports = mongoose.models.Task || mongoose.model("Task", schema);
