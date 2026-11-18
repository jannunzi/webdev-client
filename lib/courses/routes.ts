/**
 * Public course URLs:
 *   /{year}/{term}/{subject}/{courseNumber}/{section}
 *
 * `{subject}` is shared by course numbers. `webdev` covers CS4550 and CS5610.
 * `fse` covers CS5500. Rename that constant here if the slug should change.
 *
 * Shared pages (book, slides, videos, …) live on the subject, not the course
 * number. Section syllabi add the course number and section.
 */

export const TERM_SLUGS = ["spring", "summer", "fall", "winter"] as const;

export type TermSlug = (typeof TERM_SLUGS)[number];

/** Subject slug for CS4550 and CS5610. */
export const WEBDEV_SUBJECT = "webdev";

/**
 * Subject slug for CS5500. Kept as one constant so a later rename is one edit.
 */
export const FOUNDATIONS_SUBJECT = "fse";

export type CourseContext = {
  year: string;
  term: TermSlug;
  subject: string;
  /** Lowercase course number, e.g. "cs5610". Omitted on subject-level pages. */
  courseNumber?: string;
  /** Two-digit section, e.g. "02". */
  section?: string;
};

export const DEFAULT_COURSE_CONTEXT: CourseContext = {
  year: "2026",
  term: "fall",
  subject: WEBDEV_SUBJECT,
  courseNumber: "cs5610",
  section: "02",
};

export const FALL_2026_SECTIONS = [
  { courseNumber: "cs5610", section: "02" },
  { courseNumber: "cs5610", section: "09" },
  { courseNumber: "cs4550", section: "01" },
] as const;

const DEFAULT_SECTION: Record<string, string> = {
  cs5610: "02",
  cs4550: "01",
};

export const SHARED_COURSE_PAGES = [
  "book",
  "slides",
  "videos",
  "blog",
  "assignments",
  "labs",
  "office-hours",
  "project",
] as const;

export type SharedCoursePage = (typeof SHARED_COURSE_PAGES)[number];

const SHARED_PAGE_SET = new Set<string>(SHARED_COURSE_PAGES);

const NAV_PREFIXES = new Set([
  "/syllabus",
  "/book",
  "/blog",
  "/slides",
  "/videos",
  "/assignments",
  "/labs",
  "/office-hours",
  "/project",
]);

export function isTermSlug(value: string): value is TermSlug {
  return (TERM_SLUGS as readonly string[]).includes(value);
}

export function subjectForCourseNumber(courseNumber: string): string {
  if (courseNumber === "cs5500") return FOUNDATIONS_SUBJECT;
  return WEBDEV_SUBJECT;
}

export function subjectBase(context: CourseContext): string {
  return `/${context.year}/${context.term}/${context.subject}`;
}

export function sharedPagePath(context: CourseContext, page: string): string {
  return `${subjectBase(context)}/${page}`;
}

export function courseNumberPath(
  context: CourseContext & { courseNumber: string },
): string {
  return `${subjectBase(context)}/${context.courseNumber}`;
}

export function sectionSyllabusPath(
  context: CourseContext & { courseNumber: string; section: string },
): string {
  return `${courseNumberPath(context)}/${context.section}/syllabus`;
}

export function defaultSection(courseNumber: string): string | undefined {
  return DEFAULT_SECTION[courseNumber];
}

/** Syllabus link for the section in the URL, or that course's first section. */
export function syllabusPathForContext(context: CourseContext): string {
  if (context.subject === FOUNDATIONS_SUBJECT) {
    return courseNumberPath({ ...context, courseNumber: "cs5500" });
  }
  const courseNumber = context.courseNumber ?? "cs5610";
  const section = context.section ?? defaultSection(courseNumber);
  if (!section) return subjectBase(context);
  return sectionSyllabusPath({ ...context, courseNumber, section });
}

