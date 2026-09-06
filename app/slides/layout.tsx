import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../book/book.css";

export const metadata: Metadata = {
  title: "Slides — Web Dev",
  description:
    "Classroom slide decks grouped by book chapter and section — HTML, Kambaz, CSS, Tailwind, JavaScript, and Kambaz styling.",
};

export default function SlidesLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <div className="book-shell min-h-dvh">{children}</div>;
}
