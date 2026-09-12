const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    module: { type: String, required: true, trim: true },
    action: { type: String, required: true, trim: true },
    description: String,
  },
  { timestamps: true },
);
schema.index({ name: 1, module: 1, action: 1 }, { unique: true });
module.exports =
  mongoose.models.Permission || mongoose.model("Permission", schema);
