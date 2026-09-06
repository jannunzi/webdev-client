import Link from "next/link";
import { listLectureChapters } from "@/lib/lectures";

export default function LectureHubNav({
  current,
}: {
  current?: "index" | "deck";
}) {
  const chapters = listLectureChapters();

  return (
    <p className="mb-3 font-sans text-sm">
      {current === "deck" ? (
        <>
          <Link href="/lectures">Lectures</Link>
          {" · "}
        </>
      ) : null}
      <Link href="/syllabus">Syllabus</Link>
      {" · "}
      <Link href="/book">Course book</Link>
      {chapters.map((chapter) => (
        <span key={chapter.chapter}>
          {" · "}
          <Link href={chapter.href}>Chapter {chapter.chapter}</Link>
        </span>
      ))}
      {" · "}
      <Link href="/assignments">Assignments</Link>
      {" · "}
      <Link href="/quizzes/take">Quizzes</Link>
    </p>
  );
}
