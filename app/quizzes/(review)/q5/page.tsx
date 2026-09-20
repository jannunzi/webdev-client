import type { Metadata } from "next";
import { bankStats, getWebsiteCodingBank } from "@/lib/question-bank";
import { practiceChapterBank } from "@/lib/quiz-exam/canvas-fallback-banks";
import {
  QUIZ_TIME_LIMIT_MINUTES,
  WEBSITE_CODING_DRAW_COUNT,
  WEBSITE_TRADITIONAL_DRAW_COUNT,
} from "@/lib/quiz-exam";
import QuestionBankReview from "../../components/QuestionBankReview";
import { renderStaffReview } from "../../components/render-staff-review";

export const metadata: Metadata = {
  title: "Q5 question bank (review draft) — CS 4550 / CS 5610",
  description:
    "Author review of Q5 traditional practice items plus website coding pools.",
};

export default async function Quiz5BankPage() {
  return renderStaffReview(() => {
    const traditional = practiceChapterBank(5, "q5");
    const coding = getWebsiteCodingBank("q5");
    const bank = {
      ...traditional,
      title: "Q5 — REST",
      groups: [
        ...traditional.groups,
        ...(coding?.groups ?? []).map((group, index) => ({
          ...group,
          order: traditional.groups.length + index + 1,
        })),
      ],
    };
    const stats = bankStats(bank);
    return (
      <QuestionBankReview
        bank={bank}
        stats={stats}
        chapterHref="/book/ch5"
        takeHref="/quizzes/take/q5"
        studentDrawNote={`Website Q5 draws ${WEBSITE_TRADITIONAL_DRAW_COUNT} traditional items plus ${WEBSITE_CODING_DRAW_COUNT} coding items, about ${QUIZ_TIME_LIMIT_MINUTES.q5} minutes, 100 points. Canvas fallback is traditional-only.`}
      />
    );
  });
}
