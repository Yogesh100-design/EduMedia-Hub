import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  markdown: { type: String, required: true },
  tags: [String],
  cover: String,
  excerpt: String,
  authorId: { type: String},
  author: { type: String, required: true },
  date: { type: Date, default: Date.now },
  readTime: Number,
});

export default mongoose.model("Blog", blogSchema);
