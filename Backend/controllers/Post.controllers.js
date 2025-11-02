import Post from "../models/post.js";
import User from "../models/User.js";
import files from "../models/file.js";
import path from "path";

/* ---------------------------------------------------
   ✅ Create New Post
--------------------------------------------------- */
export const createPost = async (req, res) => {
  try {
    const { title, content, type, audience } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Please provide both a title and content for your post.",
      });
    }

    // Process tags
    let tags = req.body.tags || [];
    if (typeof tags === "string") tags = [tags];
    tags = Array.isArray(tags)
      ? tags.map((t) => String(t).trim()).filter((t) => t.length > 0)
      : [];

    // Map uploaded files to schema
    const media =
      req.files?.map((file) => ({
        url: file.path || file?.url,
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
      message: "🎉 Your post has been shared successfully!",
      post: populatedPost,
    });
  } catch (err) {
    console.error("❌ Error creating post:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while creating your post. Please try again later.",
    });
  }
};

/* ---------------------------------------------------
   ✅ Get Student Feed
--------------------------------------------------- */
export const getStudentFeed = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("subscriptions");

    let posts = [];

    // 1️⃣ If student follows teachers
    if (user.subscriptions && user.subscriptions.length > 0) {
      const subscribedTeacherIds = user.subscriptions
        .filter((sub) => sub.role === "teacher")
        .map((t) => t._id);

      posts = await Post.find({ author: { $in: subscribedTeacherIds } })
        .populate("author", "username email role profileImg")
        .populate("comments.user", "username")
        .sort({ createdAt: -1 });

      if (posts.length === 0) {
        return res.status(200).json({
          success: true,
          message:
            "You’re following teachers, but no posts are available yet. Check back soon!",
          posts: [],
        });
      }
    } else {
      // 2️⃣ No subscriptions → show all teacher posts
      const allTeachers = await User.find({ role: "teacher" }).select("_id");
      const allTeacherIds = allTeachers.map((t) => t._id);

      posts = await Post.find({ author: { $in: allTeacherIds } })
        .populate("author", "username email role profileImg")
        .populate("comments.user", "username")
        .sort({ createdAt: -1 });

      if (posts.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No posts from teachers yet. Stay tuned for updates!",
          posts: [],
        });
      }
    }

    // Format posts for cleaner response
    const formattedPosts = posts.map((post) => ({
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
      updatedAt: post.updatedAt,
    }));

    res.status(200).json({
      success: true,
      message: "✅ Posts loaded successfully.",
      totalPosts: formattedPosts.length,
      posts: formattedPosts,
    });
  } catch (err) {
    console.error("❌ Error fetching student feed:", err);
    res.status(500).json({
      success: false,
      message: "Unable to load your feed right now. Please try again later.",
    });
  }
};

/* ---------------------------------------------------
   ✅ Like / Unlike Post
--------------------------------------------------- */
export const toggleLike = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Sorry, this post no longer exists.",
      });
    }

    let action;
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
      action = "removed";
    } else {
      post.likes.push(userId);
      action = "added";
    }

    await post.save();
    res.status(200).json({
      success: true,
      message:
        action === "added"
          ? "❤️ You liked this post!"
          : "💔 You unliked this post.",
      totalLikes: post.likes.length,
    });
  } catch (err) {
    console.error("❌ Error toggling like:", err);
    res.status(500).json({
      success: false,
      message: "Could not update like status. Please try again.",
    });
  }
};

/* ---------------------------------------------------
   ✅ Add Comment
--------------------------------------------------- */
export const addComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.params;
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please write something before posting your comment.",
      });
    }

    const post = await Post.findById(postId).populate(
      "comments.user",
      "username profileImg role"
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found. It might have been deleted.",
      });
    }

    const newComment = {
      user: userId,
      text: text.trim(),
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    const savedComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      success: true,
      message: "💬 Comment added successfully!",
      comment: savedComment,
    });
  } catch (err) {
    console.error("❌ Error adding comment:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while adding your comment. Please try again later.",
    });
  }
};
