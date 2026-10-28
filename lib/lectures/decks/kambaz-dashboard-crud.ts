import type { LectureSlide } from "../types";

export const KAMBAZ_DASHBOARD_CRUD_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 4 · Dashboard Create Edit Delete",
      "§4.10.2 · store list, local form draft",
    ],
  },
  {
    id: "purpose",
    title: "Dashboard becomes a Client page",
    kind: "content",
    bullets: [
      "Hooks and clicks need `\"use client\"`",
      "Published cards come from `useCoursesStore`",
      "The form draft stays in `useState(emptyCourse)` — one-screen UI",
    ],
  },
  {
    id: "add-intro",
    title: "Select the four store slices",
    kind: "content",
    bullets: [
      "`courses`, `addCourse`, `deleteCourse`, `updateCourse`",
      "Typing a name must not rewrite every card until Add or Update",
    ],
  },
  {
    id: "add",
    title: "Add appends the draft (1/4)",
    kind: "content",
    code: `"use client";

import { useState } from "react";
import CourseCard from "./CourseCard";
import {
  emptyCourse,
  useCoursesStore,
  type Course,
} from "../store/coursesStore";

export default function Dashboard() {
  const courses = useCoursesStore((state) => state.courses);
  const addCourse = useCoursesStore((state) => state.addCourse);
  const deleteCourse = useCoursesStore((state) => state.deleteCourse);
  const updateCourse = useCoursesStore((state) => state.updateCourse);
  const [course, setCourse] = useState<Course>(emptyCourse);
`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeHighlightLines: [],
  },
  {
    id: "add-part-2",
    title: "Add appends the draft (2/4)",
    kind: "content",
    code: `  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      <h5 className="flex flex-wrap items-center gap-2">
        New Course
        <button
          type="button"
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
          id="wd-add-new-course-click"
          onClick={() => addCourse(course)}
        >
          Add
        </button>
        <button
          type="button"
          className="rounded bg-yellow-400 px-3 py-1.5 text-sm font-medium"
          id="wd-update-course-click"
          onClick={() => updateCourse(course)}
        >
          Update
        </button>
      </h5>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeStartLine: 18,
    codeHighlightLines: [11],
  },
  {
    id: "add-part-3",
    title: "Add appends the draft (3/4)",
    kind: "content",
    code: `      <input
        className="mb-2 mt-2 block w-full max-w-xl rounded border border-neutral-300 px-3 py-1.5"
        value={course.name}
        onChange={(e) => setCourse({ ...course, name: e.target.value })}
        id="wd-course-name"
      />
      <textarea
        className="mb-3 block w-full max-w-xl rounded border border-neutral-300 px-3 py-1.5"
        rows={3}
        value={course.description}
        onChange={(e) =>
          setCourse({ ...course, description: e.target.value })
        }
        id="wd-course-description"
      />
      <hr />`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeStartLine: 41,
    codeHighlightLines: [3, 4],
  },
  {
    id: "add-part-4",
    title: "Add appends the draft (4/4)",
    kind: "content",
    code: `      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2>
      <hr />
      <div
        id="wd-dashboard-courses"
        className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      >
        {courses.map((c) => (
          <CourseCard
            key={c._id}
            {...c}
            onEdit={() => setCourse(c)}
            onDelete={() => deleteCourse(c._id)}
          />
        ))}
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeStartLine: 57,
    codeHighlightLines: [],
  },
  {
    id: "add-live",
    title: "Add a course: live demo",
    kind: "demo",
    bullets: [
      "`onClick={() => addCourse(course)}` — pass the object, wrapped",
      "Bind name and description with `{ ...course, name: e.target.value }`",
      "id `wd-add-new-course-click`. Confirm the published count goes up",
    ],
    embed: "kambaz-courses-crud",
  },
  {
    id: "delete",
    title: "Delete must not navigate",
    kind: "content",
    bullets: [
      "The button sits inside a `Link` to course Home",
      "Call `event.preventDefault()` or the card navigates before it disappears",
      "Pass `onDelete={() => deleteCourse(c._id)}`. id `wd-delete-course-click`",
    ],
  },
  {
    id: "card-props",
    title: "CourseCard takes onEdit and onDelete",
    kind: "content",
    code: `"use client";

import Link from "next/link";
import Image from "next/image";

export default function CourseCard({
  _id,
  name,
  description,
  image,
  onEdit,
  onDelete,
}: {
  _id: string;
  name: string;
  description: string;
  image: string;
  onEdit: () => void;
  onDelete: () => void;
}) {`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
    codeHighlightLines: [11, 12, 18, 19],
  },
  {
    id: "card-buttons",
    title: "CourseCard Edit and Delete buttons",
    kind: "content",
    code: `  return (
    <div className="wd-dashboard-course w-[300px] max-w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
      <Link
        href={\`/courses/\${_id}/home\`}
        className="wd-dashboard-course-link block text-neutral-900 no-underline"
      >
        <Image
          src={image}
          width={300}
          height={160}
          alt={name}
          className="h-40 w-full object-cover"
        />
        <div className="p-4">
          <h5 className="wd-dashboard-course-title m-0 mb-2 truncate text-lg font-semibold whitespace-nowrap">
            {name}
          </h5>
          <p className="wd-dashboard-course-description m-0 mb-3 h-[100px] overflow-hidden text-sm text-neutral-600">
            {description}
          </p>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
          >
            Go
          </button>
          <button
            type="button"
            id="wd-edit-course-click"
            className="ms-2 inline-flex items-center justify-center rounded bg-yellow-400 px-3 py-1.5 text-sm font-medium"
            onClick={(event) => {
              event.preventDefault();
              onEdit();
            }}
          >
            Edit
          </button>
          <button
            type="button"
            id="wd-delete-course-click"
            className="ms-2 inline-flex items-center justify-center rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
            onClick={(event) => {
              event.preventDefault();
              onDelete();
            }}
          >
            Delete
          </button>
        </div>
      </Link>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
    codeStartLine: 21,
    codeHighlightLines: [32, 33, 43, 44],
  },
  {
    id: "edit",
    title: "Edit copies, Update writes back",
    kind: "demo",
    bullets: [
      "Edit: `setCourse(c)` so the form shows that card — preventDefault again",
      "Update: `updateCourse(course)` maps the matching `_id`",
      "The link and `_id` stay. The title and description change",
    ],
    embed: "kambaz-courses-crud",
  },
  {
    id: "recap",
    title: "Dashboard CRUD recap",
    kind: "content",
    bullets: [
      "Store = published list. `useState` = form draft",
      "Add copies + new id. Delete filters. Update maps",
      "Home can now import the same hook and see the new course",
    ],
  },
  {
    id: "next-up",
    title: "Next: a modules store",
    kind: "title",
    bullets: [
      "Same sharing problem on Modules vs Home",
      "§4.10.4: a dialog, then `modulesStore`",
    ],
  },
];
