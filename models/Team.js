const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    teamLead: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

module.exports = mongoose.models.Team || mongoose.model("Team", schema);
