import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../book/book.css";

export const metadata: Metadata = {
  title: "Question banks (review) — CS 4550 / CS 5610",
  description:
    "Staff-only author review of proposed Canvas quiz question banks. Answers are shown. Not a student exam.",
};

export default function QuizzesLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="book-shell min-h-screen">
      <main className="min-w-0 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
