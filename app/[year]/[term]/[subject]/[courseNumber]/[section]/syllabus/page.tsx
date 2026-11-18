import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SyllabusPage from "@/app/syllabus/SyllabusPage";
import { sections } from "@/app/syllabus/data/sections";
import { FALL_2026_SECTIONS, isTermSlug, WEBDEV_SUBJECT } from "@/lib/courses/routes";

type Params = {
  year: string;
  term: string;
  subject: string;
  courseNumber: string;
  section: string;
};

export function generateStaticParams() {
  return FALL_2026_SECTIONS.map((item) => ({
    year: "2026",
    term: "fall",
    subject: WEBDEV_SUBJECT,
    courseNumber: item.courseNumber,
    section: item.section,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { courseNumber, section } = await params;
  const known = sections.find((item) => item.id === `${courseNumber}-${section}`);
  return {
    title: known
      ? `${known.code}-${known.sectionNumber} — Syllabus`
      : "Syllabus",
  };
}

export default async function ContextualSyllabusPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { year, term, subject, courseNumber, section } = await params;
  if (!isTermSlug(term)) notFound();
  const known = FALL_2026_SECTIONS.some(
    (item) => item.courseNumber === courseNumber && item.section === section,
  );
  if (
    !known ||
    year !== "2026" ||
    term !== "fall" ||
    subject !== WEBDEV_SUBJECT
  ) {
    notFound();
  }
  return <SyllabusPage sectionId={`${courseNumber}-${section}`} />;
}
