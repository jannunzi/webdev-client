import Link from "next/link";
import { lectureChapterLabel } from "@/lib/lectures/types";

export default function VideosHubNav({
  current,
  chapters = [],
}: {
  current: "hub" | "clip";
  chapters?: number[];
}) {
  return (
    <p className="mb-3 font-sans text-sm">
      {current === "clip" ? (
        <>
          <Link href="/videos">Videos</Link>
          {" · "}
        </>
      ) : null}
      <Link href="/syllabus">Syllabus</Link>
      {" · "}
      <Link href="/book">Course book</Link>
      {" · "}
      <Link href="/slides">Slides</Link>
      {current === "hub"
        ? chapters.map((chapter) => (
            <span key={chapter}>
              {" · "}
              <Link href={`/videos#chapter-${chapter}-heading`}>
                {lectureChapterLabel(chapter)}
              </Link>
            </span>
          ))
        : null}
    </p>
  );
}
