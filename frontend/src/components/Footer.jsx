// Footer.jsx
import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-gray-400 border-t border-gray-800">
      <div className="w-full px-8 py-8">
        <div className="text-center">
          <h4 className="text-xl font-bold text-white mb-2">EduMedia Tech</h4>
          <p className="text-sm text-gray-400 mb-4">
            Empowering educators and learners with seamless multimedia content management.
          </p>
          <p className="text-xs text-gray-500">
            © {year} EduMedia Tech. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}