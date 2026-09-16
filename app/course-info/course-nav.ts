export const COURSE_INFO_LINKS = [
  { href: "/syllabus", label: "Syllabus" },
  { href: "/calendar", label: "Calendar" },
  { href: "/book", label: "Book" },
  { href: "/blog", label: "Blog" },
  { href: "/slides", label: "Slides" },
  { href: "/assignments", label: "Assignments" },
  { href: "/quizzes/take", label: "Quizzes" },
  { href: "/labs", label: "Labs" },
  { href: "/account/signin", label: "Kambaz" },
  { href: "/office-hours", label: "Office Hours" },
  { href: "/piazza-hours", label: "Piazza Hours" },
  { href: "/project", label: "Project" },
] as const;

export type CourseInfoHref = (typeof COURSE_INFO_LINKS)[number]["href"];

export function courseNavIsCurrent(
  pathname: string,
  href: CourseInfoHref,
): boolean {
  if (href === "/syllabus") {
    return pathname === "/" || pathname === "/syllabus" || pathname.startsWith("/syllabus/");
  }
  if (href === "/quizzes/take") {
    return pathname === "/quizzes" || pathname.startsWith("/quizzes/");
  }
  if (href === "/account/signin") {
    return pathname === "/account" || pathname.startsWith("/account/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Full-screen slide decks keep their own chrome; the hub still uses the header. */
export function courseHeaderHiddenOnPath(pathname: string): boolean {
  return /^\/slides\/[^/]+/.test(pathname);
}
