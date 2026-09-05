"use client";

import ClerkAuthBar from "../../components/ClerkAuthBar";

export default function QuizAuthBar() {
  return (
    <ClerkAuthBar title="Graded student exam" fallbackRedirect="/quizzes/take" />
  );
}
