"use client";

import ClerkAuthBar from "@/app/quizzes/components/ClerkAuthBar";

export default function PeopleAuthBar() {
  return <ClerkAuthBar title="Course roster" fallbackRedirect="/people" />;
}
