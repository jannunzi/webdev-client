import { contextualHref, type CourseContext } from "@/lib/courses/routes";

export const COURSE_INFO_LINKS = [
  { href: "/", label: "Courses" },
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

export function courseNavItems(
  showBook2: boolean,
  context: CourseContext | null = null,
): { href: string; label: string }[] {
  const items: { href: string; label: string }[] = COURSE_INFO_LINKS.map((link) => ({
    href: contextualHref(link.href, context),
    label: link.label,
  }));
  if (!showBook2) return items;
  const bookAt = items.findIndex((item) => item.label === "Book");
  items.splice(bookAt + 1, 0, { href: "/book2", label: "book2" });
  return items;
}

export function isCourseNavCurrent(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/book2") return pathname === "/book2" || pathname.startsWith("/book2/");
  if (pathname === href || pathname.startsWith(`${href}/`)) return true;
  if ((COURSE_INFO_LINKS as readonly { href: string }[]).some((link) => link.href === href)) {
    return isCourseInfoCurrent(pathname, href as CourseInfoHref);
  }
  return false;
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
