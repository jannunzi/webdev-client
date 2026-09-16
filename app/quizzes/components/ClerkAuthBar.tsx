"use client";

import CourseAuthControls from "@/app/course-info/CourseAuthControls";
import { usePathname } from "next/navigation";

export default function ClerkAuthBar({
  title,
  fallbackRedirect,
  signInLabel = "Sign in",
  signUpLabel = "Sign up",
  hint,
  showAuth = true,
}: {
  title: string;
  fallbackRedirect: string;
  signInLabel?: string;
  signUpLabel?: string;
  hint?: string;
  showAuth?: boolean;
}) {
  const pathname = usePathname();
  const redirectUrl = pathname || fallbackRedirect;

  return (
    <header className="mb-6 border-b border-neutral-200 pb-3 font-sans text-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="m-0 font-medium text-neutral-700">{title}</p>
        {showAuth ? (
          <CourseAuthControls
            fallbackRedirect={redirectUrl}
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
