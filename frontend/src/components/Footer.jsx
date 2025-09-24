// Footer.jsx
import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();

  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Changelog", href: "#changelog" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "#docs" },
        { label: "API Reference", href: "#api" },
        { label: "Tutorials", href: "#tutorials" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "#help" },
        { label: "Contact", href: "#contact" },
        { label: "Status", href: "https://status.edumediatech.com" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#about" },
        { label: "Blog", href: "#blog" },
        { label: "Careers", href: "#careers" },
      ],
    },
  ];

  const socialLinks = [
    {
      label: "Twitter",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 ..."></path>
        </svg>
      ),
      href: "https://twitter.com/edumediatech",
    },
    {
      label: "GitHub",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 ..."></path>
        </svg>
      ),
      href: "https://github.com/edumediatech",
    },
    {
      label: "LinkedIn",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328 ..."></path>
        </svg>
      ),
      href: "https://linkedin.com/company/edumediatech",
    },
  ];

  return (
    <footer className="bg-black text-gray-400 border-t border-gray-800">
      <div className="w-full px-8 py-14">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <a
              href="/"
              className="flex items-center gap-2 text-2xl font-bold text-white mb-4"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 ..."
                />
              </svg>
              EduMedia Tech
            </a>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering educators and learners with seamless multimedia
              content management.
            </p>
          </div>

          {/* Links columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-indigo-400 transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <p className="text-sm text-gray-500">
            © {year} EduMedia Tech. All rights reserved.
          </p>

          {/* Social icons */}
          <div className="flex gap-5">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="text-gray-500 hover:text-indigo-400 transition-colors duration-200"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
