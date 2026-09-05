import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../book/book.css";

export const metadata: Metadata = {
  title: "Lectures — CS 4550 / CS 5610",
  description:
    "Fall 2026 lecture decks for CS 4550 / CS 5610. Lecture 1 covers the Web, Node.js, Next.js App Router, GitHub, and Vercel.",
};

export default function LecturesLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="book-shell min-h-screen">
      <main className="mx-auto min-w-0 max-w-4xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
