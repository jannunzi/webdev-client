"use client";

import ClerkAuthBar from "@/app/quizzes/components/ClerkAuthBar";

export default function AssignmentAuthBar() {
  return (
    <ClerkAuthBar
      title="Assignments"
      fallbackRedirect="/assignments"
      signInLabel="Sign in with your school email"
    />
  );
}
