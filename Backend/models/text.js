import mongoose from "mongoose";

const TextSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    uploadedBy: { type: String, default: "anonymous" }, // optional
  },
  { timestamps: true }
);

const Text = mongoose.model("Text", TextSchema);
export default Text;
