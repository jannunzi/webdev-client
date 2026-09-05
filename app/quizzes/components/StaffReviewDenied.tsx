import Link from "next/link";
import type { StaffAccessStatus } from "@/lib/roster/instructors";
import StatusPanel from "./StatusPanel";

function StudentExamLinks() {
  return (
    <p>
      Students take the graded exam at{" "}
      <Link href="/quizzes/take/q1">/quizzes/take/q1</Link>. Practice stays
      public at <Link href="/book/practice">/book/practice</Link>.
    </p>
  );
}

export default function StaffReviewDenied({
  access,
  impersonating = false,
}: {
  access: Exclude<StaffAccessStatus, "ok">;
  impersonating?: boolean;
}) {
  if (access === "not_configured") {
    return (
      <article className="page-content font-sans">
        <StatusPanel title="This page is for course staff." tone="warn">
          <StudentExamLinks />
        </StatusPanel>
      </article>
    );
  }

  if (access === "signed_out") {
    return (
      <article className="page-content font-sans">
        <StatusPanel title="Sign in to continue." tone="neutral">
          <p>This page is for course staff.</p>
          <StudentExamLinks />
        </StatusPanel>
      </article>
    );
  }

  return (
    <article className="page-content font-sans">
      <StatusPanel title="403 Forbidden" tone="warn">
        <p>This page is for course staff only.</p>
        <p>
          Students take the graded exam at{" "}
          <Link href="/quizzes/take/q1">/quizzes/take/q1</Link>.
        </p>
        {impersonating ? (
          <p>
            You are in student view. Use <strong>Viewing as: Instructor</strong>{" "}
            above to return to author review.
          </p>
        ) : null}
      </StatusPanel>
    </article>
  );
}
