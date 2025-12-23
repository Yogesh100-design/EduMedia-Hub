// Footer.jsx
import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0a0a0a] text-gray-400 border-t border-white/5 overflow-hidden">
      {/* Subtle Gradient Glow for background depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-2xl font-black text-white tracking-tighter mb-4 italic">
              EDUMEDIA <span className="text-cyan-500">TECH</span>
            </h4>
            <p className="text-sm leading-relaxed max-w-sm text-gray-500">
              Transforming the digital classroom. Our platform simplifies multimedia management 
              so educators can focus on what matters most: <span className="text-white">inspiring students.</span>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Platform</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Resume Builder</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Course Manager</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Analytics</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h5 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Connect</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">API Docs</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-gray-600">
            © {year} EduMedia Tech — All Rights Reserved.
          </p>
          
          {/* Social Icons Placeholder */}
          <div className="flex gap-6">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all cursor-pointer group">
                <span className="text-xs group-hover:text-cyan-400">𝕏</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all cursor-pointer group">
                <span className="text-xs group-hover:text-cyan-400">in</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}