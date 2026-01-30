import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // e.g., "physics-101"
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Room", roomSchema);