import type { Metadata } from "next";
import CourseOfferingCards from "@/app/courses/CourseOfferingCards";
import { course } from "@/app/syllabus/data/course";

export const metadata: Metadata = {
  title: "Courses — Khoury College",
  description:
    "Course sections for Web Development and upcoming Khoury offerings. Open a section to read its syllabus.",
};

export default function CourseLandingPage() {
  return (
    <article className="page-content">
      <header className="mb-6">
        <p className="font-sans text-sm uppercase tracking-wide text-neutral-500">
          {course.college}
        </p>
        <h1
          id="wd-course-dashboard-title"
          className="mt-1 font-sans text-4xl font-semibold leading-tight"
        >
          Courses
        </h1>
        <p className="mt-2 text-lg text-neutral-700">
          Choose a section to open its syllabus.
        </p>
      </header>
      <CourseOfferingCards />
    </article>
  );
}
