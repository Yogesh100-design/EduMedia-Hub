import { Router } from "express";
import upload from "../middleware/Upload.middleware.js";
import File from "../models/file.js";

const router = Router();

// Single file upload
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // Save metadata in MongoDB
    const fileData = await File.create({
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });

    res.json({
      message: "File uploaded and saved in DB successfully 🚀",
      file: fileData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Multiple files upload
router.post("/uploads", upload.array("files", 5), async (req, res) => {
  try {
    const filesData = await Promise.all(
      req.files.map((file) =>
        File.create({
          originalName: file.originalname,
          filename: file.filename,
          path: file.path,
          size: file.size,
          mimetype: file.mimetype,
        })
      )
    );

    res.json({
      message: "Files uploaded and saved in DB successfully 🚀",
      files: filesData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
