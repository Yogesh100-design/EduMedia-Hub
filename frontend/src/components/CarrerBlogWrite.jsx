import React, { useState, useEffect } from "react";
import { Upload, Eye, EyeOff, Save, Loader, User, CheckCircle, AlertTriangle, Info } from "lucide-react";

// --- Message Toast ---
const MessageToast = ({ message, type }) => {
  if (!message) return null;

  const baseClasses = "fixed bottom-5 right-5 p-4 rounded-xl shadow-2xl z-50 flex items-center gap-2 transition-transform duration-300 transform";
  let styleClasses = "";
  let Icon = Info;

  switch (type) {
    case 'success':
      styleClasses = "bg-green-600 text-white";
      Icon = CheckCircle;
      break;
    case 'error':
      styleClasses = "bg-red-600 text-white";
      Icon = AlertTriangle;
      break;
    case 'info':
    default:
      styleClasses = "bg-cyan-600 text-white";
      Icon = Info;
      break;
  }

  return (
    <div className={`${baseClasses} ${styleClasses}`}>
      <Icon className="text-xl w-5 h-5" />
      <span className="font-medium">{message}</span>
    </div>
  );
};

// --- Markdown Helpers ---
const mdBold = (sel) => `**${sel}**`;
const mdItalic = (sel) => `*${sel}*`;
const mdLink = (text, url) => `[${text}](${url})`;
const mdImage = (alt, url) => `![${alt}](${url})`;
const mdBullet = () => `- `;
const mdNumber = () => `1. `;
const mdCode = (sel) => `\`${sel}\``;
const mdCodeBlock = (lang, code) => `\`\`\`${lang}\n${code}\n\`\`\``;

