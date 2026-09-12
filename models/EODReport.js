const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    completedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    inProgressTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    blockers: String,
    tomorrowPlan: String,
    totalMinutes: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Changes Requested"],
      default: "Pending",
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);
module.exports =
  mongoose.models.EODReport || mongoose.model("EODReport", schema);
