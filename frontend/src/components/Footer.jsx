// Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#0a0a0a] text-gray-400 border-t border-white/5 relative overflow-hidden">
      {/* Subtle Gradient Glow for background depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Only EduMedia on the right side */}
        <div className="flex justify-end">
          <h4 className="text-2xl font-black text-white italic">
            EDUMEDIA <span className="text-cyan-500">TECH</span>
          </h4>
        </div>
      </div>
    </footer>
  );
}