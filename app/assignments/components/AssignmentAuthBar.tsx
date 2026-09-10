"use client";

import ClerkAuthBar from "@/app/quizzes/components/ClerkAuthBar";
import { COURSE_WEBSITE_ACCOUNT_COPY } from "@/lib/course-site/account-copy";

export default function AssignmentAuthBar() {
  return (
    <ClerkAuthBar
      title="Assignments"
      fallbackRedirect="/assignments"
      signInLabel="Sign in with your school email"
      signUpLabel="Sign up"
      hint={COURSE_WEBSITE_ACCOUNT_COPY.assignmentAuthHint}
    />
  );
}
