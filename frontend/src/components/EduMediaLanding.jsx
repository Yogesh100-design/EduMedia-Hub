import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function EduMediaLandingPro() {
  const spotlightRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(600px at ${clientX}px ${clientY}px, rgba(99,102,241,0.12), transparent 80%)`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-950 overflow-hidden ">
      {/* Cursor spotlight */}
      <div
        ref={spotlightRef}
        className="pointer-events-none fixed inset-0 z-0 transition duration-300"
      />

      {/* Gradient orbs */}
      <div className="absolute -top-40 -left-40 w-[28rem] h-[28rem] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-[28rem] h-[28rem] bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-28 pb-32 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
          Learn & Teach{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Without Limits
          </span>
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-gray-300 leading-relaxed">
          A secure platform to{" "}
          <span className="text-indigo-400 font-semibold">
            upload, share, and discover
          </span>{" "}
          multimedia educational content. Powered by JWT, Cloudinary, and
          MongoDB—built for students, educators, and institutions.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            to="/register"
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition transform hover:scale-105"
          >
            Start for Free
          </Link>
          <button className="px-6 py-3 rounded-xl border border-gray-700 text-gray-200 font-semibold hover:bg-gray-800/50 transition">
            Explore Demo
          </button>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="relative z-10 container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
          Core Features
        </h2>

        <div className="grid md:grid-cols-3 gap-10 mb-20">
          {/* User System */}
          <div className="group bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-800 hover:border-indigo-500 transition ">
            <div className="text-indigo-400 mb-5">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 
                  0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 
                  21a6 6 0 00-9-5.197M15 21a6 6 0 
                  006-5.197M15 12a4 4 0 11-8 0 4 
                  4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              User System
            </h3>
            <ul className="text-gray-300 space-y-2 text-sm leading-relaxed">
              <li>🔑 Registration & login with JWT access + refresh tokens.</li>
              <li>👥 Role-based access: Student, Teacher, Admin.</li>
            </ul>
          </div>

          {/* Content Upload */}
          <div className="group bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-800 hover:border-purple-500 transition">
            <div className="text-purple-400 mb-5">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 
                  0 1115.9 6L16 6a5 5 0 011 
                  9.9M15 13l-3-3m0 0l-3 
                  3m3-3v12"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Content Upload
            </h3>
            <ul className="text-gray-300 space-y-2 text-sm leading-relaxed">
              <li>📝 Text Notes / Articles for study material or blogs.</li>
              <li>🎥 Images / Videos for tutorials, lectures, or blogs.</li>
              <li>📂 Files (PDFs, PPTs, Docs) for resources & assignments.</li>
            </ul>
          </div>

          {/* Cloud Storage */}
          <div className="group bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-800 hover:border-green-500 transition">
            <div className="text-green-400 mb-5">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 15a4 4 0 004 4h9a5 5 
                  0 10-.1-9.999 5.002 5.002 
                  0 10-9.78 2.096A4.001 
                  4.001 0 003 15z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Cloud Storage
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Uploads stored on <strong>Cloudinary</strong>, metadata managed
              with <strong>MongoDB</strong>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
