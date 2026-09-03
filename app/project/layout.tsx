import type { Metadata } from "next";
import type { ReactNode } from "react";
import CourseInfoLayout from "@/app/course-info/CourseInfoLayout";

export const metadata: Metadata = {
  title: "Final Project — CS 4550 / CS 5610 Web Development",
  description:
    "Final project options for CS 4550 and CS 5610: Kambaz Quizzes, Kambaz Pazza, or an open-ended full-stack application.",
};

export default function ProjectLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <CourseInfoLayout>{children}</CourseInfoLayout>;
}
