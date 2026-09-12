const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    totalWorkingMinutes: { type: Number, default: 0 },
    totalBreakMinutes: { type: Number, default: 0 },
    totalTaskMinutes: { type: Number, default: 0 },
    completedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    pendingTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  },
  { timestamps: true },
);
schema.index({ employeeId: 1, date: 1 }, { unique: true });
module.exports =
  mongoose.models.DailyWork || mongoose.model("DailyWork", schema);
