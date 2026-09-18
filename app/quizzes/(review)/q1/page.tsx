import type { Metadata } from "next";
import { CHAPTER1_REVIEW_BANK, bankStats } from "@/lib/question-bank";
import {
  Q1_CODING_DRAW_COUNT,
  Q1_TRADITIONAL_DRAW_COUNT,
  QUIZ_DRAW_COUNTS,
  QUIZ_TIME_LIMIT_MINUTES,
} from "@/lib/quiz-exam";
import QuestionBankReview from "../../components/QuestionBankReview";
import { renderStaffReview } from "../../components/render-staff-review";

export const metadata: Metadata = {
  title: "Q1 question bank (review draft) — CS 4550 / CS 5610",
  description:
    "Author review of every proposed Chapter 1 quiz question and option. Answers are shown.",
};

export default async function Quiz1BankPage() {
  return renderStaffReview(() => {
    const stats = bankStats(CHAPTER1_REVIEW_BANK);
    return (
      <QuestionBankReview
        bank={CHAPTER1_REVIEW_BANK}
        stats={stats}
        studentDrawNote={`Website Q1 draws ${Q1_TRADITIONAL_DRAW_COUNT} traditional groups plus ${Q1_CODING_DRAW_COUNT} coding items from the pools below (${QUIZ_DRAW_COUNTS.q1} total, about ${QUIZ_TIME_LIMIT_MINUTES.q1} minutes, 100 points). Canvas fallback still samples 10 traditional groups only — coding is website-only AI grading.`}
      />
    );
  });
}
