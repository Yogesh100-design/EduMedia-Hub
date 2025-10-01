import React, { useState, useMemo } from 'react';
import { Search, Filter, Code, Map, Briefcase, Zap, BookOpen, Video, FileText, Gift, Heart, Send, CheckCircle, Download, ChevronLeft, ChevronRight, Target, Cloud, HardHat, DollarSign } from 'lucide-react';

// --- MOCK DATA (Fully Detailed) ---

const mockQuestions = [
  { id: 1, topic: 'Data Structures', difficulty: 'Hard', title: 'Find the maximum subarray sum (Kadane\'s Algorithm).', 
    answer: `\`\`\`python
def maxSubArray(nums):
    max_so_far = nums[0]
    current_max = nums[0]
    for i in range(1, len(nums)):
        current_max = max(nums[i], current_max + nums[i])
        max_so_far = max(max_so_far, current_max)
    return max_so_far
\`\`\`
Kadane's algorithm runs in O(N) time complexity.`,
    isPopular: true, isNew: false 
  },
  { id: 2, topic: 'Frontend', difficulty: 'Medium', title: 'Explain the React Component Lifecycle and Hooks equivalents.', 
    answer: 'Mounting, Updating, Unmounting. Key Hooks: useEffect, useState, Context API.', 
    isPopular: true, isNew: true 
  },
  { id: 3, topic: 'HR', difficulty: 'Easy', title: 'Tell me about a time you failed or made a mistake.', 
    answer: 'Underestimated database migration; quickly communicated, involved DBA, and created a checklist.', 
    isPopular: false, isNew: true 
  },
  { id: 4, topic: 'Backend', difficulty: 'Hard', title: 'Describe database index types and tradeoffs (B-Tree vs. Hash).', 
    answer: 'B-Tree: good for range queries; Hash: fast exact matches; choose based on workload.', 
    isPopular: false, isNew: false 
  },
  { id: 5, topic: 'System Design', difficulty: 'Hard', title: 'Design a scalable URL Shortening Service (e.g., Bitly).', 
    answer: 'APIs, Database, Unique ID generator, CDN/cache layer (Redis) for fast redirection.', 
    isPopular: true, isNew: true 
  },
  { id: 6, topic: 'Data Structures', difficulty: 'Medium', title: 'Difference between BFS and DFS traversal.', 
    answer: 'BFS: layer by layer, shortest path; DFS: depth-first, stack/recursion, memory efficient.', 
    isPopular: false, isNew: false 
  },
  { id: 7, topic: 'HR', difficulty: 'Medium', title: 'How do you handle conflict in a cross-functional team?', 
    answer: 'Act as mediator, focus on project goals, ensure all voices are heard, compromise for progress.', 
    isPopular: false, isNew: true 
  },
  { id: 8, topic: 'Backend', difficulty: 'Medium', title: 'Explain ACID properties in database transactions.', 
    answer: 'Atomicity, Consistency, Isolation, Durability; ensures reliable DB transactions.', 
    isPopular: true, isNew: false 
  },
  { id: 9, topic: 'Frontend', difficulty: 'Hard', title: 'Optimize a massive list rendering in React.', 
    answer: 'Use virtualization (react-window/react-virtualized) to render only visible items.', 
    isPopular: true, isNew: true 
  },
  { id: 10, topic: 'System Design', difficulty: 'Medium', title: 'Design a chat application with real-time messaging.', 
    answer: 'Use WebSockets, scalable DB, message queues (Kafka/RabbitMQ), load balancers, and caching.', 
    isPopular: true, isNew: true 
  },
  { id: 11, topic: 'Frontend', difficulty: 'Easy', title: 'Difference between inline, block, and inline-block elements.', 
    answer: 'Inline: flows in text; Block: full width; Inline-block: inline but can have width/height.', 
    isPopular: false, isNew: false 
  },
  { id: 12, topic: 'Backend', difficulty: 'Medium', title: 'Explain JWT-based authentication flow.', 
    answer: 'Server issues token, client stores and sends it in headers; server validates on each request.', 
    isPopular: true, isNew: true 
  },
];

