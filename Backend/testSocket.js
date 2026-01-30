import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

socket.on("connect", () => {
  console.log("✅ Connected to server:", socket.id);

  socket.emit("sendMessage", {
    user: "Test User",
    text: "Hello from backend test 👋",
  });
});

socket.on("receiveMessage", (message) => {
  console.log("📩 Message from server:", message);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
});
