import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, CheckCircle, Upload, Plus } from 'lucide-react'; // Using lucide-react for modern icons

// Custom Success Notification Component (Replacing alert())
const SuccessNotification = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-start justify-center p-8 z-50">
    <div className="bg-white p-6 rounded-2xl shadow-2xl border-l-4 border-green-500 w-full max-w-md transform transition-all duration-500 ease-out animate-slide-in-down">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <CheckCircle className="text-green-500 w-6 h-6 mr-3" />
          <h3 className="text-xl font-bold text-gray-800">Success!</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
          <X className="w-5 h-5" />
        </button>
      </div>
      <p className="mt-2 text-gray-600">{message}</p>
    </div>
  </div>
);

// Simple UI for displaying selected files
const MediaPreview = ({ media, onRemove }) => (
  <div className="mt-4 flex flex-wrap gap-3">
    {media.map((file, index) => (
      <div 
        key={index} 
        className="relative px-4 py-1 bg-indigo-500 text-white text-sm rounded-full flex items-center gap-2 shadow-lg transition-all duration-300 hover:shadow-xl"
      >
        <span className="truncate max-w-xs">{file.name}</span>
        <button 
          type="button" 
          onClick={() => onRemove(index)} 
          className="w-5 h-5 ml-1 bg-red-600 rounded-full text-xs font-bold flex items-center justify-center hover:bg-red-700 transition transform hover:scale-110"
          aria-label={`Remove ${file.name}`}
        >
          &times;
        </button>
      </div>
    ))}
  </div>
);


export default function TeacherPost() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "Announcement",
    audience: "All Students",
    tags: "", // Comma separated string for user input
  });
  const [media, setMedia] = useState([]); // Array to store File objects
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false); // New state for success notification

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setMedia((prev) => [...prev, ...newFiles].slice(0, 5)); 
    e.target.value = null; 
  };
  
  const handleRemoveMedia = (index) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const closeSuccess = () => {
    setIsSuccess(false);
    navigate("/teacher");
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSuccess(false);
    setLoading(true);

    const data = new FormData();
    
    // Append all text fields
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("type", formData.type);
    data.append("audience", formData.audience);
    
    // Process and append tags.
    formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        .forEach(tag => data.append("tags", tag));

    // Append media files using the key 'media'
    media.forEach((file) => {
      data.append("media", file); 
    });


    try {
      // NOTE: You must replace this with your actual environment URL
      const res = await fetch("http://localhost:5001/api/v1/post", { 
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: data,
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to create post.");
      }

      // Show custom success notification instead of alert
      setIsSuccess(true);

    } catch (err) {
      console.error("Post Creation Error:", err);
      setError(err.message || "An unexpected error occurred during posting.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      {/* Custom Styles for Animation */}
      <style>{`
        .animate-slide-in-down {
          animation: slide-in-down 0.5s ease-out forwards;
        }
        @keyframes slide-in-down {
          0% { opacity: 0; transform: translateY(-50px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      {isSuccess && <SuccessNotification message="Your new post has been published successfully!" onClose={closeSuccess} />}

      <div className="w-full max-w-3xl bg-white p-8 sm:p-12 rounded-3xl shadow-2xl border border-gray-100 transform transition-all duration-500 hover:shadow-3xl animate-slide-in-down">
        
        {/* Header */}
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-2 tracking-tight">
          New Post
        </h1>
        <p className="text-gray-500 mb-10 text-lg">Share announcements, resources, or activities instantly.</p>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-6 transition-opacity duration-300">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div className="transition duration-300 hover:shadow-md rounded-xl p-0.5">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Weekly Homework Reminder"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-300 focus:border-4"
            />
          </div>

          {/* Content */}
          <div className="transition duration-300 hover:shadow-md rounded-xl p-0.5">
            <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
            <textarea
              name="content"
              id="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your main message here..."
              rows="5"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-300 resize-none focus:border-4"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Post Type */}
            <div className="transition duration-300 hover:shadow-md rounded-xl p-0.5">
              <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">Post Type</label>
              <select
                name="type"
                id="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition bg-white appearance-none pr-8 cursor-pointer focus:border-4"
              >
                <option>Announcement</option>
                <option>Resource</option>
                <option>Question</option>
                <option>Activity</option>
              </select>
            </div>

            {/* Audience */}
            <div className="transition duration-300 hover:shadow-md rounded-xl p-0.5">
              <label htmlFor="audience" className="block text-sm font-semibold text-gray-700 mb-2">Audience</label>
              <select
                name="audience"
                id="audience"
                value={formData.audience}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition bg-white appearance-none pr-8 cursor-pointer focus:border-4"
              >
                <option>All Students</option>
              </select>
            </div>
            
            {/* Tags */}
            <div className="transition duration-300 hover:shadow-md rounded-xl p-0.5">
              <label htmlFor="tags" className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
              <input
                type="text"
                name="tags"
                id="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="math, homework, due-friday"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-300 focus:border-4"
              />
            </div>
          </div>
          

          {/* Media Upload Area */}
          <div className="border-4 border-dashed border-indigo-200 p-8 rounded-2xl bg-indigo-50/50 hover:bg-indigo-100/50 transition duration-500 transform hover:scale-[1.01] cursor-pointer group">
            <div className="flex items-center justify-center flex-col">
                <Upload className="w-8 h-8 text-indigo-500 group-hover:text-indigo-700 transition duration-300" />
                <label htmlFor="media-upload" className="block text-base font-semibold text-gray-700 mt-2 mb-1 cursor-pointer">
                    Click to attach files (Max 5)
                </label>
                <p className="text-sm text-gray-500">Supports images, videos, and PDFs.</p>
            </div>
            
            <input
              type="file"
              id="media-upload"
              multiple
              onChange={handleFileChange}
              disabled={media.length >= 5}
              className="hidden" // Hide default file input
              accept="image/*,video/*,application/pdf"
            />
            <MediaPreview media={media} onRemove={handleRemoveMedia} />
          </div>


          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formData.title || !formData.content}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 
                       bg-gradient-to-r from-purple-600 to-indigo-600 text-white 
                       font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl 
                       transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-[1.005] 
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
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
  );
}
