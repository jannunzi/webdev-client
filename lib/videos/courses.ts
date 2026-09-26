import { semester } from "@/app/syllabus/data/course";
import { sections } from "@/app/syllabus/data/sections";
import { semesterCodeFromTermLabel } from "./semester";

export type VideoCourseOption = {
  id: string;
  label: string;
};

/**
 * Syllabus section → id stored on clip rows.
 * CS 4550 is one section in the roster (`CS4550`). Graduate sections keep
 * the section number (`CS5610-02`, `CS5610-09`).
 */
export function sourceCourseIdForSyllabusSection(section: {
  code: string;
  sectionNumber: string;
}): string {
  const compact = section.code.replace(/\s+/g, "").toUpperCase();
  if (compact === "CS4550") return compact;
  return `${compact}-${section.sectionNumber}`;
}

export function videoCourseOptions(): VideoCourseOption[] {
  return sections.map((section) => ({
    id: sourceCourseIdForSyllabusSection(section),
    label: section.tabLabel,
  }));
}

export function defaultVideoCourseId(): string {
  return videoCourseOptions()[0]?.id ?? "CS4550";
}

/** Current syllabus term, as a clip semester code (`Fall 2026` → `FA26`). */
export function defaultVideoSemester(): string {
  return semesterCodeFromTermLabel(semester.label) ?? "FA26";
}
