"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function ClerkAuthBar({
  title,
  fallbackRedirect,
  signInLabel = "Sign in",
  signUpLabel = "Sign up",
  hint,
}: {
  title: string;
  fallbackRedirect: string;
  signInLabel?: string;
  signUpLabel?: string;
  hint?: string;
}) {
  const pathname = usePathname();
  const redirectUrl = pathname || fallbackRedirect;

  return (
    <header className="mb-6 border-b border-neutral-200 pb-3 font-sans text-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="m-0 font-medium text-neutral-700">{title}</p>
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
      </div>
      {hint ? (
        <p className="mb-0 mt-2 text-xs text-neutral-600">{hint}</p>
      ) : null}
    </header>
  );
}
