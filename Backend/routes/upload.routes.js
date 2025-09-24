import { Router } from "express";
import upload from "../middleware/Upload.middleware.js";
import cloudinary from "../config/cloudinary.js";
import File from "../models/file.js"

const router = Router();

// Single file upload
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "myAppUploads",
    });

    // Save file metadata in MongoDB
    const fileData = await File.create({
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedBy: req.body.user || "anonymous", // optional
      cloudinaryUrl: result.secure_url,
      cloudinaryId: result.public_id,
    });

    res.status(201).json({
      message: "File uploaded to Cloudinary & saved in DB successfully 🚀",
      file: fileData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
