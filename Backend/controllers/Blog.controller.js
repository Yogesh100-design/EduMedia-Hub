import Blog from "../models/Blog.js";

// Create / Publish Blog
export const createBlog = async (req, res) => {
  try {
    const { title, markdown, author } = req.body;

    // Validate required fields
    if (!title || !markdown || !author) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all the required fields: title, content, and author name.",
      });
    }

    // Handle cover image (uploaded via multer)
    const cover = req.file ? `/uploads/${req.file.filename}` : null;

    // Create a new blog document
    const newBlog = new Blog({
      title,
      markdown,
      author,
      cover,
      date: new Date(),
      readTime: Math.ceil(markdown.length / 1000) + 2,
    });

    await newBlog.save();

    res.status(201).json({
      success: true,
      message: "🎉 Your blog has been published successfully!",
      blog: newBlog,
    });
  } catch (error) {
    console.error("❌ Error creating blog:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while publishing your blog. Please try again later.",
    });
  }
};

// Get all blogs
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });

    if (blogs.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No blogs available right now. Be the first to write one!",
        blogs: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Blogs fetched successfully.",
      totalBlogs: blogs.length,
      blogs,
    });
  } catch (error) {
    console.error("❌ Error fetching blogs:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch blogs at the moment. Please try again later.",
    });
  }
};
