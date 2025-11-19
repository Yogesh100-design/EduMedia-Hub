import React, { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import "./topbar.css"; // Add this 

const TopBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollRef = useRef(null);
  
  const routes = [
    { 
      label: "Interview Questions", 
      path: "/interview-questions", 
      icon: "💬",
      color: "text-cyan-400",
      badge: "Popular"
    },
    { 
      label: "Placement Guidance", 
      path: "/placement-guidance", 
      icon: "🎯",
      color: "text-purple-400"
    },
    { 
      label: "Resources", 
      path: "/resources", 
      icon: "📚",
      color: "text-yellow-400"
    },
    { 
      label: "Resume Builder", 
      path: "/resume-builder", 
      icon: "📄",
      color: "text-green-400",
      badge: "New"
    },
    { 
      label: "Mock Tests", 
      path: "/mock-tests", 
      icon: "📝",
      color: "text-pink-400"
    },
    { 
      label: "Career Blogs", 
      path: "/career-blogs", 
      icon: "🌟",
      color: "text-blue-400"
    },
    { 
      label: "Company Reviews", 
      path: "/company-reviews", 
      icon: "🏢",
      color: "text-red-400"
    },
    { 
      label: "Salary Insights", 
      path: "/salary-insights", 
      icon: "💰",
      color: "text-emerald-400"
    },
    { 
      label: "EduQ&A", 
      path: "/EduQ&A", 
      icon: "❓",
      color: "text-indigo-400"
    },
  ];

  const scrollLeft = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -250, behavior: 'smooth' });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 250, behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="sticky top-0 z-50 w-full bg-black border-b border-neutral-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between py-3">
          <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            EduMedia Hub
          </span>
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden text-neutral-300 hover:text-white transition-all duration-200 p-2 rounded-lg hover:bg-neutral-800 active:scale-95"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Desktop Navigation with Buttons */}
        <div className="hidden sm:flex items-center gap-3 py-3">
          {/* Left Navigation Button */}
          <button
            onClick={scrollLeft}
            className="flex-shrink-0 p-2 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-cyan-400 transition-all duration-200 active:scale-95"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5 text-neutral-300 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Scrollable Navigation Container (hidden scrollbar) */}
          <div className="flex-1 hide-scrollbar overflow-x-auto" ref={scrollRef}>
            <nav className="flex gap-3 w-max">
              {routes.map((route, idx) => (
                <Link
                  key={idx}
                  to={route.path}
                  className="flex-shrink-0 group min-h-[44px] px-5 py-2.5 
                           bg-neutral-900 rounded-full text-sm font-medium
                           text-neutral-300 hover:text-white hover:bg-neutral-800
                           border border-neutral-700 hover:border-cyan-400
                           transition-all duration-200 active:scale-95 flex items-center gap-2"
                >
                  <span className={`text-lg ${route.color} group-hover:scale-110 transition-transform`}>
                    {route.icon}
                  </span>
                  <span>{route.label}</span>
                  {route.badge && (
                    <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-black font-bold">
                      {route.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Navigation Button */}
          <button
            onClick={scrollRight}
            className="flex-shrink-0 p-2 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-cyan-400 transition-all duration-200 active:scale-95"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5 text-neutral-300 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden absolute w-full left-0 right-0 bg-neutral-950/95 backdrop-blur-lg border-t border-neutral-800 shadow-2xl">
            <nav className="px-4 py-4 grid grid-cols-1 gap-2 max-h-[70vh] overflow-y-auto">
              {routes.map((route, idx) => (
                <Link
                  key={idx}
                  to={route.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="group flex items-center gap-4 w-full text-left px-5 py-4 rounded-xl 
                           text-neutral-300 hover:text-white hover:bg-neutral-800
                           border border-neutral-800 hover:border-cyan-400
                           transition-all duration-200 active:scale-95"
                >
                  <span className={`text-2xl ${route.color} transition-transform group-hover:scale-110`}>
                    {route.icon}
                  </span>
                  <span className="flex-1 text-base font-medium">{route.label}</span>
                  {route.badge && (
                    <span className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-black font-bold">
                      {route.badge}
                    </span>
                  )}
                  <svg className="w-5 h-5 text-neutral-600 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;