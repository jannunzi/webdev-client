import type { ReactNode } from "react";
import CourseInfoLayout from "@/app/course-info/CourseInfoLayout";

export default function CourseHomeLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <CourseInfoLayout header="home">{children}</CourseInfoLayout>;
}
