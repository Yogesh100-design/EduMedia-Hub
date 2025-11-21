import React from "react";
import { Link } from "react-router-dom";

import img1 from "../assets/img1.jpg";
import img2 from "../assets/img4.jpg";
import img3 from "../assets/img3.png";
import img4 from "../assets/img4.jpeg";

const AlternatingImageShowcase = () => {
  const items = [
    {
      image: img1,
      title: "📚 Publish Blogs & Educational Posts",
      description:
        "Educators and users can easily create, upload, and share rich multimedia content—including text posts, lecture notes, and study materials—to a wide audience. Empower learning through sharing.",
      tags: [
        "Teacher Dashboard",
        "Rich Text Editor",
        "Multimedia Uploads",
        "Content Management",
      ],
      link: "/new-post",
    },
    {
      image: img2,
      title: "🧠 Practice Tech Interview Questions",
      description:
        "Prepare for your next job interview with our comprehensive database of questions across 14 technical fields. Filter by subject, view clear answers, and track your readiness.",
      tags: [
        "AI/ML",
        "DevOps",
        "System Design",
        "Cybersecurity",
        "Practice Mode",
      ],
      link: "/interview-prep",
    },
    {
      image: img3,
      title: "📄 Free Professional Resume Builder",
      description:
        "Generate a stunning, industry-standard resume in minutes. Choose from modern templates, organize your experience, and download in multiple formats, all for free.",
      tags: ["Template Customization", "PDF Export", "Career Tools", "A.I. Suggestions"],
      link: "/resume-builder",
    },
    {
      image: img4,
      title: "🌐 Ask to Experts",
      description:
        "Explore trending educational content, connect with teachers and subject matter experts, and engage in discussions to deepen your understanding of complex topics.",
      tags: ["Community", "Expert Q&A", "Trend Analysis", "Interactive Learning"],
      link: "/discover",
    },
  ];

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Glow */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent uppercase">
            EduMedia Core Features
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto mt-4" />
        </div>

        <div className="space-y-24">
          {items.map((item, index) => (
            <div
              key={index}
              className={`group relative flex flex-col md:flex-row items-center gap-12 ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Image */}
              <div className="relative w-full md:w-1/2 group-hover:scale-105 transition-transform duration-500">
                <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/40 backdrop-blur-md shadow-2xl relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-72 sm:h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="w-full md:w-1/2 space-y-6">
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  {item.title}
                </h3>

                <p className="text-gray-400 text-lg leading-relaxed border-l-2 border-gray-800 pl-4">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  {item.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-gray-900/60 text-cyan-300 border border-gray-700 rounded-full text-sm hover:border-cyan-500 transition"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA Button */}
              
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: .3; }
          50% { opacity: .1; }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default AlternatingImageShowcase;
