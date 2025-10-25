import Post from "../models/post.js";
import User from "../models/User.js";
import files from "../models/file.js";
import path from "path";

export const createPost = async (req, res) => {
  try {
    const { title, content, type, audience } = req.body;

    let tags = req.body.tags || [];
    if (typeof tags === "string") tags = [tags];
    tags = Array.isArray(tags)
      ? tags.map((t) => String(t).trim()).filter((t) => t.length > 0)
      : [];

    // -------------------------------
    // Map uploaded files (req.files) to database schema
  const media = req.files?.map((file) => ({
  url: file.path || file?.path || file?.url, // Cloudinary gives file.path as URL
  type: file.mimetype.startsWith("image")
    ? "image"
    : file.mimetype.startsWith("video")
    ? "video"
    : file.mimetype === "application/pdf"
    ? "pdf"
    : "file",
})) || [];


    const newPost = await Post.create({
      title,
      content,
      type,
      audience,
      tags,
      media,
      author: req.user._id,
    });

    const populatedPost = await Post.findById(newPost._id)
      .populate("author", "username email role profileImg")
      .populate("comments.user", "username");

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};





export const getStudentFeed = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch student and populate subscriptions
    const user = await User.findById(userId).populate("subscriptions");

    let posts;

    // 1️⃣ If student has subscriptions, show only subscribed teachers' posts
    if (user.subscriptions && user.subscriptions.length > 0) {
      const subscribedTeacherIds = user.subscriptions
        .filter((sub) => sub.role === "teacher")
        .map((t) => t._id);

      posts = await Post.find({ author: { $in: subscribedTeacherIds } })
        .populate("author", "username email role profileImg") // include profileImg
        .populate("comments.user", "username")
        .sort({ createdAt: -1 });

    } else {
      // 2️⃣ If no subscriptions, show all teacher posts
      const allTeachers = await User.find({ role: "teacher" }).select("_id");
      const allTeacherIds = allTeachers.map((t) => t._id);

      posts = await Post.find({ author: { $in: allTeacherIds } })
        .populate("author", "username email role profileImg")
        .populate("comments.user", "username")
        .sort({ createdAt: -1 });
    }

    // Map posts to include all fields returned by createPost
    const formattedPosts = posts.map(post => ({
      _id: post._id,
      title: post.title,
      content: post.content,
      type: post.type,
      audience: post.audience,
      tags: post.tags,
      media: post.media,
      author: post.author,
      comments: post.comments,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    }));

    res.status(200).json({ success: true, posts: formattedPosts });
  } catch (err) {
    console.error("Error fetching student feed:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const toggleLike = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ success: true, likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Comment on Post
export const addComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.params;
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ success: false, message: "Comment text is required" });
    }

    const post = await Post.findById(postId).populate("comments.user", "username profileImg role");
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const newComment = {
      user: userId,
      text: text.trim(),
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    // Return the new comment instead of entire array for efficiency
    const savedComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: savedComment,
    });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};