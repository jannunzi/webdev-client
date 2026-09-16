"use client";

import CourseAuthButtons from "@/app/course-info/CourseAuthButtons";

export default function ClerkAuthBar({
  title,
  fallbackRedirect,
  signInLabel = "Sign in",
  signUpLabel = "Sign up",
  hint,
  showActions = true,
}: {
  title: string;
  fallbackRedirect: string;
  signInLabel?: string;
  signUpLabel?: string;
  hint?: string;
  /** When the shared course header already shows auth, keep title/hint only. */
  showActions?: boolean;
}) {
  return (
    <header className="mb-6 border-b border-neutral-200 pb-3 font-sans text-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="m-0 font-medium text-neutral-700">{title}</p>
        {showActions ? (
          <CourseAuthButtons
            fallbackRedirect={fallbackRedirect}
            signInLabel={signInLabel}
            signUpLabel={signUpLabel}
          />
        ) : null}
      </div>
      {hint ? (
        <p className="mb-0 mt-2 text-xs text-neutral-600">{hint}</p>
      ) : null}
    </header>
  );
}
