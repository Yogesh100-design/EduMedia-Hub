import { io } from "socket.io-client";

// This detects if the app is running on Render or locally
const URL = window.location.hostname === "localhost" 
  ? "http://localhost:5001" 
  : "https://edumedia-hub-2.onrender.com";

const socket = io(URL, {
  withCredentials: true,
  autoConnect: true,
  // High-performance settings for production
  transports: ["websocket", "polling"], 
  reconnectionAttempts: 5,
});

export default socket;