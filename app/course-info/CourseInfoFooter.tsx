import Link from "next/link";

export const COURSE_INFO_LINKS = [
  { href: "/syllabus", label: "Syllabus" },
  { href: "/book", label: "Book" },
  { href: "/labs", label: "Labs" },
  { href: "/", label: "Kambaz" },
  { href: "/office-hours", label: "Office Hours" },
  { href: "/piazza-hours", label: "Piazza Hours" },
  { href: "/project", label: "Project" },
] as const;

export default function CourseInfoFooter({
  current,
}: {
  current?: (typeof COURSE_INFO_LINKS)[number]["href"];
}) {
  return (
    <nav
      aria-label="Course pages"
      className="mt-10 border-t border-neutral-200 pt-3 font-sans text-sm text-neutral-600"
    >
      {COURSE_INFO_LINKS.map((link, index) => (
        <span key={link.href}>
          {index > 0 ? " · " : null}
          {link.href === current ? (
            <span className="text-neutral-800">{link.label}</span>
          ) : (
            <Link href={link.href}>{link.label}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}
