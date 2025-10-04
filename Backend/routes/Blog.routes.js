import express, { Router } from "express";
import { createBlog , getBlogs  } from "../controllers/Blog.controller.js";

import { protect } from "../middleware/protect.middlewares.js";
import upload from "../middleware/Upload.middleware.js";

const router = Router();

router.post("/createblog" , upload.single("cover"), protect , createBlog);
router.get("/getallblog" , protect , getBlogs);


export default router;