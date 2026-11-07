import type { Metadata } from "next";
import type { ReactNode } from "react";
import CourseInfoLayout from "@/app/course-info/CourseInfoLayout";

export const metadata: Metadata = {
  title: "Office Hours — CS 4550 / CS 5610 Web Development",
  description:
    "Office hours for CS 4550 and CS 5610. Instructor: Monday and Wednesday 3:00–4:00pm ET in person; Thursday and Friday on Zoom, time not yet posted. Teaching-assistant times are recent Teams slots announced weekly on Piazza. All times are America/New_York (ET).",
};

export default function OfficeHoursLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <CourseInfoLayout>{children}</CourseInfoLayout>;
}
