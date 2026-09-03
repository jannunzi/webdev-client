import type { Metadata } from "next";
import Link from "next/link";
import {
  PRACTICE_QUIZZES,
  practicePath,
  type PracticeQuiz,
} from "../quizzes/registry";

export const metadata: Metadata = {
  title: "Practice quizzes",
  description:
    "Ungraded self-check practice for CS 4550 / CS 5610 book chapters. Not a Canvas exam.",
};

function groupByChapter(quizzes: PracticeQuiz[]) {
  const groups: { chapterLabel: string; chapterHref: string; items: PracticeQuiz[] }[] =
    [];
  for (const quiz of quizzes) {
    const last = groups[groups.length - 1];
    if (last && last.chapterHref === quiz.chapterHref) {
      last.items.push(quiz);
    } else {
      groups.push({
        chapterLabel: quiz.chapterLabel,
        chapterHref: quiz.chapterHref,
        items: [quiz],
      });
    }
  }
  return groups;
}

export default function PracticeIndexPage() {
  const groups = groupByChapter(PRACTICE_QUIZZES);

  return (
    <article className="mx-auto max-w-3xl">
      <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Practice
      </p>
      <h1 className="mt-0 font-sans text-3xl font-semibold">
        Practice quizzes
      </h1>
      <p className="rounded border border-amber-300 bg-amber-50 px-3 py-2 font-sans text-sm text-amber-950">
        These are ungraded self-checks. They are not Canvas exams and do not
        count toward your grade.
      </p>
      <p>
        Each practice page draws {PRACTICE_QUIZZES[0]?.count ?? 10} questions
        at random from that section&apos;s bank. Misses link back to the
        subsection to reread. Attempt history stays in this browser.
      </p>
      <p>
        <Link href="/book">Back to the book</Link>
      </p>

      {groups.map((group) => (
        <section key={group.chapterHref} className="mt-8">
          <h2 className="mb-3 border-b border-neutral-300 pb-2 font-sans text-xl font-semibold">
            <Link href={group.chapterHref}>{group.chapterLabel}</Link>
          </h2>
          <ul className="m-0 list-none space-y-3 p-0">
            {group.items.map((quiz) => (
              <li
                key={quiz.quizId}
                className="rounded border border-neutral-300 bg-white p-4 shadow-sm"
              >
                <h3 className="mt-0 mb-2 font-sans text-lg font-semibold">
                  {quiz.title}
                </h3>
                <p className="mb-3 mt-0 font-sans text-sm text-neutral-700">
                  From{" "}
                  <Link href={`${quiz.chapterHref}#${quiz.sectionId}`}>
                    {quiz.sectionLabel}
                  </Link>
                  {" — "}
                  {quiz.count} of {quiz.bank.length} questions.
                </p>
                <Link
                  href={practicePath(quiz.quizId)}
                  className="book-practice-cta inline-block rounded border border-neutral-400 bg-neutral-800 px-3 py-2 text-sm"
                >
                  Open practice quiz
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </article>
  );
}
