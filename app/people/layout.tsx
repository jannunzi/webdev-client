import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../book/book.css";

export const metadata: Metadata = {
  title: "People — CS 4550 / CS 5610",
  description:
    "Instructor-only Canvas roster for Fall 2026 CS 4550 and CS 5610.",
};

export default function PeopleLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="book-shell min-h-screen">
      <main className="min-w-0 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
