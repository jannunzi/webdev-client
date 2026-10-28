import type { LectureSlide } from "../types";

export const KAMBAZ_DASHBOARD_DATA_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · Dashboard from Data",
      "§3.10.3 · map courses onto cards",
    ],
  },
  {
    id: "purpose",
    title: "The grid is db.courses.map",
    kind: "content",
    bullets: [
      "Refactor the §2.4.2 dashboard so it maps JSON, not three hardcoded cards",
      "Pass each course as one `course` prop and key the card by `course._id`",
      "The published count interpolates `courses.length`",
      "Clicking a card lands on `/courses/RS101/home` (or whichever `_id`)",
    ],
  },
  {
    id: "page",
    title: "Dashboard reads the database",
    kind: "content",
    code: `import CourseCard from "./CourseCard";
import * as db from "../database";

export default function Dashboard() {
  const courses = db.courses;
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2>
      <hr />
      <div
        id="wd-dashboard-courses"
        className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      >
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeHighlightLines: [2, 5, 10, 16, 17, 18],
  },
  {
    id: "page-live",
    title: "Dashboard: live demo",
    kind: "demo",
    bullets: [
      "`import * as db from \"../database\"` then `const courses = db.courses`",
      "`{…course}` passes every field the card destructures",
      "Add or rename a course in JSON — the grid updates, `CourseCard` does not",
    ],
    embed: "kambaz-ch3-dashboard",
  },
  {
    id: "card-intro",
    title: "CourseCard encodes _id in the href",
    kind: "content",
    bullets: [
      "One `course` prop: read `course._id`, `course.name`, `course.image`",
      "`href={\`/courses/${course._id}/home\`}` — later screens look the course up",
      "The Go button is inside the same `Link`",
    ],
  },
  {
    id: "card",
    title: "CourseCard encodes _id in the href (code)",
    kind: "content",
    code: `import Link from "next/link";
import Image from "next/image";

export default function CourseCard({
  course,
}: {
  course: {
    _id: string;
    name: string;
    description: string;
    image: string;
  };
}) {
  return (
    <div className="wd-dashboard-course w-[300px] max-w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
      <Link
        href={\`/courses/\${course._id}/home\`}
        className="wd-dashboard-course-link block text-neutral-900 no-underline"
      >
        <Image
          src={course.image}
          width={300}
          height={160}
          alt={course.name}
          className="h-40 w-full object-cover"
        />
        <div className="p-4">
          <h5 className="wd-dashboard-course-title m-0 mb-2 truncate text-lg font-semibold whitespace-nowrap">
            {course.name}
          </h5>
          <p className="wd-dashboard-course-description m-0 mb-3 h-[100px] overflow-hidden text-sm text-neutral-600">
            {course.description}
          </p>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
          >
            Go
          </button>
        </div>
      </Link>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
    codeHighlightLines: [[4, 13], 17],
  },
  {
    id: "recap",
    title: "Dashboard data recap",
    kind: "content",
    bullets: [
      "`courses.map` + `key={course._id}` + `course={course}`",
      "`Published Courses ({courses.length})` follows the JSON",
      "The card’s `Link` encodes `_id` for every later course screen",
    ],
  },
  {
    id: "next-up",
    title: "Next: look the course up",
    kind: "title",
    bullets: [
      "The layout awaits `[cid]`, then `find`s the course",
      "§3.10.4–3.10.6: layout, course nav, breadcrumb",
    ],
  },
];
