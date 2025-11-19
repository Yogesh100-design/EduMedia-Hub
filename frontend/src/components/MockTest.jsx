// MockTestSoftSkills.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { BsClock, BsDownload } from "react-icons/bs";
import { Radar } from "react-chartjs-2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const TEST_DURATION = 10 * 60; // 10 min optional timer

const questions = [
  // Communication
  ...[...Array(5)].map((_, i) => ({
    id: `com-${i}`,
    cat: "Communication",
    q: [
      "I speak clearly and confidently in front of a group.",
      "I actively listen and ask clarifying questions.",
      "I adapt my language to the audience (tech / non-tech).",
      "I give constructive feedback without sounding harsh.",
      "I write concise, grammatically correct emails.",
    ][i],
  })),
  // Teamwork
  ...[...Array(5)].map((_, i) => ({
    id: `team-${i}`,
    cat: "Teamwork",
    q: [
      "I share credit and celebrate teammates' wins.",
      "I volunteer for unpopular but necessary tasks.",
      "I resolve conflicts calmly and privately first.",
      "I ask for help when stuck instead of struggling alone.",
      "I document my work so others can onboard quickly.",
    ][i],
  })),
  // Leadership
  ...[...Array(5)].map((_, i) => ({
    id: `lead-${i}`,
    cat: "Leadership",
    q: [
      "I set measurable goals and communicate them early.",
      "I delegate tasks based on strengths, not convenience.",
      "I take responsibility for team failures publicly.",
      "I mentor juniors even without formal authority.",
      "I run short daily stand-ups to keep us aligned.",
    ][i],
  })),
  // Emotional Intelligence
  ...[...Array(5)].map((_, i) => ({
    id: `eq-${i}`,
    cat: "Emotional Intelligence",
    q: [
      "I recognise my own emotions before reacting.",
      "I can describe others' feelings accurately.",
      "I stay calm when receiving negative feedback.",
      "I use humour appropriately to reduce tension.",
      "I avoid making decisions when emotionally charged.",
    ][i],
  })),
  // Adaptability
  ...[...Array(5)].map((_, i) => ({
    id: `adapt-${i}`,
    cat: "Adaptability",
    q: [
      "I learn new tools quickly when project needs change.",
      "I remain productive during uncertain requirements.",
      "I help teammates cope with change positively.",
      "I view failures as learning opportunities.",
      "I proactively upskill outside my comfort zone.",
    ][i],
  })),
];

const options = ["Never", "Rarely", "Sometimes", "Often", "Always"];
const optionValues = [1, 2, 3, 4, 5];

export default function MockTestSoftSkills() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [seconds, setSeconds] = useState(TEST_DURATION);
  const cardRef = useRef(null);

  // Optional timer
  useEffect(() => {
    if (submitted || seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds, submitted]);

  const handleAnswer = (id, val) => setAnswers((a) => ({ ...a, [id]: val }));

  const submitTest = () => {
    if (Object.keys(answers).length < questions.length) return alert("Please answer all questions.");
    setSubmitted(true);
  };

  const resetTest = () => {
    setAnswers({});
    setSubmitted(false);
    setSeconds(TEST_DURATION);
  };

  /* ----------  SCORING  ---------- */
  const categoryScores = useMemo(() => {
    const cats = ["Communication", "Teamwork", "Leadership", "Emotional Intelligence", "Adaptability"];
    return cats.map((cat) => {
      const catQs = questions.filter((q) => q.cat === cat);
      const sum = catQs.reduce((acc, q) => acc + (answers[q.id] || 0), 0);
      return { cat, score: Math.round((sum / catQs.length) * 20) }; // → 0-100
    });
  }, [answers]);

  const totalScore = Math.round(
    categoryScores.reduce((acc, c) => acc + c.score, 0) / categoryScores.length
  );

  /* ----------  PDF DOWNLOAD  ---------- */
  const downloadPDF = async () => {
    const canvas = await html2canvas(cardRef.current, { backgroundColor: "#0f172a" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const w = 210;
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, w, h);
    pdf.save("SoftSkill-Report.pdf");
  };

  /* ----------  UI  ---------- */
  if (submitted)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div ref={cardRef} className="p-8 rounded-2xl bg-slate-800 border border-white/10">
            <h2 className="text-3xl font-bold text-center mb-2">Soft-Skill Mock-Test Report</h2>
            <p className="text-center text-slate-300 mb-6">Generated on {new Date().toLocaleString()}</p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Overall Score</h3>
                <div className="text-5xl font-extrabold text-cyan-400">{totalScore}<span className="text-2xl">/100</span></div>
                <div className="mt-4 space-y-3">
                  {categoryScores.map((c) => (
                    <div key={c.cat}>
                      <div className="flex justify-between text-sm">
                        <span>{c.cat}</span>
                        <span>{c.score}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="h-2 rounded-full bg-cyan-500" style={{ width: `${c.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Radar Chart</h3>
                <Radar
                  data={{
                    labels: categoryScores.map((c) => c.cat),
                    datasets: [
                      {
                        label: "Score",
                        data: categoryScores.map((c) => c.score),
                        backgroundColor: "rgba(6,182,212,0.2)",
                        borderColor: "#06b6d4",
                        pointBackgroundColor: "#06b6d4",
                      },
                    ],
                  }}
                  options={{ scales: { r: { beginAtZero: true, max: 100 } } }}
                />
              </div>
            </div>

            <div className="mt-6 text-slate-300 text-sm">
              <strong>Interpretation:</strong> 80-100 Excellent | 60-79 Good | 40-59 Average | Below 40 needs improvement.
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <button onClick={downloadPDF} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold">
              <BsDownload /> Download PDF
            </button>
            <button onClick={resetTest} className="px-5 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold">
              Retake Test
            </button>
          </div>
        </div>
      </div>
    );

  /* ----------  TEST SCREEN  ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Soft-Skill Mock Test</h2>
          <div className="flex items-center gap-2 text-lg">
            <BsClock />
            <span className={`font-mono ${seconds < 60 ? "text-rose-400" : ""}`}>
              {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id} className="p-5 rounded-xl bg-white/10 border border-white/20">
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 font-bold">{idx + 1}</span>
                <div className="flex-1">
                  <p className="mb-3">{q.q}</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {options.map((opt, i) => (
                      <label
                        key={opt}
                        className={`cursor-pointer rounded-lg border px-3 py-2 text-center text-sm transition ${
                          answers[q.id] === optionValues[i]
                            ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                            : "border-white/30 hover:border-white/60"
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={optionValues[i]}
                          checked={answers[q.id] === optionValues[i]}
                          onChange={() => handleAnswer(q.id, optionValues[i])}
                          className="sr-only"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={submitTest}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:scale-105 transition"
          >
            Submit Test
          </button>
        </div>
      </div>
    </div>
  );
}