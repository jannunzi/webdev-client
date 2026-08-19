import type { ReactNode } from "react";
import Link from "next/link";

export function chapterHref(chapter: number | string): string {
  return `/book/ch${chapter}`;
}

/** Link to a book chapter page — e.g. Chapter 2 → /book/ch2.
 *  Mid-sentence: use `{" "}` after the tag. A bare space after `/>` is
 *  stripped by the Next/SWC compiler (renders as "Chapter 1built").
 */
export default function ChapterLink({
  to,
  children,
  className = "text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-900",
}: {
  to: number | string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Link href={chapterHref(to)} className={className}>
      {children ?? `Chapter ${to}`}
    </Link>
  );
}
