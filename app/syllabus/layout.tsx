import type { Metadata } from "next";
import type { ReactNode } from "react";
import CourseChromeShell from "@/app/course-info/CourseChromeShell";

export const metadata: Metadata = {
  title: "CS 4550 / CS 5610 Web Development — Syllabus",
  description:
    "Fall 2026 syllabus for CS 4550-01 and CS 5610-02/09: shared topics, per-section calendars, and policies.",
};

export default function SyllabusLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <CourseChromeShell mainClassName="min-w-0 px-4 py-8 sm:px-6">
      {children}
    </CourseChromeShell>
  );
}
