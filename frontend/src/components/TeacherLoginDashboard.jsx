import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, CheckCircle, Upload, Plus } from "lucide-react";

/* ---------- BLACK / NEON SUCCESS TOAST ---------- */
const SuccessNotification = ({ message, onClose }) => (
  <div
    onClick={onClose}
    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-lg flex items-start justify-center p-8 animate-fade-in"
  >
    <div className="mt-20 bg-neutral-900 border border-cyan-400 rounded-2xl p-6 shadow-cyan-400/30 shadow-2xl w-full max-w-md animate-slide-in-down">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle className="text-cyan-400 w-6 h-6" />
          <h3 className="text-xl font-bold text-white">Success!</h3>
        </div>
        <button className="text-neutral-400 hover:text-white transition">
          <X className="w-5 h-5" />
        </button>
      </div>
      <p className="mt-2 text-neutral-300">{message}</p>
    </div>
  </div>
);

/* ---------- MEDIA PREVIEW ---------- */
const MediaPreview = ({ media, onRemove }) => (
  <div className="mt-4 flex flex-wrap gap-3">
    {media.map((file, index) => (
      <div
        key={index}
        className="relative px-4 py-1 bg-cyan-400/10 text-cyan-300 text-sm rounded-full flex items-center gap-2 border border-cyan-400/30"
      >
        <span className="truncate max-w-xs">{file.name}</span>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="w-5 h-5 ml-1 bg-red-600 rounded-full text-xs font-bold flex items-center justify-center hover:bg-red-500 transition transform hover:scale-110"
          aria-label={`Remove ${file.name}`}
        >
          &times;
        </button>
      </div>
    ))}
  </div>
);

/* ---------- MAIN COMPONENT ---------- */
export default function TeacherPost() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "Announcement",
    audience: "All Students",
    tags: "",
  });
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  /* ---------- HANDLERS ---------- */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setMedia((prev) => [...prev, ...newFiles].slice(0, 5));
    e.target.value = null;
  };

  const handleRemoveMedia = (index) =>
    setMedia((prev) => prev.filter((_, i) => i !== index));

  const closeSuccess = () => {
    setIsSuccess(false);
    navigate("/teacher");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSuccess(false);
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("type", formData.type);
    data.append("audience", formData.audience);
    formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t)
      .forEach((tag) => data.append("tags", tag));
    media.forEach((file) => data.append("media", file));

    try {
      const res = await fetch("http://localhost:5001/api/v1/post", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: data,
      });
      const result = await res.json();
      if (!res.ok || !result.success)
        throw new Error(result.message || "Failed to create post.");
      setIsSuccess(true);
    } catch (err) {
      console.error("Post Creation Error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- RENDER ---------- */
  return (
    <>
      <style>{`
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        .animate-slide-in-down { animation: slide-in-down 0.5s ease-out forwards; }
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes slide-in-down { 0% { opacity: 0; transform: translateY(-50px); } 100% { opacity: 1; transform: translateY(0); } }
      `}</style>

      {isSuccess && (
        <SuccessNotification
          message="Your new post has been published successfully!"
          onClose={closeSuccess}
        />
      )}

      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-neutral-900 p-8 sm:p-12 rounded-3xl shadow-2xl border border-neutral-800 animate-slide-in-down">
          {/* Header */}
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
            New Post
          </h1>
          <p className="text-neutral-400 mb-10 text-lg">
            Share announcements, resources, or activities instantly.
          </p>

          {/* Error */}
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-xl mb-6">
              <strong>Error:</strong> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Weekly Homework Reminder"
                required
                className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:ring-2 focus:ring-cyan-400 outline-none transition"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your main message here..."
                rows="5"
                required
                className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:ring-2 focus:ring-cyan-400 outline-none transition resize-none"
              />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-neutral-300 mb-2">Post Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:ring-2 focus:ring-cyan-400 outline-none transition"
                >
                  <option>Announcement</option>
                  <option>Resource</option>
                  <option>Question</option>
                  <option>Activity</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-300 mb-2">Audience</label>
                <select
                  name="audience"
                  value={formData.audience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:ring-2 focus:ring-cyan-400 outline-none transition"
                >
                  <option>All Students</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-300 mb-2">Tags</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="math, homework, due-friday"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:ring-2 focus:ring-cyan-400 outline-none transition"
                />
              </div>
            </div>

            {/* Media Upload */}
            <div className="border-2 border-dashed border-neutral-700 p-8 rounded-2xl bg-neutral-800/50 hover:bg-neutral-800 transition duration-300 cursor-pointer group">
              <div className="flex items-center justify-center flex-col">
                <Upload className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition" />
                <label className="block text-base font-semibold text-neutral-300 mt-2 mb-1 cursor-pointer">
                  Click to attach files (Max 5)
                </label>
                <p className="text-sm text-neutral-500">Supports images, videos, and PDFs.</p>
              </div>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                disabled={media.length >= 5}
                className="hidden"
                accept="image/*,video/*,application/pdf"
              />
              <MediaPreview media={media} onRemove={handleRemoveMedia} />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !formData.title || !formData.content}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 
                         bg-gradient-to-r from-cyan-500 to-purple-500 text-black 
                         font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl 
                         hover:scale-[1.01] transition duration-300 
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Publish Post</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}