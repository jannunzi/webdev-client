import type { ReactNode } from "react";
import { course } from "@/app/syllabus/data";

export default function CourseInfoHeader({
  title,
  lede,
}: {
  title: string;
  lede?: ReactNode;
}) {
  return (
    <header className="mb-6">
      <p className="font-sans text-sm uppercase tracking-wide text-neutral-500">
        {course.college}
      </p>
      <p className="mt-1 font-sans text-sm text-neutral-600">
        CS 4550 / CS 5610 · {course.title} · {course.term}
      </p>
      <h1 className="mt-1 font-sans text-4xl font-semibold leading-tight">
        {title}
      </h1>
      {lede}
    </header>
  );
}
