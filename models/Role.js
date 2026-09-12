const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
    description: String,
  },
  { timestamps: true },
);
module.exports = mongoose.models.Role || mongoose.model("Role", schema);
