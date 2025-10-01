import React, { useState, useEffect } from "react";

// The base URL for fetching/linking media and API calls (mocked for environment consistency)
const API_BASE_URL = "http://localhost:5001";

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


/* ---------- LIGHTBOX (Media Viewer) ---------- */
const LightBox = ({ src, type, onClose }) => {
  if (!src) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex items-center justify-center p-6 animate-fade-in"
    >
      <div className="relative max-w-6xl w-full flex justify-center">
        {type === "image" && <img src={src} alt="Media preview" className="max-h-[90vh] rounded-2xl shadow-2xl object-contain" />}
        {type === "video" && <video src={src} controls autoPlay muted className="max-h-[90vh] rounded-2xl shadow-2xl" />}
        {type === "pdf" && <iframe src={src} className="w-full h-[90vh] rounded-2xl shadow-2xl bg-white" title="PDF Document" />}
      </div>
    </div>
  );
};

/* ---------- MEDIA STRIP (Grid of Media Previews) ---------- */
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
          const url = `${API_BASE_URL}/${file.url || file}`;
          const type = file.type || getType(file);
          return (
            <div
              key={idx}
              // Prevent LightBox from opening if media item is missing a URL
              onClick={() => { if (url) setLightBox({ url, type }) }}
              className="relative group cursor-pointer overflow-hidden rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 hover:scale-[1.03] transition-transform duration-300 shadow-lg"
            >
              {type === "image" && <img src={url} alt={`Media ${idx}`} className="w-full h-full object-cover" />}
              {type === "video" && <video src={url} muted loop autoPlay playsInline className="w-full h-full object-cover" />}
              
              {/* Enhanced PDF Preview */}
              {type === "pdf" && (
                <div className="flex items-center justify-center h-full w-full bg-red-600/80 text-white flex-col p-4 transition duration-300 group-hover:bg-red-700/90">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span className="text-lg font-bold text-center">PDF File</span>
                  <span className="text-xs mt-1">Click to view</span>
                </div>
              )}

              {type === "file" && <div className="flex items-center justify-center h-full w-full bg-gray-700/80 text-white text-lg font-medium">FILE</div>}
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
    
    // Optimistic UI update for better feel
    const tempId = Date.now();
    const tempComment = {
      _id: tempId,
      text: text,
      user: {
        username: "You (Posting)",
        profileImg: `https://i.pravatar.cc/40?u=${localStorage.getItem("userId")}`,
      }
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
      
      // In a real app, you would replace the temp comment with the official one
      // For this mock, we just rely on the onAdd from the parent (which assumes the API works)
      if (!data.success) {
         // Rollback or show error if API fails
         console.error("Failed to post comment:", data.message);
      }
    } catch (err) {
      console.error("Network error while posting comment:", err);
    }
  };

  return (
    <div className="mt-6 border-t border-gray-200 pt-4">
      <button 
        onClick={() => setShow(!show)} 
        className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
      >
        <CommentIcon />
        {show ? "Hide Comments" : `View Comments (${comments.length})`}
      </button>

      {show && (
        <div className="mt-4 space-y-4 animate-fade-in">
          {comments.length > 0 ? (
            comments.map((c, i) => (
              <div key={c._id || i} className="flex items-start gap-3">
                <img
                  src={c.user?.profileImg || `https://i.pravatar.cc/40?u=${c.user?.username || 'anon' + i}`}
                  alt={c.user?.username || "Anonymous"}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  onError={(e) => e.target.src = `https://placehold.co/40x40/E5E7EB/4B5563?text=User`}
                />
                <div className="bg-gray-100 rounded-2xl px-4 py-2 shadow-sm max-w-[85%]">
                  <p className="font-semibold text-sm text-gray-800">{c.user?.username || "Anonymous"}</p>
                  <p className="text-gray-700 text-sm break-words">{c.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm italic py-2">No comments yet. Be the first to start a conversation!</p>
          )}

          {/* Comment Submission Form */}
          <form onSubmit={handleSubmit} className="flex items-center gap-3 py-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Join the discussion..."
              className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none shadow-inner transition"
              aria-label="Write a comment"
            />
            <button 
              type="submit" 
              disabled={!text.trim()}
              className="px-5 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition shadow-md disabled:bg-gray-400"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

/* ---------- SKELETON CARD ---------- */
const SkeletonCard = () => (
  <div className="w-full bg-white/50 backdrop-blur-md rounded-3xl p-8 animate-pulse shadow-lg">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-16 h-16 bg-gray-200 rounded-full" />
      <div className="flex-1 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
    <div className="h-4 bg-gray-200 rounded mb-2 w-full" />
    <div className="h-4 bg-gray-200 rounded mb-6 w-3/4" />
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 auto-rows-[12rem] mb-6">
        {[...Array(3)].map((_, i) => <div key={i} className="bg-gray-200 rounded-2xl"></div>)}
    </div>
    <div className="h-10 bg-gray-200 rounded-full w-24" />
  </div>
);


/* ---------- STUDENT DASHBOARD (MAIN COMPONENT) ---------- */
export default function StudentDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  // Mocking user ID retrieval from local storage, as per the original code
  const userId = localStorage.getItem("userId") || "mock-student-user-123";

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/feed`, {
        headers: { 
            Authorization: `Bearer ${localStorage.getItem("authToken")}` 
        },
      });
      const data = await res.json();
      
      if (data.success) {
        // Ensure all required fields are present with fallbacks
        setPosts(
          data.posts.map((p) => ({
            ...p,
            liked: p.likes?.includes(userId) || false,
            likes: p.likes || [],
            tags: p.tags || [],
            media: p.media || [],
            comments: p.comments || [], // Ensure comments array exists
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
    
    // Calculate new state optimistically
    const newLiked = !old.liked;
    const newLikes = newLiked ? [...old.likes, userId] : old.likes.filter((id) => id !== userId);
    
    // Apply optimistic update
    setPosts((prev) => prev.map((p) => (p._id === postId ? { ...p, liked: newLiked, likes: newLikes } : p)));

    try {
      // Send request to API
      await fetch(`${API_BASE_URL}/api/v1/posts/${postId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
    } catch (e) {
      console.error("Failed to update like status:", e);
      // Rollback on failure
      setPosts((prev) => prev.map((p) => (p._id === postId ? old : p)));
    }
  };

  // Function to handle adding a comment locally after API call (or optimistically)
  const handleAddComment = (postId, comment) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === postId ? { ...p, comments: [...p.comments, comment] } : p))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Hero */}
        <div className="text-center mb-14">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Student Community Pulse
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            View shared resources, connect, and learn from your peers and teachers.
          </p>
        </div>

        {/* Posts/Feed */}
        {loading ? (
          <div className="flex flex-col gap-8">{[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">🤷‍♂️</span>
            <p className="text-2xl text-gray-500">No posts yet. Keep an eye out for new announcements and resources!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {posts.map((post, idx) => {
              const author = post.author || {};
              return (
                <article
                  key={post._id}
                  className="w-full bg-white/70 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 animate-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  
                  {/* Author Header */}
                  <header className="flex items-center gap-5 mb-6">
                    <img
                      src={author.profileImg || `https://i.pravatar.cc/150?u=${author.username}`}
                      alt={author.username || "User"}
                      className="w-16 h-16 rounded-full object-cover border-4 border-white/60 shadow-lg"
                      onError={(e) => e.target.src = `https://placehold.co/64x64/E5E7EB/4B5563?text=User`}
                    />
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-800">{author.username || "Anonymous"}</h3>
                        {/* Display Teacher Badge if applicable */}
                        {author.role === "teacher" && (
                          <span className="px-3 py-1 text-xs uppercase tracking-wider bg-purple-600 text-white rounded-full font-bold">
                            Teacher
                          </span>
                        )}
                      </div>
                      <time className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</time>
                      <p className="text-sm text-gray-400">{post.type} • {post.audience}</p>
                    </div>
                  </header>

                  {/* Title & Content */}
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">{post.title}</h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6 whitespace-pre-wrap">{post.content}</p>

                  {/* Media */}
                  {post.media.length > 0 && <MediaStrip media={post.media} />}

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-6">
                      {post.tags.map((t) => (
                        <span key={t} className="px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions (Like Button) */}
                  <div className="flex items-center justify-start">
                    <button
                      onClick={() => handleLike(post._id)}
                      className={`flex items-center gap-3 py-3 px-6 rounded-full text-sm font-semibold transition-all shadow-md ${
                        post.liked ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl" : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                      }`}
                      aria-label={post.liked ? "Unlike post" : "Like post"}
                    >
                      <HeartIcon className={`w-6 h-6 transition-transform ${post.liked ? "scale-110" : "scale-100"}`} />
                      <span>{post.likes.length} Likes</span>
                    </button>
                  </div>
                  
                  {/* Comments Section */}
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
      </div>

      {/* Global CSS Animations */}
      <style>{`
        @keyframes fade-in { 
            from { opacity: 0; transform: translateY(20px); } 
            to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes slide-in-from-bottom-10 { 
            from { transform: translateY(2rem); } 
            to { transform: translateY(0); } 
        }
        .animate-fade-in { 
            animation: fade-in 0.6s ease-out forwards; 
        }
        .animate-in { 
            animation: fade-in 0.6s ease-out, slide-in-from-bottom-10 0.6s ease-out; 
            animation-fill-mode: both; 
        }
      `}</style>
    </div>
  );
}
