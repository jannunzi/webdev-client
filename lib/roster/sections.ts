import type { CanvasRosterEntry } from "./types";

export const UNSECTIONED_LABEL = "Unsectioned";

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
