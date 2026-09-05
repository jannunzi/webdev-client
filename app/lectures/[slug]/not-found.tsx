import Link from "next/link";

export default function LectureNotFound() {
  return (
    <article className="px-4 py-8 sm:px-6">
      <h1 className="mt-0 font-sans text-3xl font-semibold">
        Lecture deck not found
      </h1>
      <p>
        That slug is not one of the Fall 2026 Lecture 1 decks. Use the lectures
        index, or open Chapter 1 in the book.
      </p>
      <p>
        <Link href="/lectures">All lectures</Link>
        {" · "}
        <Link href="/book/ch1">Chapter 1</Link>
      </p>
    </article>
  );
}
