import React from "react";
import { Link } from "react-router-dom";

const topBar = () => {
  const routes = [
    { label: "Interview Questions", path: "/interview-questions" },
    { label: "Placement Guidance", path: "/placement-guidance" },
    { label: "Resources", path: "/resources" },
    { label: "Resume Builder", path: "/resume-builder" },
    { label: "Mock Tests", path: "/mock-tests" },
    { label: "Career Blogs", path: "/career-blogs" },
    { label: "Company Reviews", path: "/company-reviews" },
    { label: "Salary Insights", path: "/salary-insights" },
    { label: "EduQ&A", path: "/EduQ&A" },
  ];

  return (
    // The <style> tag is removed as we don't need scrollbar-hide anymore.
    <div className="sticky top-0 z-50 w-full h-auto bg-black border-b border-neutral-800 flex flex-col items-center justify-center shadow-2xl">
      {/* NAV CONTAINER */}
      <nav 
        // Removed: overflow-x-auto, whitespace-nowrap, py-2, scrollbar-hide
        // Added: flex-wrap, gap-3 (for vertical/horizontal spacing)
        className="flex flex-wrap max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 gap-x-4 gap-y-3"
      >
        {routes.map((route, idx) => (
          <Link
            key={idx}
            to={route.path}
            // flex-shrink-0 is still useful to ensure the links don't try to shrink their text
            className="flex-shrink-0 px-4 py-2 text-neutral-200 bg-neutral-900 rounded-full text-sm font-medium shadow-md transition-all duration-300 transform 
                        hover:scale-[1.03] hover:shadow-cyan-400/30 hover:text-cyan-300 active:scale-95 
                        border border-neutral-700 hover:border-cyan-400"
          >
            {route.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default topBar;