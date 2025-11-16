import React, { useEffect, useState } from "react";

/* ---------------------------------- Answer Submission Interface (AnswerBox) ---------------------------------- */
function AnswerBox({ questionId, onAnswer }) {
  const [answer, setAnswer] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleReply = () => {
    if (!answer.trim()) return;
    onAnswer(questionId, answer);
    setAnswer("");
    setShowForm(false);
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200 mt-2"
      >
        + Provide a Response
      </button>
    );
  }

  return (
    <div className="mt-6 pt-6 border-t border-gray-700/50 flex flex-col gap-4">
      <h4 className="text-base font-medium text-gray-300">Formulate your response:</h4>
      <div className="flex gap-4">
        <input
          type="text"
          className="flex-1 rounded-lg bg-gray-800 text-white px-4 py-3"
          placeholder="Enter your answer..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleReply()}
        />
        <button
          onClick={handleReply}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg"
          disabled={!answer.trim()}
        >
          Submit
        </button>
      </div>

      <button
        onClick={() => {
          setShowForm(false);
          setAnswer("");
        }}
        className="text-xs text-gray-500 hover:text-gray-400"
      >
        Cancel
      </button>
    </div>
  );
}

/* ---------------------------------- Question Card ---------------------------------- */
function QuestionCard({ question, onAnswer }) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <p className="text-xl font-bold text-gray-50">{question.question}</p>
        <span className="text-xs px-3 py-1 bg-gray-700 text-indigo-400 rounded">
          {question.answers.length} Responses
        </span>
      </div>

      <div className="mt-6 space-y-3 border-t border-gray-700 pt-5">
        <h3 className="text-sm font-semibold text-gray-400 uppercase">Community Responses</h3>

        {question.answers.length > 0 ? (
          question.answers.map((a, idx) => (
            <div
              key={idx}
              className="text-base text-gray-300 bg-gray-700/50 rounded p-4 border-l-4 border-indigo-500"
            >
              <p>{a.text}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic text-sm">No responses yet.</p>
        )}
      </div>

      <AnswerBox questionId={question._id} onAnswer={onAnswer} />
    </div>
  );
}

/* ---------------------------------- MAIN Q&A BOARD ---------------------------------- */
export default function QandABoard() {
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "https://edumedia-hub-1-bgw0.onrender.com/api/qna";

  /* 🚀 Fetch All Questions */
  const fetchQuestions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/getQuestions`);
      const data = await res.json();

      // FIXED: Backend returns { success, questions: [] }
      setQuestions(data.questions || []);
    } catch (err) {
      console.error("Error retrieving questions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  /* 🚀 Add Question */
  const addQuestion = async () => {
    if (!questionText.trim()) return;

    try {
      const res = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionText }),
      });

      const data = await res.json();

      // FIXED: backend returns { success, question }
      setQuestions([data.question, ...questions]);

      setQuestionText("");
    } catch (err) {
      console.error("Error submitting question:", err);
    }
  };

  /* 🚀 Add Answer */
  const addAnswer = async (qId, answerText) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${qId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: answerText }),
      });

      const updated = await res.json();

      // FIXED: backend returns { success, question: updatedQuestion }
      setQuestions((prev) =>
        prev.map((q) => (q._id === qId ? updated.question : q))
      );
    } catch (err) {
      console.error("Error submitting answer:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 py-16 px-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-3 text-indigo-400">
            Technical Knowledge Repository
          </h1>
          <p className="text-lg text-gray-400">
            Ask questions. Share knowledge. Learn together.
          </p>
        </header>

        {/* ASK QUESTION */}
        <div className="bg-gray-900 rounded-xl p-8 mb-16 border border-gray-700">
          <label className="text-xl font-semibold text-indigo-400 mb-4 block">
            Submit a Question
          </label>

          <textarea
            className="w-full bg-gray-800 text-white p-4 rounded-lg"
            rows="5"
            placeholder="Type your technical question..."
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />

          <div className="mt-6 flex justify-end">
            <button
              onClick={addQuestion}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg"
              disabled={!questionText.trim()}
            >
              Submit
            </button>
          </div>
        </div>

        {/* QUESTIONS LIST */}
        <h2 className="text-3xl font-bold mb-8 border-b border-gray-800 pb-2">
          All Questions
        </h2>

        <div className="space-y-8">
          {loading && (
            <div className="text-center p-8 text-indigo-400">Loading...</div>
          )}

          {!loading && questions.length === 0 && (
            <div className="text-center p-12 bg-gray-900 rounded-xl">
              <p className="text-gray-500 text-xl">No questions yet.</p>
            </div>
          )}

          {!loading &&
            questions.map((q) => (
              <QuestionCard key={q._id} question={q} onAnswer={addAnswer} />
            ))}
        </div>
      </div>
    </div>
  );
}
