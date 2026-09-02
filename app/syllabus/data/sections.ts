import { semester } from "./course";
import type { CourseSection } from "./types";

export const SECTION_STORAGE_KEY = "syllabus-section-id";

/**
 * Official Fall 2026 sections. Every section meets once per week.
 * Meeting days and clock times are locked. Rooms / Zoom stay TBA.
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
    daysOfWeek: [3],
    time: "6:00–9:00pm ET",
    // TODO(jose): Fill the Boston room when assigned. Do not invent one.
    location: "TBA — room not posted",
    tabLabel: "CS 4550-01 · In person",
    notes: [
      "Undergraduate, in person, Boston. Meets once a week on Wednesdays, 6:00–9:00pm ET, starting September 9, 2026.",
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
    daysOfWeek: [1],
    time: "6:00–9:00pm ET",
    // TODO(jose): Fill the Boston room when assigned. Do not invent one.
    location: "TBA — room not posted",
    tabLabel: "CS 5610-02 · In person",
    notes: [
      "Graduate, in person, Boston. Meets once a week on Mondays, 6:00–9:00pm ET, starting September 14, 2026.",
      "Canvas assignment, quiz, exam, and project dates are the same as every other section. This section has less runway before the earliest deadlines.",
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
    daysOfWeek: [5],
    time: "2:00–5:00pm ET",
    // TODO(jose): Fill Canvas / Zoom when posted. Do not invent a link.
    location: "TBA — online meeting not posted",
    tabLabel: "CS 5610-09 · Online",
    notes: [
      "Graduate, online. Meets once a week on Fridays, 2:00–5:00pm ET, starting September 11, 2026.",
    ],
  },
];

export const defaultSectionId = sections[0].id;

export function findSection(id: string | null | undefined): CourseSection {
  return sections.find((section) => section.id === id) ?? sections[0];
}
