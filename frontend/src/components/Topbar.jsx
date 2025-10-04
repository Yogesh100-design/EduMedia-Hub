import React from "react";
import { Link } from "react-router-dom";

const TopBar = () => {
  const routes = [
    { label: "Interview Questions", path: "/interview-questions" },
    { label: "Placement Guidance", path: "/placement-guidance" },
    { label: "Resources", path: "/resources" },
    { label: "Resume Builder", path: "/resume-builder" },
    { label: "Mock Tests", path: "/mock-tests" },
    { label: "Career Blogs", path: "/career-blogs" },
    { label: "Company Reviews", path: "/company-reviews" },
    { label: "Salary Insights", path: "/salary-insights" },
  ];

  return (
    <>
      <div className="sticky top-0 z-50 w-full h-20 bg-black border-b border-neutral-800 flex items-center justify-center shadow-2xl">
        {/* NAV CONTAINER */}
        <nav className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto whitespace-nowrap space-x-4 sm:space-x-5 py-2 scrollbar-hide">
          {routes.map((route, idx) => (
            <Link
              key={idx}
              to={route.path}
              className="flex-shrink-0 px-4 py-2 text-neutral-200 bg-neutral-900 rounded-full text-sm font-medium shadow-md transition-all duration-300 transform 
                         hover:scale-[1.03] hover:shadow-cyan-400/30 hover:text-cyan-300 active:scale-95 
                         border border-neutral-700 hover:border-cyan-400"
            >
              {route.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* HIDE SCROLLBAR */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display:none; }
        .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>
    </>
  );
};

export default TopBar;