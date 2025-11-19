import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you'll use Link for navigation

const AlternatingImageShowcase = () => {
  const items = [
    {
      // Educational Content Focus
      image: 'https://as2.ftcdn.net/v2/jpg/03/39/88/15/1000_F_339881514_cjZwodJb2UYXS0BIHNY4bGDqphi4gxU8.jpg',
      title: '📚 Publish Blogs & Educational Posts',
      description: 'Educators and users can easily create, upload, and share rich multimedia content—including text posts, lecture notes, and study materials—to a wide audience. Empower learning through sharing.',
      tags: ['Teacher Dashboard', 'Rich Text Editor', 'Multimedia Uploads', 'Content Management'],
      link: '/new-post' // CTA link to the content creation page
    },
    {
      // Interview Prep Focus
      image: 'https://tse2.mm.bing.net/th/id/OIP.WRM6miW_snpLTI_QgojPIQHaDt?pid=Api&P=0&h=180',
      title: '🧠 Practice Tech Interview Questions',
      description: 'Prepare for your next job interview with our comprehensive database of questions across 14 technical fields. Filter by subject, view clear answers, and track your readiness.',
      tags: ['AI/ML', 'DevOps', 'System Design', 'Cybersecurity', 'Practice Mode'],
      link: '/interview-prep' // CTA link to the interview prep tool
    },
    {
      // Resume Builder Focus
      image: 'https://www.soegjobs.com/wp-content/uploads/2025/11/Choosing-a-Hospitality-Resume-Builder-Must-Have-Features-Common-Trap-768x452.png',
      title: '📄 Free Professional Resume Builder',
      description: 'Generate a stunning, industry-standard resume in minutes. Choose from modern templates, organize your experience, and download in multiple formats, all for free.',
      tags: ['Template Customization', 'PDF Export', 'Career Tools', 'A.I. Suggestions'],
      link: '/resume-builder' // CTA link to the resume creation tool
    },
    {
      // Overall Community/Discovery Focus
      image: 'https://tse3.mm.bing.net/th/id/OIP.eiPyGvnNLJ3YALgBan1mJgHaET?pid=Api&P=0&h=180',
      title: '🌐 Aks to Experts',
      description: 'Explore trending educational content, connect with teachers and subject matter experts, and engage in discussions to deepen your understanding of complex topics.',
      tags: ['Community', 'Expert Q&A', 'Trend Analysis', 'Interactive Learning'],
      link: '/discover' // CTA link to the main content feed
    }
  ];

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Animated tech grid background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Dynamic glow effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Header with neon gradient */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-wider mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            EduMedia Core Features
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full" />
        </div>

        <div className="space-y-24">
          {items.map((item, index) => (
            <div
              key={index}
              className={`group relative flex flex-col md:flex-row items-center gap-8 lg:gap-16
                ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Hover glow backdrop */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl" />
              
              {/* Image container with glassmorphism */}
              <div className="relative w-full md:w-1/2 transform transition-all duration-500 group-hover:scale-105">
                <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/40 backdrop-blur-md group-hover:border-cyan-500/50 transition-all duration-500 shadow-2xl shadow-black/50">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-purple-500/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Animated border glow */}
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                  
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 sm:h-80 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-110 relative z-0"
                  />
                  
                  {/* Floating action icon */}
                  <div className="absolute top-6 right-6 z-20 transform translate-x-20 group-hover:translate-x-0 transition-transform duration-500">
                    <div className="p-3 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {/* Swapping icon based on feature, default is fast forward/rocket */}
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content section */}
              <div className="w-full md:w-1/2 space-y-6">
                {/* Number indicator with gradient */}
                <div className="flex items-center gap-4">
                  <span className="text-7xl font-black bg-gradient-to-b from-gray-800 to-transparent bg-clip-text text-transparent group-hover:from-cyan-500 group-hover:to-purple-500 transition-all duration-300">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="h-0.5 w-20 bg-gradient-to-r from-cyan-500 to-transparent group-hover:w-32 transition-all duration-500" />
                </div>

                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent leading-tight">
                  {item.title}
                </h3>
                
                <p className="text-gray-400 text-lg leading-relaxed border-l-2 border-gray-800 pl-4 group-hover:border-cyan-500 transition-colors duration-300">
                  {item.description}
                </p>

                {/* Tech tags with neon effect */}
                <div className="flex flex-wrap gap-3">
                  {item.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-4 py-2 bg-gray-900/60 text-cyan-300 rounded-full text-sm font-semibold border border-gray-700 hover:border-cyan-500 hover:text-white hover:bg-gradient-to-r hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 cursor-pointer transform hover:scale-105"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Animated CTA button */}
           
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.1; }
        }
        .animation-delay-2000 {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default AlternatingImageShowcase;