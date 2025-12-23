import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SideBar from "../Sidebar"; 

const API_BASE_URL = "https://edumedia-hub-1-bgw0.onrender.com";

/* ---------- ICONS ---------- */
const HeartIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const CommentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

/* ---------- LIGHTBOX ---------- */
const LightBox = ({ src, type, onClose }) => {
  if (!src) return null;
  return (
    <div onClick={onClose} className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in">
      <div className="relative max-w-6xl w-full flex justify-center">
        {type === "image" && <img src={src} alt="Preview" className="max-h-[90vh] rounded-2xl object-contain shadow-2xl" />}
        {type === "video" && <video src={src} controls autoPlay className="max-h-[90vh] rounded-2xl shadow-2xl" />}
        {type === "pdf" && <iframe src={src} className="w-full h-[90vh] rounded-2xl bg-white" title="PDF" />}
      </div>
    </div>
  );
};

/* ---------- MEDIA STRIP (This was causing your error) ---------- */
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
              onClick={() => setLightBox({ url, type })}
              className="relative group cursor-pointer overflow-hidden rounded-2xl bg-neutral-800 border border-neutral-700 hover:border-purple-500 transition-all duration-300"
            >
              {type === "image" && <img src={url} alt="Post media" className="w-full h-full object-cover" />}
              {type === "video" && <video src={url} muted loop autoPlay className="w-full h-full object-cover" />}
              {type === "pdf" && (
                <div className="flex flex-col items-center justify-center h-full bg-red-900/20 text-red-500">
                  <span className="text-4xl mb-2">📄</span>
                  <span className="text-xs font-bold uppercase">View PDF</span>
                </div>
              )}
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
      user: { username: "You", profileImg: `https://i.pravatar.cc/40?u=me` }
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
    } catch (err) { console.error(err); }
  };

  return (
    <div className="mt-6 border-t border-neutral-800 pt-4">
      <button onClick={() => setShow(!show)} className="flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition">
        <CommentIcon /> {show ? "Hide Comments" : `Comments (${comments.length})`}
      </button>
      {show && (
        <div className="mt-4 space-y-4">
          {comments.map((c, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-700 flex-shrink-0" />
              <div className="bg-neutral-800/50 rounded-2xl px-4 py-2 border border-neutral-700">
                <p className="font-bold text-xs text-neutral-300">{c.user?.username || "Anonymous"}</p>
                <p className="text-sm text-neutral-400">{c.text}</p>
              </div>
            </div>
          ))}
          <form onSubmit={handleSubmit} className="flex gap-2 pt-2">
            <input 
              type="text" value={text} onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-full px-4 py-2 text-sm outline-none focus:border-purple-500"
            />
            <button className="bg-purple-600 px-4 py-2 rounded-full text-sm font-bold">Post</button>
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
    <div className="h-40 bg-neutral-800 rounded-2xl w-full" />
  </div>
);

/* ---------- MAIN DASHBOARD ---------- */
export default function TeacherDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId") || "mock-id";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/feed`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        const data = await res.json();
        if (data.success) {
          setPosts(data.posts.map(p => ({
            ...p,
            liked: p.likes?.includes(userId),
            likes: p.likes || [],
            media: p.media || [],
            comments: p.comments || []
          })));
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchPosts();
  }, [userId]);

  const handleLike = async (postId) => {
    setPosts(prev => prev.map(p => {
      if (p._id === postId) {
        const liked = !p.liked;
        return { ...p, liked, likes: liked ? [...p.likes, userId] : p.likes.filter(id => id !== userId) };
      }
      return p;
    }));
    // Logic for API call would go here
  };

  const handleAddComment = (postId, comment) => {
    setPosts(prev => prev.map(p => p._id === postId ? { ...p, comments: [...p.comments, comment] } : p));
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <SideBar />
      
      <main className="flex-1 sm:ml-72 transition-all duration-300">
        <div className="max-w-5xl mx-auto px-6 py-12">
          
          <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Teacher Command Center
              </h1>
              <p className="text-neutral-500 mt-2">Manage your classroom announcements and resources.</p>
            </div>
            <Link to="/teacher-post" className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 rounded-2xl font-bold hover:scale-105 transition shadow-lg shadow-purple-500/20">
              + Create Post
            </Link>
          </header>

          {loading ? (
            <div className="space-y-8">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <div className="space-y-10">
              {posts.map((post) => (
                <article key={post._id} className="bg-neutral-900 border border-neutral-800 rounded-[2rem] p-8 hover:border-purple-500/50 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5">
                       <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold">
                         {post.author?.username?.charAt(0) || "U"}
                       </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-200">{post.author?.username || "Anonymous"}</h3>
                      <p className="text-xs text-neutral-500 uppercase tracking-widest">{post.type}</p>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold mb-3">{post.title}</h2>
                  <p className="text-neutral-400 mb-6 leading-relaxed">{post.content}</p>

                  {post.media.length > 0 && <MediaStrip media={post.media} />}

                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleLike(post._id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${post.liked ? 'bg-pink-500/10 text-pink-500' : 'bg-neutral-800 text-neutral-400'}`}
                    >
                      <HeartIcon className="w-5 h-5" /> {post.likes.length}
                    </button>
                  </div>

                  <CommentSection 
                    postId={post._id} 
                    comments={post.comments} 
                    onAdd={(c) => handleAddComment(post._id, c)} 
                  />
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}