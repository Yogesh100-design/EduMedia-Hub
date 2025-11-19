import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";

const initialQuestions = [
  // 🌐 Web Development
  { text: "Explain event delegation in JavaScript.", field: "Web Development", answer: "Event delegation attaches a listener to a parent element instead of many children, handling events via bubbling." },
  { text: "How does React's Virtual DOM work?", field: "Web Development", answer: "React uses a lightweight virtual DOM and updates only the changed parts after diffing with the previous version." },
  { text: "What is debounce vs throttle?", field: "Web Development", answer: "Debounce delays execution until action stops; throttle executes at fixed intervals." },
  { text: "What is a closure?", field: "Web Development", answer: "A closure allows a function to access its lexical scope even after the outer function executes." },

  // 📊 Data Science
  { text: "Explain the Bias-Variance trade-off.", field: "Data Science", answer: "Bias is underfitting; variance is overfitting. The goal is balancing both." },
  { text: "What is PCA?", field: "Data Science", answer: "PCA reduces dimensionality by transforming correlated features into principal components." },
  { text: "What is cross-validation?", field: "Data Science", answer: "Repeatedly splits data into train-test to evaluate model stability." },

  // 💻 Software Engineering
  { text: "What are the four pillars of OOP?", field: "Software Engineering", answer: "Abstraction, Encapsulation, Inheritance, Polymorphism." },
  { text: "What is SOLID?", field: "Software Engineering", answer: "Five principles for maintainable software design." },

  // 🗄️ Database Systems
  { text: "Explain normalization (1NF, 2NF, 3NF).", field: "Database Systems", answer: "Normalization reduces redundancy using structured rules." },
  { text: "What are ACID properties?", field: "Database Systems", answer: "Atomicity, Consistency, Isolation, Durability ensure reliable transactions." },

  // ☁️ Cloud Computing
  { text: "IaaS vs PaaS vs SaaS?", field: "Cloud Computing", answer: "Different service levels offering infra, platform, or software." },
  { text: "What is serverless computing?", field: "Cloud Computing", answer: "Running code without managing servers using managed services." },

  // 🔐 Cybersecurity
  { text: "Symmetric vs asymmetric encryption?", field: "Cybersecurity", answer: "Symmetric uses one key; asymmetric uses public/private key pair." },
  { text: "What is hashing?", field: "Cybersecurity", answer: "Hashing converts data into a fixed-size irreversible value." },

  // ⚙️ Operating Systems
  { text: "Process vs thread?", field: "Operating Systems", answer: "Processes have separate memory; threads share memory." },
  { text: "What is deadlock?", field: "Operating Systems", answer: "A cycle where processes wait on each other indefinitely." },

  // 🤖 AI/ML
  { text: "What is reinforcement learning?", field: "AI/ML", answer: "Learning through rewards and punishments in an environment." },
  { text: "What is gradient descent?", field: "AI/ML", answer: "An optimization algorithm that updates parameters in the direction of negative gradient." },

  // ⚡ DevOps
  { text: "What is CI/CD?", field: "DevOps", answer: "CI merges code frequently; CD deploys code automatically." },
  { text: "Blue-green deployment?", field: "DevOps", answer: "Two environments run in parallel to reduce downtime." },

  // 📱 Mobile Development
  { text: "React Native vs Flutter?", field: "Mobile Development", answer: "React Native uses JS/React; Flutter uses Dart with custom UI engine." },

  // 🏗️ System Design
  { text: "Design a URL shortener.", field: "System Design", answer: "Use hashing, database mapping, and redirection service." },
  { text: "What is load balancing?", field: "System Design", answer: "Distributes traffic across multiple servers." },

  // 🧮 Aptitude
  { text: "Permutation vs combination?", field: "Aptitude", answer: "In permutations order matters; in combinations it doesn’t." },

  // 🎯 Machine Learning Engineering (NEW)
  { text: "How do you deploy a model using Docker?", field: "Machine Learning Engineering", answer: "Containerize model, expose API, push image, deploy to Kubernetes or cloud." },
  { text: "Explain A/B testing in ML.", field: "Machine Learning Engineering", answer: "Run two model versions simultaneously and compare metrics." },
  { text: "What is feature drift?", field: "Machine Learning Engineering", answer: "Change in data distribution over time, detected using statistical tests." },
  { text: "What is model monitoring?", field: "Machine Learning Engineering", answer: "Tracking drift, latency, accuracy, data quality in production." },

  // 🎨 Frontend Engineering (NEW)
  { text: "How do you optimize Core Web Vitals?", field: "Frontend Engineering", answer: "Optimize LCP, FID, CLS via image optimization and JS reduction." },
  { text: "Explain hydration mismatch.", field: "Frontend Engineering", answer: "Client and server DOM mismatch due to dynamic values." },
  { text: "What are React Server Components?", field: "Frontend Engineering", answer: "Components rendered on server to reduce bundle size." },
  { text: "What is a reconciliation algorithm?", field: "Frontend Engineering", answer: "React's diffing technique for updating UI efficiently." },

  // 🔧 Backend Engineering (NEW)
  { text: "How to design a rate limiter?", field: "Backend Engineering", answer: "Use token bucket or Redis-based counters to limit requests." },
  { text: "Eventual vs strong consistency?", field: "Backend Engineering", answer: "Immediate vs eventual synchronization across nodes." },
  { text: "Explain Circuit Breaker pattern.", field: "Backend Engineering", answer: "Prevents cascading failures by failing fast when service is down." },
  { text: "What is gRPC?", field: "Backend Engineering", answer: "A fast RPC framework using protocol buffers." },

  // 🌐 Full Stack Development (NEW)
  { text: "How do you handle authentication in MERN?", field: "Full Stack Development", answer: "Using JWT, cookies, middleware, and protected routes." },
  { text: "Implement WebSocket chat?", field: "Full Stack Development", answer: "Use Socket.io, rooms, events, and server state." },
  { text: "Best way to handle file uploads?", field: "Full Stack Development", answer: "Multipart, cloud storage, signed URLs, virus scan." },
  { text: "What is SSR vs CSR?", field: "Full Stack Development", answer: "Server-side rendering vs client-side rendering." },

  // 📊 Data Engineering (NEW)
  { text: "ETL vs ELT?", field: "Data Engineering", answer: "ETL transforms first; ELT transforms after loading." },
  { text: "How do you build a pipeline with Airflow?", field: "Data Engineering", answer: "Define DAGs, tasks, scheduling, retries." },
  { text: "What is data partitioning?", field: "Data Engineering", answer: "Splitting data for performance and parallelism." },
  { text: "What is a data lake?", field: "Data Engineering", answer: "Stores raw structured and unstructured data." },

  // 🔍 Site Reliability Engineering (NEW)
  { text: "What are SLAs, SLIs, SLOs?", field: "Site Reliability Engineering", answer: "SLIs = metrics, SLOs = targets, SLAs = contracts." },
  { text: "Explain incident response.", field: "Site Reliability Engineering", answer: "Detect → alert → fix → postmortem." },
  { text: "What is chaos engineering?", field: "Site Reliability Engineering", answer: "Inject failures to test system resilience." },
  { text: "What is error budget?", field: "Site Reliability Engineering", answer: "Allowed downtime based on SLOs." },

  // 🧪 Quality Assurance / Testing (NEW)
  { text: "What is the testing pyramid?", field: "Quality Assurance / Testing", answer: "Most unit tests, fewer integration, fewest E2E tests." },
  { text: "TDD vs BDD?", field: "Quality Assurance / Testing", answer: "TDD writes tests first; BDD uses human-readable scenarios." },
  { text: "How do you test async code?", field: "Quality Assurance / Testing", answer: "Using async/await, mocks, and wait utilities." },
  { text: "What is regression testing?", field: "Quality Assurance / Testing", answer: "Testing existing features after changes." },

  // ⛓️ Blockchain Development (NEW)
  { text: "How do smart contracts work?", field: "Blockchain Development", answer: "Self-executing programs on blockchain with set conditions." },
  { text: "PoW vs PoS?", field: "Blockchain Development", answer: "PoW uses computation; PoS uses staking." },
  { text: "What is DeFi?", field: "Blockchain Development", answer: "Decentralized finance using smart contracts." },
  { text: "What is a blockchain oracle?", field: "Blockchain Development", answer: "External data provider to smart contracts." },

  // 🔌 Embedded Systems (NEW)
  { text: "What is an RTOS?", field: "Embedded Systems", answer: "A real-time OS ensuring deterministic execution." },
  { text: "Explain memory-mapped I/O.", field: "Embedded Systems", answer: "Devices accessed via memory addresses." },
  { text: "How to reduce power in IoT?", field: "Embedded Systems", answer: "Use sleep cycles, reduce radio use, optimize code." },
  { text: "What is a watchdog timer?", field: "Embedded Systems", answer: "Resets the system if software freezes." },

  // 🎮 Game Development (NEW)
  { text: "Explain the game loop.", field: "Game Development", answer: "Loop running input → update → render cycles." },
  { text: "What is Level of Detail (LOD)?", field: "Game Development", answer: "Lower detail models used when objects are far to improve performance." },
  { text: "How do physics engines work?", field: "Game Development", answer: "Simulate collisions and motion using math models." },
  { text: "What is a sprite?", field: "Game Development", answer: "A 2D image used in games for characters and objects." }
];

