import type { Metadata } from "next";
import type { ReactNode } from "react";
import CourseInfoLayout from "@/app/course-info/CourseInfoLayout";

export const metadata: Metadata = {
  title: "Blog — CS 4550 / CS 5610 Web Development",
  description:
    "Instructor-curated news digests for CS 4550 / CS 5610. Short blurbs that link to original sources. Optional further reading — not required for grades.",
};

export default function BlogLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <CourseInfoLayout>{children}</CourseInfoLayout>;
}
