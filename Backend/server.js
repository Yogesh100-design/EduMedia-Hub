import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/User.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import path from "path";

dotenv.config();
const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // React/Vite frontend
    credentials: true,               // allow cookies & headers
  })
);
app.use(express.json());

// ✅ Debugging middleware (see requests in terminal)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// ✅ Connect Database
connectDB();

// ✅ Routes
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/v1/users", userRoutes);
app.use("/api/v1", uploadRoutes);


// ✅ Simple test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
