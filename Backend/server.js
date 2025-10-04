import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";
import userRoutes from "./routes/User.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import BlogRoute from "./routes/Blog.routes.js"


dotenv.config();
const app = express();

// ✅ Connect Database
connectDB();

// ✅ Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // React/Vite frontend
    credentials: true,               // allow cookies & headers
  })
);

// Parse JSON & urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Debugging middleware (optional)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// ✅ Serve static files (uploads)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ✅ Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1", uploadRoutes);
app.use("/api/v1", BlogRoute);



// ✅ Simple test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({ success: false, message: "Server Error" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
