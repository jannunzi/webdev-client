import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../book/book.css";

export const metadata: Metadata = {
  title: "Lectures — Web Dev",
  description:
    "Lecture decks for Web Dev. Lectures 1–4 cover the Web stack, Chapter 1 HTML, Kambaz A1 screens, and Chapter 2 CSS.",
};

export default function LecturesLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <div className="book-shell min-h-dvh">{children}</div>;
}