export function parseSectionToken(
  value: string | null | undefined,
): { courseNumber: string; section: string } | undefined {
  if (!value) return undefined;
  let token = value.trim().toLowerCase();
  if (token.startsWith("#")) token = token.slice(1);
  if (token.startsWith("syllabus-tab-")) token = token.slice("syllabus-tab-".length);
  const match = token.match(/^(cs\d+)-(\d{2})$/);
  if (!match) return undefined;
  const courseNumber = match[1] ?? "";
  const section = match[2] ?? "";
  const known = FALL_2026_SECTIONS.some(
    (item) => item.courseNumber === courseNumber && item.section === section,
  );
  if (!known) return undefined;
  return { courseNumber, section };
}

export function parseCoursePath(pathname: string): CourseContext | null {
  const match = pathname.match(
    /^\/(\d{4})\/(spring|summer|fall|winter)\/([^/]+)(?:\/(cs\d+))?(?:\/(\d{2}))?(?:\/|$)/,
  );
  if (!match) return null;
  const year = match[1];
  const term = match[2];
  const subject = match[3];
  if (!year || !term || !subject || !isTermSlug(term)) return null;
  return {
    year,
    term,
    subject,
    courseNumber: match[4],
    section: match[5],
  };
}

export function isMinimalCourseHeader(pathname: string): boolean {
  if (pathname === "/" || pathname === "") return true;
  if (pathname === "/coming-soon" || pathname.startsWith("/coming-soon/")) return true;
  const context = parseCoursePath(pathname);
  if (!context?.courseNumber || context.subject !== WEBDEV_SUBJECT) return false;
  if (context.year !== "2027" || context.term !== "spring") return false;
  const home = courseNumberPath({ ...context, courseNumber: context.courseNumber });
  return pathname === home || pathname === `${home}/`;
}

/** Header href for the course the visitor is actually in. */
export function contextualHref(href: string, context: CourseContext | null): string {
  if (!context || !NAV_PREFIXES.has(href)) return href;
  if (href === "/syllabus") return syllabusPathForContext(context);
  // CS5500 has its own book. Slides, labs, and the other shared pages live on webdev.
  if (context.subject === FOUNDATIONS_SUBJECT && href !== "/book") {
    return sharedPagePath(DEFAULT_COURSE_CONTEXT, href.slice(1));
  }
  return sharedPagePath(context, href.slice(1));
}

function fallSectionPath(courseNumber: string, section: string): string {
  return sectionSyllabusPath({
    year: "2026",
    term: "fall",
    subject: WEBDEV_SUBJECT,
    courseNumber,
    section,
  });
}

function keptSearch(searchParams: URLSearchParams, drop?: string): string {
  const next = new URLSearchParams(searchParams);
  if (drop) next.delete(drop);
  const value = next.toString();
  return value ? `?${value}` : "";
}

/**
 * Old public URL to its canonical path. `search` keeps unrelated query
 * params and drops `section` once it has been applied. Hash fragments are
 * not sent to the server; browsers reattach them after a 307.
 */
