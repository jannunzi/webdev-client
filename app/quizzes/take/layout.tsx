import type { Metadata } from "next";
import type { ReactNode } from "react";
import { isClerkPublishableKeySet } from "@/lib/config";
import { STUDENT_COPY } from "@/lib/quiz-exam/student-copy";
import InstructorPeopleLink from "../components/InstructorPeopleLink";
import StaffViewModeBar from "../components/StaffViewModeBar";
import QuizAuthBar from "./components/QuizAuthBar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Graded quizzes — CS 4550 / CS 5610",
  description: STUDENT_COPY.takeMetaDescription,
};

export default function TakeQuizLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="mx-auto max-w-3xl font-sans">
      {isClerkPublishableKeySet() ? <QuizAuthBar /> : null}
      <StaffViewModeBar />
      <InstructorPeopleLink asLine />
      {children}
    </div>
  );
}
