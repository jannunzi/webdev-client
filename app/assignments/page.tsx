import type { Metadata } from "next";
import Link from "next/link";
import { formatLongDate } from "@/app/syllabus/data/dates";
import { assignmentsIntro } from "@/app/syllabus/data/assignments";
import { listAssignments, rubricPointTotal } from "@/lib/assignments/catalog";
import AssignmentHubNav from "./components/AssignmentHubNav";

export const metadata: Metadata = {
  title: "Assignments — CS 4550 / CS 5610",
};

export default function AssignmentsIndexPage() {
  const items = listAssignments();

  return (
    <article>
      <AssignmentHubNav current="index" />
      <h1 className="mt-0 font-sans text-3xl font-semibold tracking-tight">
        Assignments
      </h1>
      {assignmentsIntro.map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
      ))}
      <p className="rounded-lg border border-sky-300 bg-sky-50 px-4 py-3 font-sans text-sm text-sky-950">
        Use the checklists to track Delivery, Lab, and Kambaz work. Due dates
        are informational — Canvas is still the official calendar. URL submit
        and auto-grading are not part of this page yet.
      </p>
      <ul className="mt-6 list-none space-y-3 p-0">
        {items.map((item) => {
          const points = item.rubric ? rubricPointTotal(item.rubric) : null;
          return (
            <li
              key={item.id}
              className="rounded-lg border border-neutral-300 bg-white p-4 shadow-sm"
            >
              <h2 className="mt-0 mb-1 font-sans text-lg font-semibold">
                <Link href={`/assignments/${item.id}`}>
                  {item.canvasId} — {item.title}
                </Link>
              </h2>
              <p className="mt-0 mb-2 font-sans text-sm text-neutral-700">
                {item.dueDate ? `Due ${formatLongDate(item.dueDate)}` : null}
                {points != null
                  ? `${item.dueDate ? " · " : ""}${points} pts`
                  : null}
                {item.status === "coming_soon"
                  ? `${item.dueDate || points != null ? " · " : ""}Checklist coming soon`
                  : null}
              </p>
              <p className="mb-3 mt-0 text-neutral-800">{item.summary}</p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/assignments/${item.id}`}
                  className="book-practice-cta inline-block rounded border border-neutral-800 bg-neutral-800 px-3 py-2 text-sm"
                >
                  {item.status === "ready"
                    ? `Open ${item.canvasId} checklist`
                    : `Open ${item.canvasId}`}
                </Link>
                <Link
                  href={item.chapterHref}
                  className="inline-block rounded border border-neutral-800 bg-white px-3 py-2 font-sans text-sm"
                >
                  Open {item.chapter} in the book
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
