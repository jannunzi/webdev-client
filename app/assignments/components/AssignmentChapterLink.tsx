import Link from "next/link";
import type { AssignmentHubItem } from "@/lib/assignments/types";

export default function AssignmentChapterLink({
  assignment,
  variant = "card",
}: {
  assignment: AssignmentHubItem;
  variant?: "card" | "inline";
}) {
  const label = `Open ${assignment.chapter} in the book`;
  if (variant === "inline") {
    return (
      <Link href={assignment.chapterHref} className="font-sans text-sm">
        {label}
      </Link>
    );
  }

  return (
    <div className="my-4 rounded-lg border-2 border-neutral-800 bg-white px-4 py-3 font-sans shadow-sm">
      <p className="m-0 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Course book
      </p>
      <p className="mb-2 mt-1 text-lg font-semibold tracking-tight">
        <Link href={assignment.chapterHref}>
          {assignment.chapter} — {assignment.chapterTitle}
        </Link>
      </p>
      <Link
        href={assignment.chapterHref}
        className="book-practice-cta inline-block rounded border border-neutral-800 bg-neutral-800 px-3 py-2 text-sm"
      >
        {label}
      </Link>
    </div>
  );
}
