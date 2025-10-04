import React, { useState, useEffect } from "react";
// Using lucide-react for modern icons
import { Zap, BookOpen, MessageSquare, Code, Users, Map, X } from 'lucide-react'; 

// Data structure for the guidance cards
const guidanceCards = [
  {
    title: "Resume Building",
    description: "Craft a standout resume that passes ATS filters and impresses recruiters.",
    icon: BookOpen,
    color: "cyan",
    action: "Redirecting to Resume Builder...",
    link: "https://novoresume.com/resume-builder" 
  },
  {
    title: "Interview Preparation",
    description: "Practice mock interviews, common questions, and body-language tips.",
    icon: MessageSquare,
    color: "lime",
    action: "Launching Interview Simulator...",
    link: "https://www.pramp.com"
  },
  {
    title: "Aptitude & Reasoning",
    description: "Sharpen quantitative, logical, and verbal skills with timed quizzes.",
    icon: Zap,
    color: "fuchsia",
    action: "Starting Aptitude Quiz...",
    link: "https://www.indiabix.com/aptitude/questions-and-answers/"
  },
  {
    title: "Coding Practice",
    description: "Solve top interview problems and optimize time complexity.",
    icon: Code,
    color: "red",
    action: "Opening Coding Environment...",
    link: "https://leetcode.com"
  },
  {
    title: "Group Discussion",
    description: "Master GD etiquette, current affairs, and effective communication skills.",
    icon: Users,
    color: "amber",
    action: "Joining Group Discussion Session...",
    link: "https://gdtopics.com"
  },
  {
    title: "Career Mapping",
    description: "Discover roles that fit your skills and set a clear professional roadmap.",
    icon: Map,
    color: "blue",
    action: "Accessing Career Explorer...",
    link: "https://www.careerexplorer.com/careers/"
  },
];

// Reusable Notification component
const Notification = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-gray-700 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center space-x-3 animate-slide-down border border-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span>{message}</span>
        <button onClick={onClose} className="text-gray-400 hover:text-white ml-4">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Detail Modal Component for Expanded Content
