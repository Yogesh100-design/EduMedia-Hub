import React, { useEffect, useState } from "react";

/* ---------------------------------- Answer Submission Interface (AnswerBox) ---------------------------------- */
/**
 * @param {object} props - Component properties.
 * @param {string} props.questionId - The unique identifier of the question.
 * @param {(questionId: string, answerText: string) => void} props.onAnswer - Callback function to submit the answer.
 */
function AnswerBox({ questionId, onAnswer }) {
  const [answer, setAnswer] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleReply = () => {
    if (!answer.trim()) return;
    onAnswer(questionId, answer);
    setAnswer("");
    setShowForm(false); // Conceal form upon submission
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200 mt-2 focus:outline-none uppercase tracking-wider"
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
          className="flex-1 rounded-lg bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none px-4 py-3 placeholder-gray-500 transition-colors duration-200 shadow-inner"
          placeholder="Enter your detailed response here..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleReply()}
        />
        <button
          onClick={handleReply}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!answer.trim()}
        >
          Submit Response
        </button>
      </div>
      <button
        onClick={() => {
          setShowForm(false);
          setAnswer("");
        }}
        className="text-xs self-start text-gray-500 hover:text-gray-400 transition-colors duration-200 focus:outline-none"
      >
        Cancel
      </button>
    </div>
  );
}

/* ---------------------------------- Question Card Component ---------------------------------- */
/**
 * @param {object} props - Component properties.
 * @param {object} props.question - The question object containing _id, question, and answers.
 * @param {(questionId: string, answerText: string) => void} props.onAnswer - Callback function to submit the answer.
 */
function QuestionCard({ question, onAnswer }) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 hover:border-indigo-500/50 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <p className="text-xl font-bold text-gray-50 tracking-normal leading-snug">
          Subject: {question.question}
        </p>
        <span className="text-xs font-semibold uppercase px-3 py-1 bg-gray-700 text-indigo-400 rounded">
          {question.answers.length} {question.answers.length === 1 ? "Response" : "Responses"}
        </span>
      </div>

      {/* Answers Section */}
      <div className="mt-6 space-y-3 border-t border-gray-700 pt-5">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
            Community Responses
        </h3>
        {question.answers.length > 0 ? (
          question.answers.map((a, idx) => (
            <div
              key={idx}
              className="text-base text-gray-300 bg-gray-700/50 rounded p-4 border-l-4 border-indigo-500 shadow-sm transition-colors duration-200"
            >
              <p className="font-light">{a.text}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic text-sm">No community responses have been recorded for this inquiry.</p>
        )}
      </div>

      {/* Reply Section */}
      <AnswerBox questionId={question._id} onAnswer={onAnswer} />
    </div>
  );
}

/* ---------------------------------- Main QandABoard Component ---------------------------------- */
export default function QandABoard() {
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "https://edumedia-hub-1-bgw0.onrender.com/api/qna";

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/getQuestions`);
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      console.error("Error retrieving questions:", err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Handler for question submission
  const addQuestion = async () => {
    if (!questionText.trim()) return;
    try {
      const res = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionText }),
      });
      if (!res.ok) throw new Error("Failed to post question.");
      const newQ = await res.json();
      setQuestions([newQ, ...questions]);
      setQuestionText("");
    } catch (err) {
      console.error("Error submitting question:", err);
      alert("Submission failed. Please check the network connection.");
    }
  };

  // Handler for answer submission
  const addAnswer = async (qId, answerText) => {
    if (!answerText.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/${qId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: answerText }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to submit answer.");
      }

      const updatedQ = await res.json();
      // Update the state with the newly answered question object
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) => (q._id === qId ? updatedQ : q))
      );
    } catch (err) {
      console.error("Error submitting answer:", err.message);
      alert("Answer submission failed. Please try again.");
    }
  };

  return (
    // Applied full width (min-h-screen) and sufficient horizontal padding (px-8)
    <div className="min-h-screen bg-gray-950 text-gray-100 py-16 px-8">
      {/* Container for content; uses max-w-7xl to prevent excessive stretch */}
      <div className="max-w-7xl mx-auto">
        
        {/* Header - Formalized text and color scheme */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-3 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-300">
              Technical Knowledge Repository
            </span>
          </h1>
          <p className="text-lg text-gray-400 mt-2">
            A collaborative platform for advanced technical inquiry and peer-reviewed responses.
          </p>
        </header>

        {/* Query Submission Interface */}
        <div className="bg-gray-900 rounded-xl shadow-xl p-8 mb-16 border border-gray-700/50">
          <label
            htmlFor="ask-input"
            className="block text-xl font-semibold text-indigo-400 mb-4"
          >
            Submit a Technical Inquiry
          </label>
          <textarea
            id="ask-input"
            className="w-full resize-none rounded-lg bg-gray-800 text-white border-gray-700 focus:ring-4 focus:ring-indigo-500 focus:border-indigo-500 outline-none p-4 placeholder-gray-500 transition-colors duration-200 shadow-inner"
            rows="5"
            placeholder="e.g. Please elaborate on the computational complexity of the Quicksort algorithm when applied to nearly sorted datasets."
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
          <div className="mt-6 flex justify-end">
            <button
              onClick={addQuestion}
              className="px-8 py-3 bg-indigo-600 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!questionText.trim()}
            >
              Submit Inquiry
            </button>
          </div>
        </div>

        {/* Questions List */}
        <h2 className="text-3xl font-bold text-gray-100 mb-8 border-b border-gray-800 pb-2">
            Pending and Resolved Queries
        </h2>
        
        <div className="space-y-8">
          {loading && (
             <div className="text-center p-8 text-indigo-400">Loading queries...</div>
          )}
          {!loading && questions.length === 0 && (
            <div className="text-center p-12 bg-gray-900 rounded-xl shadow-inner border border-gray-700">
              <p className="text-gray-500 text-xl font-medium">
                No active inquiries found. Please submit the first question. 
              </p>
            </div>
          )}
          {!loading && questions.map((q) => (
            <QuestionCard key={q._id} question={q} onAnswer={addAnswer} />
          ))}
        </div>
      </div>
    </div>
  );
}