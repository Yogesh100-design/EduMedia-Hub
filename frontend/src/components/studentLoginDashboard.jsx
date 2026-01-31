import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SideBar from "../Sidebar";

const API_BASE_URL = "https://edumedia-hub-1-bgw0.onrender.com";

/* ---------- HELPER: ALPHABET AVATAR ---------- */
const AlphabetAvatar = ({ name, size = "w-12 h-12", fontSize = "text-xl" }) => {
  const firstLetter = name ? name.charAt(0).toUpperCase() : "?";

  // Array of colors to make the UI vibrant
  const colors = [
    "bg-cyan-600",
    "bg-purple-600",
    "bg-blue-600",
    "bg-pink-600",
    "bg-emerald-600",
    "bg-indigo-600",
  ];

  // Pick a color based on the first letter's char code so it stays consistent for that user
  const colorIndex = firstLetter.charCodeAt(0) % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <div
      className={`${size} ${bgColor} rounded-full flex items-center justify-center font-black text-white border-2 border-neutral-800 shadow-inner`}
    >
      <span className={fontSize}>{firstLetter}</span>
    </div>
  );
};

/* ---------- ICONS ---------- */
const HeartIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const CommentIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

/* ---------- LIGHTBOX & MEDIA STRIP (Logic remains same) ---------- */
const LightBox = ({ src, type, onClose }) => {
  if (!src) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in"
    >
      <div className="relative max-w-6xl w-full flex justify-center">
        {type === "image" && (
          <img
            src={src}
            alt="Preview"
            className="max-h-[90vh] rounded-2xl object-contain shadow-2xl"
          />
        )}
        {type === "video" && (
          <video
            src={src}
            controls
            autoPlay
            className="max-h-[90vh] rounded-2xl shadow-2xl"
          />
        )}
        {type === "pdf" && (
          <iframe
            src={src}
            className="w-full h-[90vh] rounded-2xl bg-white"
            title="PDF"
          />
        )}
      </div>
    </div>
  );
};

const MediaStrip = ({ media = [] }) => {
  const [lightBox, setLightBox] = useState(null);
  const getType = (file) => {
    const url = file.url || file;
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(url)) return "image";
    if (/\.(mp4|webm|ogg)$/i.test(url)) return "video";
    if (/\.pdf$/i.test(url)) return "pdf";
    return "file";
  };
  return (
    <>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 auto-rows-[12rem] mb-6">
        {media.map((file, idx) => {
          const url = file.url?.startsWith("http")
            ? file.url
            : `${API_BASE_URL}/${file.url || file}`;
          const type = file.type || getType(file);
          return (
            <div
              key={idx}
              onClick={() => setLightBox({ url, type })}
              className="relative group cursor-pointer overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-cyan-400 transition-all duration-300"
            >
              {type === "image" && (
                <img
                  src={url}
                  alt="Media"
                  className="w-full h-full object-cover"
                />
              )}
              {type === "video" && (
                <video
                  src={url}
                  muted
                  loop
                  autoPlay
                  className="w-full h-full object-cover"
                />
              )}
              {type === "pdf" && (
                <div className="flex flex-col items-center justify-center h-full bg-cyan-900/20 text-cyan-500">
                  <span className="text-4xl mb-2">📄</span>
                  <span className="text-xs font-bold">PDF</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <LightBox
        src={lightBox?.url}
        type={lightBox?.type}
        onClose={() => setLightBox(null)}
      />
    </>
  );
};

/* ---------- COMMENT SECTION WITH ALPHABET AVATAR ---------- */
const CommentSection = ({ postId, comments = [], onAdd }) => {
  const [text, setText] = useState("");
  const [show, setShow] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const tempComment = {
      _id: Date.now(),
      text: text,
      user: { username: "You" },
    };
    onAdd(tempComment);
    setText("");
    try {
      await fetch(`${API_BASE_URL}/api/v1/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ text: tempComment.text }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-6 border-t border-neutral-800 pt-4">
      <button
        onClick={() => setShow(!show)}
        className="flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition"
      >
        <CommentIcon />{" "}
        {show ? "Hide Comments" : `Comments (${comments.length})`}
      </button>
      {show && (
        <div className="mt-4 space-y-4">
          {comments.map((c, i) => (
            <div key={i} className="flex items-start gap-3">
              {/* Using AlphabetAvatar instead of <img> */}
              <AlphabetAvatar
                name={c.user?.username}
                size="w-8 h-8"
                fontSize="text-xs"
              />
              <div className="bg-neutral-800/50 rounded-2xl px-4 py-2 border border-neutral-700">
                <p className="font-bold text-xs text-neutral-300">
                  {c.user?.username || "Anonymous"}
                </p>
                <p className="text-sm text-neutral-400">{c.text}</p>
              </div>
            </div>
          ))}
          <form onSubmit={handleSubmit} className="flex gap-2 pt-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-neutral-900 border border-neutral-700 rounded-full px-4 py-2 text-sm outline-none focus:border-cyan-500"
            />
            <button className="bg-cyan-600 px-4 py-2 rounded-full text-sm font-bold text-black">
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

/* ---------- MAIN DASHBOARD ---------- */
export default function StudentDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId") || "mock-student";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/feed`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setPosts(
            data.posts.map((p) => ({
              ...p,
              liked: p.likes?.includes(userId),
              likes: p.likes || [],
              media: p.media || [],
              comments: p.comments || [],
            })),
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [userId]);

  return (
    <div className="flex min-h-screen bg-black text-white">
      <SideBar />
      <main className="flex-1 sm:ml-72 transition-all duration-300">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Student Community Pulse
            </h1>
            <p className="text-neutral-500 mt-3 text-lg">
              Connect with peers and access shared resources.
            </p>
            
          </header>

          <Link
              to="/chat"
              className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 rounded-2xl font-bold hover:scale-105 transition shadow-lg shadow-purple-500/20"
            >
              + join
            </Link>

          <div className="space-y-10">
            {posts.map((post) => (
              <article
                key={post._id}
                className="bg-neutral-900/50 border border-neutral-800 rounded-[2.5rem] p-8 hover:border-cyan-500/50 transition-all duration-500"
              >
                <div className="flex items-center gap-4 mb-6">
                  {/* Using AlphabetAvatar for Post Author */}
                  <AlphabetAvatar
                    name={post.author?.username}
                    size="w-14 h-14"
                    fontSize="text-2xl"
                  />
                  <div>
                    <h3 className="font-bold text-neutral-200 text-lg">
                      {post.author?.username || "Anonymous"}
                      {post.author?.role === "teacher" && (
                        <span className="ml-2 text-[10px] bg-cyan-600 text-black px-2 py-0.5 rounded-full uppercase font-black">
                          Teacher
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest">
                      {post.type} •{" "}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-4 text-white">
                  {post.title}
                </h2>
                <p className="text-neutral-400 mb-6 leading-relaxed text-lg">
                  {post.content}
                </p>

                {post.media.length > 0 && <MediaStrip media={post.media} />}

                <button
                  onClick={() => {
                    /* Like logic */
                  }}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold bg-neutral-800 text-neutral-400`}
                >
                  <HeartIcon className="w-5 h-5" /> {post.likes.length} Likes
                </button>

                <CommentSection
                  postId={post._id}
                  comments={post.comments}
                  onAdd={(c) => {}}
                />
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
