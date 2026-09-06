import type { CanvasRosterEntry } from "./types";

export const UNSECTIONED_LABEL = "Unsectioned";

/** Fall 2026 course sections used by staff filters and quiz take overrides. */
export const COURSE_SECTION_IDS = ["CS4550", "CS5610-02", "CS5610-09"] as const;

export type CourseSectionId = (typeof COURSE_SECTION_IDS)[number];

export function isCourseSectionId(value: string): value is CourseSectionId {
  return (COURSE_SECTION_IDS as readonly string[]).includes(value);
}

/**
 * Map a `canvas_roster.section` label to a course section id.
 * Accepts exact ids (`CS4550`) and Canvas labels (`CS4550 CRN 11464`).
 */
export function courseSectionIdFromRoster(
  raw: string | undefined | null,
): CourseSectionId | undefined {
  const trimmed = raw?.trim();
  if (!trimmed) return undefined;
  if (isCourseSectionId(trimmed)) return trimmed;

  const ranked = [...COURSE_SECTION_IDS].sort((a, b) => b.length - a.length);
  for (const id of ranked) {
    if (trimmed.length < id.length) continue;
    if (trimmed.slice(0, id.length).toUpperCase() !== id.toUpperCase()) {
      continue;
    }
    const next = trimmed.charAt(id.length);
    if (next === "" || !/[A-Za-z0-9]/.test(next)) return id;
  }
  return undefined;
}

export type RosterSectionGroup = {
  section: string;
  students: CanvasRosterEntry[];
};

export function studentDisplayName(entry: CanvasRosterEntry): string {
  const name = entry.name?.trim();
  return name || entry.email;
}

export function compareStudents(
  a: CanvasRosterEntry,
  b: CanvasRosterEntry,
): number {
  const byName = studentDisplayName(a).localeCompare(studentDisplayName(b), undefined, {
    sensitivity: "base",
  });
  if (byName !== 0) return byName;
  return a.email.localeCompare(b.email, undefined, { sensitivity: "base" });
}

export function compareSectionLabels(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

export function groupRosterBySection(
  entries: CanvasRosterEntry[],
): RosterSectionGroup[] {
  const groups = new Map<string, CanvasRosterEntry[]>();
  for (const entry of entries) {
    const section = entry.section?.trim() || UNSECTIONED_LABEL;
    const students = groups.get(section) ?? [];
    students.push(entry);
    groups.set(section, students);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => compareSectionLabels(a, b))
    .map(([section, students]) => ({
      section,
      students: [...students].sort(compareStudents),
    }));
}