export function legacyCourseRedirect(
  pathname: string,
  searchParams: URLSearchParams,
): { pathname: string; search: string } | null {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const sectionParam = parseSectionToken(searchParams.get("section"));

  if ((path === "/syllabus" || path.startsWith("/syllabus/")) && sectionParam) {
    return {
      pathname: fallSectionPath(sectionParam.courseNumber, sectionParam.section),
      search: keptSearch(searchParams, "section"),
    };
  }

  if (path === "/syllabus") {
    return {
      pathname: fallSectionPath("cs5610", "02"),
      search: keptSearch(searchParams, "section"),
    };
  }

  if (path.startsWith("/syllabus/")) {
    const parsed = parseSectionToken(path.slice("/syllabus/".length));
    if (!parsed) return null;
    return {
      pathname: fallSectionPath(parsed.courseNumber, parsed.section),
      search: keptSearch(searchParams),
    };
  }

  const bare = parseSectionToken(path.startsWith("/") ? path.slice(1) : path);
  if (bare && (path.startsWith("/cs") || path.startsWith("/syllabus-tab-"))) {
    return {
      pathname: fallSectionPath(bare.courseNumber, bare.section),
      search: keptSearch(searchParams),
    };
  }

  if (path === "/cs5500" || path.startsWith("/cs5500/")) {
    const rest = path.slice("/cs5500".length);
    const foundations: CourseContext = {
      year: "2027",
      term: "summer",
      subject: FOUNDATIONS_SUBJECT,
    };
    if (rest === "/book" || rest.startsWith("/book/")) {
      return {
        pathname: `${sharedPagePath(foundations, "book")}${rest.slice("/book".length)}`,
        search: keptSearch(searchParams),
      };
    }
    return {
      pathname: `${courseNumberPath({ ...foundations, courseNumber: "cs5500" })}${rest}`,
      search: keptSearch(searchParams),
    };
  }

  if (path === "/coming-soon/cs5610-sp2027") {
    return {
      pathname: courseNumberPath({
        year: "2027",
        term: "spring",
        subject: WEBDEV_SUBJECT,
        courseNumber: "cs5610",
      }),
      search: "",
    };
  }
  if (path === "/coming-soon/cs4550-sp2027") {
    return {
      pathname: courseNumberPath({
        year: "2027",
        term: "spring",
        subject: WEBDEV_SUBJECT,
        courseNumber: "cs4550",
      }),
      search: "",
    };
  }

  for (const page of SHARED_COURSE_PAGES) {
    const base = `/${page}`;
    if (path !== base && !path.startsWith(`${base}/`)) continue;
    const rest = path.slice(base.length);
    return {
      pathname: `${sharedPagePath(DEFAULT_COURSE_CONTEXT, page)}${rest}`,
      search: keptSearch(searchParams),
    };
  }

  return null;
}

/**
 * Turn a legacy site href into the public course path. Hashes and unrelated
 * query params stay. Editor, auth, and already-canonical paths are unchanged.
 */
export function toPublicCourseHref(href: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const hashAt = href.indexOf("#");
  const hash = hashAt >= 0 ? href.slice(hashAt) : "";
  const beforeHash = hashAt >= 0 ? href.slice(0, hashAt) : href;
  const queryAt = beforeHash.indexOf("?");
  const pathname = queryAt >= 0 ? beforeHash.slice(0, queryAt) : beforeHash;
  const search = queryAt >= 0 ? beforeHash.slice(queryAt + 1) : "";
  if (
    pathname === "/book2" ||
    pathname.startsWith("/book2/") ||
    pathname === "/book-editor" ||
    pathname.startsWith("/book-editor/") ||
    pathname.startsWith("/account/") ||
    pathname === "/sign-in" ||
    pathname.startsWith("/sign-in/") ||
    pathname === "/sign-up" ||
    pathname.startsWith("/sign-up/")
  ) {
    return href;
  }
  const redirected = legacyCourseRedirect(pathname, new URLSearchParams(search));
  if (!redirected) return href;
  return `${redirected.pathname}${redirected.search}${hash}`;
}

/** Where a shared webdev page is actually rendered. Foundations is not rewritten. */
export function sharedContentRewrite(pathname: string): string | null {
  const match = pathname.match(
    /^\/(\d{4})\/(spring|summer|fall|winter)\/([^/]+)\/(book|slides|videos|blog|assignments|labs|office-hours|project)(\/.*)?$/,
  );
  if (!match || match[3] !== WEBDEV_SUBJECT) return null;
  const page = match[4];
  if (!page || !SHARED_PAGE_SET.has(page)) return null;
  return `/${page}${match[5] ?? ""}`;
}

export function courseContentRewrites(): {
  source: string;
  destination: string;
}[] {
  return SHARED_COURSE_PAGES.flatMap((page) => [
    {
      source: `/:year(\\d{4})/:term(spring|summer|fall|winter)/${WEBDEV_SUBJECT}/${page}`,
      destination: `/${page}`,
    },
    {
      source: `/:year(\\d{4})/:term(spring|summer|fall|winter)/${WEBDEV_SUBJECT}/${page}/:path*`,
      destination: `/${page}/:path*`,
    },
  ]);
}
