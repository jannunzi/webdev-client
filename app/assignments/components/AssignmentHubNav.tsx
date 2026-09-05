import Link from "next/link";
import InstructorPeopleLink from "@/app/quizzes/components/InstructorPeopleLink";

export default function AssignmentHubNav({
  current,
}: {
  current?: "index" | "detail";
}) {
  return (
    <p className="mb-4 font-sans text-sm">
      {current === "detail" ? (
        <>
          <Link href="/assignments">Assignments</Link>
          {" · "}
        </>
      ) : null}
      <Link href="/syllabus#assignments">Syllabus</Link>
      {" · "}
      <Link href="/book">Course book</Link>
      {" · "}
      <Link href="/quizzes/take">Graded quizzes</Link>
      {" · "}
      <Link href="/book/practice">Practice (ungraded)</Link>
      <InstructorPeopleLink />
    </p>
  );
}
