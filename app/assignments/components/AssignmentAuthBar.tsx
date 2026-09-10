"use client";

import ClerkAuthBar from "@/app/quizzes/components/ClerkAuthBar";
import { COURSE_WEBSITE_ACCOUNT_COPY } from "@/lib/course-site/account-copy";

export default function AssignmentAuthBar() {
  return (
    <ClerkAuthBar
      title="Assignments"
      fallbackRedirect="/assignments"
      signInLabel={COURSE_WEBSITE_ACCOUNT_COPY.signInWithCanvasEmail}
      signUpLabel={COURSE_WEBSITE_ACCOUNT_COPY.signUpWithCanvasEmail}
      hint={COURSE_WEBSITE_ACCOUNT_COPY.assignmentAuthHint}
    />
  );
}
