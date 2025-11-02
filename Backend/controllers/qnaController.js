import Qna from "../models/Qna.js";

/* ---------------------------------------------------
   ✅ Get All Questions
--------------------------------------------------- */
export const getQuestions = async (req, res) => {
  try {
    const questions = await Qna.find().sort({ createdAt: -1 });

    if (questions.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No questions have been asked yet. Be the first to start the discussion!",
        questions: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "✅ Questions fetched successfully.",
      totalQuestions: questions.length,
      questions,
    });
  } catch (err) {
    console.error("❌ Error fetching questions:", err);
    res.status(500).json({
      success: false,
      message: "Unable to fetch questions at the moment. Please try again later.",
    });
  }
};

/* ---------------------------------------------------
   ✅ Post a New Question
--------------------------------------------------- */
export const addQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid question before submitting.",
      });
    }

    const newQuestion = new Qna({ question: question.trim() });
    await newQuestion.save();

    res.status(201).json({
      success: true,
      message: "🎉 Your question has been posted successfully!",
      question: newQuestion,
    });
  } catch (err) {
    console.error("❌ Error adding question:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while posting your question. Please try again later.",
    });
  }
};

/* ---------------------------------------------------
   ✅ Add an Answer to a Question
--------------------------------------------------- */
export const addAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please write an answer before submitting.",
      });
    }

    const question = await Qna.findById(id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Sorry, the question you’re trying to answer was not found.",
      });
    }

    question.answers.push({ text: text.trim() });
    await question.save();

    res.status(201).json({
      success: true,
      message: "💬 Your answer has been added successfully!",
      question,
    });
  } catch (err) {
    console.error("❌ Error adding answer:", err);
    res.status(500).json({
      success: false,
      message: "Unable to add your answer right now. Please try again later.",
    });
  }
};
