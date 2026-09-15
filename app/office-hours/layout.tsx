import type { Metadata } from "next";
import type { ReactNode } from "react";
import CourseInfoLayout from "@/app/course-info/CourseInfoLayout";

export const metadata: Metadata = {
  title: "Staff and Office Hours — CS 4550 / CS 5610 Web Development",
  description:
    "Instructor and teaching-assistant contacts and office hours for CS 4550 and CS 5610. Piazza is the primary Q&A. All posted times are America/New_York (ET).",
};

export default function OfficeHoursLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <CourseInfoLayout>{children}</CourseInfoLayout>;
}
