import Message from "../models/Message.js";
import Room from "../models/room.js";

export const socketController = (io) => {
  io.on("connection", (socket) => {

    socket.on("joinRoom", async (roomId) => {
      socket.join(roomId);
      
      // FETCH HISTORY: Load last 50 messages for this specific room
      const history = await Message.find({ roomId }).sort({ createdAt: 1 }).limit(50);
      socket.emit("loadMessages", history);
    });

    socket.on("sendMessage", async (data) => {
      try {
        // SAVE TO DB
        const newMessage = new Message({
          roomId: data.roomId,
          senderId: data.senderId,
          user: data.user,
          text: data.text,
          time: data.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        await newMessage.save();

        // Broadcast to everyone in the room
        io.to(data.roomId).emit("receiveMessage", newMessage);
      } catch (err) {
        console.error("Error saving message:", err);
      }
    });
  });
};