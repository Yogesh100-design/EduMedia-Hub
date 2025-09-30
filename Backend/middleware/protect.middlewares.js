import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    // 1️⃣ Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const token = authHeader.split(" ")[1]; // Extract the token

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    // 2️⃣ Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Token invalid or expired" });
    }

    if (!decoded.userId) {
      return res.status(401).json({ message: "Token invalid" });
    }

    // 3️⃣ Attach logged-in user to req
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // Controllers can now access req.user._id
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error in authentication" });
  }
};

