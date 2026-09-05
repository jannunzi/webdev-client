import type { Metadata } from "next";
import ComingSoonExam from "../components/ComingSoonExam";

export const metadata: Metadata = {
  title: "X1 — CS 4550 / CS 5610",
};

export default function TakeX1Page() {
  return (
    <ComingSoonExam
      examId="x1"
      title="X1"
      unlockLabel="Monday, October 26, 2026, 12:00 AM ET"
      dueLabel="Sunday, November 1, 2026, 11:59 PM ET"
    />
  );
}
