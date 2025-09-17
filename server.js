import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from './routes/User.routes.js'
import uploadRoutes from './routes/upload.routes.js'

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/v1/users',userRoutes)
app.use('/api/v1/',uploadRoutes)

// Simple test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
