import type { ReactNode } from "react";
import "../book/book.css";
import CourseSiteHeader from "./CourseSiteHeader";

export default function CourseInfoLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="book-shell min-h-screen">
      <CourseSiteHeader />
      <main className="min-w-0 py-8">
        <div className="page-content px-4 sm:px-6">{children}</div>
      </main>
    </div>
  );
}
