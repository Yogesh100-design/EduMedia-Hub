// Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setMobileMenuOpen(false);
    navigate("/");
    window.location.reload();
  };

  const navLinks = [
    { label: "About", to: "/about" },
    // Add more links here
  ];

  return (
    <header className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-lg border-b border-gray-800 font-['Inter']">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-white hover:text-indigo-400 transition"
          aria-label="EduMedia Tech Homepage"
        >
          <svg className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="hidden sm:inline">EduMedia Tech</span>
          <span className="sm:hidden">EduMedia</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Primary site navigation">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.to} className="text-gray-300 hover:text-indigo-400 transition py-2">
              {link.label}
            </Link>
          ))}

          {isLoggedIn ? (
            <button onClick={handleLogout} className="px-5 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition transform hover:scale-105">
              Log Out
            </button>
          ) : (
            <Link to="/login">
              <button className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition transform hover:scale-105">
                Sign In
              </button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden relative z-50 text-gray-300 hover:text-indigo-400 transition p-2"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <div className="relative w-6 h-6 flex items-center justify-center">
            {/* Animated hamburger */}
            <span className={`absolute block h-0.5 w-5 bg-current transform transition duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'}`}></span>
            <span className={`absolute block h-0.5 w-5 bg-current transition duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`absolute block h-0.5 w-5 bg-current transform transition duration-300 ${mobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          onClick={() => setMobileMenuOpen(false)}
        ></div>

        {/* Menu Panel */}
        <nav 
          className={`absolute top-0 left-0 w-full h-full bg-gray-950/98 backdrop-blur-xl border-t border-gray-800 transform transition-transform duration-300 ease-out ${mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
          aria-label="Mobile site navigation"
        >
          <div className="container mx-auto px-6 pt-24 pb-8 h-full flex flex-col justify-start">
            {/* Menu Links */}
            <div className="flex flex-col gap-2">
              {navLinks.map((link, index) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="group text-2xl font-medium text-gray-200 hover:text-indigo-400 transition-all duration-300 py-4 border-b border-gray-800/50"
                  style={{
                    transitionDelay: `${index * 75}ms`,
                    transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                    opacity: mobileMenuOpen ? 1 : 0,
                  }}
                >
                  <span className="inline-block">{link.label}</span>
                  <span className="block h-0.5 w-0 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>

            {/* Auth Button */}
            <div className="mt-8 space-y-4">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="w-full px-6 py-4 rounded-xl bg-red-600/90 text-white font-semibold hover:bg-red-700 transition transform hover:scale-105 text-lg"
                  style={{
                    transitionDelay: `${navLinks.length * 75}ms`,
                    transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                    opacity: mobileMenuOpen ? 1 : 0,
                    transition: 'all 0.4s ease-out'
                  }}
                >
                  Log Out
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center"
                  style={{
                    transitionDelay: `${navLinks.length * 75}ms`,
                    transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                    opacity: mobileMenuOpen ? 1 : 0,
                    transition: 'all 0.4s ease-out'
                  }}
                >
                  <button className="w-full px-6 py-4 rounded-xl bg-indigo-600/90 text-white font-semibold hover:bg-indigo-700 transition transform hover:scale-105 text-lg">
                    Sign In
                  </button>
                </Link>
              )}
            </div>

            {/* Optional: Add footer info */}
            <div className="mt-auto pt-8 border-t border-gray-800/50">
              <p className="text-sm text-gray-500">© 2024 EduMedia Tech</p>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}