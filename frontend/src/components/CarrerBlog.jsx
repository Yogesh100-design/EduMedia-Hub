import React, { useEffect, useState } from "react";
import { MdBookmarkBorder, MdBookmark } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const MOCK_BLOGS = [
  {
    id: 1,
    title: "Understanding JavaScript Closures",
    markdown: "JavaScript closures allow functions to access variables...",
    cover: "https://picsum.photos/600/400?random=1",
    author: "Admin",
    readTime: 3,
    isBookmarked: false,
  },
  {
    id: 2,
    title: "Why Node.js is Great for Backend",
    markdown: "Node.js allows you to write backend using JavaScript...",
    cover: "https://picsum.photos/600/400?random=2",
    author: "Admin",
    readTime: 2,
    isBookmarked: false,
  },
];

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortingOption, setSortingOption] = useState("latest");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /** Fetch blogs **/
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);

      let fetchedData = MOCK_BLOGS;

      try {
        const token = localStorage.getItem("authToken") || "";

        const res = await fetch(
          "https://edumedia-hub-1-bgw0.onrender.com/api/v1/getallblog",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const apiData = await res.json();

        // FIXED: Backend returns { blogs: [] }
        if (res.ok && Array.isArray(apiData.blogs)) {
          fetchedData = apiData.blogs.map((blog) => ({
            ...blog,
            isBookmarked: false,
          }));
        } else {
          console.warn("Unexpected API response. Using mock data.");
        }
      } catch (e) {
        console.error("Error fetching blogs:", e);
        setError("Unable to fetch blogs right now.");
      }

      setBlogs(fetchedData);
      setIsLoading(false);
    };

    load();
  }, []);

  /** Search Filter **/
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /** Sorting **/
  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    if (sortingOption === "latest") {
      return new Date(b.date) - new Date(a.date);
    } else if (sortingOption === "oldest") {
      return new Date(a.date) - new Date(b.date);
    } else {
      return a.readTime - b.readTime;
    }
  });

  /** Toggle Bookmark **/
  const toggleBookmark = (id) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog._id === id
          ? { ...blog, isBookmarked: !blog.isBookmarked }
          : blog
      )
    );
  };

  /** Delete Blog (only mock delete for now) **/
  const handleDelete = (id) => {
    setBlogs((prev) => prev.filter((blog) => blog._id !== id));
  };

  /** Loading State **/
  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 md:px-8 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 mt-16">
        Explore Blogs
      </h1>

      {/* Search + Sorting */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-3">
        <input
          type="text"
          placeholder="Search blogs..."
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-auto"
          value={sortingOption}
          onChange={(e) => setSortingOption(e.target.value)}
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="readTime">Shortest Read Time</option>
        </select>
      </div>

      {/* Blog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedBlogs.length > 0 ? (
          sortedBlogs.map((blog) => (
            <div
              key={blog._id || blog.id}
              className="shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition bg-white"
            >
              {/* Cover Image */}
              {blog.cover && (
                <img
                  src={
                    blog.cover.startsWith("http")
                      ? blog.cover
                      : `https://edumedia-hub-1-bgw0.onrender.com${blog.cover}`
                  }
                  alt="Blog Cover"
                  className="h-56 w-full object-cover"
                />
              )}

              <div className="p-5">
                {/* Title */}
                <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>

                {/* Author + Read Time */}
                <p className="text-gray-500 text-sm mb-2">
                  ✍ {blog.author} • ⏱ {blog.readTime} min read
                </p>

                {/* Markdown Preview */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {blog.markdown}
                </p>

                {/* Buttons */}
                <div className="flex justify-between items-center">
                  <Link
                    to={`/blog/${blog._id}`}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Read More →
                  </Link>

                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleBookmark(blog._id)}>
                      {blog.isBookmarked ? (
                        <MdBookmark className="text-blue-600 text-2xl" />
                      ) : (
                        <MdBookmarkBorder className="text-gray-600 text-2xl" />
                      )}
                    </button>

                    <button onClick={() => handleDelete(blog._id)}>
                      <MdDelete className="text-red-500 text-2xl" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h2 className="text-center text-gray-600 col-span-3 text-xl">
            No blogs found.
          </h2>
        )}
      </div>
    </div>
  );
}
