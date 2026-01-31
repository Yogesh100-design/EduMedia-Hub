import { useEffect, useState, useRef } from "react";
import socket from "../socket";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [groups, setGroups] = useState([{ id: "global", name: "Global Dark Room" }]);
  const [activeRoom, setActiveRoom] = useState("global");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const scrollRef = useRef(null);
  
  const [userId] = useState(() => "user_" + Math.floor(Math.random() * 9999));

  // 1. FETCH ROOMS FROM BACKEND ON LOAD
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("https://edumedia-hub-1-bgw0.onrender.com/api/v1/rooms");
        const data = await response.json();
        if (data && data.length > 0) {
          setGroups(data);
        }
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    };
    fetchRooms();
  }, []);

  // 2. AUTO-SCROLL
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. ROOM JOINING & HISTORY
  useEffect(() => {
    socket.emit("joinRoom", activeRoom);
    setMessages([]); // Clear current view while switching
    
    // The backend 'joinRoom' event now triggers this
    socket.on("loadMessages", (history) => {
      setMessages(history);
    });

    return () => {
      socket.off("loadMessages");
    };
  }, [activeRoom]);

  // 4. REAL-TIME MESSAGE LISTENING
  useEffect(() => {
    const onReceiveMessage = (msg) => {
      if (msg.roomId === activeRoom) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receiveMessage", onReceiveMessage);
    return () => socket.off("receiveMessage", onReceiveMessage);
  }, [activeRoom]);

  // 5. CREATE GROUP (SAVE TO DB)
  const createGroup = async () => {
    if (!newGroupName.trim()) return;

    try {
      const response = await fetch("https://edumedia-hub-1-bgw0.onrender.com/api/v1/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newGroupName }),
      });
      
      const savedRoom = await response.json();
      
      setGroups((prev) => [...prev, savedRoom]);
      setActiveRoom(savedRoom.id);
      setNewGroupName("");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error creating room:", err);
      alert("Failed to create room. Check if backend is running.");
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    const payload = {
      roomId: activeRoom,
      senderId: userId,
      user: "User-" + userId.slice(-3),
      text: message,
    };

    socket.emit("sendMessage", payload);
    setMessage("");
  };

  return (
    <div className="flex h-screen w-full bg-[#0b0b0b] text-gray-200 overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#141414] border-r border-gray-800 flex flex-col shrink-0">
        <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-[#1a1a1a]">
          <h2 className="font-bold text-blue-500 text-xs tracking-widest uppercase">Study Groups</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-1.5 bg-gray-800 hover:bg-blue-600 rounded-md transition-all group"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"></path></svg>
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {groups.map((group) => (
            <button
              key={group.id}
              onClick={() => setActiveRoom(group.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                activeRoom === group.id 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                : "hover:bg-[#1e1e1e] text-gray-400"
              }`}
            >
              <span className="opacity-50">#</span>
              <span className="truncate font-medium text-sm">{group.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* CHAT MAIN CONTENT */}
      <main className="flex-1 flex flex-col bg-[#0b0b0b] relative">
        <header className="bg-[#1a1a1a]/80 backdrop-blur-md px-8 py-5 border-b border-gray-800 flex items-center justify-between z-10">
          <div>
            <h2 className="font-bold text-xl text-white"># {groups.find(g => g.id === activeRoom)?.name || "Chat"}</h2>
            <p className="text-[10px] text-blue-400 font-bold uppercase mt-1 tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
              Live Session
            </p>
          </div>
        </header>

        {/* MESSAGES BOX */}
        <div className="flex-1 overflow-y-auto px-6 md:px-20 py-8 flex flex-col gap-4 custom-scrollbar">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full opacity-20 text-center">
              <svg className="mx-auto" width="60" height="60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              <p className="mt-4 text-xs uppercase tracking-[0.2em]">No history in this room</p>
            </div>
          )}
          
          {messages.map((msg, index) => {
            const isMe = msg.senderId === userId;
            return (
              <div key={msg._id || index} className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] md:max-w-[60%] px-4 py-3 rounded-2xl relative shadow-xl transition-all ${
                  isMe ? "bg-blue-600 text-white rounded-tr-none" : "bg-[#1e1e1e] text-gray-200 rounded-tl-none border border-gray-800"
                }`}>
                  {!isMe && <span className="text-[10px] font-black text-blue-400 uppercase mb-1 block">{msg.user}</span>}
                  <p className="text-[15px] leading-relaxed break-words">{msg.text}</p>
                  <span className={`text-[9px] block text-right mt-2 opacity-50 ${isMe ? "text-white" : "text-gray-400"}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>

        {/* INPUT FOOTER */}
        <footer className="p-6 bg-[#121212] border-t border-gray-800">
          <div className="flex items-center gap-4 max-w-5xl mx-auto">
            <div className="flex-1 bg-[#1a1a1a] border border-gray-800 rounded-2xl px-5 py-1 focus-within:border-blue-600 transition-all shadow-inner">
              <input
                type="text"
                placeholder={`Message in #${activeRoom}...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="w-full bg-transparent py-3 text-sm outline-none placeholder-gray-600"
              />
            </div>
            <button 
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-900/30"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
            </button>
          </div>
        </footer>
      </main>

      {/* CREATE GROUP MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md px-4">
          <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-gray-800 w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">New Study Room</h3>
            <p className="text-gray-500 text-sm mb-6">Create a space for a specific subject or topic.</p>
            <input 
              autoFocus
              className="w-full bg-[#0b0b0b] border border-gray-700 rounded-xl px-5 py-3 text-sm outline-none focus:border-blue-500 transition-all text-white mb-6"
              placeholder="e.g. Advanced Mathematics"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <div className="flex justify-end gap-3 font-bold">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-gray-500 hover:text-white">Cancel</button>
              <button onClick={createGroup} className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 shadow-lg shadow-blue-900/20">Create Room</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #444; }
      `}</style>
    </div>
  );
};

export default Chat;