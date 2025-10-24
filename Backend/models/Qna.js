import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const qnaSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answers: [answerSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Qna", qnaSchema);
