import type { OfficeHourRow } from "./types";

/**
 * Teaching-assistant slots reported by Giuseppe.
 * Every TA meets on Microsoft Teams. No join URL was published — do not add one.
 * Giuseppe Marotta holds no office hours. His email was not provided.
 */
export const officeHoursPlaceholder =
  "Actual times are announced weekly on each section’s Piazza. Teaching assistants meet on Microsoft Teams. No join link is published — check that section’s Piazza announcements or email the TA for how to join.";

const teamsLocation = "Microsoft Teams — no join link posted";

export const officeHourRows: OfficeHourRow[] = [
  {
    name: "Shloka Shreyans Trivedi",
    role: "Teaching assistant, CS 4550-01",
    hours: "Typical recent slot: Thursday and Friday, about 10:00am–2:00pm ET",
    location: teamsLocation,
    contact: "trivedi.shl@northeastern.edu",
  },
  {
    name: "Anurag Bheemappa Gnanamurthy",
    role: "Teaching assistant, CS 4550-01",
    hours: "Typical recent slot: Fridays, 5:00–11:00pm ET",
    location: teamsLocation,
    contact: "bheemappagnanamurt.a@northeastern.edu",
  },
  {
    name: "Tisha Sujal Kotadia",
    role: "Teaching assistant, CS 5610-02",
    hours:
      "Typical recent slot: Friday evenings, starting 7:00pm ET; end time varies",
    location: teamsLocation,
    contact: "kotadia.t@northeastern.edu",
  },
  {
    name: "Aryan Alpesh Mehta",
    role: "Teaching assistant, CS 5610-02",
    hours:
      "No fixed slot. Varies weekly; latest sessions were on weekends",
    location: teamsLocation,
    contact: "mehta.arya@northeastern.edu",
  },
  {
    name: "Tanishq Neela",
    role: "Teaching assistant, CS 5610-09",
    hours: "Typical recent slot: Monday and Wednesday, 7:00–11:00am ET",
    location: teamsLocation,
    contact: "neela.t@northeastern.edu",
  },
  {
    name: "Geethanjali Ravichandra",
    role: "Teaching assistant, CS 5610-09",
    hours: "Typical recent slot: Thursday and Friday, 7:00–11:00am ET",
    location: teamsLocation,
    contact: "ravichandra.g@northeastern.edu",
  },
  {
    name: "Giuseppe Marotta",
    role: "Course staff",
    hours: "No office hours. Answers questions on Piazza",
    location: "Piazza",
    contact: "Piazza",
  },
];

/**
 * Instructor blocks confirmed by Jose.
 * Monday and Wednesday are in person, 3:00–4:00pm America/New_York.
 * Thursday and Friday are on Zoom; no clock time was given.
 * `place` is only a room or join URL already posted in site data.
 */
export type InstructorOfficeBlock = {
  id: string;
  days: string;
  /** Clock time only when it was explicitly confirmed. */
  time?: string;
  modality: "in-person" | "zoom";
  /** Room or Zoom join URL. Omit when it has not been posted. */
  place?: string;
};

export const instructorOfficeBlocks: readonly InstructorOfficeBlock[] = [
  {
    id: "mon-wed-in-person",
    days: "Monday and Wednesday",
    time: "3:00–4:00pm ET",
    modality: "in-person",
  },
  {
    id: "thu-fri-zoom",
    days: "Thursday and Friday",
    modality: "zoom",
  },
];

export function formatInstructorOfficeHours(block: InstructorOfficeBlock): string {
  if (block.time && block.modality === "zoom") {
    return `${block.days}, ${block.time}, on Zoom`;
  }
  if (block.time) {
    return `${block.days}, ${block.time}`;
  }
  if (block.modality === "zoom") {
    return `${block.days} on Zoom — time not yet posted`;
  }
  return `${block.days} — time not yet posted`;
}

export function formatInstructorOfficeLocation(block: InstructorOfficeBlock): string {
  if (block.place) return block.place;
  if (block.modality === "in-person") return "In person — room not yet posted";
  return "Zoom — join link not yet posted";
}

export function instructorOfficeHourRows(instructor: {
  name: string;
  role: string;
  email: string;
}): OfficeHourRow[] {
  return instructorOfficeBlocks.map((block) => ({
    name: instructor.name,
    role: instructor.role,
    hours: formatInstructorOfficeHours(block),
    location: formatInstructorOfficeLocation(block),
    contact: instructor.email,
  }));
}

export const officeHourColumns = [
  "Name",
  "Role",
  "Hours",
  "Location",
  "Contact",
] as const;
