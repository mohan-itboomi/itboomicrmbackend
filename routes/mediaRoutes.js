const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

require("dotenv").config();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (file) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "office-crm/frd",
        resource_type: "image",
        type: "upload",
        access_mode: "public",
      },
      (error, result) => (error ? reject(error) : resolve(result)),
    );
    stream.end(file.buffer);
  });

module.exports = ({ auth }) => {
  const router = express.Router();
  router.post(
    "/upload",
    auth,
    upload.single("file"),
    async (req, res, next) => {
      try {
        if (!req.file)
          return res
            .status(400)
            .json({ success: false, message: "A file is required." });
        if (
          !process.env.CLOUDINARY_CLOUD_NAME ||
          !process.env.CLOUDINARY_API_KEY ||
          !process.env.CLOUDINARY_API_SECRET
        )
          return res
            .status(500)
            .json({ success: false, message: "Cloudinary is not configured." });
        const result = await uploadToCloudinary(req.file);
        res
          .status(201)
          .json({
            success: true,
            data: {
              url: result.secure_url,
              publicId: result.public_id,
              name: req.file.originalname,
              format: result.format,
              resourceType: result.resource_type,
            },
          });
      } catch (error) {
        next(error);
      }
    },
  );
  return router;
};
