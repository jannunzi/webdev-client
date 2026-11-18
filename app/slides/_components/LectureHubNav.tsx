import Link from "next/link";
import { lectureChapterLabel, listLectureChapters } from "@/lib/lectures";

export default function LectureHubNav({
  current,
  editMode = false,
}: {
  current?: "index" | "deck";
  editMode?: boolean;
}) {
  const chapters = listLectureChapters();

  return (
    <p className="mb-3 font-sans text-sm">
      {current === "deck" ? (
        <>
          <Link href={editMode ? "/2026/fall/webdev/slides?edit=1" : "/2026/fall/webdev/slides"}>Slides</Link>
          {" · "}
        </>
      ) : null}
      <Link href="/syllabus">Syllabus</Link>
      {" · "}
      <Link href="/2026/fall/webdev/book">Course book</Link>
      {" · "}
      <Link href="/2026/fall/webdev/blog">Blog</Link>
      {chapters.map((chapter) => (
        <span key={chapter.chapter}>
          {" · "}
          <Link href={`/2026/fall/webdev/slides#chapter-${chapter.chapter}-heading`}>
            {lectureChapterLabel(chapter.chapter)}
          </Link>
        </span>
      ))}
      {" · "}
      <Link href="/2026/fall/webdev/assignments">Assignments</Link>
    </p>
  );
}
