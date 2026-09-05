import type { Metadata } from "next";
import { CHAPTER1_BANK, bankStats } from "@/lib/question-bank";
import QuestionBankReview from "../../components/QuestionBankReview";

export const metadata: Metadata = {
  title: "Q1 question bank (review draft) — CS 4550 / CS 5610",
  description:
    "Author review of every proposed Chapter 1 quiz question and option. Answers are shown.",
};

export default function Quiz1BankPage() {
  const stats = bankStats(CHAPTER1_BANK);
  return <QuestionBankReview bank={CHAPTER1_BANK} stats={stats} />;
}
