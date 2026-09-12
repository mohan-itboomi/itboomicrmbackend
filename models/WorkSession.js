const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    startTime: Date,
    endTime: Date,
    startedAt: Date,
    endedAt: Date,
    durationMinutes: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["Running", "Paused", "Completed"],
      default: "Running",
    },
  },
  { timestamps: true },
);
module.exports =
  mongoose.models.WorkSession || mongoose.model("WorkSession", schema);
