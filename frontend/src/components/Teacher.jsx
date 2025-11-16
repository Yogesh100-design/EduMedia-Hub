import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TopBar from "../Topbar"

const API_BASE_URL = "https://edumedia-hub-1-bgw0.onrender.com";

/* ---------- ICONS ---------- */
const HeartIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const CommentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

/* ---------- LIGHTBOX ---------- */
const LightBox = ({ src, type, onClose }) => {
  if (!src) return null;
  return (
    <div onClick={onClose} className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in">
      <div className="relative max-w-6xl w-full flex justify-center">
        {type === "image" && <img src={src} alt="Media preview" className="max-h-[90vh] rounded-2xl shadow-2xl object-contain" />}
        {type === "video" && <video src={src} controls autoPlay muted className="max-h-[90vh] rounded-2xl shadow-2xl" />}
        {type === "pdf" && <iframe src={src} className="w-full h-[90vh] rounded-2xl shadow-2xl bg-white" title="PDF Document" />}
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
          const url = file.url?.startsWith("http") ? file.url : `${API_BASE_URL}/${file.url || file}`;
          const type = file.type || getType(file);
          return (
            <div
              key={idx}
              onClick={() => { if (url) setLightBox({ url, type }) }}
              className="relative group cursor-pointer overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-cyan-400 hover:shadow-cyan-400/30 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300"
            >
              {type === "image" && <img src={url} alt={`Media ${idx}`} className="w-full h-full object-cover" />}
              {type === "video" && <video src={url} muted loop autoPlay playsInline className="w-full h-full object-cover" />}
              {type === "pdf" && (
                <div className="flex items-center justify-center h-full w-full bg-red-900/80 text-white flex-col p-4 transition duration-300 group-hover:bg-red-700/90">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span className="text-lg font-bold text-center">PDF File</span>
                  <span className="text-xs mt-1">Click to view</span>
                </div>
              )}
              {type === "file" && <div className="flex items-center justify-center h-full w-full bg-neutral-800 text-neutral-400 text-lg font-medium">FILE</div>}
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
    const tempComment = {
      _id: Date.now(),
      text: text,
      user: { username: "You", profileImg: `https://i.pravatar.cc/40?u=${localStorage.getItem("userId")}` }
    };
    onAdd(tempComment);
    setText("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ text: tempComment.text }),
      });
      const data = await res.json();
      if (!data.success) console.error("Failed to post comment:", data.message);
    } catch (err) {
      console.error("Network error while posting comment:", err);
    }
  };

  return (
    <div className="mt-6 border-t border-neutral-800 pt-4">
      <button onClick={() => setShow(!show)} className="flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition">
        <CommentIcon />
        {show ? "Hide Comments" : `View Comments (${comments.length})`}
      </button>
      {show && (
        <div className="mt-4 space-y-4 animate-fade-in">
          {comments.length > 0 ? (
            comments.map((c, i) => (
              <div key={c._id || i} className="flex items-start gap-3">
                <img src={c.user?.profileImg || `https://i.pravatar.cc/40?u=${c.user?.username || 'anon' + i}`} alt={c.user?.username || "Anonymous"} className="w-10 h-10 rounded-full object-cover border-2 border-neutral-700" onError={(e) => e.target.src = `https://placehold.co/40x40/1F2937/9CA3AF?text=U`} />
                <div className="bg-neutral-900 rounded-2xl px-4 py-2 border border-neutral-800 max-w-[85%]">
                  <p className="font-semibold text-sm text-neutral-200">{c.user?.username || "Anonymous"}</p>
                  <p className="text-neutral-300 text-sm break-words">{c.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-neutral-500 text-sm italic py-2">No comments yet. Be the first to start a conversation!</p>
          )}
          <form onSubmit={handleSubmit} className="flex items-center gap-3 py-2">
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Join the discussion..." className="flex-1 px-4 py-3 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-200 placeholder-neutral-500 focus:ring-2 focus:ring-cyan-400 outline-none transition" aria-label="Write a comment" />
            <button type="submit" disabled={!text.trim()} className="px-5 py-3 bg-cyan-500 text-black rounded-full font-semibold hover:bg-cyan-400 transition disabled:bg-neutral-700 disabled:text-neutral-500">Post</button>
          </form>
        </div>
      )}
    </div>
  );
};

/* ---------- SKELETON CARD ---------- */
const SkeletonCard = () => (
  <div className="w-full bg-neutral-900 rounded-3xl p-8 animate-pulse border border-neutral-800">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-16 h-16 bg-neutral-800 rounded-full" />
      <div className="flex-1 space-y-3">
        <div className="h-6 bg-neutral-800 rounded w-1/3" />
        <div className="h-4 bg-neutral-800 rounded w-1/4" />
      </div>
    </div>
    <div className="h-4 bg-neutral-800 rounded mb-2 w-full" />
    <div className="h-4 bg-neutral-800 rounded mb-6 w-3/4" />
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 auto-rows-[12rem] mb-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-neutral-800 rounded-2xl"></div>
      ))}
    </div>
    <div className="h-10 bg-neutral-800 rounded-full w-24" />
  </div>
);

