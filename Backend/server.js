import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";

// Models
import Room from "./models/room.js"; 

// Routes
import userRoutes from "./routes/User.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import BlogRoute from "./routes/Blog.routes.js";
import qnaRoutes from "./routes/qnaRoutes.js";
import userProfile from "./routes/userProfile.routes.js";
import { socketController } from "./controllers/socket.controller.js";

dotenv.config();
const app = express();
const __dirname = path.resolve(); // Resolves the root directory

/* ---------------- DATABASE ---------------- */
connectDB();

/* ---------------- MIDDLEWARE ---------------- */
const allowedOrigins = ["http://localhost:5173", "https://edumedia-hub-2.onrender.com"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging Middleware
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

/* ---------------- API ROUTES ---------------- */
app.use("/api/v1/users", userRoutes);
app.use("/api/v1", uploadRoutes);
app.use("/api/v1", BlogRoute);
app.use("/api/qna", qnaRoutes);
app.use("/api/v1/user", userProfile);

app.get("/api/v1/rooms", async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching rooms" });
  }
});

app.post("/api/v1/rooms", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Room name is required" });
    const roomId = name.toLowerCase().replace(/\s+/g, "-");
    const newRoom = new Room({ id: roomId, name });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating room" });
  }
});

/* ---------------- STATIC FILES & DEPLOYMENT ---------------- */
// 1. Serve 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// 2. Serve React Frontend (Assumes your build folder is named 'dist')
// Change "frontend/dist" to match your actual folder structure (e.g., "client/dist" or just "dist")
app.use(express.static(path.join(__dirname, "/frontend/dist")));

// 3. THE FIX: Catch-all route to serve React's index.html
app.use((req, res, next) => {
  if (req.url.startsWith("/api")) return next();
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});


/* ---------------- HTTP SERVER ---------------- */
const server = http.createServer(app);

/* ---------------- SOCKET.IO ---------------- */
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

socketController(io);

/* ---------------- ERROR HANDLERS ---------------- */
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({ success: false, message: "Server Error" });
});

/* ---------------- START SERVER ---------------- */
const PORT =  4000;
server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
});