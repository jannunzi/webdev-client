import type { Metadata } from "next";
import ComingSoonExam from "../components/ComingSoonExam";

export const metadata: Metadata = {
  title: "X2 — CS 4550 / CS 5610",
};

export default function TakeX2Page() {
  return (
    <ComingSoonExam
      examId="x2"
      title="X2"
      unlockLabel="Monday, November 30, 2026, 12:00 AM ET"
      dueLabel="Thursday, December 3, 2026, 11:59 PM ET"
    />
  );
}
