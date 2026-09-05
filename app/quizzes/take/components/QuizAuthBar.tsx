"use client";

import { STUDENT_COPY } from "@/lib/quiz-exam/student-copy";
import ClerkAuthBar from "../../components/ClerkAuthBar";

export default function QuizAuthBar() {
  return (
    <ClerkAuthBar
      title="Graded student exam"
      fallbackRedirect="/quizzes/take"
      signInLabel={STUDENT_COPY.signInWithSchoolEmail}
      signUpLabel={STUDENT_COPY.signUpWithSchoolEmail}
      hint={STUDENT_COPY.useRosterEmail}
    />
  );
}
