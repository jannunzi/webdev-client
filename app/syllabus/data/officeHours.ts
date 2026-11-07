import type { OfficeHourRow } from "./types";

/**
 * Teaching-assistant slots reported by Giuseppe.
 * Every TA meets on Microsoft Teams. No join URL was published — do not add one.
 * Giuseppe Marotta holds no office hours. His email was not provided.
 */
export const officeHoursPlaceholder =
  "Teaching assistants meet on Microsoft Teams. No join link is published — check that section’s Piazza announcements or email the TA for how to join.";

const teamsLocation = "Microsoft Teams — no join link posted";

export const officeHourRows: OfficeHourRow[] = [
  {
    name: "Shloka Shreyans Trivedi",
    role: "Teaching assistant, CS 4550-01",
    hours: "Thursday and Friday, 10:00am–2:00pm ET",
    location: teamsLocation,
    contact: "trivedi.shl@northeastern.edu",
  },
  {
    name: "Anurag Bheemappa Gnanamurthy",
    role: "Teaching assistant, CS 4550-01",
    hours: "Fridays, 5:00–11:00pm ET",
    location: teamsLocation,
    contact: "bheemappagnanamurt.a@northeastern.edu",
  },
  {
    name: "Tisha Sujal Kotadia",
    role: "Teaching assistant, CS 5610-02",
    hours:
      "Friday evenings, starting 7:00pm ET; end time varies",
    location: teamsLocation,
    contact: "kotadia.t@northeastern.edu",
  },
  {
    name: "Aryan Alpesh Mehta",
    role: "Teaching assistant, CS 5610-02",
    hours:
      "Weekends; day and time vary",
    location: teamsLocation,
    contact: "mehta.arya@northeastern.edu",
  },
  {
    name: "Tanishq Neela",
    role: "Teaching assistant, CS 5610-09",
    hours: "Monday and Wednesday, 7:00–11:00am ET",
    location: teamsLocation,
    contact: "neela.t@northeastern.edu",
  },
  {
    name: "Geethanjali Ravichandra",
    role: "Teaching assistant, CS 5610-09",
    hours: "Thursday and Friday, 7:00–11:00am ET",
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
 * Monday and Wednesday are in person, 3:00–4:00pm America/New_York,
 * Meserve Hall 052 (basement). Thursday and Friday are on Zoom; no clock
 * time and no join URL were given. The Zoom link goes out as a Piazza invite.
 */
export type InstructorOfficeBlock = {
  id: string;
  days: string;
  /** Clock time only when it was explicitly confirmed. */
  time?: string;
  modality: "in-person" | "zoom";
  /** Room when one has been confirmed. Do not store an unconfirmed Zoom URL. */
  place?: string;
};

export const instructorOfficeBlocks: readonly InstructorOfficeBlock[] = [
  {
    id: "mon-wed-in-person",
    days: "Monday and Wednesday",
    time: "3:00–4:00pm ET",
    modality: "in-person",
    place: "Meserve Hall 052 (basement)",
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
    return `${block.days} on Zoom`;
  }
  return block.days;
}

export function formatInstructorOfficeLocation(block: InstructorOfficeBlock): string {
  if (block.place) return block.place;
  if (block.modality === "in-person") return "In person — room not yet posted";
  return "An invite with the Zoom link will be posted on Piazza.";
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
