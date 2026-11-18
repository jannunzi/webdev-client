/**
 * Course offerings shown on the site landing page.
 *
 * Add next semester's CS5610 / CS4550 by appending an entry. Each section
 * becomes its own card. CS4550 and CS5610 keep sharing `/book`. A course
 * with no sections yet (CS5500) is one card and uses its own book route.
 */

import { formatMeetingWeekdays } from "@/app/syllabus/data/dates";
import { sections as syllabusSections } from "@/app/syllabus/data/sections";
import {
  courseNumberPath,
  FOUNDATIONS_SUBJECT,
  parseSectionToken,
  sectionSyllabusPath,
  sharedPagePath,
  WEBDEV_SUBJECT,
} from "./routes";

export type TermSeason = "Fall" | "Spring" | "Summer" | "Winter";

export type OfferingStatus = "active" | "coming-soon";

export type CourseTerm = {
  season: TermSeason;
  year: number;
};

export type OfferingSection = {
  /** Syllabus section id, e.g. `cs5610-02`. */
  id: string;
  /** Card line, e.g. `CS5610-02`. */
  label: string;
  /** Meeting modality shown under the section label. */
  detail?: string;
  syllabusHref: string;
};

export type CourseOffering = {
  id: string;
  /** Display number with no space, e.g. `CS5610`. */
  courseNumber: string;
  title: string;
  term: CourseTerm;
  status: OfferingStatus;
  /** Where the offering's syllabus lives. Section cards use their own href. */
  syllabusHref: string;
  bookHref: string;
  sections: OfferingSection[];
  /**
   * Meeting facts when the offering has no syllabus section yet.
   * Online offerings omit a room.
   */
  meeting?: {
    delivery: "Online" | "In person";
    when: string;
  };
};

const SEASON_RANK: Record<TermSeason, number> = {
  Spring: 1,
  Summer: 2,
  Fall: 3,
  Winter: 4,
};

/** Newer terms first. Within a year, Fall, then Summer, then Spring. */
export function termSortKey(term: CourseTerm): number {
  return term.year * 10 + SEASON_RANK[term.season];
}

export const courseOfferings: CourseOffering[] = [
  {
    id: "cs5610-sp2027",
    courseNumber: "CS5610",
    title: "Web Development",
    term: { season: "Spring", year: 2027 },
    status: "coming-soon",
    syllabusHref: courseNumberPath({
      year: "2027",
      term: "spring",
      subject: WEBDEV_SUBJECT,
      courseNumber: "cs5610",
    }),
    bookHref: sharedPagePath(
      { year: "2026", term: "fall", subject: WEBDEV_SUBJECT },
      "book",
    ),
    sections: [],
  },
  {
    id: "cs4550-sp2027",
    courseNumber: "CS4550",
    title: "Web Development",
    term: { season: "Spring", year: 2027 },
    status: "coming-soon",
    syllabusHref: courseNumberPath({
      year: "2027",
      term: "spring",
      subject: WEBDEV_SUBJECT,
      courseNumber: "cs4550",
    }),
    bookHref: sharedPagePath(
      { year: "2026", term: "fall", subject: WEBDEV_SUBJECT },
      "book",
    ),
    sections: [],
  },
  {
    id: "cs5610-fa2026",
    courseNumber: "CS5610",
    title: "Web Development",
    term: { season: "Fall", year: 2026 },
    status: "active",
    syllabusHref: sectionSyllabusPath({
      year: "2026",
      term: "fall",
      subject: WEBDEV_SUBJECT,
      courseNumber: "cs5610",
      section: "02",
    }),
    bookHref: sharedPagePath(
      { year: "2026", term: "fall", subject: WEBDEV_SUBJECT },
      "book",
    ),
    sections: [
      {
        id: "cs5610-02",
        label: "CS5610-02",
        detail: "In person",
        syllabusHref: sectionSyllabusPath({
          year: "2026",
          term: "fall",
          subject: WEBDEV_SUBJECT,
          courseNumber: "cs5610",
          section: "02",
        }),
      },
      {
        id: "cs5610-09",
        label: "CS5610-09",
        detail: "Online",
        syllabusHref: sectionSyllabusPath({
          year: "2026",
          term: "fall",
          subject: WEBDEV_SUBJECT,
          courseNumber: "cs5610",
          section: "09",
        }),
      },
    ],
  },
  {
    id: "cs4550-fa2026",
    courseNumber: "CS4550",
    title: "Web Development",
    term: { season: "Fall", year: 2026 },
    status: "active",
    syllabusHref: sectionSyllabusPath({
      year: "2026",
      term: "fall",
      subject: WEBDEV_SUBJECT,
      courseNumber: "cs4550",
      section: "01",
    }),
    bookHref: sharedPagePath(
      { year: "2026", term: "fall", subject: WEBDEV_SUBJECT },
      "book",
    ),
    sections: [
      {
        id: "cs4550-01",
        label: "CS4550-01",
        detail: "In person",
        syllabusHref: sectionSyllabusPath({
          year: "2026",
          term: "fall",
          subject: WEBDEV_SUBJECT,
          courseNumber: "cs4550",
          section: "01",
        }),
      },
    ],
  },
  {
    id: "cs5500-su2027",
    courseNumber: "CS5500",
    title: "Foundations of Software Engineering",
    term: { season: "Summer", year: 2027 },
    status: "coming-soon",
    syllabusHref: courseNumberPath({
      year: "2027",
      term: "summer",
      subject: FOUNDATIONS_SUBJECT,
      courseNumber: "cs5500",
    }),
    bookHref: sharedPagePath(
      { year: "2027", term: "summer", subject: FOUNDATIONS_SUBJECT },
      "book",
    ),
    sections: [],
    meeting: {
      delivery: "Online",
      when: "Mon/Wed 3:00–4:30 PM",
    },
  },
];

