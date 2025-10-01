import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const mediaSchema = new mongoose.Schema({
  url: { type: String }, // file path (uploads/xyz.png)
  type: { type: String, enum: ["image", "video", "pdf", "file"] },
});

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String }, // optional text
    type: { type: String, default: "Announcement" }, // Announcement, Resource, etc.
    audience: { type: String, default: "All Students" },
    tags: [{ type: String }],
    media: [mediaSchema],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
