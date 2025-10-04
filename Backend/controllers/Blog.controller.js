import Blog from "../models/Blog.js";

  // Create / Publish Blog
  export const createBlog = async (req, res) => {
    try {
      const { title, markdown, author } = req.body;

      if (!title || !markdown || !author) {
        return res.status(400).json({ message: "Title, markdown, and author are required" });
      }

      // cover image handled by multer
      const cover = req.file ? `/uploads/${req.file.filename}` : null;

      const newBlog = new Blog({
        title,
        markdown,
        author,
        cover,
        date: new Date(),
        readTime: Math.ceil(markdown.length / 1000) + 2
      });

      await newBlog.save();

      res.status(201).json({
        message: "Blog published successfully",
        blog: newBlog,
      });
    } catch (error) {
      console.error("Error creating blog:", error);
      res.status(500).json({ message: "Server error while publishing blog" });
    }
  };



// Get all blogs
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs" });
  }
};
