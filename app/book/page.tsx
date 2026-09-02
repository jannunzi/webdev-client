import Link from "next/link";

export default function BookHome() {
  return (
    <div>
      <h1 className="mt-0 font-sans text-3xl font-semibold">
        Developing Full Stack Next.js Web Applications
      </h1>
      <p className="text-neutral-700">Dr. Jose Annunziato</p>
      <p>
        <Link href="/syllabus">CS 4550 Fall 2026 Syllabus</Link>
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
    </div>
  );
}
