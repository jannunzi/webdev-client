import { findSection, sections } from "./sections";
import type {
  OfficeHourRow,
  PiazzaBoard,
  StaffGroup,
  StaffMember,
} from "./types";

/**
 * Per-section staff contacts and office hours.
 * The first Piazza scrape was a draft — keep missing hours/contacts TBD
 * until a Piazza thread confirms them. Do not invent phone, Zoom, or boards.
 */

export const ALL_SECTION_IDS = sections.map((section) => section.id);

export const PIAZZA_PRIMARY_HREF = "https://piazza.com/class/mtkw93ft8hw8w/";

export const piazzaBoards: PiazzaBoard[] = [
  {
    id: "cs4550-01",
    label: "CS 4550-01 Piazza",
    href: PIAZZA_PRIMARY_HREF,
  },
  {
    id: "cs5610-02",
    label: "CS 5610-02 Piazza",
    href: "https://piazza.com/class/mtugls6qxs5iz/",
  },
  {
    id: "cs5610-09",
    label: "CS 5610-09 Piazza",
  },
];

export const officeHoursIntro =
  "Piazza is the primary place for course questions — homework, labs, the book, and the project. Do not email staff for those. Office hours below are subject to update; check this page and Piazza if something looks stale.";

export const officeHoursPlaceholder =
  "Office hours and contacts that are not confirmed on Piazza are marked TBD. Do not assume a phone number or Zoom link.";

export const cs561009TaNote =
  "No CS 5610-09 TA intros with hours were posted beyond Giuseppe. Section-specific teaching-assistant office hours for CS 5610-09 are TBD.";

const jose: StaffMember = {
  id: "jose-annunziato",
  name: "Jose Annunziato",
  role: "Instructor",
  sectionIds: ALL_SECTION_IDS,
  sectionLabel: "All sections (CS 4550-01, CS 5610-02, CS 5610-09)",
  email: "j.annunziato@northeastern.edu",
  alsoEmails: ["jga@ccs.neu.edu", "jga@ccis.neu.edu"],
  altEmails: ["jannunzi@gmail.com"],
  hoursStatus: "tbd",
  hours: [],
  hoursSummary: "TBD — see Piazza",
  piazzaNote:
    "Office hours and Piazza hours are not posted yet. See Piazza for updates.",
};

const giuseppe: StaffMember = {
  id: "giuseppe-marotta",
  name: "Giuseppe Marotta",
  role: "TA",
  sectionIds: ALL_SECTION_IDS,
  sectionLabel: "All sections (CS 4550-01, CS 5610-02, CS 5610-09)",
  email: "marottagiusi123@gmail.com",
  hoursStatus: "tbd",
  hours: [],
  hoursSummary: "Piazza coverage; fixed OH TBD",
  piazzaNote:
    "Monitors Piazza frequently (24×7-style coverage). No fixed office-hour windows posted.",
};

const anurag: StaffMember = {
  id: "anurag-bheemappa",
  name: "Anurag Bheemappa Gnanamurthy",
  role: "TA",
  sectionIds: ["cs4550-01"],
  sectionLabel: "CS 4550-01",
  email: "bheemappagnanamurt.a@northeastern.edu",
  altEmails: ["anurag9596eng@gmail.com"],
  contactMethod: "Microsoft Teams",
  hoursStatus: "tbd",
  hours: [],
  hoursSummary: "TBD",
  piazzaNote: "Office hours are TBD until posted on Piazza.",
  sources: [
    {
      label: "Piazza post 13",
      href: "https://piazza.com/class/mtkw93ft8hw8w/post/13",
    },
  ],
};

const shloka: StaffMember = {
  id: "shloka-trivedi",
  name: "Shloka Shreyans Trivedi",
  role: "TA",
  sectionIds: ["cs4550-01"],
  sectionLabel: "CS 4550-01",
  email: "trivedi.shl@northeastern.edu",
  altEmails: ["shloka.trivedi02@gmail.com"],
  contactMethod: "Microsoft Teams",
  hoursStatus: "tbd",
  hours: [],
  hoursSummary: "TBD",
  piazzaNote: "Office hours are TBD until posted on Piazza.",
  sources: [
    {
      label: "Piazza post 11",
      href: "https://piazza.com/class/mtkw93ft8hw8w/post/11",
    },
  ],
};

