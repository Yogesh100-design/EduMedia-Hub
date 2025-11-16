import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  Search,
  Bookmark,
  Share2,
  AlertTriangle,
  CheckCircle,
  Info,
  Loader,
  ChevronUp,
  ChevronDown,
  Eye
} from "lucide-react";

// Mock Data for local testing since the backend is external
const MOCK_BLOGS = [
  {
    _id: "1",
    title: "The Rise of AI in Creative Fields",
    author: "Dr. Evelyn Reed",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    readTime: 8,
    cover: "https://placehold.co/600x400/1e293b/a5f3fc?text=AI+Creativity",
    markdown:
      "Artificial intelligence is rapidly moving from purely analytical roles into creative domains like design, music composition, and digital art. This shift raises profound questions about originality, intellectual property, and the future role of human artists. Rather than replacement, we are seeing a trend towards augmentation, where AI tools handle the iterative work, allowing human creators to focus on conceptualization and emotional depth. Understanding these tools is paramount for any modern professional. This is a very long text added here to demonstrate the effective expansion and smooth transition of the card content when the \"Read More\" button is clicked. It should wrap nicely and show all the data when expanded.",
  },
  {
    _id: "2",
    title: "Navigating the New Job Market Landscape",
    author: "Markus Chen",
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    readTime: 5,
    cover: "https://placehold.co/600x400/1e293b/38bdf8?text=Job+Market",
    markdown:
      "The post-pandemic job market favors specialized skills and adaptability over general experience. Continuous learning, networking, and demonstrating emotional intelligence (EQ) are now crucial factors for career success. Focus on portfolio building and projects that showcase real-world problem-solving abilities.",
  },
  {
    _id: "3",
    title: "Mastering Asynchronous Communication",
    author: "Sophia Lee",
    date: new Date(Date.now() - 86400000 * 10).toISOString(),
    readTime: 4,
    cover: "https://placehold.co/600x400/1e293b/06b6d4?text=Communication",
    markdown:
      "In global remote teams, clear, concise, and timely asynchronous communication is a superpower. Avoid unnecessary meetings by prioritizing well-documented decisions and summarizing key outcomes in writing. Good asynchronous practice fosters inclusion and respects different time zones, leading to a more focused and productive work environment.",
  },
];

/* ---------- Toast Component (Kept Simple and Effective) ---------- */
const MessageToast = ({ message, type }) => {
  if (!message) return null;
  const base =
    "fixed bottom-5 right-5 p-4 rounded-xl shadow-2xl z-50 flex items-center gap-2 transition-opacity duration-300";
  const map = {
    success: { cls: "bg-green-600 text-white", Icon: CheckCircle },
    error: { cls: "bg-red-600 text-white", Icon: AlertTriangle },
    info: { cls: "bg-blue-600 text-white", Icon: Info },
  };
  const { cls, Icon } = map[type] || map.info;
  return (
    <div className={`${base} ${cls}`}>
      <Icon className="w-5 h-5" />
      <span className="font-medium">{message}</span>
    </div>
  );
};