/* ---------- MAIN DASHBOARD ---------- */
export default function TeacherDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId") || "mock-teacher-user-456";

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/feed`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      const data = await res.json();
      if (data.success) {
        setPosts(
          data.posts.map((p) => ({
            ...p,
            liked: p.likes?.includes(userId) || false,
            likes: p.likes || [],
            tags: p.tags || [],
            media: p.media || [],
            comments: p.comments || [],
            author: p.author || {},
          }))
        );
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    const old = posts.find((p) => p._id === postId);
    const newLiked = !old.liked;
    const newLikes = newLiked
      ? [...old.likes, userId]
      : old.likes.filter((id) => id !== userId);
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId ? { ...p, liked: newLiked, likes: newLikes } : p
      )
    );
    try {
      await fetch(`${API_BASE_URL}/api/v1/posts/${postId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
    } catch (e) {
      console.error("Failed to update like status:", e);
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
    <>
      <TopBar />
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-14 gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 animate-pulse">
                Teacher Command Center
              </h1>
              <p className="text-neutral-400 mt-4 text-lg">
                Manage announcements, track engagement, and share resources with
                students.
              </p>
            </div>
            <Link
              to="/teacher-post"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition transform"
              aria-label="Create a new post"
            >
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create New Post
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col gap-8">
              {[...Array(3)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-6xl mb-4 block">✏️</span>
              <p className="text-2xl text-neutral-500">
                No posts yet. Time to create your first announcement or
                resource!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {posts.map((post, idx) => {
                const author = post.author || {};
                return (
                  <article
                    key={post._id}
                    className="w-full bg-neutral-900 rounded-3xl p-8 border border-neutral-800 hover:border-purple-500 hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-500 animate-fade-in"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {/* Author */}
                    <header className="flex items-center gap-5 mb-6">
                      <img
                        src={
                          author.profileImg ||
                          `https://i.pravatar.cc/150?u=${author.username}`
                        }
                        alt={author.username || "User"}
                        className="w-16 h-16 rounded-full object-cover border-2 border-neutral-700"
                        onError={(e) =>
                          (e.target.src =
                            "https://placehold.co/64x64/1F2937/9CA3AF?text=U")
                        }
                      />
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-neutral-200">
                            {author.username || "Anonymous"}
                          </h3>
                          {author.role === "teacher" && (
                            <span className="px-3 py-1 text-xs uppercase tracking-wider bg-purple-600 text-white rounded-full font-bold">
                              Teacher
                            </span>
                          )}
                        </div>
                        <time className="text-sm text-neutral-500">
                          {new Date(post.createdAt).toLocaleString()}
                        </time>
                        <p className="text-sm text-neutral-400">
                          {post.type} • {post.audience}
                        </p>
                      </div>
                    </header>

                    {/* Content */}
                    <h2 className="text-2xl font-semibold text-neutral-100 mb-4">
                      {post.title}
                    </h2>
                    <p className="text-neutral-300 text-lg leading-relaxed mb-6 whitespace-pre-wrap">
                      {post.content}
                    </p>

                    {/* Media */}
                    {post.media.length > 0 && (
                      <MediaStrip media={post.media} />
                    )}

                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-3 mb-6">
                        {post.tags.map((t) => (
                          <span
                            key={t}
                            className="px-4 py-1.5 bg-purple-400/10 text-purple-300 rounded-full text-sm font-medium border border-purple-400/20"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-start">
                      <button
                        onClick={() => handleLike(post._id)}
                        className={`flex items-center gap-3 py-3 px-6 rounded-full text-sm font-semibold transition-all shadow-md ${
                          post.liked
                            ? "bg-gradient-to-r from-pink-500 to-red-600 text-black hover:shadow-xl"
                            : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                        }`}
                        aria-label={post.liked ? "Unlike post" : "Like post"}
                      >
                        <HeartIcon
                          className={`w-6 h-6 transition-transform ${
                            post.liked ? "scale-110" : "scale-100"
                          }`}
                        />
                        <span>{post.likes.length} Likes</span>
                      </button>
                    </div>

                    {/* Comments */}
                    <CommentSection
                      postId={post._id}
                      comments={post.comments}
                      onAdd={(c) => handleAddComment(post._id, c)}
                    />
                  </article>
                );
              })}
            </div>
          )}

          {/* CSS animations */}
          <style>{`
            @keyframes fade-in {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
              animation: fade-in 0.6s ease-out forwards;
            }
          `}</style>
        </div>
      </div>
    </>
  );
}
