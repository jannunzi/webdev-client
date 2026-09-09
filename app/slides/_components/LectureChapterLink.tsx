import Link from "next/link";
import { lectureChapterLabel, type LectureHubItem } from "@/lib/lectures/types";

export default function LectureChapterLink({
  lecture,
}: {
  lecture?: Pick<LectureHubItem, "chapter" | "chapterHref" | "chapterTitle">;
}) {
  const chapter = lecture?.chapter ?? 1;
  const href = lecture?.chapterHref ?? "/book/ch1";
  const chapterTitle =
    lecture?.chapterTitle ?? "Building Next.js User Interfaces with HTML";

  return (
    <div className="my-4 rounded-lg border-2 border-neutral-800 bg-white px-4 py-3 font-sans shadow-sm">
      <p className="m-0 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {chapter > 6 ? "Project" : "Course book"}
      </p>
      <p className="mb-2 mt-1 text-lg font-semibold tracking-tight">
        <Link href={href}>
          {lectureChapterLabel(chapter)} — {chapterTitle}
        </Link>
      </p>
      <Link
        href={href}
        className="book-practice-cta inline-block rounded border border-neutral-800 bg-neutral-800 px-3 py-2 text-sm"
      >
        {chapter > 6
          ? "Open the project page"
          : `Open Chapter ${chapter} in the book`}
      </Link>
    </div>
  );
}
