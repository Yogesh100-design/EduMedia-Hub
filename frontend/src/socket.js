import { io } from "socket.io-client";

// Use the environment variable port or default to 4000 to match your server
const URL = "http://localhost:4000"; 

const socket = io(URL, {
  withCredentials: true,
  autoConnect: true,
});

export default socket;