import type { Metadata } from "next";
import type { ReactNode } from "react";
import CourseInfoLayout from "@/app/course-info/CourseInfoLayout";

export const metadata: Metadata = {
  title: "CS5500 — Foundations of Software Engineering",
  description: "CS5500, Foundations of Software Engineering, Summer 2027. Coming soon.",
};

export default function Cs5500Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <CourseInfoLayout>{children}</CourseInfoLayout>;
}
