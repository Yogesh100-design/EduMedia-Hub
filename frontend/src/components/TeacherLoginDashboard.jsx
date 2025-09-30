import React, { useState, useRef } from "react";
import { Send, Tag, FilePlus, X, Hash, Image, Video, FileText, Loader2, Users } from "lucide-react";

const AttachmentIcon = ({ type }) => {
  switch (type) {
    case "image": return <Image className="w-4 h-4 text-green-500" />;
    case "video": return <Video className="w-4 h-4 text-red-500" />;
    case "pdf": return <FileText className="w-4 h-4 text-blue-500" />;
    default: return <FileText className="w-4 h-4 text-gray-500" />;
  }
};

export default function TeacherPostCreator() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("announcement");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [audience, setAudience] = useState("all");
  const [isPublishing, setIsPublishing] = useState(false);
  const fileInputRef = useRef(null);

  const postTypes = [
    { id: "announcement", label: "Announcement", icon: "📢" },
    { id: "question", label: "Question", icon: "❓" },
    { id: "resource", label: "Resource", icon: "📚" },
    { id: "discussion", label: "Discussion", icon: "💭" },
  ];

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag) => setTags(tags.filter(t => t !== tag));

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      type: file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
        ? "video"
        : file.type.startsWith("application/pdf")
        ? "pdf"
        : "file",
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
    }));
    setAttachments([...attachments, ...newAttachments]);
    e.target.value = null; // reset input
  };

  const removeAttachment = (id) => setAttachments(attachments.filter(att => att.id !== id));

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) return alert("Add both title and content");

    setIsPublishing(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("type", type);
      formData.append("audience", audience);
      tags.forEach(tag => formData.append("tags[]", tag));
      attachments.forEach(att => formData.append("files", att.file));

      const res = await fetch("http://localhost:5001/api/v1/post", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Publish failed");

      // Reset form
      setTitle(""); setContent(""); setType("announcement"); setTags([]); setAttachments([]); setAudience("all");
      alert("✅ Post published successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Error: " + err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-6 md:p-10 border border-indigo-100/50 transition-all duration-500">
        
        {/* Header */}
        <header className="flex items-center gap-4 mb-8 border-b pb-4">
          <Send className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Create a New Class Post
          </h1>
        </header>

        {/* Post Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <Hash className="w-4 h-4 text-indigo-500" /> Post Type
            </label>
            <div className="flex flex-wrap gap-2">
              {postTypes.map(pt => (
                <button
                  key={pt.id}
                  onClick={() => setType(pt.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition shadow-sm
                    ${type === pt.id ? "bg-indigo-600 text-white ring-2 ring-indigo-400 scale-105" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  {pt.icon} {pt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Audience */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" /> Audience
            </label>
            <select 
              value={audience} 
              onChange={e => setAudience(e.target.value)} 
              className="p-3 border border-gray-300 rounded-lg shadow-inner focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200 bg-white"
            >
              <option value="all">All Students (Default)</option>
              <option value="specific-course">Specific Course/Class</option>
              <option value="group">Study Group/Private</option>
            </select>
          </div>
        </div>

        {/* Title & Content */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-4 text-xl font-semibold border-b-2 border-gray-200 rounded-t-lg focus:border-indigo-500 outline-none mb-3"
          />
          <textarea
            rows={6}
            placeholder={`Write the full details of your ${type} here...`}
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 resize-y"
          />
        </div>

        {/* Tags */}
        <div className="mb-6 border p-4 rounded-xl">
          <div className="flex gap-2 flex-wrap mb-3">
            {tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                #{tag} 
                <button onClick={() => handleRemoveTag(tag)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              placeholder="Add tag"
              onKeyPress={e => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-indigo-500 outline-none"
            />
            <button onClick={handleAddTag} className="px-4 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 flex items-center gap-1">
              <Tag className="w-4 h-4" /> Add
            </button>
          </div>
        </div>

        {/* Attachments */}
        <div className="mb-6 border p-4 rounded-xl">
          <input type="file" multiple ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          <button onClick={() => fileInputRef.current.click()} className="px-4 py-2 mb-3 bg-white text-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-50 flex items-center gap-2">
            <FilePlus className="w-5 h-5" /> Upload Files
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            {attachments.map(att => (
              <div key={att.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3 truncate">
                  <AttachmentIcon type={att.type} />
                  <span className="truncate">{att.name}</span>
                  <span className="text-xs text-gray-500">({att.size})</span>
                </div>
                <button onClick={() => removeAttachment(att.id)} className="text-red-500 hover:text-red-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Publish Button */}
        <button
          onClick={handlePublish}
          disabled={isPublishing}
          className={`w-full py-4 text-lg font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center gap-3 ${isPublishing ? "cursor-not-allowed bg-indigo-400" : ""}`}
        >
          {isPublishing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />} 
          {isPublishing ? "Publishing..." : "Publish Post"}
        </button>
      </div>
    </div>
  );
}
