import type { ReactNode } from "react";
import { headers } from "next/headers";
import CourseInfoLayout from "@/app/course-info/CourseInfoLayout";
import { isMinimalCourseHeader } from "@/lib/courses/routes";

export default async function SubjectLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const coursePath = (await headers()).get("x-course-path") ?? "";
  return (
    <CourseInfoLayout header={isMinimalCourseHeader(coursePath) ? "home" : "full"}>
      {children}
    </CourseInfoLayout>
  );
}
