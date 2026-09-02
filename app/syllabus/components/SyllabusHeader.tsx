import Link from "next/link";
import { formatLongDate } from "../data/dates";
import type { CourseInfo, CourseSection, SemesterDates } from "../data/types";

function levelLabel(level: CourseSection["level"]): string {
  return level === "undergraduate" ? "Undergrad" : "Grad";
}

function modalityLabel(modality: CourseSection["modality"]): string {
  return modality === "in-person" ? "In person" : "Online";
}

export default function SyllabusHeader({
  course,
  section,
  semester,
}: {
  course: CourseInfo;
  section: CourseSection;
  semester: SemesterDates;
}) {
  return (
    <header id="overview" className="scroll-mt-6 mb-6">
      <p className="font-sans text-sm uppercase tracking-wide text-neutral-500">
        {course.college}
      </p>
      <h1 className="mt-1 font-sans text-4xl font-semibold leading-tight">
        {section.code}-{section.sectionNumber} {course.title}
      </h1>
      <p className="mt-2 text-lg text-neutral-700">
        CRN {section.crn} · {levelLabel(section.level)} ·{" "}
        {modalityLabel(section.modality)} · {section.campus} · {course.term} ·{" "}
        {course.credits} credits
      </p>
      <p className="text-neutral-600">
        {course.instructor.name}
        {" · "}
        <a href={`mailto:${course.instructor.email}`}>{course.instructor.email}</a>
      </p>
      <p className="mt-4 text-[1.05rem] text-neutral-800">
        Companion to{" "}
        <Link href="/book">{course.bookTitle}</Link>, Chapters 1–6. This
        section’s first class is {formatLongDate(section.firstClass)}. University
        term: {formatLongDate(semester.firstDayOfClasses)} –{" "}
        {formatLongDate(semester.lastDayOfClasses)}. Edit sections and dates in{" "}
        <code>app/syllabus/data</code>.
      </p>
    </header>
  );
}
