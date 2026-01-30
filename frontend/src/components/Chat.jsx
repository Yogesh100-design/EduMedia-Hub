import { useEffect, useState, useRef } from "react";
import socket from "../socket";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const onReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receiveMessage", onReceiveMessage);

    return () => {
      socket.off("receiveMessage", onReceiveMessage);
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    // We only emit here; the server will broadcast it back to update our UI
    socket.emit("sendMessage", {
      user: "Me", 
      text: message,
    });

    setMessage("");
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>💬 Live Chat</h2>
        <div style={styles.statusGroup}>
          <div style={styles.dot}></div>
          <span style={styles.statusText}>Live</span>
        </div>
      </header>

      <div style={styles.chatBox}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              ...styles.messageWrapper,
              alignSelf: msg.user === "Me" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                ...styles.bubble,
                backgroundColor: msg.user === "Me" ? "#007AFF" : "#F2F2F7",
                color: msg.user === "Me" ? "white" : "#1C1C1E",
                borderBottomRightRadius: msg.user === "Me" ? "4px" : "18px",
                borderBottomLeftRadius: msg.user === "Me" ? "18px" : "4px",
              }}
            >
              <span style={styles.userLabel}>{msg.user}</span>
              <p style={styles.text}>{msg.text}</p>
              <small style={{...styles.time, color: msg.user === "Me" ? "#E0E0E0" : "#8E8E93"}}>
                {msg.time}
              </small>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <div style={styles.inputArea}>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.sendButton}>Send</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "20px auto",
    height: "600px",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    overflow: "hidden",
  },
  header: {
    padding: "20px",
    background: "#ffffff",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { margin: 0, fontSize: "1.1rem", fontWeight: "700", color: "#1a1a1a" },
  statusGroup: { display: "flex", alignItems: "center", gap: "6px" },
  dot: { width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#34C759" },
  statusText: { fontSize: "0.8rem", color: "#34C759", fontWeight: "600" },
  chatBox: {
    flex: 1,
    padding: "15px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    backgroundColor: "#ffffff",
  },
  messageWrapper: { maxWidth: "85%", display: "flex", flexDirection: "column" },
  bubble: {
    padding: "10px 14px",
    borderRadius: "18px",
    position: "relative",
  },
  userLabel: { fontSize: "0.65rem", fontWeight: "700", marginBottom: "2px", display: "block", textTransform: "uppercase", opacity: 0.8 },
  text: { margin: 0, fontSize: "0.95rem", fontWeight: "400", wordBreak: "break-word" },
  time: { fontSize: "0.6rem", marginTop: "4px", display: "block", textAlign: "right" },
  inputArea: { padding: "15px", display: "flex", gap: "10px", borderTop: "1px solid #eee" },
  input: {
    flex: 1,
    padding: "12px 18px",
    borderRadius: "25px",
    border: "1px solid #E5E5EA",
    backgroundColor: "#F2F2F7",
    outline: "none",
    fontSize: "0.95rem",
  },
  sendButton: {
    padding: "0 20px",
    backgroundColor: "#007AFF",
    color: "white",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default Chat;