const DetailModal = ({ card, onClose, triggerNotification }) => {
  if (!card) return null;

  const DetailIcon = card.icon;
  // Mock detailed content for demonstration
  const mockDetails = {
    "Resume Building": "This comprehensive guide provides step-by-step templates, keyword optimization tips, and a powerful list of action verbs to create an ATS-friendly resume. Focus on quantifiable achievements and tailoring your content for specific job descriptions.",
    "Interview Preparation": "Access a massive library of behavioral, technical, and system design interview questions. Includes video tutorials on confident body language, handling stress, and effective salary negotiation tactics.",
    "Aptitude & Reasoning": "Practice hundreds of mock tests covering quantitative aptitude, logical reasoning, and verbal ability, all timed to simulate real exam conditions. Get real-time scoring and detailed solution analysis to track your improvement.",
    "Coding Practice": "A curated, structured learning path of Data Structures and Algorithms problems categorized by complexity (Easy, Medium, Hard). Supports popular languages (Python, Java, C++) and features an integrated debugger.",
    "Group Discussion": "Learn key strategies for contributing effectively in a Group Discussion. Topics cover current affairs, business ethics, and social issues, with tips on leadership, active listening, and conflict resolution.",
    "Career Mapping": "An interactive tool to match your skills, interests, and academic background with potential career tracks (e.g., Software Engineer, Data Scientist, Product Manager). Includes required skill checklists and personalized learning roadmaps.",
  };

  // Determine button text based on card title
  const buttonText = card.title.includes('Quiz') || card.title.includes('Solve') || card.title.includes('Join') ? 'Start Session' : 'Go to Resource';
  
  // Tailwind classes for dark mode contrast
  const colorClasses = {
      'cyan': { background: 'bg-cyan-900/30', border: 'border-cyan-500', text: 'text-cyan-400', button: 'bg-cyan-600 hover:bg-cyan-500' },
      'lime': { background: 'bg-lime-900/30', border: 'border-lime-500', text: 'text-lime-400', button: 'bg-lime-600 hover:bg-lime-500' },
      'fuchsia': { background: 'bg-fuchsia-900/30', border: 'border-fuchsia-500', text: 'text-fuchsia-400', button: 'bg-fuchsia-600 hover:bg-fuchsia-500' },
      'red': { background: 'bg-red-900/30', border: 'border-red-500', text: 'text-red-400', button: 'bg-red-600 hover:bg-red-500' },
      'amber': { background: 'bg-amber-900/30', border: 'border-amber-500', text: 'text-amber-400', button: 'bg-amber-600 hover:bg-amber-500' },
      'blue': { background: 'bg-blue-900/30', border: 'border-blue-500', text: 'text-blue-400', button: 'bg-blue-600 hover:bg-blue-500' },
  }

  const currentColors = colorClasses[card.color] || colorClasses['cyan'];
  
  // New handler for the modal's primary button
  const handlePrimaryAction = () => {
    onClose(); 
    triggerNotification(card.action);
    if (card.link) {
      window.open(card.link, "_blank"); // Open in new tab
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg md:max-w-xl lg:max-w-2xl transform transition-all duration-300 overflow-hidden border border-gray-700 animate-zoom-in" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`p-6 md:p-8 ${currentColors.background} border-b-4 ${currentColors.border} flex items-center`}>
          <DetailIcon className={`w-8 h-8 md:w-10 md:h-10 ${currentColors.text} mr-4`} />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-50">{card.title}</h2>
        </div>
        
        {/* Modal Content */}
        <div className="p-6 md:p-8">
          <p className="text-gray-300 mb-6 leading-relaxed text-base">
            {mockDetails[card.title] || "Detailed information for this guide is currently unavailable."}
          </p>
          
          <p className="font-semibold text-gray-100 mb-4 text-lg">Next Step:</p>
          
          <div className="p-4 bg-gray-900 rounded-lg text-sm text-gray-400 italic border border-gray-700">
            {card.action}
          </div>
        </div>
        
        {/* Modal Footer (Actions) */}
        <div className="p-6 md:p-8 flex justify-between bg-gray-900 border-t border-gray-700">
          <button
            onClick={onClose}
            className="text-gray-400 font-semibold px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition duration-300"
          >
            Close
          </button>
          <button
            onClick={handlePrimaryAction} 
            className={`text-white px-6 py-3 rounded-lg font-semibold transition duration-300 shadow-lg ${currentColors.button}`}
          >
            {buttonText} →
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const PlacementGuide = () => {
  const [notification, setNotification] = useState('');
  const [selectedCard, setSelectedCard] = useState(null); 

  // Effect to hide the notification automatically
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification('');
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Generic handler for all card actions
  const handleCardAction = (card) => {
    setSelectedCard(card); // Open the detail modal
  };

  // Handler for the main CTA button
  const handleCtaAction = () => {
    setNotification("Booking session... Please check your email for confirmation!");
  };

  return (
    <div className="min-h-screen bg-gray-950 py-10 px-4 font-sans relative">
      <style jsx global>{`
        @keyframes slide-down {
          0% { transform: translate(-50%, -100%); opacity: 0; }
          100% { transform: translate(-50%, 0); opacity: 1; }
        }
        .animate-slide-down { animation: slide-down 0.3s ease-out forwards; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        @keyframes zoom-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-zoom-in { animation: zoom-in 0.3s ease-out forwards; }
        @keyframes card-fade-up { to { opacity: 1; transform: translateY(0); } }
        .card-enter-animation { opacity: 0; transform: translateY(20px); animation: card-fade-up 0.5s ease-out forwards; }
        .card-1 { animation-delay: 0.1s; }
        .card-2 { animation-delay: 0.2s; }
        .card-3 { animation-delay: 0.3s; }
        .card-4 { animation-delay: 0.4s; }
        .card-5 { animation-delay: 0.5s; }
        .card-6 { animation-delay: 0.6s; }
      `}</style>
      
      <Notification message={notification} onClose={() => setNotification('')} />
      <DetailModal card={selectedCard} onClose={() => setSelectedCard(null)} triggerNotification={setNotification} />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tighter drop-shadow-lg animate-fade-in">
            PLACEMENT <span className="text-fuchsia-500">ACCELERATOR</span>
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
            Structured, clear, and actionable steps to help you land your dream tech job.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {guidanceCards.map((card, index) => {
            const iconClasses = `text-${card.color}-400`;
            const buttonClasses = `text-${card.color}-400 font-medium text-sm hover:text-${card.color}-300 transition duration-200`;

            return (
              <div
                key={index}
                className={`bg-gray-900 rounded-xl shadow-2xl hover:shadow-fuchsia-900/40 transition-all duration-300 p-6 border-t border-l border-gray-700/50 hover:scale-[1.03] hover:-translate-y-1 card-enter-animation card-${index + 1}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`${iconClasses} mb-4`}>
                  <card.icon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-50 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {card.description}
                </p>
                <button 
                  onClick={() => handleCardAction(card)} 
                  className={buttonClasses}
                >
                  {card.title.includes('Quiz') || card.title.includes('Solve') || card.title.includes('Join') ? 'Start Now →' : 'Learn More →'}
                </button>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <button 
            onClick={handleCtaAction}
            className="bg-fuchsia-600 text-white px-10 py-5 rounded-xl font-bold text-xl shadow-2xl shadow-fuchsia-500/70 hover:bg-fuchsia-500 transition duration-300 transform hover:scale-[1.04] active:scale-100 uppercase tracking-wider"
          >
            Book a Free Counseling Session
          </button>
          <p className="mt-6 text-sm text-gray-500">
            Click here to connect with a placement expert and map your career path today.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlacementGuide;
