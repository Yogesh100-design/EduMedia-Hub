import Post from "../models/post.js";
import User from "../models/User.js";
import files from "../models/file.js";
import path from "path";

export const createPost = async (req, res) => {
  try {
    const { title, content, type, audience } = req.body;
    const tags = req.body.tags || [];

    // Map uploaded files to match schema
    const media =
      req.files?.map((file) => ({
        url: file.path.replace("\\", "/"), // handle Windows paths
        type: file.mimetype.startsWith("image")
          ? "image"
          : file.mimetype.startsWith("video")
          ? "video"
          : file.mimetype === "application/pdf"
          ? "pdf"
          : "text",
      })) || [];

    // Create post
    const newPost = await Post.create({
      title,
      content,
      type,
      audience,
      tags,
      media, // use the correct schema field
      author: req.user._id, // logged-in user
    });

    // Populate author and comments
    const populatedPost = await Post.findById(newPost._id)
      .populate("author", "username email role profileImg")
      .populate("comments.user", "username");

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Define the async function inside useEffect
export const getStudentFeed = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch student and populate subscriptions
    const user = await User.findById(userId).populate("subscriptions");

    if (user.role !== "student") {
      return res.status(403).json({ message: "Only students can view feed" });
    }

    let posts;

    // 1️⃣ If student has subscriptions, show only subscribed teachers' posts
    if (user.subscriptions && user.subscriptions.length > 0) {
      const subscribedTeacherIds = user.subscriptions
        .filter((sub) => sub.role === "teacher")
        .map((t) => t._id);

      posts = await Post.find({ author: { $in: subscribedTeacherIds } })
        .populate("author", "username email role")
        .populate("comments.user", "username")
        .sort({ createdAt: -1 });

    } else {
      // 2️⃣ If no subscriptions, show all teacher posts
      const allTeachers = await User.find({ role: "teacher" }).select("_id");
      const allTeacherIds = allTeachers.map((t) => t._id);

      posts = await Post.find({ author: { $in: allTeacherIds } })
        .populate("author", "username email role")
        .populate("comments.user", "username")
        .sort({ createdAt: -1 });
    }

    res.json({ success: true, posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



// Like / Unlike Post
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

    if (!text)
      return res.status(400).json({ message: "Comment text is required" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user: userId, text });
    await post.save();

    res.status(201).json({ success: true, comments: post.comments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
