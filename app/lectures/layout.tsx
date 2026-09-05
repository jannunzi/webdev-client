import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../book/book.css";

export const metadata: Metadata = {
  title: "Lectures — Web Dev",
  description:
    "Lecture decks for Web Dev. Lecture 1 covers the Web, Node.js, Next.js App Router, GitHub, and Vercel.",
};

export default function LecturesLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <div className="book-shell min-h-dvh">{children}</div>;
}
