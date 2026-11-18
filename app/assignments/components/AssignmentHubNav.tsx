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
          <Link href="/2026/fall/webdev/assignments">Assignments</Link>
          {" · "}
        </>
      ) : null}
      <Link href="/syllabus#assignments">Syllabus</Link>
      {" · "}
      <Link href="/2026/fall/webdev/book">Course book</Link>
      {" · "}
      <Link href="/2026/fall/webdev/blog">Blog</Link>
      {" · "}
      <Link href="/2026/fall/webdev/slides">Slides</Link>
      {" · "}
      <Link href="/2026/fall/webdev/book/practice">Practice (ungraded)</Link>
      <InstructorPeopleLink />
    </p>
  );
}
