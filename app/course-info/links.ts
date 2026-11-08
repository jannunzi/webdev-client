export const COURSE_INFO_LINKS = [
  { href: "/syllabus", label: "Syllabus" },
  { href: "/book", label: "Book" },
  { href: "/blog", label: "Blog" },
  { href: "/slides", label: "Slides" },
  { href: "/videos", label: "Videos" },
  { href: "/assignments", label: "Assignments" },
  { href: "/labs", label: "Labs" },
  { href: "/account/signin", label: "Kambaz" },
  { href: "/office-hours", label: "Office Hours" },
  { href: "/project", label: "Project" },
] as const;

export type CourseInfoHref = (typeof COURSE_INFO_LINKS)[number]["href"];

export function courseNavItems(showBook2: boolean): { href: string; label: string }[] {
  const items: { href: string; label: string }[] = COURSE_INFO_LINKS.map((link) => ({
    href: link.href,
    label: link.label,
  }));
  if (!showBook2) return items;
  const bookAt = items.findIndex((item) => item.href === "/book");
  items.splice(bookAt + 1, 0, { href: "/book2", label: "book2" });
  return items;
}

export function isCourseNavCurrent(pathname: string, href: string): boolean {
  if (href === "/book2") return pathname === "/book2" || pathname.startsWith("/book2/");
  return isCourseInfoCurrent(pathname, href as CourseInfoHref);
}

export function isCourseInfoCurrent(
  pathname: string,
  href: CourseInfoHref,
): boolean {
  if (href === "/account/signin") {
    return pathname === "/account" || pathname.startsWith("/account/");
  }
  if (href === "/book") {
    return pathname === "/book" || pathname.startsWith("/book/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
