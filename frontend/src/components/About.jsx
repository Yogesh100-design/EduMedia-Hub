import React, { useState, useEffect, useRef } from "react";
import {
  Layers,
  Wrench,
  Target,
  Sparkles,
  Github,
  Linkedin,
  Mail,
  Code,
  ArrowRight,
  Zap,
  BookOpen,
  GraduationCap,
  MessageCircle,
  Globe,
} from "lucide-react";
import eduImage from '../assets/edu.jpg';

// ------------------------------------------------------------------
// Mobile detection hook (optional - to disable parallax on mobile)
// ------------------------------------------------------------------
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

// ------------------------------------------------------------------
// 3D-parallax & mouse-move helper hook
// ------------------------------------------------------------------
const useParallax = () => {
  const isMobile = useIsMobile();
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    if (isMobile) return; // Disable parallax on mobile
    
    const handle = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
      setCoords({ x, y });
    };
    
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [isMobile]);
  
  return coords;
};

// ------------------------------------------------------------------
// Re-usable animated section (Fade in and slide up)
// ------------------------------------------------------------------
const AnimatedSection = ({ children, delay = 0 }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-1000 ease-out ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
};

// ------------------------------------------------------------------
// Orbiting particles background (reduced on mobile for performance)
// ------------------------------------------------------------------
const OrbitingParticles = () => {
  const isMobile = useIsMobile();
  const particleCount = isMobile ? 20 : 40;
  
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {Array.from({ length: particleCount }).map((_, i) => (
        <span
          key={i}
          className="absolute block w-1 h-1 bg-cyan-400 rounded-full opacity-60 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${15 + Math.random() * 15}s linear infinite`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-30px) translateX(20px); }
          66% { transform: translateY(15px) translateX(-15px); }
          100% { transform: translateY(0) translateX(0); }
        }
      `}</style>
    </div>
  );
};

// ------------------------------------------------------------------
// Main component
// ------------------------------------------------------------------
const AboutPage = () => {
  const parallax = useParallax();
  const ref = useRef(null);
  const isMobile = useIsMobile();

  // CONSTANTS
  const PROFILE_IMAGE_URL = eduImage;

  // Data
  const projects = [
    {
      name: "SVIT College Project",
      tech: "React + Tailwind CSS + Git/GitHub",
      desc: "A web portal for college management with student profiles, notices, and result management.",
      icon: <GraduationCap className="w-5 h-5" />,
    },
    {
      name: "Full Backend Practice",
      tech: "Node.js + Express + MongoDB",
      desc: "RESTful APIs, JWT auth, file uploads, and CRUD operations in a complete backend project.",
      icon: <Layers className="w-5 h-5" />,
    },
    {
      name: "EduMidia",
      tech: "React + Node.js + MongoDB",
      desc: "Education platform with resource sharing, media uploads, and collaborative learning features.",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      name: "NoteNest",
      tech: "React + MongoDB + Node.js",
      desc: "Full-stack notes manager with JWT auth, rich-text editor, and real-time syncing.",
      icon: <Code className="w-5 h-5" />,
    },
    {
      name: "Quick News",
      tech: "React + NewsAPI",
      desc: "Responsive news aggregator with category navigation and infinite scrolling.",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      name: "AI Chatbot",
      tech: "React + OpenAI API",
      desc: "Intelligent chatbot for web apps with query responses and UX improvements.",
      icon: <MessageCircle className="w-5 h-5" />,
    },
  ];
  
  const skills = {
    Frontend: ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS", "Bootstrap"],
    Backend: ["Node.js", "Express.js"],
    Database: ["MySQL", "MongoDB"],
    Tools: ["Git", "GitHub", "Postman", "MongoDB Atlas", "REST APIs"],
  };

  const socials = [
    { label: "GitHub", url: "https://github.com/Yogesh100-design", Icon: Github },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/yogesh-chavan-494196316/", Icon: Linkedin },
    { label: "Email", url: "mailto:chavanyogesh8600@gmail.com", Icon: Mail },
  ];

  return (
    <div className="relative min-h-screen bg-black text-gray-100 overflow-x-hidden">
      <OrbitingParticles />

      {/* Gradient glow follows mouse (hidden on mobile) */}
      {!isMobile && (
        <div
          className="pointer-events-none fixed inset-0 z-0 transition-transform duration-300"
          style={{
            transform: `translate(${parallax.x * 30}px, ${parallax.y * 30}px)`,
          }}
        >
          <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" />
        </div>
      )}

      <main
        ref={ref}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 lg:py-32"
      >
        {/* --------------- INTRO (Image + Bio) --------------- */}
        <AnimatedSection>
          <section className="mb-16 md:mb-24">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16">
              {/* Profile Image with Parallax Tilt */}
              <div
                className="w-40 h-40 md:w-56 md:h-56 shrink-0 relative 
                         rounded-full overflow-hidden border-4 border-cyan-500/50 
                         shadow-xl shadow-cyan-500/40 transition-all duration-300
                         transform hover:scale-105"
                style={!isMobile ? {
                  transform: `rotateX(${parallax.y * 5}deg) rotateY(${
                    parallax.x * 5
                  }deg)`,
                  boxShadow: "0 0 40px rgba(6, 182, 212, 0.4)",
                } : {}}
              >
                <img
                  src={PROFILE_IMAGE_URL}
                  alt="Yogesh Chavan"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/224x224/505050/ffffff?text=Yogesh";
                  }}
                />
              </div>

              {/* Text Content */}
              <div className="text-center md:text-left">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 mb-3 leading-tight">
                  Hey, I'm <span className="italic">Yogesh Chavan</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl max-w-4xl leading-relaxed text-gray-300">
                  5<sup>th</sup>-semester IT Engineering student turning caffeine into code. I craft
                  pixel-perfect UIs, optimise queries & explore how{" "}
                  <strong className="text-cyan-400">AI can super-charge React apps</strong>. I build, break,
                  and rebuild until the solution is elegant and impactful.
                </p>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* --------------- PROJECTS --------------- */}
        <AnimatedSection delay={300}>
          <section className="mb-16 md:mb-24">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 flex items-center gap-3 md:gap-4 text-cyan-300">
              <Layers className="w-7 h-7 md:w-8 md:h-8" /> Projects I've Shipped
            </h2>
            <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <AnimatedSection key={p.name} delay={300 + i * 100}>
                  <div
                    className="group relative p-5 md:p-6 rounded-xl md:rounded-2xl border border-gray-800 bg-gray-900/50
                            hover:border-cyan-400/50 transition-all duration-500
                            hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20"
                  >
                    <div className="absolute -top-2 -right-2 p-2 md:p-3 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {p.icon}
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-100">{p.name}</h3>
                    <span className="inline-block mb-3 px-3 py-1 text-xs font-medium bg-cyan-900/50 text-cyan-300 rounded-full border border-cyan-700/50">
                      {p.tech}
                    </span>
                    <p className="text-sm md:text-base text-gray-400 leading-relaxed">{p.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </section>
        </AnimatedSection>

        {/* --------------- SKILLS --------------- */}
        <AnimatedSection delay={900}>
          <section className="mb-16 md:mb-24">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-10 flex items-center gap-3 md:gap-4 text-cyan-300">
              <Wrench className="w-7 h-7 md:w-8 md:h-8" /> Tech Stack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {Object.entries(skills).map(([cat, items], idx) => (
                <AnimatedSection key={cat} delay={900 + idx * 150}>
                  <div className="p-5 md:p-6 rounded-xl md:rounded-2xl border border-gray-800 bg-gray-900/50">
                    <h3 className="font-semibold text-lg mb-4 text-gray-100">{cat}</h3>
                    <div className="flex flex-wrap gap-2">
                      {items.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-gray-800 text-gray-200 rounded-full text-sm
                                      hover:bg-cyan-700 hover:text-white transition-all duration-300 cursor-pointer"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </section>
        </AnimatedSection>

        {/* --------------- GOALS & COLLAB --------------- */}
        <AnimatedSection delay={1500}>
          <section className="mb-16 md:mb-24">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-10 flex items-center gap-3 md:gap-4 text-cyan-300">
              <Target className="w-7 h-7 md:w-8 md:h-8" /> What's Next & Let's Collab
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-100">Future Goals</h3>
                <ul className="space-y-3 text-gray-300">
                  {[
                    "Learn Next.js + Docker",
                    "Integrate OpenAI API with React to build smart writing assistants",
                    "Ship an open-source SaaS that solves a real-world pain point",
                  ].map((g, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm md:text-base">
                      <Zap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-100">Collaboration Ethos</h3>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                  Active in dev Discords, prepping for GSoC 2025, thriving in hackathons & pair-programming sessions.
                  The best software is born from diverse minds brainstorming at 2 a.m.
                </p>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* --------------- CLOSING --------------- */}
        <AnimatedSection delay={2000}>
          <section className="text-center bg-gradient-to-br from-gray-900 to-black rounded-2xl md:rounded-3xl p-6 md:p-10 border border-gray-800">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
              Let's Build Something Amazing Together
            </h2>
            <p className="text-gray-300 mb-6 md:mb-8 text-sm md:text-base">
              Open for internships, freelance gigs, coffee chats, and open-source collaborations.
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-lg md:rounded-xl font-semibold
                            hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/30 text-sm md:text-base"
                >
                  <s.Icon className="w-4 h-4 md:w-5 md:h-5" />
                  {s.label}
                </a>
              ))}
            </div>
          </section>
        </AnimatedSection>
      </main>
    </div>
  );
};

export default AboutPage;