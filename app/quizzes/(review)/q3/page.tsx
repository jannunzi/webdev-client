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
  title: "Q3 question bank (review draft) — CS 4550 / CS 5610",
  description:
    "Author review of Q3 traditional practice items plus website coding pools.",
};

export default async function Quiz3BankPage() {
  return renderStaffReview(() => {
    const traditional = practiceChapterBank(3, "q3");
    const coding = getWebsiteCodingBank("q3");
    const bank = {
      ...traditional,
      title: "Q3 — JavaScript",
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
        chapterHref="/book/ch3"
        takeHref="/quizzes/take/q3"
        studentDrawNote={`Website Q3 draws ${WEBSITE_TRADITIONAL_DRAW_COUNT} traditional items plus ${WEBSITE_CODING_DRAW_COUNT} coding items, about ${QUIZ_TIME_LIMIT_MINUTES.q3} minutes, 100 points. Canvas fallback is traditional-only.`}
      />
    );
  });
}
