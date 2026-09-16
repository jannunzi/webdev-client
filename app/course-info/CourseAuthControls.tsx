"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function CourseAuthControls({
  fallbackRedirect = "/syllabus",
  signInLabel = "Sign in",
  signUpLabel = "Sign up",
}: {
  fallbackRedirect?: string;
  signInLabel?: string;
  signUpLabel?: string;
}) {
  const pathname = usePathname();
  const redirectUrl = pathname || fallbackRedirect;

  return (
    <div className="flex items-center gap-2">
      <Show when="signed-out">
        <SignInButton forceRedirectUrl={redirectUrl}>
          <button
            type="button"
            className="rounded border border-neutral-400 bg-white px-3 py-1.5 hover:bg-neutral-50"
          >
            {signInLabel}
          </button>
        </SignInButton>
        <SignUpButton forceRedirectUrl={redirectUrl}>
          <button
            type="button"
            className="rounded border border-neutral-800 bg-neutral-800 px-3 py-1.5 text-white hover:bg-neutral-700"
          >
            {signUpLabel}
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </div>
  );
}
