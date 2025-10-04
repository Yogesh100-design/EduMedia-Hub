import React, { useState, useEffect, useMemo } from "react";

const LOCAL_STORAGE_KEY = 'PLACEMENT_CHECKLIST_STATUS';

const getInitialCompletionStatus = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
};

/* -------------  EXPANDED CONTENT ------------- */
const guidanceSections = [
  {
    title: "📄 Resume & Portfolio",
    items: [
      "1-page (2 only if 5+ yrs).",
      "Quantify: “Reduced time by 42 %”.",
      "Add GitHub / LinkedIn / Dev-portfolio links.",
      "Export PDF → FirstName_Role_College.pdf",
      "Host 3 polished projects with live demos & README GIF.",
    ],
  },
  {
    title: "🧠 Aptitude + Puzzles",
    items: [
      "Indiabix core topics (Time & Work, P&C, Probability).",
      "Solve 10 puzzles/week (PuzzleFry / GFG).",
      "Maintain formula cheat-sheet.",
      "30-min rapid-fire session every morning.",
      "Track speed vs accuracy in spreadsheet.",
    ],
  },
  {
    title: "💻 Online-Assessments",
    items: [
      "LeetCode weekly contest (minimum 2 contests).",
      "Hackerrank Certification badges (SQL, PS, React).",
      "CodeSignal 300+ threshold.",
      "HackerEarth practice tracks (TCS-NQT style).",
      "60-min company-specific mock (TCS, Infy, Wipro, Amazon).",
    ],
  },
  {
    title: "🎯 DSA + Core CS",
    items: [
      "Pattern checklist: sliding-window, two-pointer, prefix-sum, bit-manip, trie.",
      "Revise OS (scheduling, paging, deadlock), DBMS (normalisation, joins, ACID), Networks (TCP vs UDP, OSI).",
      "Solve 1 hard every Sunday; write editorial in Notion.",
      "Dry-run on whiteboard while speaking aloud.",
      "Time/Space complexity tag every solution.",
    ],
  },
  {
    title: "🗣️ Technical Interview",
    items: [
      "Think out loud → approach first, then code.",
      "Handle edge-cases (empty, single, max input).",
      "Clean code: meaningful vars, helper funcs.",
      "Run custom test before saying ‘done’.",
      "Ask clarifying questions; treat interviewer as teammate.",
    ],
  },
  {
    title: "🤝 Behavioural / HR",
    items: [
      "STAR framework stories (conflict, failure, leadership, initiative, success).",
      "Why us? → link product + culture + your skills.",
      "Salary homework: Glassdoor, Levels.fyi → give range, not number.",
      "Prepare 3 questions for them (team structure, growth, onboarding).",
      "Record yourself → improve body-language & pace.",
    ],
  },
  {
    title: "🌐 Online Presence",
    items: [
      "GitHub pinned repos with demo GIF + clean README.",
      "LinkedIn headline: “Aspiring SDE | Java • React”.",
      "Write 1 technical article/month (Medium/Dev.to).",
      "Join 2–3 tech communities (Discord, Slack, Telegram).",
      "Keep personal socials private / professional.",
    ],
  },
  {
    title: "🏢 Company Research",
    items: [
      "Tech-stack, engineering blogs, recent releases.",
      "Financial health (for start-ups: runway, funding rounds).",
      "Glassdoor interview experiences (3-month window).",
      "Competitor comparison → 1 slide summary.",
      "Connect with employees → informational chat.",
    ],
  },
  {
    title: "💬 Offer & Negotiation",
    items: [
      "Don’t accept on call → ask for written offer.",
      "Evaluate CTC components (fixed, variable, stocks, bonus).",
      "Negotiate respectfully with data (counter offers, market range).",
      "Notice-period & joining date clarity.",
      "Get everything in writing before rejecting other offers.",
    ],
  },
  {
    title: "🧘 Mental & Physical Health",
    items: [
      "7–8 hrs sleep; no screens 30 min before bed.",
      "30-min workout / walk / yoga daily.",
      "5-min breathing before interview → reduce cortisol.",
      "Celebrate small wins → keep motivation high.",
      "Reach out to mentors / peers when stuck.",
    ],
  },
];

const allItems = guidanceSections.flatMap((s, secIdx) =>
  s.items.map((txt, i) => ({
    id: `${secIdx}-${i}`,
    txt,
    secIdx,
  }))
);

const PlacementGuidance = () => {
  const [openSec, setOpenSec] = useState(null);
  const [done, setDone] = useState(getInitialCompletionStatus);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(done));
  }, [done]);

  const toggleDone = (id) =>
    setDone((p) => ({ ...p, [id]: !p[id] }));

  const completedCount = useMemo(
    () => allItems.filter((it) => done[it.id]).length,
    [done]
  );
  const progress = Math.round((completedCount / allItems.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-5xl font-extrabold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
          Placement Guidance Checklist
        </h2>
        <p className="text-center text-slate-300 mb-10">
          Track every step toward your dream offer
        </p>

        {/* Progress */}
        <div className="mb-10 p-5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-300">Overall Progress</span>
            <span className="text-xl font-bold text-cyan-400">{progress}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                progress === 100 ? "bg-green-500" : "bg-cyan-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-400 text-right">
            {completedCount} / {allItems.length} tasks completed
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {guidanceSections.map((s, idx) => {
            const secItems = allItems.filter((i) => i.secIdx === idx);
            const secDone = secItems.filter((i) => done[i.id]).length;
            const secProgress = Math.round((secDone / secItems.length) * 100);

            return (
              <div
                key={s.title}
                className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden shadow-lg"
              >
                <button
                  onClick={() => setOpenSec((p) => (p === idx ? null : idx))}
                  className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-cyan-300">
                      {s.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        secProgress === 100
                          ? "bg-green-500/20 text-green-300"
                          : "bg-blue-500/20 text-blue-300"
                      }`}
                    >
                      {secProgress}%
                    </span>
                  </div>
                  <svg
                    className={`w-6 h-6 text-cyan-400 transition-transform ${
                      openSec === idx ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div
                  className={`grid transition-all duration-500 ease-in-out ${
                    openSec === idx
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <ul className="space-y-3 px-6 pb-6 pt-2">
                      {secItems.map((it) => (
                        <li key={it.id} className="flex items-start">
                          <input
                            type="checkbox"
                            id={it.id}
                            checked={!!done[it.id]}
                            onChange={() => toggleDone(it.id)}
                            className="mt-1 mr-3 h-5 w-5 rounded accent-cyan-500"
                          />
                          <label
                            htmlFor={it.id}
                            className={`flex-1 cursor-pointer transition ${
                              done[it.id]
                                ? "line-through text-slate-500 italic"
                                : "text-slate-200"
                            }`}
                          >
                            {it.txt}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <a
            href="https://www.unipune.ac.in/dept/science/statistics/pdf/Placement%20Brochure%202016-17-13-10-16.pdf"
            className="inline-block px-10 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-xl shadow-blue-500/40 hover:scale-105 transition"
          >
            Download Complete Guide (PDF)
          </a>
        </div>
      </div>
    </div>
  );
};

export default PlacementGuidance;