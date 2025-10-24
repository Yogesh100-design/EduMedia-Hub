import express from "express";
import { getQuestions, addQuestion, addAnswer } from "../controllers/qnaController.js";

const router = express.Router();

router.get("/getQuestions", getQuestions);
router.post("/", addQuestion);
router.post("/:id/answer", addAnswer);

export default router;
