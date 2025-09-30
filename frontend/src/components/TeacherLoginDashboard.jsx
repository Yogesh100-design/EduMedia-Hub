import React, { useState, useRef } from "react";

export default function TeacherPostCreator() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("announcement");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [audience, setAudience] = useState("all");
  const fileInputRef = useRef(null);

  const postTypes = [
    { id: "announcement", label: "📢 Announcement" },
    { id: "question", label: "❓ Question" },
    { id: "resource", label: "📚 Resource" },
    { id: "discussion", label: "💭 Discussion" }
  ];

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      type: file.type.startsWith('image/') ? 'image' :
            file.type.startsWith('video/') ? 'video' :
            file.type.startsWith('application/pdf') ? 'pdf' : 'file',
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
    }));
    setAttachments([...attachments, ...newAttachments]);
  };

  const removeAttachment = (id) => {
    setAttachments(attachments.filter(att => att.id !== id));
  };

  const handlePublish = async () => {
    if (!content.trim() || !title.trim()) {
      alert("Please add both title and content");
      return;
    }

    setIsPublishing(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("type", type);
      formData.append("audience", audience);

      // append tags
      tags.forEach(tag => formData.append("tags[]", tag));

      // append files
      attachments.forEach(att => formData.append("content", att.file));

      const res = await fetch("http://localhost:5001/api/v1/post", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
          // Don't set Content-Type; browser sets it automatically for FormData
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to publish post");

      // Reset form
      setContent("");
      setTitle("");
      setTags([]);
      setAttachments([]);

      alert("✅ Post published successfully!");

    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Create New Post</h1>

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Post Title"
        className="w-full p-3 border rounded mb-3"
      />

      {/* Content */}
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Write your post..."
        className="w-full p-3 border rounded mb-3"
        rows={6}
      />

      {/* Tags */}
      <div className="flex gap-2 flex-wrap mb-3">
        {tags.map(tag => (
          <span key={tag} className="px-3 py-1 bg-gray-200 rounded-full">
            #{tag} <button onClick={() => handleRemoveTag(tag)}>x</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={tagInput}
          onChange={e => setTagInput(e.target.value)}
          placeholder="Add a tag"
          className="flex-1 p-2 border rounded"
          onKeyPress={e => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
        />
        <button onClick={handleAddTag} className="px-3 py-2 bg-blue-600 text-white rounded">Add Tag</button>
      </div>

      {/* File Upload */}
      <div className="mb-3">
        <input
          type="file"
          multiple
          name="files"  // ✅ Multer expects this field name
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />
        <button onClick={() => fileInputRef.current.click()} className="px-3 py-2 bg-gray-200 rounded">
          Upload Files
        </button>
      </div>

      {/* Attachment Preview */}
      <div className="flex flex-wrap gap-2 mb-3">
        {attachments.map(att => (
          <div key={att.id} className="p-2 border rounded">
            {att.name} ({att.size}) <button onClick={() => removeAttachment(att.id)}>x</button>
          </div>
        ))}
      </div>

      {/* Post Type */}
      <div className="mb-3">
        <select value={type} onChange={e => setType(e.target.value)} className="p-2 border rounded">
          {postTypes.map(pt => <option key={pt.id} value={pt.id}>{pt.label}</option>)}
        </select>
      </div>

      {/* Audience */}
      <div className="mb-3">
        <select value={audience} onChange={e => setAudience(e.target.value)} className="p-2 border rounded">
          <option value="all">All Students</option>
          <option value="specific-course">Specific Course</option>
          <option value="group">Study Group</option>
        </select>
      </div>

      <button
        onClick={handlePublish}
        disabled={isPublishing}
        className="px-4 py-2 bg-indigo-600 text-white rounded"
      >
        {isPublishing ? "Publishing..." : "Publish Post"}
      </button>
    </div>
  );
}
