const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    employeeId: { type: String, unique: true, sparse: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    phone: String,
    role: {
      type: String,
      enum: ["admin", "employee", "web-developer", "mobile-developer", "team-lead", "tester", "bd", "project-coordinator"],
      default: "employee",
    },
    department: String,
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    teamLead: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    designation: String,
    joiningDate: Date,
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    refreshTokenVersion: { type: Number, default: 0 },
    resetPasswordTokenHash: { type: String, select: false },
    resetPasswordExpiresAt: { type: Date, select: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
