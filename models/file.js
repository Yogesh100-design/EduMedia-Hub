import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    mimetype: { type: String, required: true },
    uploadedBy: { type: String }, // optional: store user info if needed
  },
  { timestamps: true }
);

const File = mongoose.model("File", FileSchema);
export default File;
