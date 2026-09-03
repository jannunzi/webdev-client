import type { Metadata } from "next";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/config";
import StatusPanel from "../../quizzes/components/StatusPanel";

export const metadata: Metadata = {
  title: "Sign in — CS 4550 / CS 5610",
};

export default function SignInPage() {
  if (!isClerkConfigured()) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 font-sans">
        <StatusPanel title="Sign-in is not configured yet" tone="warn">
          <p>
            Clerk keys are missing. The course book remains public. Add
            <code> NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and
            <code> CLERK_SECRET_KEY</code> to enable student login.
          </p>
        </StatusPanel>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 py-12 font-sans">
      <SignIn />
      <p className="mt-6 text-sm">
        <Link href="/book">Back to the course book</Link>
        {" · "}
        <Link href="/quizzes/take">Graded quizzes</Link>
      </p>
    </main>
  );
}