const mockRoadmaps = {
  Frontend: [
    'HTML/CSS Semantics & Accessibility', 
    'JavaScript ES12+ Deep Dive', 
    'React (Hooks, Context, Router)', 
    'Modern State Management (Redux/Zustand)', 
    'Unit & E2E Testing (Jest/Cypress)', 
    'Performance Optimization & Web Vitals', 
    'Deployment (Vercel/Netlify)', 
    'Next.js & SSR', 
    'TypeScript Basics'
  ],
  Backend: [
    'Core Language (Python/Node.js/Go)', 
    'Relational & NoSQL Databases', 
    'RESTful API Design & Best Practices', 
    'Microservices Architecture', 
    'Authentication (OAuth, JWT)', 
    'Caching Strategies (Redis/Memcached)', 
    'Load Balancing & Scaling', 
    'GraphQL Basics', 
    'Message Queues (RabbitMQ/Kafka)'
  ],
  Fullstack: [
    'Frontend + Backend Fundamentals', 
    'Database & ORM Integration', 
    'CI/CD Pipelines (GitHub Actions/Jenkins)', 
    'Cloud Services Deployment (AWS/Azure)', 
    'System Design Basics (CAP Theorem)', 
    'End-to-End Application Security', 
    'Docker & Kubernetes Basics'
  ],
  DevOps: [
    'Linux & Shell Scripting', 
    'Cloud Fundamentals (AWS VPC, EC2, S3)', 
    'Containerization (Docker & Compose)', 
    'Orchestration (Kubernetes/EKS)', 
    'Configuration Management (Ansible/Terraform)', 
    'Monitoring & Logging (Prometheus/Grafana)', 
    'CI/CD Automation & GitOps', 
    'Infrastructure as Code', 
    'Security Best Practices'
  ],
};

const mockQuotes = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "Strive not to be a success, but rather to be of value. - Albert Einstein",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "The difference between the impossible and the possible lies in a person's determination. - Tommy Lasorda",
  "If you want to lift yourself up, lift up someone else. - Booker T. Washington",
  "It does not matter how slowly you go as long as you do not stop. - Confucius",
  "The best way to predict the future is to create it. - Peter Drucker",
  "Don’t watch the clock; do what it does. Keep going. - Sam Levenson",
  "Quality is not an act, it is a habit. - Aristotle"
];

const mockResources = [
  { name: 'LeetCode', type: 'Platform', description: 'Practice coding interview questions with a focus on DSA.', icon: <Code className="w-5 h-5 text-green-600"/> },
  { name: 'System Design Interview', type: 'Book/Blog', description: 'In-depth case studies for designing large-scale systems.', icon: <BookOpen className="w-5 h-5 text-indigo-600"/> },
  { name: 'freeCodeCamp', type: 'Course', description: 'Comprehensive free courses on web development and CS.', icon: <Video className="w-5 h-5 text-red-600"/> },
  { name: 'MDN Web Docs', type: 'Documentation', description: 'The definitive reference for HTML, CSS, and JavaScript.', icon: <FileText className="w-5 h-5 text-blue-600"/> },
  { name: 'AWS Documentation', type: 'Cloud', description: 'Official guides for cloud computing fundamentals and services.', icon: <Cloud className="w-5 h-5 text-orange-600"/> },
  { name: 'Design Patterns Refactoring', type: 'Blog/Book', description: 'Understanding and implementing common software design patterns.', icon: <HardHat className="w-5 h-5 text-gray-800"/> },
  { name: 'InterviewBit', type: 'Platform', description: 'Learn coding, DSA, and interview preparation systematically.', icon: <Code className="w-5 h-5 text-purple-600"/> },
];

const mockPapers = [
  { company: 'Google', title: 'Data Structures Round 1 & 2 (2023)', type: 'Coding', level: 'Hard' },
  { company: 'Microsoft', title: 'Behavioral & HR Questions (2024)', type: 'Behavioral', level: 'Medium' },
  { company: 'Amazon', title: 'L5 System Design Deep Dive', type: 'System Design', level: 'Hard' },
  { company: 'Goldman Sachs', title: 'Quantitative Aptitude Test', type: 'Aptitude', level: 'Medium' },
  { company: 'Facebook', title: 'Frontend & React Assessment (2023)', type: 'Coding', level: 'Medium' },
  { company: 'Apple', title: 'Software Engineering Interview (2023)', type: 'Behavioral + Coding', level: 'Hard' },
];


