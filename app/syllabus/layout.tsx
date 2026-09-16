import type { Metadata } from "next";
import type { ReactNode } from "react";
import CourseInfoLayout from "@/app/course-info/CourseInfoLayout";

export const metadata: Metadata = {
  title: "CS 4550 / CS 5610 Web Development — Syllabus",
  description:
    "Fall 2026 syllabus for CS 4550-01 and CS 5610-02/09: shared topics, per-section calendars, and policies.",
};

export default function SyllabusLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <CourseInfoLayout>{children}</CourseInfoLayout>;
}
