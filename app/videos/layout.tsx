import type { Metadata } from "next";
import type { ReactNode } from "react";
import CourseInfoLayout from "@/app/course-info/CourseInfoLayout";

export const metadata: Metadata = {
  title: "Videos — CS 4550 / CS 5610 Web Development",
  description:
    "YouTube lecture clips mapped to book sections. Pick a course section and open the clip at its start time.",
};

export default function VideosLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <CourseInfoLayout>{children}</CourseInfoLayout>;
}
