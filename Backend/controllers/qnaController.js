import Qna from "../models/Qna.js";

/* ---------------------------------------------------
   ✅ Get All Questions
--------------------------------------------------- */
export const getQuestions = async (req, res) => {
  try {
    const questions = await Qna.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      questions: questions || [],
    });
  } catch (err) {
    console.error("❌ Error fetching questions:", err);
    return res.status(500).json({
      success: false,
      questions: [], // IMPORTANT FIX
      message: "Unable to fetch questions at the moment.",
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
        questions: [], // FIX
        message: "Please enter a valid question.",
      });
    }

    const newQuestion = new Qna({ question: question.trim(), answers: [] });
    await newQuestion.save();

    return res.status(201).json({
      success: true,
      question: newQuestion,
    });
  } catch (err) {
    console.error("❌ Error adding question:", err);
    return res.status(500).json({
      success: false,
      questions: [], // FIX
      message: "Server error while posting question.",
    });
  }
};

/* ---------------------------------------------------
   ✅ Add Answer to Question
--------------------------------------------------- */
export const addAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        questions: [], // FIX
        message: "Please write an answer.",
      });
    }

    const question = await Qna.findById(id);
    if (!question) {
      return res.status(404).json({
        success: false,
        questions: [], // FIX
        message: "Question not found.",
      });
    }

    question.answers.push({ text: text.trim() });
    await question.save();

    return res.status(201).json({
      success: true,
      question,
    });
  } catch (err) {
    console.error("❌ Error adding answer:", err);
    return res.status(500).json({
      success: false,
      questions: [], // FIX
      message: "Server error while adding answer.",
    });
  }
};