/* ---------- Main Component ---------- */
const CareerBlogs = () => {
  /* ---- state ---- */
  const [blogs, setBlogs] = useState([]);
  const [displayBlogs, setDisplayBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  /* ---- expanded cards (using a Set for multi-expansion support) ---- */
  const [expanded, setExpanded] = useState(new Set());
  const toggleExpand = (_id) => {
    const n = new Set(expanded);
    n.has(_id) ? n.delete(_id) : n.add(_id);
    setExpanded(n);
  };

  /* ---- fetch (CORRECTED to read apiData.blogs) ---- */
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      let fetchedData = MOCK_BLOGS; // Start with mock data as fallback

      try {
        const token =
          typeof localStorage !== "undefined"
            ? localStorage.getItem("authToken")
            : "";
        const res = await fetch(
          "https://edumedia-hub-1-bgw0.onrender.com/api/v1/getallblog",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const apiData = await res.json();

        if (res.ok && Array.isArray(apiData.blogs)) {
          fetchedData = apiData.blogs;
        } else {
          console.warn("API returned unexpected format or failed; using mock data.");
        }
      } catch (e) {
        console.error("Fetch error, using mock data:", e);
        // keep using mock data
      } finally {
        // Initialize blogs with bookmarked state
        setBlogs(fetchedData.map((b) => ({ ...b, isBookmarked: false })));
        setIsLoading(false);
      }
    };
    load();
  }, []);

  /* ---- search ---- */
  useEffect(() => {
    let f = blogs;
    if (search.trim()) {
      const q = search.toLowerCase();
      f = f.filter((b) =>
        `${b.title} ${b.author} ${b.markdown}`.toLowerCase().includes(q)
      );
    }
    setDisplayBlogs(f);
  }, [search, blogs]);

  /* ---- actions ---- */
  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  const bookmark = (_id) => {
    setBlogs((prev) => {
      const blog = prev.find((b) => b._id === _id);
      const isNow = !blog?.isBookmarked;

      showToast("success", isNow ? "Saved to Bookmarks!" : "Bookmark removed.");

      return prev.map((b) => (b._id === _id ? { ...b, isBookmarked: isNow } : b));
    });
  };

  const share = (_id) => {
    const url = `${window.location.origin}/blog/${_id}`;

    // Fallback for clipboard API using execCommand (necessary in some iframes)
    const tempInput = document.createElement("textarea");
    tempInput.value = url;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);

    showToast("info", "Link copied to clipboard!");
  };

  /* ---- render ---- */
  const renderContent = () => {
    if (isLoading)
      return (
        <div className="text-center py-20">
          <Loader className="mx-auto w-12 h-12 text-cyan-400 animate-spin mb-4" />
          <p className="text-slate-300">Fetching latest insights...</p>
        </div>
      );
    if (error)
      return (
        <div className="text-center py-20 text-red-400">
          <AlertTriangle className="mx-auto w-12 h-12 mb-4" />
          <p className="font-semibold">{error}</p>
        </div>
      );
    if (displayBlogs.length === 0)
      return (
        <div className="text-center py-20 text-slate-400">
          <AlertTriangle className="mx-auto w-12 h-12 mb-4" />
          <p>No results found matching your search criteria.</p>
        </div>
      );

    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {displayBlogs.map((blog) => {
          const open = expanded.has(blog._id);
          const formattedDate = new Date(blog.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          const coverUrl = blog.cover?.startsWith("http")
            ? blog.cover
            : `http://localhost:5001${blog.cover}`;

          return (
            <article
              key={blog._id}
              className={`rounded-3xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 overflow-hidden shadow-xl transition-all duration-500 hover:shadow-cyan-500/20 ${
                open ? "shadow-2xl border-cyan-500/70" : ""
              }`}
            >
              {/* Cover Image */}
              <div className="h-48 overflow-hidden relative">
                <img
                  src={coverUrl}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/600x400/1e293b/38bdf8?text=Career+Insight`;
                  }}
                />
              </div>

              <div className="p-6 flex flex-col justify-between">
                <div>
                  {/* Title */}
                  <h3 className="text-2xl font-extrabold text-cyan-200 mb-3 leading-snug">
                    {blog.title}
                  </h3>

                  {/* Metadata (Author, Date, Time) - Clean & Subtle */}
                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-4 pb-4 border-b border-slate-700/50">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-blue-400" /> {blog.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" /> {formattedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" /> {blog.readTime} min read
                    </span>
                  </div>

                  {/* Collapsible Body/Content */}
                  <div
                    className={`text-base text-slate-300 overflow-hidden transition-all duration-500 ease-in-out ${
                      open ? "max-h-[1000px] opacity-100" : "max-h-20 opacity-90"
                    }`}
                  >
                    {/* Preserve line breaks for markdown */}
                    <p className="whitespace-pre-wrap">{blog.markdown}</p>
                  </div>
                </div>

                {/* --- Footer & Actions --- */}
                <div className="mt-5 pt-4 border-t border-slate-700/50 flex items-center justify-between">
                  {/* Bookmark & Share Buttons */}
                  <div className="flex items-center gap-3">
                    {/* Bookmark */}
                    <button
                      onClick={() => bookmark(blog._id)}
                      title={blog.isBookmarked ? "Remove bookmark" : "Bookmark this article"}
                      className={`p-2 rounded-full transition-colors duration-200 shadow-inner ${
                        blog.isBookmarked
                          ? "bg-cyan-600 text-white shadow-cyan-900"
                          : "bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-cyan-400"
                      }`}
                    >
                      <Bookmark className="w-4 h-4" fill={blog.isBookmarked ? "currentColor" : "none"} />
                    </button>
                    {/* Share */}
                    <button
                      onClick={() => share(blog._id)}
                      title="Share link"
                      className="p-2 rounded-full bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-cyan-400 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Expand / Collapse Button */}
                  <button
                    onClick={() => toggleExpand(blog._id)}
                    className="flex items-center gap-1 px-4 py-2 rounded-full bg-cyan-600 text-white font-semibold text-sm hover:bg-cyan-500 transition-all duration-300 shadow-md shadow-cyan-500/40"
                  >
                    {open ? (
                      <>
                        Show Less <ChevronUp className="w-4 h-4 ml-1" />
                      </>
                    ) : (
                      <>
                        Read More <ChevronDown className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-16 px-4 sm:px-6 font-[Inter]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 border-b border-slate-800 pb-8">
          <div className="text-center md:text-left md:flex-1 mb-6 md:mb-0">
            <h2 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
              Career Insights Library
            </h2>
            <p className="text-lg text-slate-300 mt-2">
              Curated stories, advice, and trends from industry professionals.
            </p>
          </div>

          {/* Submit Story Button */}
          <a
            href="/career-blogs-write"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-bold hover:scale-[1.02] transition-transform shadow-xl shadow-cyan-600/30"
          >
            Submit Your Story
          </a>
        </div>

        {/* Search */}
        <div className="relative mb-16 max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 w-5 h-5" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, or keyword..."
            className="w-full pl-12 pr-6 py-4 rounded-full bg-slate-800 border border-slate-700 text-white placeholder-slate-400 font-medium focus:outline-none focus:ring-4 focus:ring-cyan-500/50 transition-all"
          />
        </div>

        {/* Blogs Grid */}
        {renderContent()}
      </div>

      {/* Toast */}
      {toast && <MessageToast message={toast.text} type={toast.type} />}
    </div>
  );
};

export default CareerBlogs;
