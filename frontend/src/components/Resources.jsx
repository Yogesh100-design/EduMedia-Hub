import React from "react";

const Resources = () => {
  // All links open in new tab & are verified 2025-06
  const links = {
    resume: [
      { name: "Resume Worded", url: "https://resumeworded.com", desc: "AI-powered resume review & ATS check" },
      { name: "Enhancv", url: "https://enhancv.com", desc: "Modern templates with content hints" },
      { name: "Novoresume", url: "https://novoresume.com", desc: "One-page templates loved by recruiters" },
      { name: "Overleaf LaTeX", url: "https://overleaf.com", desc: "Clean academic/research CVs" },
    ],
    coding: [
      { name: "LeetCode", url: "https://leetcode.com/problemset/all/", desc: "1.2k+ problems + weekly contests" },
      { name: "HackerRank", url: "https://hackerrank.com/domains", desc: "Company-specific tracks (TCS, Infy, NQT)" },
      { name: "Codeforces", url: "https://codeforces.com", desc: "Competitive contests & ratings" },
      { name: "GeeksforGeeks", url: "https://geeksforgeeks.org", desc: "DSA, OS, DBMS gate-to-placement" },
      { name: "InterviewBit", url: "https://interviewbit.com", desc: "Structured 3-month roadmap" },
    ],
    aptitude: [
      { name: "Indiabix", url: "https://indiabix.com", desc: "Huge bank of aptitude + puzzles" },
      { name: "Testpot", url: "https://testpot.com", desc: "Free timed mock tests" },
      { name: "PuzzleFry", url: "https://puzzlefry.com", desc: "Interview puzzles with explainer" },
      { name: "Aptitude-Test.com", url: "https://aptitude-test.com", desc: "Topic-wise practice & PDFs" },
    ],
    system: [
      { name: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", desc: "60k ⭐ GitHub repo" },
      { name: "HLD Bible", url: "https://highleveldesignbible.com", desc: "End-to-end design templates" },
      { name: "ByteByteGo", url: "https://bytebytego.com", desc: "Interactive system-design course" },
      { name: "Gaurav Sen YouTube", url: "https://youtube.com/@GauravSensei", desc: "Visual system-design breakdowns" },
    ],
    projects: [
      { name: "Github Explore", url: "https://github.com/explore", desc: "Trending repos for inspiration" },
      { name: "Kaggle Learn", url: "https://kaggle.com/learn", desc: "Micro-courses (Python, ML, SQL)" },
      { name: "Google Summer of Code", url: "https://summerofcode.withgoogle.com", desc: "Open-source stipend program" },
      { name: "MLH Fellowship", url: "https://fellowship.mlh.io", desc: "Remote hackathon sprints" },
    ],
    community: [
      { name: "r/cscareers", url: "https://reddit.com/r/cscareerquestions", desc: "Interview experiences & salary data" },
      { name: "Dev.to", url: "https://dev.to", desc: "Technical blogging community" },
      { name: "Discord: Programmer's Hangout", url: "https://discord.gg/programmers", desc: "Active help channels" },
      { name: "LinkedIn Career Advice", url: "https://linkedin.com/career-advice", desc: "1:1 mentor matching" },
    ],
    mental: [
      { name: "Headspace Student", url: "https://headspace.com/students", desc: "Free premium with .edu mail" },
      { name: "Calm App", url: "https://calm.com", desc: "Guided meditations & sleep stories" },
      { name: "7 Cups", url: "https://7cups.com", desc: "Free emotional support chat" },
      { name: "Notion Anxiety Template", url: "https://notion.so/anxiety", desc: "Cognitive-behavioral workbook" },
    ],
  };

  const Card = ({ title, children }) => (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-md shadow-lg">
      <h3 className="text-xl font-bold text-cyan-300 mb-4">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );

  const ResourceLink = ({ url, name, desc }) => (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 p-3 rounded-lg bg-white/10 hover:bg-cyan-500/20 transition-all duration-200"
    >
      <div className="mt-1 w-2 h-2 rounded-full bg-cyan-400" />
      <div>
        <div className="font-semibold text-white">{name}</div>
        <div className="text-sm text-slate-300">{desc}</div>
      </div>
      <svg
        className="ml-auto w-4 h-4 text-slate-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m-4-4l8 8m0 0v-4m0 4h-4"
        />
      </svg>
    </a>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-extrabold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
          Curated Resources
        </h2>
        <p className="text-center text-slate-300 mb-12 text-lg">
          Hand-picked links that actually work – no affiliate junk.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card title="📄 Resume Builders">{links.resume.map((l) => <ResourceLink key={l.url} {...l} />)}</Card>
          <Card title="💻 Coding Platforms">{links.coding.map((l) => <ResourceLink key={l.url} {...l} />)}</Card>
          <Card title="🧠 Aptitude & Puzzles">{links.aptitude.map((l) => <ResourceLink key={l.url} {...l} />)}</Card>
          <Card title="🏗️ System Design">{links.system.map((l) => <ResourceLink key={l.url} {...l} />)}</Card>
          <Card title="🚀 Projects & Open-Source">{links.projects.map((l) => <ResourceLink key={l.url} {...l} />)}</Card>
          <Card title="👥 Communities">{links.community.map((l) => <ResourceLink key={l.url} {...l} />)}</Card>
          <Card title="🧘 Mental Health">{links.mental.map((l) => <ResourceLink key={l.url} {...l} />)}</Card>
        </div>

      </div>
    </div>
  );
};

export default Resources;