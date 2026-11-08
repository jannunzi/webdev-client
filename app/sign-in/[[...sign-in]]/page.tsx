import type { Metadata } from "next";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import CourseWebsiteAccountNote from "@/app/syllabus/components/CourseWebsiteAccountNote";
import { isClerkConfigured } from "@/lib/config";
import { safeReturnPath } from "@/lib/auth/must-change-password";
import StatusPanel from "../../quizzes/components/StatusPanel";

export const metadata: Metadata = {
  title: "Sign in — CS 4550 / CS 5610",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string | string[] }>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.redirect_url) ? params.redirect_url[0] : params.redirect_url;
  const redirectTo = raw ? safeReturnPath(raw) : "/book";

  if (!isClerkConfigured()) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 font-sans">
        <CourseWebsiteAccountNote variant="sign-in" />
        <StatusPanel title="Sign-in is not available yet" tone="warn">
          <p>
            Sign-in is not available yet. The course book remains public.
          </p>
        </StatusPanel>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 py-12 font-sans">
      <CourseWebsiteAccountNote variant="sign-in" />
      <SignIn forceRedirectUrl={redirectTo} fallbackRedirectUrl={redirectTo} />
      <p className="mt-6 text-sm">
        <Link href="/book">Back to the course book</Link>
      </p>
    </main>
  );
}
