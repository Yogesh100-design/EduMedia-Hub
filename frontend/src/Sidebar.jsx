import React, { useState } from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const routes = [
    { label: "Interview Questions", path: "/interview-questions", icon: "💬", color: "text-cyan-400", badge: "Popular" },
    { label: "Placement Guidance", path: "/placement-guidance", icon: "🎯", color: "text-purple-400" },
    { label: "Resources", path: "/resources", icon: "📚", color: "text-yellow-400" },
    { label: "Resume Builder", path: "/resume-builder", icon: "📄", color: "text-green-400", badge: "New" },
    { label: "Mock Tests", path: "/mock-tests", icon: "📝", color: "text-pink-400" },
    { label: "Career Blogs", path: "/career-blogs", icon: "🌟", color: "text-blue-400" },
    { label: "Company Reviews", path: "/company-reviews", icon: "🏢", color: "text-red-400" },
    { label: "Salary Insights", path: "/salary-insights", icon: "💰", color: "text-emerald-400" },
    { label: "EduQ&A", path: "/EduQ&A", icon: "❓", color: "text-indigo-400" },
  ];

  return (
    <>
      {/* 1. CSS to hide scrollbars (Add this to your global CSS or keep it here) */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>

      {/* Mobile Toggle Button */}
      <div className="sm:hidden fixed top-0 left-0 w-full bg-black border-b border-neutral-800 z-50 px-4 py-3 flex justify-between items-center">
        <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          EduMedia Hub
        </span>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-neutral-300 p-2 rounded-lg hover:bg-neutral-800"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Sidebar Container */}
      <aside className={`
        fixed left-0 top-0 h-screen bg-black border-r border-neutral-800 z-40
        transition-transform duration-300 ease-in-out w-72
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        sm:translate-x-0 flex flex-col
      `}>
        
        {/* Logo Section */}
        <div className="hidden sm:flex px-6 py-8">
          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            EduMedia Hub
          </span>
        </div>

        {/* Navigation - Added hide-scrollbar class */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto pt-20 sm:pt-0 pb-6 hide-scrollbar">
          {routes.map((route, idx) => (
            <Link
              key={idx}
              to={route.path}
              onClick={() => setMobileMenuOpen(false)}
              className="group flex items-center gap-4 px-4 py-3 rounded-xl 
                         text-neutral-300 hover:text-white hover:bg-neutral-800/50
                         border border-transparent hover:border-neutral-700
                         transition-all duration-200 active:scale-[0.98]"
            >
              <span className={`text-xl ${route.color} group-hover:scale-110 transition-transform`}>
                {route.icon}
              </span>
              <span className="flex-1 text-sm font-medium">{route.label}</span>
              {route.badge && (
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-black font-bold uppercase tracking-tighter">
                  {route.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-neutral-800">
          <div className="flex items-center gap-3 px-2 py-2 text-neutral-500 text-xs italic">
            <span>© 2024 EduMedia Hub</span>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 sm:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default SideBar;