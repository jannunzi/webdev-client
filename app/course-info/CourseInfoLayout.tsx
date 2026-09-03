import type { ReactNode } from "react";
import "../book/book.css";

export default function CourseInfoLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="book-shell min-h-screen">
      <main className="min-w-0 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
