import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../book/book.css";

export const metadata: Metadata = {
  title: "CS 4550 / CS 5610 Web Development — Syllabus",
  description:
    "Fall 2026 syllabus for CS 4550-01 and CS 5610-02/09: shared topics, per-section calendars, and policies.",
};

export default function SyllabusLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="book-shell min-h-screen">
      <main className="min-w-0 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
