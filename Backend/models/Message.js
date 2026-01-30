import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  // ADD THIS LINE: To link the message to a specific study group
  roomId: { 
    type: String, 
    required: true,
    index: true // Makes searching for messages in a room much faster
  },
  senderId: String,
  user: String,
  text: String,
  time: {
    type: String,
    default: () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  },
  createdAt: { type: Date, default: Date.now },
});

// Rename 'Socket' to 'Message' for clarity
export default mongoose.model("Message", messageSchema);