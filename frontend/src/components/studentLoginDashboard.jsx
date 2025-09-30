// StudentDashboard.jsx  (width + actions re-arranged)
import React, { useState, useEffect } from "react";

const HeartIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const LightBox = ({ src, type, onClose }) => {
  if (!src) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
    >
      {type === "image" && <img src={src} alt="" className="max-w-full max-h-full rounded-2xl shadow-2xl" />}
      {type === "video" && <video src={src} controls autoPlay muted className="max-w-full max-h-full rounded-2xl shadow-2xl" />}
      {type === "pdf" && <iframe src={src} className="w-full h-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl" title="PDF" />}
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
          const url = `http://localhost:5001/${file.url || file}`;
          const type = getType(file);
          return (
            <div
              key={idx}
              onClick={() => setLightBox({ url, type })}
              className="relative group cursor-pointer overflow-hidden rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 hover:scale-105 transition-transform duration-300"
            >
              {type === "image" && <img src={url} alt="" className="w-full h-full object-cover" />}
              {type === "video" && (
                <video
                  src={url}
                  muted
                  loop
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  onMouseEnter={(e) => e.play()}
                  onMouseLeave={(e) => e.pause()}
                />
              )}
              {type === "pdf" && (
                <div className="flex flex-col items-center justify-center h-full text-white">
                  <span className="text-sm font-semibold">PDF</span>
                </div>
              )}
              {type === "file" && (
                <div className="flex flex-col items-center justify-center h-full text-white">
                  <span className="text-xs">FILE</span>
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

const SkeletonCard = () => (
  <div className="w-full bg-white/30 backdrop-blur-xl rounded-3xl p-8 animate-pulse">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-16 h-16 bg-gray-300 rounded-full" />
      <div className="flex-1 space-y-3">
        <div className="h-6 bg-gray-300 rounded w-1/3" />
        <div className="h-4 bg-gray-300 rounded w-1/4" />
      </div>
    </div>
    <div className="h-32 bg-gray-300 rounded-2xl mb-6" />
    <div className="h-10 bg-gray-300 rounded-full w-24" />
  </div>
);

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
      if (data.success) setPosts(data.posts.map((p) => ({ ...p, liked: p.likes.includes(userId) })));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* ---- Hero ---- */}
        <div className="text-center mb-14">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Community Pulse
          </h1>
          <p className="text-gray-600 mt-4 text-lg">Connect, share and learn with your peers—now in style.</p>
        </div>

        {loading ? (
          <div className="flex flex-col gap-8">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
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
                  className="w-full bg-white/70 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 animate-in fade-in slide-in-from-bottom-10"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* ---- Author ---- */}
                  <header className="flex items-center gap-5 mb-6">
                    <img
                      src={author.profileImg || `https://i.pravatar.cc/150?u=${author.username}`}
                      alt={author.username}
                      className="w-16 h-16 rounded-full object-cover border-4 border-white/60 shadow-lg"
                    />
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-800">{author.username}</h3>
                        {author.role === "teacher" && (
                          <span className="px-3 py-1 text-xs uppercase tracking-wider bg-purple-600 text-white rounded-full">
                            Teacher
                          </span>
                        )}
                      </div>
                      <time className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</time>
                    </div>
                  </header>

                  {/* ---- Content ---- */}
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">{post.content}</p>

                  {/* ---- Media ---- */}
                  {post.media?.length > 0 && <MediaStrip media={post.media} />}

                  {/* ---- Tags ---- */}
                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-6">
                      {post.tags.map((t) => (
                        <span key={t} className="px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* ---- Divider ---- */}
                  <hr className="border-gray-200 dark:border-gray-700 my-4" />

                  {/* ---- Action Bar : LEFT vs RIGHT ---- */}
                  <div className="flex items-center justify-between">
                    {/* LEFT : empty for future extras */}

                    {/* RIGHT : Like + Comment */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(post._id)}
                        className={`group flex items-center gap-3 py-3 px-6 rounded-full text-sm font-semibold transition-all ${
                          post.liked
                            ? "bg-purple-600 text-white shadow-lg hover:bg-purple-700"
                            : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                        }`}
                      >
                        <HeartIcon
                          className={`w-6 h-6 transition-transform ${post.liked ? "scale-110" : ""} ${
                            post.liked ? "text-white" : ""
                          }`}
                        />
                        <span>{post.liked ? "Liked" : "Like"}</span>
                        <span className="ml-auto">{post.likes.length}</span>
                      </button>

                      <button className="flex items-center gap-3 py-3 px-6 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{post.comments?.length || 0}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}{" "}
      </div>

      {/* ---- entrance animations ---- */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-in-from-bottom-10 {
          from {
            transform: translateY(2rem);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: fade-in 0.6s ease-out, slide-in-from-bottom-10 0.6s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
}