// --- SUB-COMPONENTS ---

/**
 * Helper component for displaying difficulty badge
 */
const DifficultyBadge = ({ difficulty }) => {
    let colorClass = '';
    switch (difficulty) {
        case 'Hard':
            colorClass = 'bg-red-100 text-red-700';
            break;
        case 'Medium':
            colorClass = 'bg-orange-100 text-orange-700';
            break;
        case 'Easy':
            colorClass = 'bg-green-100 text-green-700';
            break;
        default:
            colorClass = 'bg-gray-100 text-gray-700';
    }
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}>
            {difficulty}
        </span>
    );
};

/**
 * 1. Interview Q&A Section
 */
const InterviewQnASection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTopic, setFilterTopic] = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [activeQuestion, setActiveQuestion] = useState(mockQuestions[0].id);

  // Dynamically generate topics and difficulties from the full mock list
  const topics = ['All', ...new Set(mockQuestions.map(q => q.topic))];
  const difficulties = ['All', ...new Set(mockQuestions.map(q => q.difficulty))];
  
  const filteredQuestions = useMemo(() => {
    return mockQuestions
      .filter(q => filterTopic === 'All' || q.topic === filterTopic)
      .filter(q => filterDifficulty === 'All' || q.difficulty === filterDifficulty)
      .filter(q => q.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, filterTopic, filterDifficulty]);

  const activeQ = mockQuestions.find(q => q.id === activeQuestion);

  return (
    <div className="bg-white shadow-2xl rounded-2xl p-6 md:p-10 mb-12 border-t-8 border-indigo-600">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-2 flex items-center">
        <BookOpen className="w-8 h-8 mr-3 text-indigo-600"/> Interview Q&A Bank
      </h2>
      <p className="text-gray-500 mb-8">Master 100+ essential questions across core engineering domains.</p>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-gray-50 p-4 rounded-xl shadow-inner">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions by keyword or concept..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3.5 pl-10 border border-gray-300 rounded-xl focus:ring-teal-500 focus:border-teal-500 transition"
          />
        </div>
        <select
          value={filterTopic}
          onChange={(e) => setFilterTopic(e.target.value)}
          className="p-3.5 border border-gray-300 rounded-xl w-full md:w-1/4 focus:ring-teal-500 focus:border-teal-500 transition bg-white"
        >
          {topics.map(t => <option key={t} value={t}>{t === 'All' ? 'All Topics' : t}</option>)}
        </select>
        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="p-3.5 border border-gray-300 rounded-xl w-full md:w-1/4 focus:ring-teal-500 focus:border-teal-500 transition bg-white"
        >
          {difficulties.map(d => <option key={d} value={d}>{d === 'All' ? 'All Difficulty' : d}</option>)}
        </select>
      </div>

      {/* Stats and Tags */}
      <div className="flex flex-wrap gap-6 mb-8 text-sm font-medium">
        <span className="flex items-center text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
          <Zap className="w-4 h-4 mr-1"/> High Demand: {mockQuestions.filter(q => q.isPopular).length} Questions
        </span>
        <span className="flex items-center text-teal-600 bg-teal-50 p-2 rounded-lg border border-teal-200">
          <CheckCircle className="w-4 h-4 mr-1"/> Added This Month: {mockQuestions.filter(q => q.isNew).length} Questions
        </span>
        <span className="flex items-center text-indigo-600 bg-indigo-50 p-2 rounded-lg border border-indigo-200">
          <Code className="w-4 h-4 mr-1"/> Total Q's: {mockQuestions.length}
        </span>
      </div>

      {/* Question List and Detail View */}
      <div className="grid md:grid-cols-5 gap-6">
        {/* Question List */}
        <div className="md:col-span-2 max-h-[500px] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 sticky top-0 bg-white pt-1">Filtered Results ({filteredQuestions.length})</h3>
          <div className="space-y-3">
            {filteredQuestions.length > 0 ? filteredQuestions.map(q => (
              <div
                key={q.id}
                onClick={() => setActiveQuestion(q.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${activeQuestion === q.id ? 'bg-indigo-100 border-indigo-500 shadow-lg' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'}`}
              >
                <p className={`font-bold ${activeQuestion === q.id ? 'text-indigo-800' : 'text-gray-700'}`}>{q.title}</p>
                <div className="flex justify-between items-center text-xs mt-2">
                  <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 font-medium">{q.topic}</span>
                  <DifficultyBadge difficulty={q.difficulty} />
                </div>
              </div>
            )) : (
                <p className="text-gray-500 italic p-4">No questions match your criteria.</p>
            )}
          </div>
        </div>

        {/* Answer Detail */}
        <div className="md:col-span-3">
          {activeQ ? (
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 max-h-[500px] overflow-y-auto shadow-inner">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{activeQ.title}</h3>
              <div className="flex space-x-3 mb-4">
                  <DifficultyBadge difficulty={activeQ.difficulty} />
                  <span className="text-sm font-medium text-gray-600">{activeQ.topic}</span>
              </div>
              
              <h4 className="text-xl font-semibold text-indigo-600 mb-2 mt-6 border-b pb-1">Detailed Explanation:</h4>
              <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-sm font-mono shadow-xl">
                <code>{activeQ.answer}</code>
              </pre>

              <p className="text-sm text-gray-500 mt-4 italic border-t pt-4">Tip: Always discuss time and space complexity when answering coding questions. For HR questions, use the STAR method.</p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 italic p-10 bg-gray-50 rounded-xl border">
              <BookOpen className="w-6 h-6 mr-2"/> Select a question from the list to view its complete, detailed answer.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * 2. Placement Guidance Section
 */
const PlacementGuidanceSection = () => (
  <div className="bg-white shadow-2xl rounded-2xl p-6 md:p-10 mb-12 border-l-8 border-teal-600">
    <h2 className="text-4xl font-extrabold text-gray-800 mb-2 flex items-center">
      <Briefcase className="w-8 h-8 mr-3 text-teal-600"/> Strategic Placement Guidance
    </h2>
    <p className="text-gray-500 mb-8">Essential guides, video lectures, and practice materials for a smooth transition to the industry.</p>

    <div className="grid md:grid-cols-3 gap-8">
      {/* Video Tutorials */}
      <div className="col-span-1">
        <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center border-b pb-2">
          <Video className="w-5 h-5 mr-2 text-red-500"/> Core Interview Techniques
        </h3>
        <div className="bg-gray-100 p-4 rounded-xl shadow-md">
          <p className="font-medium text-gray-800 mb-3">Featured Video: Behavioral Interview Deep Dive</p>
          <div className="aspect-video bg-gray-300 rounded-lg flex items-center justify-center text-sm text-gray-600 mb-3">
            [Embedded Video Player Placeholder: Mastering STAR Method]
          </div>
          <a href="#" className="text-sm text-teal-600 hover:text-teal-800 font-bold block transition">
            Access Full Prep Video Library →
          </a>
        </div>
      </div>

      {/* Checklist */}
      <div className="col-span-1">
        <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center border-b pb-2">
          <FileText className="w-5 h-5 mr-2 text-yellow-600"/> Final Pre-Interview Checklist
        </h3>
        <ul className="space-y-3">
          {['Resume & Cover Letter Polished', 'System Design Topologies Covered', 'Portfolio/GitHub Repository Ready', 'Behavioral Answers Documented (STAR)', 'Target Company Research Completed'].map((item, index) => (
            <li key={index} className="flex items-start text-gray-700 bg-yellow-50 p-3 rounded-xl border border-yellow-200 shadow-sm">
              <CheckCircle className="w-5 h-5 mr-3 mt-0.5 text-yellow-600 flex-shrink-0"/>
              <span className="font-medium">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Salary Negotiation Guide */}
      <div className="col-span-1">
        <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center border-b pb-2">
          <DollarSign className="w-5 h-5 mr-2 text-green-600"/> Salary Negotiation Guide
        </h3>
        <div className="bg-green-50 p-4 rounded-xl border border-green-200 shadow-md">
            <p className="text-sm text-gray-700 mb-3">Download our step-by-step guide to negotiating your first professional offer successfully. Know your worth!</p>
            <a href="#" className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-full shadow-lg hover:bg-green-700 transition duration-150 transform hover:scale-[1.02]">
                Download Salary Guide <Download className="w-4 h-4 ml-2"/>
            </a>
        </div>
        <p className="text-xs text-gray-400 mt-2">Average entry-level tech salary data available upon login.</p>
      </div>
    </div>
    
    {/* Placement Papers Links */}
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-2xl font-bold text-gray-700 mb-4 flex items-center">
          <FileText className="w-6 h-6 mr-2 text-indigo-500"/> Previous Year Placement Papers
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {mockPapers.map((paper, index) => (
            <a key={index} href="#" className="flex flex-col items-start p-3 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition duration-150 border border-indigo-200">
              <p className="text-sm font-bold text-indigo-700">{paper.company}</p>
              <p className="text-xs text-gray-600 mb-1">{paper.title}</p>
              <DifficultyBadge difficulty={paper.level} />
            </a>
        ))}
      </div>
    </div>
  </div>
);

/**
 * 3. Roadmaps Section
 */
const RoadmapsSection = () => {
  const [activeRoadmap, setActiveRoadmap] = useState('Frontend');
  const [progress, setProgress] = useState({});

  const currentSteps = mockRoadmaps[activeRoadmap] || [];
  const totalSteps = currentSteps.length;
  const completedSteps = Object.values(progress).filter(Boolean).length;
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const toggleProgress = (index) => {
    setProgress(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="bg-white shadow-2xl rounded-2xl p-6 md:p-10 mb-12 border-l-8 border-indigo-600">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-2 flex items-center">
        <Map className="w-8 h-8 mr-3 text-indigo-600"/> Structured Career Roadmaps
      </h2>
      <p className="text-gray-500 mb-8">Select a path to view detailed milestones and track your personal progress toward specialization.</p>
      
      {/* Roadmap Selector */}
      <div className="flex flex-wrap gap-4 mb-8 border-b pb-4">
        {Object.keys(mockRoadmaps).map(mapName => (
          <button
            key={mapName}
            onClick={() => { setActiveRoadmap(mapName); setProgress({}); }}
            className={`px-5 py-2 text-base font-bold rounded-full transition duration-200 shadow-md ${
              activeRoadmap === mapName
                ? 'bg-indigo-600 text-white ring-4 ring-indigo-300 transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {mapName}
          </button>
        ))}
      </div>
      
      <h3 className="text-3xl font-bold text-gray-700 mb-4 flex items-center">
        <Target className="w-6 h-6 mr-2 text-indigo-500"/> {activeRoadmap} Development Path
      </h3>

      {/* Progress Bar */}
      <div className="mb-10 bg-indigo-50 p-4 rounded-xl border border-indigo-200">
        <p className="text-lg font-bold text-gray-800 mb-2">Completion Status: {completedSteps}/{totalSteps} steps completed</p>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-indigo-600 h-3 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm font-medium text-indigo-500 mt-2">{Math.round(progressPercentage)}% Target Achieved</p>
      </div>

      {/* Steps List (Timeline) */}
      <ol className="relative border-l-4 border-gray-300 ml-6 space-y-8">                  
        {currentSteps.map((step, index) => (
          <li key={index} className="ml-8">
            <span 
              onClick={() => toggleProgress(index)}
              className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-8 ring-white cursor-pointer transition-colors duration-200 shadow-md ${
                progress[index] ? 'bg-green-500 hover:bg-green-600' : 'bg-indigo-200 hover:bg-indigo-300'
              }`}
              title={progress[index] ? 'Mark as Incomplete' : 'Mark as Complete'}
            >
              {progress[index] ? <CheckCircle className="w-5 h-5 text-white"/> : <HardHat className="w-5 h-5 text-indigo-600"/>}
            </span>
            <h4 className={`text-xl font-bold mb-1 ${progress[index] ? 'text-green-700' : 'text-gray-900'}`}>{step}</h4>
            <p className="text-sm text-gray-500">Milestone {index + 1}: Click the icon to update your completion status.</p>
          </li>
        ))}
      </ol>
    </div>
  );
};

/**
 * 4. Motivational Quotes Section
 */
const MotivationalQuotesSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextQuote = () => {
    setActiveIndex((prev) => (prev + 1) % mockQuotes.length);
  };

  const prevQuote = () => {
    setActiveIndex((prev) => (prev - 1 + mockQuotes.length) % mockQuotes.length);
  };

  return (
    <div className="bg-white shadow-2xl rounded-2xl p-6 md:p-10 mb-12 border-l-8 border-yellow-600">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-2 flex items-center">
        <Heart className="w-8 h-8 mr-3 text-yellow-600"/> Inspiration Corner
      </h2>
      <p className="text-gray-500 mb-8">Fuel your study sessions with daily motivation.</p>

      {/* Quote Carousel */}
      <div className="relative bg-yellow-50 p-8 rounded-xl text-center border-4 border-yellow-300 shadow-lg mb-6">
        <p className="text-2xl italic font-serif text-gray-800 min-h-[100px] flex items-center justify-center transition-opacity duration-500">
          "{mockQuotes[activeIndex].split(' - ')[0]}"
        </p>
        <p className="text-base font-bold text-yellow-800 mt-4 border-t pt-2">
          - {mockQuotes[activeIndex].split(' - ')[1]}
        </p>
        <button onClick={prevQuote} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-xl hover:bg-gray-100 transition transform hover:scale-110">
          <ChevronLeft className="w-6 h-6 text-yellow-600"/>
        </button>
        <button onClick={nextQuote} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-xl hover:bg-gray-100 transition transform hover:scale-110">
          <ChevronRight className="w-6 h-6 text-yellow-600"/>
        </button>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
            {mockQuotes.map((_, index) => (
                <div key={index} className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-yellow-600 w-4' : 'bg-gray-300'}`}></div>
            ))}
        </div>
      </div>

      {/* Daily Tip */}
      <div className="p-4 bg-yellow-100 rounded-lg border border-yellow-300 flex items-start shadow-inner">
        <Gift className="w-6 h-6 mr-3 mt-1 text-yellow-700 flex-shrink-0"/>
        <div>
            <p className="text-base text-gray-700 font-bold">Today's Focus Tip:</p>
            <p className="text-sm text-gray-600">
                Break down complex study topics into 25-minute **'Pomodoro' sessions**. Focus intensely during the session, and take a 5-minute break afterward. This maximizes retention and prevents burnout.
            </p>
        </div>
      </div>
    </div>
  );
};

/**
 * 5. Resources & Tools Section
 */
const ResourcesToolsSection = () => (
  <div className="bg-white shadow-2xl rounded-2xl p-6 md:p-10 mb-12 border-l-8 border-green-600">
    <h2 className="text-4xl font-extrabold text-gray-800 mb-2 flex items-center">
      <Target className="w-8 h-8 mr-3 text-green-600"/> Essential Resources & Tools
    </h2>
    <p className="text-gray-500 mb-8">Curated links to documentation, practice platforms, and industry blogs.</p>
    
    <h3 className="text-2xl font-bold text-gray-700 mb-6">Recommended Learning Channels</h3>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {mockResources.map((resource, index) => (
        <div key={index} className="p-4 bg-green-50 rounded-xl border border-green-200 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center mb-3">
              {resource.icon}
              <span className="ml-2 text-lg font-bold text-gray-800">{resource.name}</span>
            </div>
            <p className="text-sm text-gray-600">{resource.description}</p>
          </div>
          <a href="#" className="text-sm mt-3 block text-green-600 hover:text-green-800 font-semibold flex items-center">
            Go to Source <ChevronRight className="w-4 h-4 ml-1"/>
            <span className="ml-auto text-xs px-3 py-1 rounded-full bg-green-200 text-green-800">{resource.type}</span>
          </a>
        </div>
      ))}
    </div>

    <div className="pt-6 border-t border-gray-200">
      <h3 className="text-2xl font-bold text-gray-700 mb-4">Downloadable Cheat Sheets & Notes</h3>
      <div className="flex flex-wrap gap-4">
        {['React Hooks Cheat Sheet', 'SQL Query Basics PDF', 'Big O Notation Guide', 'Vim/Emacs Keybindings'].map((note, index) => (
            <a key={index} href="#" className="inline-flex items-center px-5 py-2 bg-gray-700 text-white text-sm font-bold rounded-full shadow-lg hover:bg-gray-800 transition duration-150 transform hover:scale-[1.02]">
                {note} <Download className="w-4 h-4 ml-2"/>
            </a>
        ))}
      </div>
    </div>
  </div>
);

/**
 * 6. Mock Interview Section
 */
const MockInterviewSection = () => (
  <div className="bg-white shadow-2xl rounded-2xl p-6 md:p-10 mb-12 border-l-8 border-red-600">
    <h2 className="text-4xl font-extrabold text-gray-800 mb-2 flex items-center">
      <Send className="w-8 h-8 mr-3 text-red-600"/> Mock Interview Simulation
    </h2>
    <p className="text-gray-500 mb-8">Your last hurdle before the actual interview. Get real-time feedback from experts.</p>

    <div className="grid md:grid-cols-3 gap-8">
      {/* Sign-up Form/Link */}
      <div className="md:col-span-2 bg-red-50 p-6 rounded-xl border border-red-200 shadow-inner">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Book Your Personalized Session</h3>
        <p className="text-base text-gray-600 mb-6">Choose your domain (Coding, System Design, or Behavioral) and schedule a 60-minute session with a verified industry mentor.</p>
        <a 
          href="#" 
          className="w-full md:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent text-lg font-bold rounded-full shadow-xl text-white bg-red-600 hover:bg-red-700 transition duration-150 transform hover:scale-105 ring-4 ring-red-200"
        >
          Schedule Mock Interview Now →
        </a>
      </div>

      {/* Preparation Checklist */}
      <div className="md:col-span-1 p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Interview Day Checklist</h3>
        <ul className="space-y-3">
          {['Test microphone/camera settings', 'Clear background and quiet space ensured', 'Dress professionally (business casual)', 'Have digital notepad/IDE ready', 'Review last 3 questions solved'].map((item, index) => (
            <li key={index} className="flex items-start text-sm text-gray-700">
              <CheckCircle className="w-5 h-5 mr-3 mt-0.5 text-green-500 flex-shrink-0"/>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);


// --- MAIN APP COMPONENT ---

export default function Career() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      {/* Header */}
      <header className="bg-white shadow-2xl p-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight">
              The Placement Prep Portal
            </h1>
            <p className="text-sm text-gray-500 mt-1">Your definitive source for interview excellence.</p>
          </div>
          <div className="hidden sm:block">
            <span className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full bg-teal-100 text-teal-800 shadow-inner">
                <Zap className="w-4 h-4 mr-2"/> Ready to Crush Interviews
            </span>
          </div>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="space-y-16">
          
          {/* Section 1: Interview Q&A */}
          <InterviewQnASection />
          
          {/* Section 2: Placement Guidance */}
          <PlacementGuidanceSection />
          
          {/* Section 3: Roadmaps */}
          <RoadmapsSection />
          
          {/* Section 4: Motivational Quotes */}
          <MotivationalQuotesSection />
          
          {/* Section 5: Resources & Tools */}
          <ResourcesToolsSection />
          
          {/* Section 6: Mock Interview */}
          <MockInterviewSection />

        </div>
      </main>
      
      {/* Footer */}
      <footer className="p-8 text-center text-sm text-gray-500 border-t border-gray-200 bg-white mt-12">
        <p>&copy; 2024 Career Prep Portal. Built with dedication for aspiring engineers.</p>
        <p className="mt-1 text-xs text-gray-400">Disclaimer: All resources are for educational and practice purposes only.</p>
      </footer>
    </div>
  );
}