export type LandingCard = {
  id: string;
  offeringId: string;
  /** Long label used outside the card, including term. */
  heading: string;
  /** Card title: CS5610-02, or CS5610 when there is no section yet. */
  title: string;
  /** Course name, delivery, and meeting facts. No course number or section. */
  lines: string[];
  term: CourseTerm;
  sectionId: string | null;
  sectionLabel: string | null;
  detail: string | null;
  status: OfferingStatus;
  href: string;
  bookHref: string;
};

export type LandingGroup = {
  id: string;
  label: string;
  term: CourseTerm;
  cards: LandingCard[];
};

/** Same card width in every term: 3 columns on desktop, 2 on tablet, 1 on a phone. */
export function termCardGridClass(): string {
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
}

export function termLabel(term: CourseTerm): string {
  return `${term.season} ${term.year}`;
}

/** "CS5610 · Web Development · Fall 2026" */
export function offeringHeading(offering: CourseOffering): string {
  return `${offering.courseNumber} · ${offering.title} · ${termLabel(offering.term)}`;
}

export function offeringById(id: string): CourseOffering | undefined {
  return courseOfferings.find((offering) => offering.id === id);
}

function meetingLines(sectionId: string, fallbackDetail?: string): string[] {
  const section = syllabusSections.find((item) => item.id === sectionId);
  if (!section) return fallbackDetail ? [fallbackDetail] : [];
  const lines = [section.modality === "online" ? "Online" : "In person"];
  if (section.daysOfWeek.length > 0 && section.time) {
    lines.push(`${formatMeetingWeekdays(section.daysOfWeek)}, ${section.time}`);
  }
  if (section.modality !== "online" && section.location.trim()) {
    lines.push(section.location);
  }
  return lines;
}

function cardsForOffering(offering: CourseOffering): LandingCard[] {
  const heading = offeringHeading(offering);
  if (offering.sections.length === 0) {
    return [
      {
        id: offering.id,
        offeringId: offering.id,
        heading,
        title: offering.courseNumber,
        lines: [
          offering.title,
          ...(offering.meeting
            ? [offering.meeting.delivery, offering.meeting.when]
            : []),
        ],
        term: offering.term,
        sectionId: null,
        sectionLabel: null,
        detail: null,
        status: offering.status,
        href: offering.syllabusHref,
        bookHref: offering.bookHref,
      },
    ];
  }
  return offering.sections.map((section) => ({
    id: section.id,
    offeringId: offering.id,
    heading,
    title: section.label,
    lines: [offering.title, ...meetingLines(section.id, section.detail)],
    term: offering.term,
    sectionId: section.id,
    sectionLabel: section.label,
    detail: section.detail ?? null,
    status: offering.status,
    href: section.syllabusHref,
    bookHref: offering.bookHref,
  }));
}

/**
 * Cards grouped by term, newest term first. Within a term, offerings stay
 * in `courseOfferings` order. A course with no sections is one card.
 */
export function landingGroups(
  offerings: readonly CourseOffering[] = courseOfferings,
): LandingGroup[] {
  const groups: LandingGroup[] = [];
  for (const offering of offerings) {
    const id = `${offering.term.year}-${offering.term.season.toLowerCase()}`;
    let group = groups.find((item) => item.id === id);
    if (!group) {
      group = {
        id,
        label: termLabel(offering.term),
        term: offering.term,
        cards: [],
      };
      groups.push(group);
    }
    group.cards.push(...cardsForOffering(offering));
  }
  return groups.sort((a, b) => termSortKey(b.term) - termSortKey(a.term));
}

export function landingCards(
  offerings: readonly CourseOffering[] = courseOfferings,
): LandingCard[] {
  return landingGroups(offerings).flatMap((group) => group.cards);
}

/**
 * Section id from an old tab address: `cs5610-02`, `#cs5610-02`,
 * `CS5610-02`, or `syllabus-tab-cs5610-02`.
 */
export function sectionIdFromLegacyTab(
  value: string | null | undefined,
): string | undefined {
  const parsed = parseSectionToken(value);
  if (!parsed) return undefined;
  return `${parsed.courseNumber}-${parsed.section}`;
}

export function legacySectionPath(sectionId: string): string | undefined {
  const parsed = parseSectionToken(sectionId);
  if (!parsed) return undefined;
  return sectionSyllabusPath({
    year: "2026",
    term: "fall",
    subject: WEBDEV_SUBJECT,
    courseNumber: parsed.courseNumber,
    section: parsed.section,
  });
}

/** Path aliases for the old section tabs. Query and hash forms are handled on `/syllabus`. */
export function legacyTabRedirects(): {
  source: string;
  destination: string;
  permanent: boolean;
}[] {
  const redirects: { source: string; destination: string; permanent: boolean }[] = [];
  for (const card of landingCards()) {
    if (!card.sectionId) continue;
    redirects.push(
      {
        source: `/syllabus-tab-${card.sectionId}`,
        destination: card.href,
        permanent: false,
      },
      {
        source: `/${card.sectionId}`,
        destination: card.href,
        permanent: false,
      },
    );
  }
  return redirects;
}
