import type { Metadata } from "next";
import type { ReactNode } from "react";
import CourseChromeShell from "@/app/course-info/CourseChromeShell";

export const metadata: Metadata = {
  title: "Question banks (review) — CS 4550 / CS 5610",
  description:
    "Staff-only author review of proposed Canvas quiz question banks. Answers are shown. Not a student exam.",
};

export default function QuizzesLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <CourseChromeShell mainClassName="min-w-0 px-4 py-8 sm:px-6">
      {children}
    </CourseChromeShell>
  );
}
