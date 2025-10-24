// EduMediaLandingPro.jsx
import React, { useEffect, useRef } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function EduMediaLandingPro() {
  const spotlightRef = useRef(null);

  /* -------------------------------------------------- */
  /* 1.  Dynamic cursor spotlight (kept for UX sparkle) */
  /* -------------------------------------------------- */
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

  /* -------------------------------------------------- */
  /* 2.  JSON-LD structured data for rich results       */
  /* -------------------------------------------------- */
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

  /* -------------------------------------------------- */
  /* 3.  Meta tags injected via React-Helmet or <head>  */
  /*     (below in JSX)                                 */
  /* -------------------------------------------------- */

  return (
    <>
      {/* ----------- SEO meta tags (Helmet or public/index.html) ----------- */}
      <Helmet>
        <title>
          EduMedia Tech | Learn & Teach Without Limits – Secure Educational
          Platform
        </title>
        <meta
          name="description"
          content="Upload, share and discover multimedia educational content. Student login, teacher dashboard, resume builder, interview prep, salary insights – powered by JWT, Cloudinary, MongoDB."
        />
        <meta
          name="keywords"
          content="educational platform, student login, teacher dashboard, resume builder, interview preparation, salary insights, multimedia content, upload notes, share videos, Cloudinary, MongoDB, JWT"
        />
        <meta name="author" content="EduMedia Tech" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="EduMedia Tech | Learn & Teach Without Limits" />
        <meta
          property="og:description"
          content="Securely upload, share and discover educational content. Built for students, educators and institutions."
        />
        <meta property="og:url" content={window.location.origin} />
        <meta property="og:site_name" content="EduMedia Tech" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="EduMedia Tech | Learn & Teach Without Limits" />
        <meta
          name="twitter:description"
          content="Secure educational platform – notes, videos, resume builder, interview prep."
        />
        <link rel="canonical" href={window.location.href} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* ----------- Visible UI ----------- */}
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
        <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-28 pb-32 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
            Learn & Teach{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Without Limits
            </span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-gray-300 leading-relaxed">
            A secure platform to{" "}
            <strong className="text-indigo-400">
              upload, share, and discover
            </strong>{" "}
            multimedia educational content. Powered by JWT, Cloudinary, and
            MongoDB—built for students, educators, and institutions.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 ">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition transform hover:scale-105"
              aria-label="Start for free – create your account"
            >
              Start for Free
            </Link>
            <Link
              to="/demo"
              className="px-6 py-3 rounded-xl border border-gray-700 text-gray-200 font-semibold hover:bg-gray-800/50 transition"
              aria-label="Explore platform demo"
            >
              Explore Demo
            </Link>
          </div>
        </main>

        {/* Features Section */}
        <section id="features" className="relative z-10 container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            Core Features
          </h2>

          <div className="grid md:grid-cols-3 gap-10 mb-20">
            {/* User System */}
            <article className="group bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-800 hover:border-indigo-500 transition">
              <div className="text-indigo-400 mb-5">
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0112 0v1zm0 0h6v-1a6 6 0-9-5.197M15 21a6 6 0-9-5.197M15 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Student Login
              </h3>
              <ul className="text-gray-300 space-y-2 text-sm leading-relaxed">
                <li>🔑 Access posts uploaded by teachers and more.</li>
                <li>👥 Build your resume for free.</li>
              </ul>
            </article>

            {/* Content Upload */}
            <article className="group bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-800 hover:border-purple-500 transition">
              <div className="text-purple-400 mb-5">
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Teacher Dashboard
              </h3>
              <ul className="text-gray-300 space-y-2 text-sm leading-relaxed">
                <li>📝 Text notes & articles for study material or blogs.</li>
                <li>🎥 Images & videos for tutorials, lectures, or blogs.</li>
                <li>📂 PDFs, PPTs, Docs for resources & assignments.</li>
              </ul>
            </article>

            {/* Cloud Storage */}
            <article className="group bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-800 hover:border-green-500 transition">
              <div className="text-green-400 mb-5">
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
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
    </>
  );
}
