// Profile.jsx
import React, { useState, useEffect } from "react";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [profile, setProfile] = useState({
    name: "Alex Carter",
    email: "alex@example.com",
    bio: "Computer Science student passionate about web development and AI.",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "https://alexcarter.dev",
    github: "https://github.com/alexcarter",
    linkedin: "https://linkedin.com/in/alexcarter",
    avatar: "https://i.pravatar.cc/150?u=alex",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    dateOfBirth: "2000-03-15",
    gender: "Male",
    university: "Stanford University",
    major: "Computer Science",
    graduationYear: "2024",
    gpa: "3.8",
    interests: ["Web Development", "Machine Learning", "Blockchain", "UI/UX Design"],
    skills: ["React", "JavaScript", "Python", "Node.js", "MongoDB", "Tailwind CSS"],
    languages: ["English (Native)", "Spanish (Intermediate)", "French (Basic)"],
    achievements: [
      { title: "Dean's List", year: "2023", icon: "🏆" },
      { title: "Hackathon Winner", year: "2022", icon: "🥇" },
      { title: "Certified React Developer", year: "2023", icon: "📜" }
    ],
    stats: {
      coursesCompleted: 12,
      assignmentsSubmitted: 45,
      averageGrade: "A-",
      studyStreak: 7,
      totalPoints: 1420,
      rank: "Top 10%"
    }
  });

  const [editedProfile, setEditedProfile] = useState(profile);
  const [skillsInput, setSkillsInput] = useState("");
  const [interestsInput, setInterestsInput] = useState("");

  // Animated background effect
  useEffect(() => {
    const updateMousePosition = (ev) => {
      const cursor = document.getElementById("cursor-glow");
      if (cursor) {
        cursor.style.background = `radial-gradient(600px at ${ev.clientX}px ${ev.clientY}px, rgba(99, 102, 241, 0.15), transparent 80%)`;
      }
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setEditedProfile(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInterestAdd = () => {
    if (interestsInput && !editedProfile.interests.includes(interestsInput)) {
      setEditedProfile(prev => ({
        ...prev,
        interests: [...prev.interests, interestsInput]
      }));
      setInterestsInput("");
    }
  };

  const handleInterestRemove = (interest) => {
    setEditedProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleSkillAdd = () => {
    if (skillsInput && !editedProfile.skills.includes(skillsInput)) {
      setEditedProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skillsInput]
      }));
      setSkillsInput("");
    }
  };

  const handleSkillRemove = (skill) => {
    setEditedProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setProfile(editedProfile);
    setIsEditing(false);
    setLoading(false);
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    toast.textContent = 'Profile updated successfully!';
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 3000);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
    setAvatarPreview(null);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "👤" },
    { id: "education", label: "Education", icon: "🎓" },
    { id: "skills", label: "Skills", icon: "🛠️" },
    { id: "achievements", label: "Achievements", icon: "🏆" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative">
      <div id="cursor-glow" className="pointer-events-none fixed inset-0 transition duration-300 -z-0" />

      <div className="relative z-10 max-w-6xl mx-auto p-4 md:p-6">
        {/* Cover Image */}
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8 group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
          <img
            src={profile.coverImage}
            alt="Cover"
            className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
          />
          {isEditing && (
            <div className="absolute bottom-6 right-6 z-20">
              <label className="bg-white/90 hover:bg-white backdrop-blur-sm px-4 py-2 rounded-lg text-sm cursor-pointer transition-all hover:scale-105 shadow-lg">
                <span className="flex items-center gap-2">Change Cover</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setEditedProfile(prev => ({ ...prev, coverImage: reader.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
          )}
        </div>

        {/* Profile Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-8 transform hover:scale-[1.01] transition-all duration-300">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-300" />
              <img
                src={avatarPreview || profile.avatar}
                alt="Avatar"
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-2xl transform group-hover:scale-105 transition duration-300"
              />
              {isEditing && (
                <label className="absolute bottom-2 right-2 bg-indigo-600 text-white p-3 rounded-full cursor-pointer hover:bg-indigo-700 transition-all hover:scale-110 shadow-lg">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                  📷
                </label>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4 animate-fadeIn">
                  <input
                    type="text"
                    name="name"
                    value={editedProfile.name}
                    onChange={handleInputChange}
                    className="text-3xl md:text-4xl font-bold bg-transparent border-b-2 border-gray-300 focus:border-indigo-500 outline-none pb-2 w-full transition-all focus:scale-105"
                  />
                  <input
                    type="email"
                    name="email"
                    value={editedProfile.email}
                    onChange={handleInputChange}
                    className="text-gray-600 bg-transparent border-b border-gray-300 focus:border-indigo-500 outline-none pb-1 w-full"
                  />
                  <textarea
                    name="bio"
                    value={editedProfile.bio}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all focus:shadow-lg"
                    rows="4"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              ) : (
                <div className="animate-fadeIn">
                  <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    {profile.name}
                  </h1>
                  <p className="text-gray-600 text-lg">{profile.email}</p>
                  <p className="text-gray-700 mt-3 text-lg leading-relaxed">{profile.bio}</p>
                </div>
              )}

              <div className="flex gap-4 mt-6">
                {isEditing ? (
                  <>
                    <button onClick={handleSave} disabled={loading} className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all transform hover:scale-105 shadow-lg">
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button onClick={handleCancel} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all transform hover:scale-105">
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fadeIn">
          {activeTab === "overview" && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">👤 Personal Information</h2>
                <div className="space-y-4">
                  {[
                    { label: "Phone", name: "phone", value: editedProfile.phone },
                    { label: "Location", name: "location", value: editedProfile.location },
                    { label: "Date of Birth", name: "dateOfBirth", value: editedProfile.dateOfBirth, type: "date" },
                    { label: "Gender", name: "gender", value: editedProfile.gender, type: "select", options: ["Male", "Female", "Other", "Prefer not to say"] }
                  ].map(field => (
                    <div key={field.name} className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                      {isEditing ? (
                        field.type === "select" ? (
                          <select
                            name={field.name}
                            value={field.value}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all focus:shadow-lg"
                          >
                            {field.options.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type || "text"}
                            name={field.name}
                            value={field.value}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all focus:shadow-lg"
                          />
                        )
                      ) : (
                        <p className="text-gray-800 font-medium">{field.value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "education" && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">🎓 Education</h2>
                <div className="space-y-4">
                  {[
                    { label: "University", name: "university", value: editedProfile.university },
                    { label: "Major", name: "major", value: editedProfile.major },
                    { label: "Graduation Year", name: "graduationYear", value: editedProfile.graduationYear },
                    { label: "GPA", name: "gpa", value: editedProfile.gpa }
                  ].map(field => (
                    <div key={field.name} className="border-l-4 border-indigo-500 pl-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name={field.name}
                          value={field.value}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all focus:shadow-lg"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium text-lg">{field.value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">🛠️ Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {editedProfile.skills.map(skill => (
                    <span key={skill} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full flex items-center gap-2">
                      {skill}
                      {isEditing && (
                        <button onClick={() => handleSkillRemove(skill)} className="text-red-500 hover:text-red-700">×</button>
                      )}
                    </span>
                  ))}
                </div>
                {isEditing && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg outline-none"
                      placeholder="Add new skill"
                    />
                    <button onClick={handleSkillAdd} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Add</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">🏆 Achievements</h2>
                <ul className="space-y-3">
                  {editedProfile.achievements.map(a => (
                    <li key={a.title} className="flex items-center gap-3 bg-indigo-50 rounded-lg p-3 hover:shadow-md transition-all">
                      <span className="text-2xl">{a.icon}</span>
                      <div>
                        <p className="font-medium">{a.title}</p>
                        <p className="text-gray-500 text-sm">{a.year}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
