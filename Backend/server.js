import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";

// Routes
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
// Consolidated CORS to match Express config
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});



io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // Use a specific listener for chat messages
  socket.on("sendMessage", (data) => {
    console.log("📩 Message received:", data);

    // Add a unique ID and Timestamp on the server side
    const messagePayload = {
      id: Date.now() + Math.random(), // Unique key for React lists
      user: data.user || "Anonymous",
      text: data.text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // io.emit sends it to everyone, including the sender
    io.emit("receiveMessage", messagePayload);
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
const PORT =  4000;
server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
});