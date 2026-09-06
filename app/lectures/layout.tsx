import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../book/book.css";

export const metadata: Metadata = {
  title: "Lectures — Web Dev",
  description:
    "Classroom lecture decks grouped by book chapter and topic — HTML, Kambaz, CSS, and upcoming Tailwind and Kambaz styling.",
};

export default function LecturesLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <div className="book-shell min-h-dvh">{children}</div>;
}
