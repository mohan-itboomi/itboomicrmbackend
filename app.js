require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const apiRoutes = require("./routes");
const { sanitizeRequest } = require("./middleware/security");
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeRequest);
app.use("/api/v1/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: "draft-7", legacyHeaders: false }));
app.use("/api/v1", apiRoutes);
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found" }),
);
app.use((error, req, res, next) => {
  console.error(error);
  const duplicate = error.code === 11000;
  res
    .status(error.name === "ValidationError" || duplicate ? 400 : 500)
    .json({
      success: false,
      message:
        error.name === "ValidationError"
          ? "Invalid request data"
          : duplicate
            ? "A record with this value already exists"
            : "Internal server error",
    });
});
module.exports = { app };
