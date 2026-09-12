const mongoose = require("mongoose");

const frdDocumentSchema = new mongoose.Schema({
  version: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvedAt: Date,
}, { _id: true, timestamps: true });

const phaseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: String,
  status: { type: String, enum: ["Planned", "In Progress", "Completed", "Blocked"], default: "Planned" },
  completionPercentage: { type: Number, min: 0, max: 100, default: 0 },
  startDate: Date,
  endDate: Date,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  deliverables: [String],
}, { _id: true });

const schema = new mongoose.Schema(
  {
    projectCode: { type: String, unique: true, sparse: true, trim: true },
    code: { type: String, unique: true, sparse: true, trim: true },
    name: { type: String, required: true, trim: true },
    client: String,
    description: String,
    coordinator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    teamLead: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    businessDevelopmentOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    projectLead: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    scope: {
      summary: String,
      objectives: [String],
      deliverables: [String],
      exclusions: [String],
      acceptanceCriteria: [String],
    },
    frd: { type: [frdDocumentSchema], default: [] },
    phases: [phaseSchema],
    startDate: Date,
    endDate: Date,
    duration: { type: String, trim: true },
    estimatedMinutes: { type: Number, min: 0 },
    status: {
      type: String,
      enum: ["Not Started", "On Board", "In Progress", "On Hold", "Completed", "Cancelled"],
      default: "Not Started",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.models.Project || mongoose.model("Project", schema);
