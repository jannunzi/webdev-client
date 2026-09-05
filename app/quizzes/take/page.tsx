import type { Metadata } from "next";
import Link from "next/link";
import StaffOnly from "../components/StaffOnly";
import { listExamBanks, STUDENT_COPY } from "@/lib/quiz-exam";

export const metadata: Metadata = {
  title: "Graded quizzes — CS 4550 / CS 5610",
};

const COMING_SOON_EXAMS = [
  {
    id: "x1",
    title: "X1",
    window: "Unlock Oct 26 · due Nov 1",
  },
  {
    id: "x2",
    title: "X2",
    window: "Unlock Nov 30 · due Dec 3 (exam week)",
  },
] as const;

export default function TakeQuizIndexPage() {
  const exams = listExamBanks();

  return (
    <article>
      <p className="mb-4 text-sm">
        <StaffOnly>
          <Link href="/quizzes">Question banks</Link>
          {" · "}
        </StaffOnly>
        <Link href="/book">Course book</Link>
        {" · "}
        <Link href="/assignments">Assignments</Link>
        {" · "}
        <Link href="/lectures">Lectures</Link>
        {" · "}
        <Link href="/book/practice">Practice (ungraded)</Link>
      </p>
      <h1 className="mt-0 text-3xl font-semibold tracking-tight">
        Graded quizzes
      </h1>
      <p className="rounded-lg border border-sky-300 bg-sky-50 px-4 py-3 text-sky-950">
        {STUDENT_COPY.takeIndexLead} After you submit, the same URL is
        how you come back for your score and — during the class-wide review
        week — the answers. Practice self-checks stay on{" "}
        <Link href="/book/practice">/book/practice</Link>.
        <StaffOnly>
          {" "}
          Author review banks (answers shown) stay on{" "}
          <Link href="/quizzes">/quizzes</Link>.
        </StaffOnly>
      </p>
      <ul className="list-none space-y-3 p-0">
        {exams.map(({ quizId, bank }) => (
          <li
            key={quizId}
            className="rounded-lg border border-neutral-300 bg-white p-4 shadow-sm"
          >
            <h2 className="mt-0 mb-2 text-lg font-semibold">{bank.title}</h2>
            <p className="mt-0 text-sm text-neutral-700">
              Chapter {bank.chapter} · {bank.groups.length} questions (one from
              each group)
            </p>
            <Link
              href={`/quizzes/take/${quizId}`}
              className="book-practice-cta inline-block rounded border border-neutral-800 bg-neutral-800 px-3 py-2 text-sm"
            >
              Take or review {bank.title}
            </Link>
          </li>
        ))}
        {COMING_SOON_EXAMS.map((exam) => (
          <li
            key={exam.id}
            className="rounded-lg border border-neutral-300 bg-white p-4 shadow-sm"
          >
            <h2 className="mt-0 mb-2 text-lg font-semibold">{exam.title}</h2>
            <p className="mt-0 text-sm text-neutral-700">
              {exam.window} · Canvas 100-point shell · coming soon
            </p>
            <Link
              href={`/quizzes/take/${exam.id}`}
              className="book-practice-cta inline-block rounded border border-neutral-800 bg-neutral-800 px-3 py-2 text-sm"
            >
              Open {exam.title}
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
