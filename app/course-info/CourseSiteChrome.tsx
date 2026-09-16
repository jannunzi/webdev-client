"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import CourseAuthControls from "./CourseAuthControls";
import {
  COURSE_INFO_LINKS,
  courseHeaderHiddenOnPath,
  courseNavIsCurrent,
} from "./course-nav";

function CourseNavLinks({
  pathname,
  onNavigate,
  className,
}: {
  pathname: string;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <ul className={className}>
      {COURSE_INFO_LINKS.map((link) => {
        const current = courseNavIsCurrent(pathname, link.href);
        return (
          <li key={link.href}>
            {current ? (
              <span className="font-semibold text-neutral-900">{link.label}</span>
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

export default function CourseSiteChrome({
  authEnabled,
}: {
  authEnabled: boolean;
}) {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);

  if (courseHeaderHiddenOnPath(pathname)) {
    return null;
  }

  return (
    <header className="course-site-header sticky top-0 z-50 border-b border-neutral-300 bg-white font-sans text-sm text-neutral-800">
      <div className="flex h-[var(--course-site-header-height)] items-center gap-3 px-3 sm:px-4">
        <Link
          href="/syllabus"
          className="shrink-0 font-semibold text-neutral-900 no-underline hover:underline"
        >
          CS 4550 / 5610
        </Link>
        <nav
          aria-label="Course"
          className="hidden min-w-0 flex-1 md:block"
        >
          <CourseNavLinks
            pathname={pathname}
            className="m-0 flex list-none flex-nowrap items-center gap-x-3 overflow-x-auto p-0"
          />
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {authEnabled ? <CourseAuthControls /> : null}
          <button
            type="button"
            className="rounded border border-neutral-300 bg-white p-2 text-neutral-800 hover:bg-neutral-50 md:hidden"
            aria-expanded={open}
            aria-controls="wd-course-site-nav"
            aria-label={open ? "Close course menu" : "Open course menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <FaTimes aria-hidden /> : <FaBars aria-hidden />}
          </button>
        </div>
      </div>
      {open ? (
        <nav
          id="wd-course-site-nav"
          aria-label="Course"
          className="border-t border-neutral-200 px-3 py-3 md:hidden"
        >
          <CourseNavLinks
            pathname={pathname}
            onNavigate={() => setOpen(false)}
            className="m-0 grid list-none grid-cols-2 gap-x-3 gap-y-2 p-0"
          />
        </nav>
      ) : null}
    </header>
  );
}
