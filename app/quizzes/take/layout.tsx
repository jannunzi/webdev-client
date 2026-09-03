import type { Metadata } from "next";
import type { ReactNode } from "react";
import { isClerkPublishableKeySet } from "@/lib/config";
import QuizAuthBar from "./components/QuizAuthBar";

export const metadata: Metadata = {
  title: "Graded quizzes — CS 4550 / CS 5610",
  description:
    "Student exam mode. Sign in with a Canvas roster email to take a graded quiz.",
};

export default function TakeQuizLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="mx-auto max-w-3xl font-sans">
      {isClerkPublishableKeySet() ? <QuizAuthBar /> : null}
      {children}
    </div>
  );
}
