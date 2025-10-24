import Qna from "../models/Qna.js";

// Get all questions
export const getQuestions = async (req, res) => {
  try {
    const questions = await Qna.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Post a new question
export const addQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question.trim()) return res.status(400).json({ message: "Question is required" });

    const newQ = new Qna({ question });
    await newQ.save();
    res.status(201).json(newQ);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add an answer to a question
export const addAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text.trim()) return res.status(400).json({ message: "Answer cannot be empty" });

    const question = await Qna.findById(id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    question.answers.push({ text });
    await question.save();

    res.json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
