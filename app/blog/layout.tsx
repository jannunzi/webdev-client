import type { Metadata } from "next";
import type { ReactNode } from "react";
import CourseInfoLayout from "@/app/course-info/CourseInfoLayout";

export const metadata: Metadata = {
  title: "Blog — CS 4550 / CS 5610 Web Development",
  description:
    "Instructor-curated news digests. Short blurbs that link to original sources.",
};

export default function BlogLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <CourseInfoLayout>{children}</CourseInfoLayout>;
}
