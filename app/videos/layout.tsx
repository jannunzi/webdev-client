import type { Metadata } from "next";
import type { ReactNode } from "react";
import CourseSiteHeader from "@/app/course-info/CourseSiteHeader";
import "../book/book.css";

export const metadata: Metadata = {
  title: "Videos — Web Dev",
  description:
    "YouTube lecture clips grouped by book chapter and section. Open a card to play that section at its start time.",
};

export default function VideosLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="book-shell min-h-dvh">
      <CourseSiteHeader />
      {children}
    </div>
  );
}
