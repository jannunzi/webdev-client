/**
 * Course offerings shown on the site landing page.
 *
 * Add next semester's CS5610 / CS4550 by appending an entry. Each section
 * becomes its own card. CS4550 and CS5610 keep sharing `/book`. A course
 * with no sections yet (CS5500) is one card and uses its own book route.
 */

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
};

export const courseOfferings: CourseOffering[] = [
  {
    id: "cs5610-fa2026",
    courseNumber: "CS5610",
    title: "Web Development",
    term: { season: "Fall", year: 2026 },
    status: "active",
    syllabusHref: "/syllabus/cs5610-02",
    bookHref: "/book",
    sections: [
      {
        id: "cs5610-02",
        label: "CS5610-02",
        detail: "In person",
        syllabusHref: "/syllabus/cs5610-02",
      },
      {
        id: "cs5610-09",
        label: "CS5610-09",
        detail: "Online",
        syllabusHref: "/syllabus/cs5610-09",
      },
    ],
  },
  {
    id: "cs4550-fa2026",
    courseNumber: "CS4550",
    title: "Web Development",
    term: { season: "Fall", year: 2026 },
    status: "active",
    syllabusHref: "/syllabus/cs4550-01",
    bookHref: "/book",
    sections: [
      {
        id: "cs4550-01",
        label: "CS4550-01",
        detail: "In person",
        syllabusHref: "/syllabus/cs4550-01",
      },
    ],
  },
  {
    id: "cs5500-su2027",
    courseNumber: "CS5500",
    title: "Foundations of Software Engineering",
    term: { season: "Summer", year: 2027 },
    status: "coming-soon",
    syllabusHref: "/cs5500",
    bookHref: "/cs5500/book",
    sections: [],
  },
];

export type LandingCard = {
  id: string;
  offeringId: string;
  heading: string;
  sectionId: string | null;
  sectionLabel: string | null;
  detail: string | null;
  status: OfferingStatus;
  href: string;
  bookHref: string;
};

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

/**
 * One card per section. An offering with no sections (a coming-soon course)
 * is a single card. Order follows `courseOfferings`.
 */
export function landingCards(
  offerings: readonly CourseOffering[] = courseOfferings,
): LandingCard[] {
  const cards: LandingCard[] = [];
  for (const offering of offerings) {
    const heading = offeringHeading(offering);
    if (offering.sections.length === 0) {
      cards.push({
        id: offering.id,
        offeringId: offering.id,
        heading,
        sectionId: null,
        sectionLabel: null,
        detail: null,
        status: offering.status,
        href: offering.syllabusHref,
        bookHref: offering.bookHref,
      });
      continue;
    }
    for (const section of offering.sections) {
      cards.push({
        id: section.id,
        offeringId: offering.id,
        heading,
        sectionId: section.id,
        sectionLabel: section.label,
        detail: section.detail ?? null,
        status: offering.status,
        href: section.syllabusHref,
        bookHref: offering.bookHref,
      });
    }
  }
  return cards;
}

const TAB_ID_PREFIX = "syllabus-tab-";

/**
 * Section id from an old tab address: `cs5610-02`, `#cs5610-02`, or
 * `syllabus-tab-cs5610-02` (the tab button id).
 */
export function sectionIdFromLegacyTab(
  value: string | null | undefined,
): string | undefined {
  if (!value) return undefined;
  let token = value.trim();
  if (token.startsWith("#")) token = token.slice(1);
  if (token.startsWith(TAB_ID_PREFIX)) token = token.slice(TAB_ID_PREFIX.length);
  if (!token) return undefined;
  const card = landingCards().find((item) => item.sectionId === token);
  return card?.sectionId ?? undefined;
}

export function legacySectionPath(sectionId: string): string | undefined {
  const card = landingCards().find((item) => item.sectionId === sectionId);
  return card?.href;
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
