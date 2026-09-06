import type { Metadata } from "next";
import { CHAPTER1_BANK, bankStats } from "@/lib/question-bank";
import { QUIZ_DRAW_COUNTS, QUIZ_TIME_LIMIT_MINUTES } from "@/lib/quiz-exam";
import QuestionBankReview from "../../components/QuestionBankReview";
import { renderStaffReview } from "../../components/render-staff-review";

export const metadata: Metadata = {
  title: "Q1 question bank (review draft) — CS 4550 / CS 5610",
  description:
    "Author review of every proposed Chapter 1 quiz question and option. Answers are shown.",
};

export default async function Quiz1BankPage() {
  return renderStaffReview(() => {
    const stats = bankStats(CHAPTER1_BANK);
    return (
      <QuestionBankReview
        bank={CHAPTER1_BANK}
        stats={stats}
        studentDrawNote={`Student attempts and Canvas fallback draw ${QUIZ_DRAW_COUNTS.q1} of these ${stats.groups} topic groups (one question each, about ${QUIZ_TIME_LIMIT_MINUTES.q1} minutes, 100 points). Variants stay in the bank.`}
      />
    );
  });
}
