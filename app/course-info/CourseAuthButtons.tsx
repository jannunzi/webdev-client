"use client";

import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function CourseAuthButtons({
  fallbackRedirect = "/syllabus",
  signInLabel = "Sign in",
  signUpLabel = "Sign up",
}: {
  fallbackRedirect?: string;
  signInLabel?: string;
  signUpLabel?: string;
}) {
  const pathname = usePathname();
  const { user } = useUser();
  const redirectUrl = pathname || fallbackRedirect;
  const who =
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses[0]?.emailAddress ||
    null;

  return (
    <div className="flex shrink-0 items-center gap-2">
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
        {who ? (
          <span className="max-w-[12rem] truncate text-neutral-600">{who}</span>
        ) : null}
        <UserButton />
      </Show>
    </div>
  );
}
