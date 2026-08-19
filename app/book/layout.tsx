import type { ReactNode } from "react";
import BookTOC from "./TOC";
import "./book.css";

export default function BookLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="book-shell flex min-h-screen">
      <BookTOC />
      <main className="min-w-0 flex-1 overflow-x-auto p-6">{children}</main>
    </div>
  );
}
