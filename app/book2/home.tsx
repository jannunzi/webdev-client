import Link from "next/link";
import BookVideosNote from "@/app/book/components/BookVideosNote";
import ResumeReading from "@/app/book/ResumeReading";
import {
  HOW_TO_USE_THE_BOOK_HEADING,
  HOW_TO_USE_THE_BOOK_INTRO,
} from "@/app/book/videosOptional";
import { BOOK2_CHAPTERS, rewriteBookPath } from "@/lib/book-editor/book2-path";
import SourceNote from "./source-note";

const CHAPTER_TITLES = [
  "Chapter 1 — Building Next.js User Interfaces with HTML",
  "Chapter 2 — Styling User Interfaces with CSS and Tailwind",
  "Chapter 3 — Creating Single Page Applications with JavaScript",
  "Chapter 4 — Managing Client State",
  "Chapter 5 — Implementing RESTful Web APIs with Express.js",
  "Chapter 6 — Integrating React with MongoDB",
] as const;

export default function Book2Home() {
  return (
    <div data-book-source="home">
      <SourceNote source="home" title="Staff preview.">
        This is book2. The public book at /book is unchanged. Chapter 1 shows the latest saved draft when one exists. Every other chapter is the published chapter, labeled as such.
      </SourceNote>
      <h1 className="font-sans text-3xl font-semibold">
        Developing Full Stack Next.js Web Applications
      </h1>
      <p className="text-neutral-700">Dr. Jose Annunziato</p>
      <section id="how-to-use" className="mt-5 scroll-mt-24">
        <h2 className="mt-0 font-sans text-xl font-semibold">{HOW_TO_USE_THE_BOOK_HEADING}</h2>
        <p>
          {HOW_TO_USE_THE_BOOK_INTRO}{" "}
          <Link href="/syllabus#book">Same note on the syllabus</Link>.
        </p>
        <BookVideosNote className="mt-3" />
      </section>
      <ResumeReading base="/book2" />
      <p>
        <Link href="/syllabus">Syllabus</Link>
        {" — leave the preview for course pages (assignments, quizzes, slides)."}
      </p>
      <h2 className="font-sans text-xl font-semibold">Chapters</h2>
      <ul>
        {BOOK2_CHAPTERS.map((chapter, index) => (
          <li key={chapter.chapter}>
            <Link href={rewriteBookPath(`/book/ch${chapter.chapter}`, "/book2")}>
              {CHAPTER_TITLES[index]}
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="font-sans text-xl font-semibold">Practice</h2>
      <p>
        Ungraded self-checks for each chapter live on dedicated practice pages and do not count
        toward your grade.{" "}
        <Link href="/book2/practice">Browse practice quizzes</Link>.
      </p>
    </div>
  );
}
