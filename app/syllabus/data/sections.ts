import { semester } from "./course";
import type { CourseSection } from "./types";

export const SECTION_STORAGE_KEY = "syllabus-section-id";

/**
 * Official Fall 2026 sections. First-class dates are confirmed.
 *
 * TODO(jose): Meeting days and clock times are placeholders so the agenda
 * projector has a weekday pattern that includes each section’s firstClass.
 * Edit `daysOfWeek` and `time` when the registrar / Canvas schedule is final.
 * Do not invent rooms — leave `location` as TBA until a room or Zoom is posted.
 */
export const sections: CourseSection[] = [
  {
    id: "cs4550-01",
    code: "CS 4550",
    sectionNumber: "01",
    crn: "11464",
    level: "undergraduate",
    modality: "in-person",
    campus: "Boston",
    firstClass: "2026-09-09",
    lastClass: semester.lastDayOfClasses,
    // TODO(jose): Confirm meeting days. Mon/Wed is a placeholder so the first
    // meeting lands on Wed 2026-09-09 (Mon 2026-09-07 is Labor Day).
    daysOfWeek: [1, 3],
    // TODO(jose): Confirm start/end time.
    time: "TBA — meeting time not posted",
    // TODO(jose): Fill the Boston room when assigned. Do not invent one.
    location: "TBA — room not posted",
    tabLabel: "CS 4550-01 · In person",
    notes: [
      "Undergraduate, in person, Boston. First class is Wednesday, September 9, 2026.",
      "Meeting days and the clock time are placeholders until Jose confirms the official pattern.",
    ],
  },
  {
    id: "cs5610-02",
    code: "CS 5610",
    sectionNumber: "02",
    crn: "17395",
    level: "graduate",
    modality: "in-person",
    campus: "Boston",
    firstClass: "2026-09-14",
    lastClass: semester.lastDayOfClasses,
    // TODO(jose): Confirm meeting days. Mon/Thu is a placeholder so the first
    // meeting lands on Mon 2026-09-14.
    daysOfWeek: [1, 4],
    // TODO(jose): Confirm start/end time.
    time: "TBA — meeting time not posted",
    // TODO(jose): Fill the Boston room when assigned. Do not invent one.
    location: "TBA — room not posted",
    tabLabel: "CS 5610-02 · In person",
    notes: [
      "Graduate, in person, Boston. First class is Monday, September 14, 2026 — a few days after the undergraduate section.",
      "Canvas assignment, quiz, exam, and project dates are the same as every other section. This section has less runway before the earliest deadlines.",
      "Meeting days and the clock time are placeholders until Jose confirms the official pattern.",
    ],
  },
  {
    id: "cs5610-09",
    code: "CS 5610",
    sectionNumber: "09",
    crn: "21441",
    level: "graduate",
    modality: "online",
    campus: "Online",
    firstClass: "2026-09-11",
    lastClass: semester.lastDayOfClasses,
    // TODO(jose): Confirm meeting days. Tue/Fri is a placeholder so the first
    // meeting lands on Fri 2026-09-11 (Tue 2026-09-08 is before the term).
    daysOfWeek: [2, 5],
    // TODO(jose): Confirm start/end time or async/live mix.
    time: "TBA — meeting time not posted",
    // TODO(jose): Fill Canvas / Zoom when posted. Do not invent a link.
    location: "TBA — online meeting not posted",
    tabLabel: "CS 5610-09 · Online",
    notes: [
      "Graduate, online. First class is Friday, September 11, 2026.",
      "Meeting days and the clock time are placeholders until Jose confirms the official pattern.",
    ],
  },
];

export const defaultSectionId = sections[0].id;

export function findSection(id: string | null | undefined): CourseSection {
  return sections.find((section) => section.id === id) ?? sections[0];
}
