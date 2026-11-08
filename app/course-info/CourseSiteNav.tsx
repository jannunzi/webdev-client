"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { courseNavItems, isCourseNavCurrent } from "./links";

function CourseLinkList({
  className,
  onNavigate,
  showBook2,
}: {
  className?: string;
  onNavigate?: () => void;
  showBook2: boolean;
}) {
  const pathname = usePathname();

  return (
    <ul className={className}>
      {courseNavItems(showBook2).map((link) => {
        const current = isCourseNavCurrent(pathname, link.href);
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
  const [showBook2, setShowBook2] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/book2/visible", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : { show: false }))
      .then((body: { show?: boolean }) => {
        if (!cancelled && body.show === true) setShowBook2(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <nav aria-label="Course pages" className="min-w-0 flex-1">
      <details className="md:hidden">
        <summary className="cursor-pointer font-medium text-neutral-800">
          Course pages
        </summary>
        <CourseLinkList
          showBook2={showBook2}
          className="mt-2 flex list-none flex-col gap-1 p-0"
        />
      </details>
      <CourseLinkList
        showBook2={showBook2}
        className="m-0 hidden list-none flex-wrap items-center gap-x-3 gap-y-1 p-0 md:flex"
      />
    </nav>
  );
}
