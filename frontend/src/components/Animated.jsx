// HeroCursor.jsx
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function HeroCursor() {
  const spotlightRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      spotlightRef.current.style.background = `radial-gradient(600px at ${clientX}px ${clientY}px, rgba(99, 102, 241, 0.15), transparent 80%)`;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-950 overflow-hidden">
      {/* Cursor-tracking spotlight */}
      <div
        ref={spotlightRef}
        className="pointer-events-none fixed inset-0 z-0 transition duration-300"
      />

      {/* Gradient orb (subtle) */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Navbar (glass) */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12">
        <div className="text-2xl font-bold text-white flex items-center gap-2">
          <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          EduMedia Tech
        </div>
        <div className="hidden md:flex items-center gap-6 text-gray-300">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
          <a href="#docs" className="hover:text-white transition">Docs</a>
          <Link
            to="/register"
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-24 pb-32 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
          Learn & Teach{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Without Limits
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-300">
          Upload, share, and discover multimedia educational content secured by JWT and powered by
          Cloudinary & MongoDB—built for creators, students, and institutions.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            to="/register"
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition transform hover:scale-105"
          >
            Start for Free
          </Link>
          <button className="px-6 py-3 rounded-lg border border-gray-700 text-gray-200 font-semibold hover:bg-gray-800/50 transition">
            Explore Demo
          </button>
        </div>

        {/* Trusted by strip */}
        <div className="mt-20 w-full max-w-5xl">
          <p className="text-gray-400 text-sm">Trusted by educators at</p>
          <div className="mt-4 flex flex-wrap justify-center items-center gap-8 opacity-60 grayscale">
            {["boAt", "Google", "Udemy", "Coursera", "Unacademy"].map((brand) => (
              <span key={brand} className="text-2xl font-bold text-gray-400">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}