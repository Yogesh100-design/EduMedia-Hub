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

        <div className="mt-16 text-center">
          <a
            href="https://github.com/your-org/awesome-placement-links"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-cyan-500/40 transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Contribute on GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

export default Resources;