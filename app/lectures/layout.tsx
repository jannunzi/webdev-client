import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../book/book.css";

export const metadata: Metadata = {
  title: "Lectures — Web Dev",
  description:
    "Lecture decks for Web Dev. Lectures 1–3 cover the Web stack, Chapter 1 HTML, and the Kambaz A1 screens.",
};

export default function LecturesLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <div className="book-shell min-h-dvh">{children}</div>;
}
