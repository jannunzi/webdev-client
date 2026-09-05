import type { Metadata } from "next";
import Link from "next/link";
import { listLectureDecks } from "@/lib/lectures/catalog";
import LectureChapterLink from "./_components/LectureChapterLink";
import LectureHubNav from "./_components/LectureHubNav";

export const metadata: Metadata = {
  title: "Lectures — CS 4550 / CS 5610",
};

export default function LecturesIndexPage() {
  const decks = listLectureDecks();

  return (
    <article>
      <LectureHubNav current="index" />
      <h1 className="mt-0 font-sans text-3xl font-semibold tracking-tight">
        Lectures
      </h1>
      <p>
        Interactive decks for the Fall 2026 lecture sequence. Start here during
        class, then continue in the matching book chapter. Keyboard shortcuts
        on each deck: next / previous with the arrow keys or space,{" "}
        <kbd>f</kbd> for fullscreen, Esc to exit.
      </p>
      <p className="rounded-lg border border-sky-300 bg-sky-50 px-4 py-3 font-sans text-sm text-sky-950">
        These slides are the classroom version of Chapter 1. They are not a
        substitute for Lab 1 or the A1 checklist on{" "}
        <Link href="/assignments">Assignments</Link>.
      </p>

      <section className="mt-8" aria-labelledby="lecture-1-heading">
        <p className="mb-1 font-sans text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Canvas Lecture 1
        </p>
        <h2
          id="lecture-1-heading"
          className="mt-0 mb-2 font-sans text-xl font-semibold tracking-tight"
        >
          Chapter 1 — environment, HTML foundations, GitHub, and Vercel
        </h2>
        <LectureChapterLink />
        <ul className="mt-4 list-none space-y-3 p-0">
          {decks.map((deck, index) => (
            <li
              key={deck.slug}
              className="rounded-lg border border-neutral-300 bg-white p-4 shadow-sm"
            >
              <h3 className="mt-0 mb-1 font-sans text-lg font-semibold">
                <Link href={`/lectures/${deck.slug}`}>
                  Deck {index + 1} — {deck.title}
                </Link>
              </h3>
              <p className="mt-0 mb-2 font-sans text-sm text-neutral-700">
                {deck.slides.length} slides · Canvas Lecture {deck.canvasLecture}{" "}
                · Chapter {deck.chapter}
              </p>
              <p className="mb-3 mt-0 text-neutral-800">{deck.summary}</p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/lectures/${deck.slug}`}
                  className="book-practice-cta inline-block rounded border border-neutral-800 bg-neutral-800 px-3 py-2 text-sm"
                >
                  Open deck
                </Link>
                <Link
                  href={deck.chapterHref}
                  className="inline-block rounded border border-neutral-800 bg-white px-3 py-2 font-sans text-sm"
                >
                  Open Chapter 1 in the book
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
