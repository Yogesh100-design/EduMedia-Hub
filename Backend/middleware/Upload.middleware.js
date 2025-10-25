import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const folder = "uploads"; // Folder name in Cloudinary
    let resourceType = "auto"; // auto-detect image/video/pdf/etc.

    // ✅ Remove extension from name to avoid .jpg.jpg
    const fileNameWithoutExt = file.originalname.replace(/\.[^/.]+$/, "");

    return {
      folder,
      resource_type: resourceType,
      public_id: `${Date.now()}-${fileNameWithoutExt}`,
    };
  },
});

// ✅ File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "video/mp4",
    "application/pdf",
    "text/plain",
  ];
  allowedTypes.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Invalid file type!"), false);
};

// ✅ Export multer instance
const upload = multer({ storage, fileFilter });
export default upload;