export default function BlogWriter() {
  // --- States ---
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [tags, setTags] = useState("");
  const [cover, setCover] = useState("");
  const [preview, setPreview] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [localUserId] = useState(localStorage.getItem('localUserId') || crypto.randomUUID());

  // --- Local User ID Setup ---
  useEffect(() => {
    if (!localStorage.getItem('localUserId')) localStorage.setItem('localUserId', localUserId);
  }, [localUserId]);

  // --- Load Draft ---
  useEffect(() => {
    const raw = localStorage.getItem(`blog-draft-${localUserId}`);
    if (raw) {
      try {
        const d = JSON.parse(raw);
        setTitle(d.title || "");
        setMarkdown(d.markdown || "");
        setTags(d.tags || "");
        setCover(d.cover || "");
        setMessage({ type: 'info', text: 'Draft loaded from local storage.' });
      } catch (e) {
        console.error(e);
        setMessage({ type: 'error', text: 'Error loading draft.' });
      }
    } else {
      setMessage({ type: 'info', text: 'Starting a new draft.' });
    }
    setTimeout(() => setMessage(null), 3000);
  }, [localUserId]);

  // --- Auto-save Draft ---
  useEffect(() => {
    if (!title.trim() && !markdown.trim()) return;

    const t = setInterval(() => {
      const payload = { title, markdown, tags, cover, last_saved: new Date().toISOString() };
      try {
        localStorage.setItem(`blog-draft-${localUserId}`, JSON.stringify(payload));
        setSaved(true);
      } catch (e) {
        console.error(e);
        setMessage({ type: 'error', text: 'Auto-save failed.' });
      } finally {
        setIsSaving(false);
        setTimeout(() => setSaved(false), 1500);
      }
    }, 5000);

    return () => clearInterval(t);
  }, [title, markdown, tags, cover, localUserId]);

  // --- Upload Cover ---
  const uploadCover = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCover(ev.target.result);
    reader.readAsDataURL(file);
  };

  // --- Insert Markdown ---
  const insert = (fn, ...args) => {
    const el = document.getElementById("md-editor");
    const [start, end] = [el.selectionStart, el.selectionEnd];
    const selected = markdown.substring(start, end);
    const text = fn(selected, ...args);
    setMarkdown(markdown.slice(0, start) + text + markdown.slice(end));
    setTimeout(() => el.setSelectionRange(start + text.length, start + text.length), 0);
  };

  // --- Render Markdown ---
  const renderMD = (md) =>
    md
      .replace(/^### (.*$)/gim, "<h3 class='text-xl font-semibold mt-4 mb-2'>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2 class='text-2xl font-bold mt-4 mb-2'>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1 class='text-3xl font-extrabold mb-4'>$1</h1>")
      .replace(/\*\*(.+)\*\*/g, "<strong class='font-bold'>$1</strong>")
      .replace(/\*(.+)\*/g, "<em class='italic'>$1</em>")
      .replace(/!\[([^\]]+)\]\(([^)]+)\)/g, "<img alt='$1' src='$2' class='rounded-xl my-4 max-w-full' onerror='this.onerror=null;this.src=\"https://placehold.co/600x400/1e293b/94a3b8?text=Image+Error\"' />")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href='$2' target='_blank' class='text-cyan-400 underline'>$1</a>")
      .replace(/\`(.+)\`/g, "<code class='bg-slate-800 px-1 rounded'>$1</code>")
      .replace(/```(\w+)?\n([\s\S]+?)\n```/g, "<pre class='bg-slate-800 p-3 rounded-xl overflow-auto my-4'><code class='language-$1'>$2</code></pre>")
      .replace(/^- (.+)$/gim, "<li class='ml-4 list-disc text-slate-300'>$1</li>")
      .replace(/^\d+\. (.+)$/gim, "<li class='ml-4 list-decimal text-slate-300'>$1</li>")
      .replace(/\n/g, "<br />");

  // --- Publish Blog ---
  const publish = async () => {
    if (!title.trim() || !markdown.trim()) {
      setMessage({ type: 'error', text: "Title & markdown required." });
      return setTimeout(() => setMessage(null), 3000);
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("markdown", markdown);
    formData.append("author", `LocalUser-${localUserId.substring(0, 8)}`);

    if (cover && cover.startsWith("data:")) {
      const res = await fetch(cover);
      const blob = await res.blob();
      formData.append("cover", blob, "cover.jpg");
    }

    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("https://edumedia-hub.onrender.com/api/v1/createblog", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to publish blog");

      setMessage({ type: 'success', text: "Blog published successfully!" });
      setTitle(""); setMarkdown(""); setTags(""); setCover("");
      localStorage.removeItem(`blog-draft-${localUserId}`);
    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: e.message || "Publish failed." });
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-10 px-6 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left - Editor */}
        <div className="flex flex-col gap-4 max-h-[90vh] overflow-y-auto pr-2">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            Write Career Blog
          </h2>

          <div className="bg-white/10 border border-white/20 rounded-xl p-4 space-y-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Blog Title (Required)"
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <label className="flex items-center gap-2 cursor-pointer bg-slate-800 p-2 rounded-lg border border-slate-700 hover:bg-slate-700 transition">
              <Upload className="w-5 h-5" />
              <span>{cover ? "Change cover image" : "Upload cover image"}</span>
              <input type="file" accept="image/*" onChange={uploadCover} className="hidden" />
            </label>
            {cover && <img src={cover} alt="cover" className="w-full h-40 object-cover rounded-lg border border-slate-700" />}
          </div>

          <textarea
            id="md-editor"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Write in Markdown..."
            rows={18}
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm"
          />

          <div className="flex items-center gap-3 py-2">
            <button
              onClick={() => setPreview((p) => !p)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
            >
              {preview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />} {preview ? "Hide Preview" : "Show Preview"}
            </button>
            <button
              onClick={publish}
              className="ml-auto px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:scale-105 transition"
            >
              Publish
            </button>
            <span className={`text-xs flex items-center gap-1 ${saved ? 'text-green-400' : 'text-slate-500'}`}>
              {isSaving ? <Loader className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
              {isSaving ? "Saving..." : (saved ? "Saved" : "Draft")}
            </span>
          </div>
          <div className="text-xs text-slate-500 text-center mt-2 flex items-center justify-center gap-1">
            <User className="w-3 h-3"/> Draft saved locally (ID: {localUserId.substring(0, 8)})
          </div>
        </div>

        {/* Right - Preview */}
        <div className="sticky top-10 max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-800 border border-white/20 p-6 shadow-2xl">
          {preview ? (
            <>
              {cover && <img src={cover} alt="cover" className="w-full h-48 object-cover rounded-xl mb-4 border border-slate-700" />}
              <h1 className="text-3xl font-extrabold mb-2 text-cyan-300">{title || "Untitled Blog"}</h1>
              <p className="text-sm text-slate-500 mb-4">
                Preview for: LocalUser-{localUserId.substring(0, 8)} | Tags: {tags || 'None'}
              </p>
              <div className="prose prose-invert max-w-none text-slate-300 [&>p]:leading-relaxed [&>p]:my-4"
                   dangerouslySetInnerHTML={{ __html: renderMD(markdown) }} />
            </>
          ) : (
            <div className="text-slate-400 grid place-items-center h-full">
              <div className="text-center">
                <Eye className="mx-auto text-4xl mb-2" />
                <p>Toggle the "Show Preview" button to see live formatting.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {message && <MessageToast message={message.text} type={message.type} />}
    </div>
  );
}
