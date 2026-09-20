import Link from "next/link";
import InstructorPeopleLink from "../components/InstructorPeopleLink";
import { renderStaffReview } from "../components/render-staff-review";

export default async function QuizzesIndexPage() {
  return renderStaffReview(() => (
    <article className="page-content font-sans">
      <p className="mb-4 text-sm">
        <Link href="/book">Course book</Link>
        {" · "}
        <Link href="/syllabus">Syllabus</Link>
        <InstructorPeopleLink />
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
        <li>
          <Link href="/quizzes/q2">Q2 — CSS (Chapter 2)</Link>
          {" "}
          <span className="text-sm text-amber-800">Review draft</span>
          {" · "}
          <Link href="/quizzes/take/q2">Student exam</Link>
        </li>
        <li>
          <Link href="/quizzes/q3">Q3 — JavaScript (Chapter 3)</Link>
          {" "}
          <span className="text-sm text-amber-800">Review draft</span>
          {" · "}
          <Link href="/quizzes/take/q3">Student exam</Link>
        </li>
        <li>
          <Link href="/quizzes/q4">Q4 — Client state (Chapter 4)</Link>
          {" "}
          <span className="text-sm text-amber-800">Review draft</span>
          {" · "}
          <Link href="/quizzes/take/q4">Student exam</Link>
        </li>
        <li>
          <Link href="/quizzes/q5">Q5 — REST (Chapter 5)</Link>
          {" "}
          <span className="text-sm text-amber-800">Review draft</span>
          {" · "}
          <Link href="/quizzes/take/q5">Student exam</Link>
        </li>
        <li>
          <Link href="/quizzes/q6">Q6 — MongoDB (Chapter 6)</Link>
          {" "}
          <span className="text-sm text-amber-800">Review draft</span>
          {" · "}
          <Link href="/quizzes/take/q6">Student exam</Link>
        </li>
      </ul>
    </article>
  ));
}
