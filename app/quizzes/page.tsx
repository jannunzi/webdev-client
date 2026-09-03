import Link from "next/link";

export default function QuizzesIndexPage() {
  return (
    <article className="mx-auto max-w-3xl font-sans">
      <p className="mb-4 text-sm">
        <Link href="/book">Course book</Link>
        {" · "}
        <Link href="/syllabus">Syllabus</Link>
      </p>
      <h1 className="mt-0 font-semibold text-3xl tracking-tight">
        Question banks
      </h1>
      <p className="text-neutral-700">
        Author review surfaces for proposed Canvas questions. Answers are
        visible. These pages are not student exams.
      </p>
      <p>
        Students take the graded version at{" "}
        <Link href="/quizzes/take">/quizzes/take</Link>
        {" "}
        (Clerk sign-in + Canvas roster). Practice self-checks stay on{" "}
        <Link href="/book/practice">/book/practice</Link>.
      </p>
      <ul className="list-disc pl-5">
        <li>
          <Link href="/quizzes/q1">Q1 — HTML (Chapter 1)</Link>
          {" "}
          <span className="text-sm text-amber-800">Review draft</span>
          {" · "}
          <Link href="/quizzes/take/q1">Student exam</Link>
        </li>
      </ul>
    </article>
  );
}
