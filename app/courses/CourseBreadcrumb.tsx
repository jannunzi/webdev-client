import Link from "next/link";

export default function CourseBreadcrumb({ current }: { current: string }) {
  return (
    <nav
      id="wd-course-breadcrumb"
      aria-label="Breadcrumb"
      className="mb-4 font-sans text-sm text-neutral-600"
    >
      <ol className="m-0 flex list-none flex-wrap items-center gap-x-2 gap-y-1 p-0">
        <li>
          <Link
            href="/"
            id="wd-all-courses-link"
            className="font-medium text-neutral-800 no-underline hover:underline"
          >
            Courses
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li className="text-neutral-900">{current}</li>
      </ol>
    </nav>
  );
}