const tisha: StaffMember = {
  id: "tisha-kotadia",
  name: "Tisha Sujal Kotadia",
  role: "TA",
  sectionIds: ["cs5610-02"],
  sectionLabel: "CS 5610-02",
  email: "kotadia.t@northeastern.edu",
  altEmails: ["tisha.kotadia@hotmail.com"],
  contactMethod: "Microsoft Teams",
  teams: "@Tisha Sujal Kotadia",
  hoursStatus: "posted",
  hours: [
    { days: "Thursday", time: "7–9am and 12:30–2:30pm" },
    { days: "Friday", time: "7–9am and 12:30–2:30pm" },
    { days: "Saturday", time: "7–9am" },
  ],
  hoursSummary:
    "Thu 7–9am + 12:30–2:30pm; Fri 7–9am + 12:30–2:30pm; Sat 7–9am (ET)",
  hoursNote:
    "Posted as 10 hours. Course target is 4 hours/week over 2–4 days.",
  location: "Khoury",
  sources: [
    {
      label: "Piazza post 11",
      href: "https://piazza.com/class/mtugls6qxs5iz/post/11",
    },
  ],
};

const aryan: StaffMember = {
  id: "aryan-mehta",
  name: "Aryan Alpesh Mehta",
  role: "TA",
  sectionIds: ["cs5610-02"],
  sectionLabel: "CS 5610-02",
  email: "mehta.arya@northeastern.edu",
  altEmails: ["aryanmehta5902@gmail.com"],
  contactMethod: "Microsoft Teams",
  teams: "@Aryan Mehta",
  hoursStatus: "posted",
  hours: [
    { days: "Thursday", time: "6–9pm" },
    { days: "Friday", time: "6–9pm" },
    { days: "Saturday", time: "12–2pm and 5–7pm" },
  ],
  hoursSummary: "Thu 6–9pm; Fri 6–9pm; Sat 12–2pm + 5–7pm (ET)",
  location: "Khoury",
  sources: [
    {
      label: "Piazza post 13",
      href: "https://piazza.com/class/mtugls6qxs5iz/post/13",
    },
    {
      label: "Piazza post 14",
      href: "https://piazza.com/class/mtugls6qxs5iz/post/14",
    },
  ],
};

export const staffMembers: StaffMember[] = [
  jose,
  giuseppe,
  anurag,
  shloka,
  tisha,
  aryan,
];

export function memberCoversSection(
  member: StaffMember,
  sectionId: string,
): boolean {
  return member.sectionIds.includes(sectionId);
}

export function staffMembersForSection(sectionId: string): StaffMember[] {
  return staffMembers.filter((member) =>
    memberCoversSection(member, sectionId),
  );
}

function isSharedStaff(member: StaffMember): boolean {
  return member.sectionIds.length > 1;
}

export function sectionTaNote(sectionId: string): string | undefined {
  if (sectionId === "cs5610-09") return cs561009TaNote;
  return undefined;
}

export function staffGroupsForSection(sectionId: string): StaffGroup[] {
  const section = findSection(sectionId);
  const members = staffMembersForSection(sectionId);
  const instructor = members.filter((member) => member.role === "Instructor");
  const sharedTas = members.filter(
    (member) => member.role === "TA" && isSharedStaff(member),
  );
  const sectionTas = members.filter(
    (member) => member.role === "TA" && !isSharedStaff(member),
  );

  return [
    { id: "instructor", title: "Instructor", members: instructor },
    {
      id: "course-wide-ta",
      title: "Course-wide teaching assistant",
      members: sharedTas,
    },
    {
      id: "section-tas",
      title: `${section.code}-${section.sectionNumber} teaching assistants`,
      members: sectionTas,
      note: sectionTas.length === 0 ? sectionTaNote(sectionId) : undefined,
    },
  ];
}

export function piazzaBoardForSection(sectionId: string): PiazzaBoard {
  return (
    piazzaBoards.find((board) => board.id === sectionId) ?? {
      id: sectionId,
      label: "Piazza",
    }
  );
}

function tableLocation(member: StaffMember): string {
  return member.location ?? "—";
}

export function officeHourRowForMember(member: StaffMember): OfficeHourRow {
  return {
    name: member.name,
    role: member.role,
    sections: member.sectionLabel,
    hours: member.hoursSummary,
    location: tableLocation(member),
    contact: member.email,
  };
}

export function officeHourRowsForSection(sectionId: string): OfficeHourRow[] {
  return staffMembersForSection(sectionId).map(officeHourRowForMember);
}

/** Unfiltered rows — tests and callers should prefer `officeHourRowsForSection`. */
export const officeHourRows: OfficeHourRow[] =
  staffMembers.map(officeHourRowForMember);

export const officeHourColumns = [
  "Name",
  "Role",
  "Sections",
  "Hours",
  "Location",
  "Contact",
] as const;
