const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    phaseId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    description: String,
    completionPercentage: { type: Number, min: 0, max: 100, default: 0 },
    status: {
      type: String,
      enum: ["Planned", "In Progress", "Completed", "On Hold"],
      default: "Planned",
    },
  },
  { timestamps: true },
);
module.exports = mongoose.models.Module || mongoose.model("Module", schema);
