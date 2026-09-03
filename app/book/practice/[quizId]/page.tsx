import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SelfCheck from "../../components/SelfCheck";
import {
  PRACTICE_QUIZZES,
  chapterSectionHref,
  getPracticeQuiz,
} from "../../quizzes/registry";

type PageProps = {
  params: Promise<{ quizId: string }>;
};

export function generateStaticParams() {
  return PRACTICE_QUIZZES.map((quiz) => ({ quizId: quiz.quizId }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { quizId } = await params;
  const quiz = getPracticeQuiz(quizId);
  if (!quiz) {
    return { title: "Practice quiz" };
  }
  return {
    title: `Practice — ${quiz.title}`,
    description: `Ungraded self-check for ${quiz.sectionLabel}. Not a Canvas exam.`,
  };
}

export default async function PracticeQuizPage({ params }: PageProps) {
  const { quizId } = await params;
  const quiz = getPracticeQuiz(quizId);
  if (!quiz) notFound();

  return (
    <article className="mx-auto max-w-3xl">
      <nav
        aria-label="Practice breadcrumb"
        className="mb-4 font-sans text-sm text-neutral-600"
      >
        <Link href="/book">Book</Link>
        {" · "}
        <Link href="/book/practice">Practice</Link>
        {" · "}
        <span>{quiz.title}</span>
      </nav>

      <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Practice
      </p>
      <h1 className="mt-0 font-sans text-3xl font-semibold">{quiz.title}</h1>
      <p className="rounded border border-amber-300 bg-amber-50 px-3 py-2 font-sans text-sm text-amber-950">
        This is an ungraded self-check — not a Canvas exam and not part of
        your course grade. You can retry as often as you like; scores stay on
        this device.
      </p>
      <p>
        Drawn from{" "}
        <Link href={chapterSectionHref(quiz)}>{quiz.sectionLabel}</Link>
        {" in "}
        <Link href={quiz.chapterHref}>{quiz.chapterLabel}</Link>.
      </p>

      <SelfCheck quizId={quiz.quizId} bank={quiz.bank} count={quiz.count} />

      <p className="mt-6 font-sans text-sm">
        <Link href={chapterSectionHref(quiz)}>
          Back to {quiz.sectionLabel}
        </Link>
        {" · "}
        <Link href="/book/practice">All practice quizzes</Link>
      </p>
    </article>
  );
}
