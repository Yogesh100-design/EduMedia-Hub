import express from "express";
import { createUserProfile, getUserProfileWithPost } from "../controllers/UserProfile.controller.js";
import upload from "../middleware/Upload.middleware.js";
import { protect } from "../middleware/protect.middlewares.js";

const router = express.Router();

router.post("/profile",protect, upload.single("media"),createUserProfile);
router.get("/getPost",protect, getUserProfileWithPost);

export default router;