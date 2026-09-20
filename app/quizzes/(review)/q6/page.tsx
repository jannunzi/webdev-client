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
  title: "Q6 question bank (review draft) — CS 4550 / CS 5610",
  description:
    "Author review of Q6 traditional practice items plus website coding pools.",
};

export default async function Quiz6BankPage() {
  return renderStaffReview(() => {
    const traditional = practiceChapterBank(6, "q6");
    const coding = getWebsiteCodingBank("q6");
    const bank = {
      ...traditional,
      title: "Q6 — MongoDB",
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
        chapterHref="/book/ch6"
        takeHref="/quizzes/take/q6"
        studentDrawNote={`Website Q6 draws ${WEBSITE_TRADITIONAL_DRAW_COUNT} traditional items plus ${WEBSITE_CODING_DRAW_COUNT} coding items, about ${QUIZ_TIME_LIMIT_MINUTES.q6} minutes, 100 points. Canvas fallback is traditional-only.`}
      />
    );
  });
}
