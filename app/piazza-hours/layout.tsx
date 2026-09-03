import type { Metadata } from "next";
import type { ReactNode } from "react";
import CourseInfoLayout from "@/app/course-info/CourseInfoLayout";

export const metadata: Metadata = {
  title: "Piazza Hours — CS 4550 / CS 5610 Web Development",
  description:
    "When course staff monitor Piazza for CS 4550 and CS 5610. All times are America/New_York (ET).",
};

export default function PiazzaHoursLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <CourseInfoLayout>{children}</CourseInfoLayout>;
}
