import Link from "next/link";
import { chapterPager, type BookChapterNumber } from "@/lib/book-editor/book2-path";

export default function ChapterPager({ chapter }: { chapter: BookChapterNumber }) {
  const { previous, next } = chapterPager(chapter);
  return (
    <nav
      aria-label="Chapter"
      className="mt-10 flex flex-col gap-3 border-t border-neutral-300 pt-4 font-sans text-sm sm:flex-row sm:justify-between"
    >
      {previous ? (
        <Link href={previous.href} className="rounded border border-neutral-300 px-3 py-2 no-underline hover:bg-neutral-100">
          Previous chapter
          <span className="mt-0.5 block text-xs text-neutral-500">{previous.label}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.href} className="rounded border border-neutral-300 px-3 py-2 no-underline hover:bg-neutral-100 sm:text-right">
          Next chapter
          <span className="mt-0.5 block text-xs text-neutral-500">{next.label}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
