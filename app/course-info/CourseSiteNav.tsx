"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COURSE_INFO_LINKS, isCourseInfoCurrent } from "./links";

function CourseLinkList({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <ul className={className}>
      {COURSE_INFO_LINKS.map((link) => {
        const current = isCourseInfoCurrent(pathname, link.href);
        return (
          <li key={link.href}>
            {current ? (
              <span className="font-medium text-neutral-900">{link.label}</span>
            ) : (
              <Link
                href={link.href}
                onClick={onNavigate}
                className="text-neutral-700 no-underline hover:underline"
              >
                {link.label}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function CourseSiteNav() {
  return (
    <nav aria-label="Course pages" className="min-w-0 flex-1">
      <details className="md:hidden">
        <summary className="cursor-pointer font-medium text-neutral-800">
          Course pages
        </summary>
        <CourseLinkList className="mt-2 flex list-none flex-col gap-1 p-0" />
      </details>
      <CourseLinkList className="m-0 hidden list-none flex-wrap items-center gap-x-3 gap-y-1 p-0 md:flex" />
    </nav>
  );
}
