// StudentDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

// Helper function for time formatting
const formatPostTime = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();
  const diffInMinutes = Math.round((now - date) / (1000 * 60));

  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInMinutes < 24 * 60) return `${Math.round(diffInMinutes / 60)} hours ago`;
  return date.toLocaleDateString();
};

export default function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  // Enhanced user data
  const [user] = useState({
    name: "Alex Carter",
    email: "alex@example.com",
    avatar: "https://i.pravatar.cc/150?u=alex",
    joined: "Jan 2024",
    courses: 5,
    completedAssignments: 12,
    pendingAssignments: 3,
    points: 1420,
    streak: 7,
    level: "Intermediate"
  });

  const navItems = [
    { label: "My Courses", icon: "📚", path: "/student/courses", badge: user.courses },
    { label: "Assignments", icon: "📝", path: "/student/assignments", badge: user.pendingAssignments },
    { label: "Resources", icon: "📁", path: "/student/resources", badge: null },
    { label: "Progress", icon: "📊", path: "/student/progress", badge: null },
    { label: "Community", icon: "💬", path: "/student/community", badge: 3 },
  ];

  // Fetch notifications and posts
  useEffect(() => {
    setLoading(true);
    let notificationsFinished = false;
    let postsFinished = false;

    const checkAndSetLoading = () => {
      if (notificationsFinished && postsFinished) {
        setLoading(false);
      }
    };

    // Fetch notifications
    setTimeout(() => {
      setNotifications([
        { id: 1, message: "New assignment available", time: "5 min ago", unread: true, type: "assignment" },
        { id: 2, message: "Course updated: React Advanced", time: "1 hour ago", unread: true, type: "course" },
        { id: 3, message: "Your submission graded", time: "2 hours ago", unread: false, type: "grade" },
      ]);
      notificationsFinished = true;
      checkAndSetLoading();
    }, 1000);

    // Fetch posts
    setTimeout(() => {
      setPosts([
        {
          _id: 1,
          author: { name: "Sarah Johnson", avatar: "https://i.pravatar.cc/150?u=sarah" },
          content: "Just completed the React Advanced course! The hooks section was incredibly helpful. 🎉",
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          likes: 24,
          comments: 8,
          tags: ["React", "Web Development"]
        },
        {
          _id: 2,
          author: { name: "Mike Chen", avatar: "https://i.pravatar.cc/150?u=mike" },
          content: "Working on my final project for the Full Stack course. Anyone want to collaborate?",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          likes: 15,
          comments: 12,
          tags: ["Full Stack", "Collaboration"]
        }
      ]);
      postsFinished = true;
      checkAndSetLoading();
    }, 1500);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Glassmorphism Header with Profile on Top Right */}
      <header className="relative bg-white/70 backdrop-blur-lg border-b border-white/20 shadow-lg z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center gap-8">
            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              🎓 EduMedia
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 transition-colors group ${
                    location.pathname.startsWith(item.path) ? "text-indigo-600 font-bold border-b-2 border-indigo-600" : "text-gray-700 hover:text-indigo-600"
                  }`}
                >
                  <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side - Profile and Notifications */}
          <div className="flex items-center gap-4">
            {/* Notifications with Dropdown */}
            <div className="relative group">
              <button className="relative p-2 bg-white/50 backdrop-blur-sm rounded-full hover:bg-white/70 transition-all">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 00-6 6v2.25l-2.25 2.25v2.25h16.5v-2.25L16.5 12V9.75a6 6 0 00-6-6z" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {/* Notification Dropdown */}
              <div className="absolute right-0 mt-2 w-80 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 origin-top-right scale-95 group-hover:scale-100">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map(notif => (
                    <div key={notif.id} className={`p-4 hover:bg-gray-50 transition-colors ${notif.unread ? 'bg-indigo-50' : ''}`}>
                      <p className="text-sm text-gray-800">{notif.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-gray-200 text-center">
                    <Link to="/student/notifications" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View All</Link>
                </div>
              </div>
            </div>

            {/* Profile Dropdown - Top Right */}
            <div className="relative group">
              <button className="flex items-center gap-3 p-2 bg-white/50 backdrop-blur-sm rounded-full hover:bg-white/70 transition-all focus:outline-none">
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full border-2 border-indigo-200"
                />
                <div className="hidden lg:block text-left">
                  <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.level}</p>
                </div>
                <svg className="w-4 h-4 text-gray-600 hidden lg:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Dropdown */}
              <div className="absolute right-0 mt-2 w-64 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 origin-top-right scale-95 group-hover:scale-100">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt="avatar" className="w-12 h-12 rounded-full" />
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between text-sm">
                    <div className="text-center">
                      <p className="font-bold text-indigo-600">{user.points}</p>
                      <p className="text-gray-500">Points</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-green-600">{user.streak}</p>
                      <p className="text-gray-500">Streak</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-purple-600">{user.courses}</p>
                      <p className="text-gray-500">Courses</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <Link to="/profile" className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition flex items-center gap-2">
                    👤 View Profile
                  </Link>
                  <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition flex items-center gap-2">
                    ⚙️ Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-2"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Mobile Navigation */}
        <nav className="md:hidden flex justify-around border-t border-white/30 py-2 bg-white/70 backdrop-blur-lg">
          {navItems.slice(0, 4).map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-1 text-sm transition-colors ${
                location.pathname.startsWith(item.path) ? "text-indigo-600 font-bold" : "text-gray-700 hover:text-indigo-600"
              }`}
            >
              <span className="text-xl relative">
                {item.icon}
                {item.badge > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center p-[2px] animate-pulse">
                    {item.badge}
                  </span>
                )}
              </span>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </nav>
      </header>

      {/* Main Content Area - Full Width Posts Below Streak */}
      <main className="max-w-7xl mx-auto flex-1 p-6 relative">
        {/* Welcome Section with Streak */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-8 rounded-2xl shadow-2xl relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent" />
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white/30 rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(' ')[0]}! 🎉</h2>
              <p className="text-lg opacity-90 mb-4">You're doing great! Keep up the momentum.</p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-sm opacity-75">Current Streak</p>
                  <p className="text-2xl font-bold">{user.streak} days 🔥</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-sm opacity-75">Total Points</p>
                  <p className="text-2xl font-bold">{user.points.toLocaleString()}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-sm opacity-75">Active Courses</p>
                  <p className="text-2xl font-bold">{user.courses}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Community Posts Section - Below Streak */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Community Feed</h3>
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
              + New Post
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">No posts yet</h4>
              <p className="text-gray-600">Be the first to share something with the community!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post, index) => (
                <div
                  key={post._id}
                  className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 transform hover:scale-[1.01] transition-all duration-300 hover:shadow-xl"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Post Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={post.author?.avatar || `https://i.pravatar.cc/150?u=${post.author?.name}`}
                      alt={post.author?.name}
                      className="w-12 h-12 rounded-full border-2 border-indigo-200"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-800">{post.author?.name}</h4>
                        <span className="text-gray-500 text-sm">
                          {formatPostTime(post.createdAt)}
                        </span>
                      </div>
                      {post.tags && (
                        <div className="flex gap-2 mt-1">
                          {post.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-xs font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-gray-800 leading-relaxed mb-4">{post.content}</p>

                  {/* Post Actions */}
                  <div className="flex items-center gap-6 text-gray-500">
                    <button className="flex items-center gap-2 hover:text-indigo-600 transition-colors group">
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-sm font-medium">{post.likes || 0}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-indigo-600 transition-colors group">
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="text-sm font-medium">{post.comments || 0}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-indigo-600 transition-colors group">
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      <span className="text-sm font-medium">Share</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Outlet />
        </div>
      </main>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .delay-700 {
          animation-delay: 0.7s;
        }
      `}</style>
    </div>
  );
}