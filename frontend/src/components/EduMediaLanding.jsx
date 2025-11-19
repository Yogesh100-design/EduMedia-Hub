// EduMediaLandingPro.jsx
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import AlternatingImageShowcase from "./Images";

// Define the features data to pass to AlternatingImageShowcase
const featuresData = [
    {
        title: "Secure Content Upload & Sharing",
        description: "Teachers and institutions can securely upload multimedia educational content (videos, PDFs, notes) using robust storage like Cloudinary.",
        imageUrl: "/path-to-teacher-upload-image.png", // Replace with actual image path
        link: "/teacher-dashboard",
    },
    {
        title: "Free Resume Builder & Interview Prep",
        description: "Empower students with free tools including a resume generator and comprehensive interview preparation kits to kickstart their careers.",
        imageUrl: "/path-to-student-resume-image.png", // Replace with actual image path
        link: "/interview-prep",
    },
    // Add more alternating features here if needed
];


export default function EduMediaLandingPro() {
  const spotlightRef = useRef(null);

  // 1. Dynamic cursor spotlight (kept for UX sparkle)
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

  // 2. JSON-LD structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "EduMedia Tech",
    url: window.location.origin,
    description:
      "A secure platform to upload, share, and discover multimedia educational content. Built for students, educators, and institutions.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${window.location.origin}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  // Inject SEO meta tags manually (works without Helmet)
  useEffect(() => {
    document.title = "EduMedia Tech | Learn & Teach Without Limits – Secure Educational Platform";
    const metaDescription = document.querySelector("meta[name='description']");
    if (metaDescription)
      metaDescription.setAttribute(
        "content",
        "Upload, share and discover multimedia educational content. Student login, teacher dashboard, resume builder, interview prep, salary insights – powered by JWT, Cloudinary, MongoDB."
      );

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => document.head.removeChild(script);
  }, []);

  // UI section
  return (
    <>
      <div className="relative min-h-screen bg-gray-950 overflow-hidden">
        {/* Cursor spotlight */}
        <div
          ref={spotlightRef}
          className="pointer-events-none fixed inset-0 z-0 transition duration-300"
        />

        {/* Gradient orbs */}
        <div className="absolute -top-40 -left-40 w-[28rem] h-[28rem] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[28rem] h-[28rem] bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Hero Section */}
        <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-18 pb-20 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
            Learn & Teach{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Without Limits
            </span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-gray-300 leading-relaxed">
            A secure platform to{" "}
            <strong className="text-indigo-400">upload, share, and discover</strong>{" "}
            multimedia educational content. Powered by JWT, Cloudinary, and MongoDB—
            built for students, educators, and institutions.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition transform hover:scale-105"
            >
              Start for Free
            </Link>
          </div>
        </main>

        {/* Features Section */}
        <section id="features" className="relative z-10 container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            Core Features
          </h2>

          <div className="grid md:grid-cols-3 gap-10 mb-20">
            {/* Student Login */}
            <article className="group bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-800 hover:border-indigo-500 transition">
              <div className="text-indigo-400 mb-5">
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {/* Corrected SVG path for User Icon */}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Student Login</h3>
              <ul className="text-gray-300 space-y-2 text-sm leading-relaxed">
                <li>🔑 Access posts uploaded by teachers and more.</li>
                <li>👥 Build your resume for free.</li>
              </ul>
            </article>

            {/* Teacher Dashboard */}
            <article className="group bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-800 hover:border-purple-500 transition">
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
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Teacher Dashboard</h3>
              <ul className="text-gray-300 space-y-2 text-sm leading-relaxed">
                <li>📝 Upload text notes or blogs.</li>
                <li>🎥 Share images, videos, and tutorials.</li>
                <li>📂 Manage PDFs, Docs, and assignments.</li>
              </ul>
            </article>

            {/* Core Features */}
            <article className="group bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-800 hover:border-green-500 transition">
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
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Core Features</h3>
              <ul className="text-gray-300 space-y-2 text-sm leading-relaxed">
                <li>📊 Interview preparation kits.</li>
                <li>📝 Educational blogs & insights.</li>
                <li>💰 Salary insights for graduates.</li>
                <li>📄 Free resume creation tool.</li>
              </ul>
            </article>
          </div>
        </section>
      </div>
      <AlternatingImageShowcase features={featuresData} /> 
    </>
  );
}