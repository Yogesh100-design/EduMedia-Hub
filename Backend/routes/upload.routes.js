import express from "express";
import {
  createPost,
  getStudentFeed,
  toggleLike,
  addComment,
} from "../controllers/Post.controllers.js";
import { protect } from "../middleware/protect.middlewares.js";
import upload from "../middleware/Upload.middleware.js";

const router = express.Router();

// Teacher → Create Post (text + multiple files)
router.post("/post", protect , upload.array("content", 5), createPost);

// Student feed
router.get("/feed" , protect ,  getStudentFeed);

// Like & Comment
router.post("/:postId/like",  toggleLike);
router.post("/:postId/comment", protect , addComment);

export default router;
