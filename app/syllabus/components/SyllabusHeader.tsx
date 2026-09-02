import Link from "next/link";
import { formatLongDate } from "../data/dates";
import type { CourseInfo, SemesterDates } from "../data/types";

export default function SyllabusHeader({
  course,
  semester,
}: {
  course: CourseInfo;
  semester: SemesterDates;
}) {
  return (
    <header id="overview" className="scroll-mt-6 mb-8">
      <p className="font-sans text-sm uppercase tracking-wide text-neutral-500">
        {course.college}
      </p>
      <h1 className="mt-1 font-sans text-4xl font-semibold leading-tight">
        {course.code} {course.title}
      </h1>
      <p className="mt-2 text-lg text-neutral-700">
        {course.section} · {course.term} · {course.credits} credits
      </p>
      <p className="text-neutral-600">
        {course.instructor.name}
        {" · "}
        <a href={`mailto:${course.instructor.email}`}>{course.instructor.email}</a>
      </p>
      <p className="mt-4 text-[1.05rem] text-neutral-800">
        Companion to{" "}
        <Link href="/book">{course.bookTitle}</Link>, Chapters 1–6. First day of
        classes {formatLongDate(semester.firstDayOfClasses)}; last day of
        classes {formatLongDate(semester.lastDayOfClasses)}. This page is
        generated from typed modules under <code>app/syllabus/data</code> —
        change the semester there, not in the JSX.
      </p>
    </header>
  );
}