// Determine all unique fields for the filter buttons
// This automatically extracts fields from your array - just add questions and they appear!
const allFields = ["All Fields", ...new Set(initialQuestions.map(q => q.field))];

const InterviewQuestions = () => {
  const [selectedField, setSelectedField] = useState(allFields[0]);
  const [questions] = useState(initialQuestions);
  const [visible, setVisible] = useState([]);
  const [openAnswerIndex, setOpenAnswerIndex] = useState(null);
  const scrollRef = useRef(null);

  // Function to toggle answer visibility
  const toggleAnswer = (index) => {
    setOpenAnswerIndex(openAnswerIndex === index ? null : index);
  };

  // Filter questions based on selected field
  const filteredQuestions = useMemo(() => {
    if (selectedField === "All Fields") {
      console.log(`Showing all ${questions.length} questions across ${allFields.length - 1} fields`);
      return questions;
    }
    const fieldQuestions = questions.filter(q => q.field === selectedField);
    console.log(`Showing ${fieldQuestions.length} questions for ${selectedField}`);
    return fieldQuestions;
  }, [selectedField, questions]);

  // Handle staggered animation when filter changes
  useEffect(() => {
    setVisible([]);
    setOpenAnswerIndex(null);
    
    filteredQuestions.forEach((_, i) => {
      setTimeout(() => {
        setVisible((v) => [...v, i]);
      }, i * 60);
    });
    
    return () => setVisible([]);
  }, [filteredQuestions]);

  // Scroll functions for field navigation
  const scrollLeft = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  }, []);

  // Touch swipe handlers for mobile
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const currentIndex = allFields.indexOf(selectedField);
    if (touchEndX.current < touchStartX.current - 50 && currentIndex < allFields.length - 1) {
      setSelectedField(allFields[currentIndex + 1]);
    }
    if (touchEndX.current > touchStartX.current + 50 && currentIndex > 0) {
      setSelectedField(allFields[currentIndex - 1]);
    }
  };

  return (
    <div 
      className="h-screen overflow-y-auto bg-gray-950 text-white font-sans scrollbar-hide"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">
        {/* Header with Stats */}
        <div className="text-center mb-10">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-gradient-x">
            Tech Interview Prep
          </h2>
          <p className="text-gray-400 text-lg font-light mb-2">
            Swipe left/right or use arrows to explore {allFields.length - 1} tech fields
          </p>
          <div className="flex justify-center gap-6 mt-4 text-sm text-gray-400">
            <span className="px-4 py-2 bg-gray-800 rounded-full">
              <span className="text-cyan-400 font-bold">{questions.length}</span> Total Questions
            </span>
            <span className="px-4 py-2 bg-gray-800 rounded-full">
              <span className="text-purple-400 font-bold">{allFields.length - 1}</span> Fields Covered
            </span>
            <span className="px-4 py-2 bg-gray-800 rounded-full">
              <span className="text-pink-400 font-bold">{filteredQuestions.length}</span> Currently Showing
            </span>
          </div>
        </div>

        {/* Enhanced Field Filter Bar */}
        <div className="sticky top-0 z-20 py-4 bg-gray-950/90 backdrop-blur-md border-b border-gray-800/50">
          <div className="flex items-center justify-between gap-4">
            {/* Left Arrow Button */}
            <button
              onClick={scrollLeft}
              className="flex-shrink-0 p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
            >
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Scrollable Field Container */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-2"
            >
              <div className="flex gap-3 w-max min-w-full justify-center">
                {/* All fields are automatically generated from your array */}
                {allFields.map((field) => (
                  <button
                    key={field}
                    onClick={() => setSelectedField(field)}
                    className={`snap-start px-6 py-3 text-sm font-semibold rounded-full whitespace-nowrap transition-all duration-300 transform
                      ${selectedField === field
                        ? "bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white shadow-xl shadow-purple-500/30 scale-105"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105 hover:text-white"
                      }`}
                  >
                    {field}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Arrow Button */}
            <button
              onClick={scrollRight}
              className="flex-shrink-0 p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
            >
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Question Grid - Shows ALL filtered questions automatically */}
        <div className="grid gap-6 mt-8 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {filteredQuestions.map((q, i) => {
            const isAnswerOpen = openAnswerIndex === i;
            return (
              <div
                key={`${q.field}-${i}`} // Improved key to handle duplicates
                className={`
                  relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 
                  transition-all duration-500 ease-out
                  ${visible.includes(i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                  ${isAnswerOpen 
                    ? "ring-2 ring-purple-500 shadow-2xl shadow-purple-500/20" 
                    : "hover:shadow-2xl hover:shadow-gray-900/40 hover:border-gray-700 hover:scale-[1.02]"
                  }
                `}
                onClick={() => toggleAnswer(i)}
              >
                {/* Top gradient bar */}
                <div className="h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
                
                <div className="p-6">
                  {/* Field Badge - Shows which field this question belongs to */}
                  <div className="inline-block px-3 py-1 rounded-full bg-gray-800 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
                    {q.field}
                  </div>

                  {/* Question Text */}
                  <p className="text-white font-semibold text-lg leading-relaxed mb-4">
                    {q.text}
                  </p>

                  {/* Answer Section (Accordion) */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isAnswerOpen ? "max-h-96 mt-4" : "max-h-0"
                    }`}
                  >
                    <div className="pt-4 border-t border-gray-800">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mr-3" />
                        <span className="text-purple-400 font-bold text-sm uppercase">Answer</span>
                      </div>
                      <p className="text-gray-300 leading-relaxed text-base">
                        {q.answer}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAnswer(i);
                    }}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 hover:gap-3 active:scale-95"
                  >
                    {isAnswerOpen ? "Hide Answer" : "View Answer"}
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isAnswerOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Empty State (only shows if filter returns nothing) */}
        {filteredQuestions.length === 0 && (
          <div className="text-center py-20 mt-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-800 mb-4">
              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.563M15 6.5a3 3 0 11-6 0 3 3 0 016 0zm6 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xl text-gray-400">No questions found for this field.</p>
            <p className="text-gray-500 mt-2">Try selecting a different category.</p>
          </div>
        )}
      </div>

      {/* Floating Action Button for quick field switch (mobile only) */}
      <button
        onClick={() => {
          const currentIndex = allFields.indexOf(selectedField);
          const nextIndex = (currentIndex + 1) % allFields.length;
          setSelectedField(allFields[nextIndex]);
        }}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white shadow-2xl shadow-purple-500/40 hover:scale-110 active:scale-95 transition-all duration-200 sm:hidden"
        aria-label="Next field"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>

      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-size: 200% 200%; background-position: left center; }
          50% { background-size: 200% 200%; background-position: right center; }
        }
        .animate-gradient-x { animation: gradient-x 3s ease infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default InterviewQuestions;