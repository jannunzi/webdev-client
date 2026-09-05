import Link from "next/link";
import type { StaffAccessStatus } from "@/lib/roster/instructors";
import StatusPanel from "./StatusPanel";

export default function StaffReviewDenied({
  access,
}: {
  access: Exclude<StaffAccessStatus, "ok">;
}) {
  if (access === "not_configured") {
    return (
      <article className="mx-auto max-w-3xl font-sans">
        <StatusPanel title="Author review is not configured yet" tone="warn">
          <p>
            Clerk env vars are missing, so this page cannot tell who is signed
            in. Question bank answers are not shown. The rest of the course
            book stays available.
          </p>
          <p>
            Jose: add the keys from <code>.env.example</code> to Vercel,
            including <code>INSTRUCTOR_EMAILS=jannunzi@gmail.com</code>.
            TAs go in <code>TA_EMAILS</code> after they create a Clerk
            account.
          </p>
          <p>
            Students take the graded exam at{" "}
            <Link href="/quizzes/take/q1">/quizzes/take/q1</Link>. Practice
            stays public at <Link href="/book/practice">/book/practice</Link>.
          </p>
        </StatusPanel>
      </article>
    );
  }

  if (access === "signed_out") {
    return (
      <article className="mx-auto max-w-3xl font-sans">
        <StatusPanel title="Sign in to view author review" tone="neutral">
          <p>
            Question bank review shows answers and is limited to instructors
            and TAs. Anyone may create a Clerk account; review access is an
            email allowlist, not a separate registration. Sign in with the
            address on <code>INSTRUCTOR_EMAILS</code> or{" "}
            <code>TA_EMAILS</code>.
          </p>
          <p>
            Students take the graded exam at{" "}
            <Link href="/quizzes/take/q1">/quizzes/take/q1</Link>. Practice
            stays public at <Link href="/book/practice">/book/practice</Link>.
          </p>
        </StatusPanel>
      </article>
    );
  }

  return (
    <article className="mx-auto max-w-3xl font-sans">
      <StatusPanel title="403 Forbidden" tone="warn">
        <p>
          Author review (answers shown) is limited to the course instructor
          and TAs. Being on the Canvas student roster does not grant access.
          Signed-in browsing of the book, syllabus, labs, and practice pages
          is fine. The question bank was not loaded.
        </p>
        <p>
          Students take the graded exam at{" "}
          <Link href="/quizzes/take/q1">/quizzes/take/q1</Link>.
        </p>
      </StatusPanel>
    </article>
  );
}
