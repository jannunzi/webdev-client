import { findSection, sections } from "./sections";
import type {
  OfficeHourRow,
  PiazzaBoard,
  StaffGroup,
  StaffMember,
} from "./types";

/**
 * Per-section staff contacts and office hours.
 * Confirmed windows from Piazza replies on 2026-09-14. Leave unknown
 * hours/contacts TBD. Do not invent Zoom links.
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
  "Piazza is the primary place for course questions — homework, labs, the book, and the project. Do not email staff for those. Posted office hours are walk-up / Microsoft Teams windows with a live check-in line — not calendar booking. Check this page and Piazza if something looks stale.";

export const officeHoursPlaceholder =
  "Hours and contacts that are not confirmed on Piazza stay TBD. Confirmed phone numbers and Teams names are listed. Do not assume a Zoom link.";

export const cs561009TaNote =
  "Giuseppe is Piazza-only (no bookable or queue office hours). Section-specific teaching-assistant office hours for CS 5610-09 are TBA.";

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
  hoursSummary: "Piazza only — no walk-up or Teams line",
  piazzaOnly: true,
  piazzaNote:
    "Piazza-only. Monitors the forum frequently. No bookable office hours and no live check-in queue.",
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
  teams: "trivedi.shl@northeastern.edu",
  phone: "+1 857-427-7547",
  hoursStatus: "posted",
  hours: [
    { days: "Tuesday", time: "11am–12pm" },
    { days: "Wednesday", time: "11am–12pm" },
    { days: "Thursday", time: "11am–1pm" },
  ],
  hoursSummary: "Tue 11am–12pm; Wed 11am–12pm; Thu 11am–1pm (ET)",
  hoursNote: "Confirmed on Piazza 2026-09-14. Microsoft Teams (same as email).",
  location: "Microsoft Teams",
  piazzaHours: [
    { days: "Tuesday", time: "9–11am" },
    { days: "Wednesday", time: "9–11am" },
  ],
  piazzaHoursSummary: "Tue/Wed 9–11am (ET)",
  piazzaNote: "Piazza hours: Tue/Wed 9–11am ET.",
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
  phone: "+1 857-605-9277",
  hoursStatus: "posted",
  hours: [
    { days: "Monday", time: "8–10am" },
    { days: "Thursday", time: "8–10am" },
  ],
  hoursSummary: "Mon/Thu 8–10am (ET, Teams)",
  hoursNote: "Confirmed on Piazza 2026-09-14. Microsoft Teams.",
  location: "Microsoft Teams",
  piazzaHours: [
    { days: "Tuesday", time: "3–5pm" },
    { days: "Wednesday", time: "3–5pm" },
    { days: "Friday", time: "3–5pm" },
    { days: "Saturday", time: "3–5pm" },
  ],
  piazzaHoursSummary: "Tue/Wed/Fri/Sat 3–5pm (ET)",
  piazzaNote: "Piazza hours: Tue/Wed/Fri/Sat 3–5pm ET.",
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
  phone: "857-507-0827",
  hoursStatus: "posted",
  hours: [
    { days: "Friday", time: "9–11am" },
    { days: "Saturday", time: "9–11am" },
  ],
  hoursSummary: "Fri/Sat 9–11am (ET, Teams)",
  hoursNote: "Confirmed on Piazza 2026-09-14. Microsoft Teams.",
  location: "Microsoft Teams",
  piazzaHours: [
    { days: "Monday", time: "7–9am" },
    { days: "Tuesday", time: "7–9am" },
    { days: "Wednesday", time: "7–9am" },
    { days: "Thursday", time: "7–9am" },
  ],
  piazzaHoursSummary: "Mon–Thu 7–9am (ET)",
  piazzaNote: "Piazza hours: Mon–Thu 7–9am ET.",
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

export function findStaffMember(id: string | undefined | null): StaffMember | undefined {
  if (!id) return undefined;
  return staffMembers.find((member) => member.id === id);
}

/** True unless the person is Piazza-only (Giuseppe). */
export function queueEnabledForMember(member: StaffMember): boolean {
  return member.piazzaOnly !== true;
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
  if (member.piazzaOnly) return "Piazza only";
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

export function officeHoursQueueHref(
  taId: string,
  sectionId: string,
): string {
  const params = new URLSearchParams({ section: sectionId });
  return `/office-hours/queue/${taId}?${params.toString()}`;
}
