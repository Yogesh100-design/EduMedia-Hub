import { io } from "socket.io-client";

const URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5001"
    : "https://edumedia-hub-2.onrender.com";

const socket = io(URL, {
  path: "/socket.io",
  transports: ["websocket"],
  reconnectionAttempts: 5,
  timeout: 20000,
});

export default socket;
