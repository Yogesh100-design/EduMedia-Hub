// StudentDashboard.jsx
import React, { useState, useEffect } from "react";

/* ---------- ICONS ---------- */
const HeartIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
             2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
             C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 
             22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const CommentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01
         M21 12c0 4.418-4.03 8-9 8
         a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72
         C3.512 15.042 3 13.574 3 12
         c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

/* ---------- LIGHTBOX ---------- */
const LightBox = ({ src, type, onClose }) => {
  if (!src) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex items-center justify-center p-6 animate-fade-in"
    >
      <div className="relative max-w-6xl w-full flex justify-center">
        {type === "image" && (
          <img src={src} alt="" className="max-h-[90vh] rounded-2xl shadow-2xl" />
        )}
        {type === "video" && (
          <video src={src} controls autoPlay muted className="max-h-[90vh] rounded-2xl shadow-2xl" />
        )}
        {type === "pdf" && (
          <iframe src={src} className="w-full h-[90vh] rounded-2xl shadow-2xl bg-white" title="PDF" />
        )}
      </div>
    </div>
  );
};

/* ---------- MEDIA STRIP ---------- */
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
          const url = `http://localhost:5001/${file.url || file}`;
          const type = getType(file);
          return (
            <div
              key={idx}
              onClick={() => setLightBox({ url, type })}
              className="relative group cursor-pointer overflow-hidden rounded-2xl bg-white/10 backdrop-blur-lg border border-gray-200 hover:scale-[1.03] transition-transform duration-300 shadow-md"
            >
              {type === "image" && <img src={url} alt="" className="w-full h-full object-cover" />}
              {type === "video" && <video src={url} muted loop autoPlay playsInline className="w-full h-full object-cover" />}
              {type === "pdf" && (
                <div className="flex flex-col items-center justify-center h-full text-white font-semibold bg-indigo-500/70">
                  PDF
                </div>
              )}
              {type === "file" && (
                <div className="flex flex-col items-center justify-center h-full text-white bg-gray-700/70">
                  FILE
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          );
        })}
      </div>
      <LightBox src={lightBox?.url} type={lightBox?.type} onClose={() => setLightBox(null)} />
    </>
  );
};

/* ---------- COMMENT SECTION ---------- */
const CommentSection = ({ postId, comments = [], onAdd }) => {
  const [text, setText] = useState("");
  const [show, setShow] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await fetch(`http://localhost:5001/api/v1/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.success) {
        onAdd(data.comment);
        setText("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => setShow(!show)}
        className="text-sm font-medium text-indigo-600 hover:underline"
      >
        {show ? "Hide Comments" : `View Comments (${comments.length})`}
      </button>

      {show && (
        <div className="mt-4 space-y-4 animate-fade-in">
          {/* Existing Comments */}
          {comments.length > 0 ? (
            comments.map((c, i) => (
              <div key={i} className="flex items-start gap-3 animate-slide-up">
                <img
                  src={c.user?.profileImg || `https://i.pravatar.cc/40?u=${c.user?.username}`}
                  alt={c.user?.username}
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div className="bg-gray-100 rounded-2xl px-4 py-2 shadow-sm">
                  <p className="font-semibold text-sm">{c.user?.username || "Anonymous"}</p>
                  <p className="text-gray-700 text-sm">{c.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No comments yet. Be the first!</p>
          )}

          {/* Add Comment */}
          <form onSubmit={handleSubmit} className="flex items-center gap-3 sticky bottom-0 bg-white py-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-md"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

/* ---------- DASHBOARD ---------- */
export default function StudentDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/v1/feed", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts.map((p) => ({
          ...p,
          liked: p.likes.includes(userId),
        })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    const old = posts.find((p) => p._id === postId);
    const newLikes = old.liked ? old.likes.filter((id) => id !== userId) : [...old.likes, userId];
    setPosts((prev) => prev.map((p) => (p._id === postId ? { ...p, liked: !p.liked, likes: newLikes } : p)));

    try {
      await fetch(`http://localhost:5001/api/v1/posts/${postId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
    } catch (e) {
      setPosts((prev) => prev.map((p) => (p._id === postId ? old : p)));
    }
  };

  const handleAddComment = (postId, comment) => {
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId ? { ...p, comments: [...p.comments, comment] } : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-14">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Community Pulse
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            Connect, share and learn with your peers—now in style.
          </p>
        </div>

        {/* Posts */}
        {loading ? (
          <p className="text-center text-gray-500 animate-pulse">Loading posts...</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">🤷‍♂️</span>
            <p className="text-2xl text-gray-500">No posts yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {posts.map((post, idx) => {
              const author = post.author || {};
              return (
                <article
                  key={post._id}
                  className="w-full bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 animate-fade-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* Author */}
                  <header className="flex items-center gap-5 mb-6">
                    <img
                      src={author.profileImg || `https://i.pravatar.cc/150?u=${author.username}`}
                      alt={author.username}
                      className="w-16 h-16 rounded-full object-cover border-4 border-white/60 shadow-md"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{author.username}</h3>
                      <time className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleString()}
                      </time>
                    </div>
                  </header>

                  {/* Content */}
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">{post.content}</p>

                  {/* Media */}
                  {post.media?.length > 0 && <MediaStrip media={post.media} />}

                  {/* Actions */}
                  <div className="flex items-center gap-4 mt-4">
                    <button
                      onClick={() => handleLike(post._id)}
                      className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold shadow transition ${
                        post.liked
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                      }`}
                    >
                      <HeartIcon className="w-5 h-5" />
                      {post.likes.length}
                    </button>

                    <button
                      className="flex items-center gap-2 px-5 py-2 rounded-full font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      <CommentIcon />
                      {post.comments?.length || 0}
                    </button>
                  </div>

                  {/* Comments */}
                  <CommentSection
                    postId={post._id}
                    comments={post.comments || []}
                    onAdd={(c) => handleAddComment(post._id, c)}
                  />
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-slide-up {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
