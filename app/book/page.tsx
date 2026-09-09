import Link from "next/link";
import BookVideosNote from "./components/BookVideosNote";
import ResumeReading from "./ResumeReading";
import {
  HOW_TO_USE_THE_BOOK_HEADING,
  HOW_TO_USE_THE_BOOK_INTRO,
} from "./videosOptional";

export default function BookHome() {
  return (
    <div>
      <h1 className="mt-0 font-sans text-3xl font-semibold">
        Developing Full Stack Next.js Web Applications
      </h1>
      <p className="text-neutral-700">Dr. Jose Annunziato</p>
      <section id="how-to-use" className="mt-5 scroll-mt-6">
        <h2 className="mt-0 font-sans text-xl font-semibold">
          {HOW_TO_USE_THE_BOOK_HEADING}
        </h2>
        <p>
          {HOW_TO_USE_THE_BOOK_INTRO}{" "}
          <Link href="/syllabus#book">Same note on the syllabus</Link>.
        </p>
        <BookVideosNote className="mt-3" />
      </section>
      <ResumeReading />
      <p>
        <Link href="/syllabus">CS 4550 / CS 5610 Fall 2026 Syllabus</Link>
        {" · "}
        <Link href="/calendar">Academic Calendar</Link>
        {" · "}
        <Link href="/assignments">Assignments</Link>
        {" · "}
        <Link href="/slides">Slides</Link>
        {" · "}
        <Link href="/office-hours">Office Hours</Link>
        {" · "}
        <Link href="/piazza-hours">Piazza Hours</Link>
        {" · "}
        <Link href="/project">Final Project</Link>
        {" · "}
        <Link href="/quizzes/take/q1">Q1 graded quiz</Link>
      </p>
      <h2 className="font-sans text-xl font-semibold">Chapters</h2>
      <ul>
        <li>
          <Link href="/book/ch1">
            Chapter 1 — Building Next.js User Interfaces with HTML
          </Link>
        </li>
        <li>
          <Link href="/book/ch2">
            Chapter 2 — Styling User Interfaces with CSS and Tailwind
          </Link>
        </li>
        <li>
          <Link href="/book/ch3">
            Chapter 3 — Creating Single Page Applications with JavaScript
          </Link>
        </li>
        <li>
          <Link href="/book/ch4">
            Chapter 4 — Managing Client State
          </Link>
        </li>
        <li>
          <Link href="/book/ch5">
            Chapter 5 — Implementing RESTful Web APIs with Express.js
          </Link>
        </li>
        <li>
          <Link href="/book/ch6">
            Chapter 6 — Integrating React with MongoDB
          </Link>
        </li>
      </ul>
      <h2 className="font-sans text-xl font-semibold">Practice</h2>
      <p>
        Ungraded self-checks for each chapter live on dedicated practice
        pages and do not count toward your grade.{" "}
        <Link href="/book/practice">Browse practice quizzes</Link>.
      </p>
    </div>
  );
}
