import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads folder exists
const uploadFolder = "uploads/";
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "video/mp4",
    "application/pdf",
    "text/plain",
  ];
  // Note: MulterError: Unexpected field occurs BEFORE fileFilter runs, 
  // so the file type logic is okay, but not the cause of the original error.
  allowedTypes.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Invalid file type!"), false);
};

// Export multer instance
const upload = multer({ storage, fileFilter });
export default upload;
