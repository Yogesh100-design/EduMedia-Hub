import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";

import userRoutes from "./routes/User.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import BlogRoute from "./routes/Blog.routes.js";
import qnaRoutes from "./routes/qnaRoutes.js";
import userProfile from "./routes/userProfile.routes.js";

dotenv.config();
const app = express();

/* ---------------- DATABASE ---------------- */
connectDB();

/* ---------------- MIDDLEWARE ---------------- */
app.use(
  cors({
    origin: ["http://localhost:5173", "https://edumedia-hub-2.onrender.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

/* ---------------- STATIC ---------------- */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ---------------- ROUTES ---------------- */
app.use("/api/v1/users", userRoutes);
app.use("/api/v1", uploadRoutes);
app.use("/api/v1", BlogRoute);
app.use("/api/qna", qnaRoutes);
app.use("/api/v1/user", userProfile);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* ---------------- HTTP SERVER ---------------- */
const server = http.createServer(app);

/* ---------------- SOCKET.IO ---------------- */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("sendMessage", (message) => {
    console.log("📩 Message received:", message);
    io.emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

/* ---------------- ERROR HANDLERS ---------------- */
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({ success: false, message: "Server Error" });
});

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
});
