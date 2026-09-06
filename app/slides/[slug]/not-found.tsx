import Link from "next/link";
import { listLectureChapters } from "@/lib/lectures";

export default function SlideDeckNotFound() {
  const chapters = listLectureChapters();

  return (
    <article className="px-4 py-8 sm:px-6">
      <h1 className="mt-0 font-sans text-3xl font-semibold">
        Slide deck not found
      </h1>
      <p>
        That slug is not one of the published slide decks. Use the slides
        index, or open the matching chapter in the book.
      </p>
      <p>
        <Link href="/slides">All slides</Link>
        {chapters.map((chapter) => (
          <span key={chapter.chapter}>
            {" · "}
            <Link href={chapter.href}>Chapter {chapter.chapter}</Link>
          </span>
        ))}
      </p>
    </article>
  );
}
