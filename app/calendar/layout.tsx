import type { Metadata } from "next";
import type { ReactNode } from "react";
import CourseInfoLayout from "@/app/course-info/CourseInfoLayout";

export const metadata: Metadata = {
  title: "Academic Calendar — CS 4550 / CS 5610 Web Development",
  description:
    "Fall 2026 Northeastern academic calendar dates for CS 4550 and CS 5610: holidays, add/drop, fall break, and the final exam window.",
};

export default function AcademicCalendarLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <CourseInfoLayout>{children}</CourseInfoLayout>;
}
