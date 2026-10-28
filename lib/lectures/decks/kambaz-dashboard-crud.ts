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
    id: "edit",
    title: "Edit copies, Update writes back",
    kind: "demo",
    bullets: [
      "Edit: `setCourse(c)` so the form shows that card — preventDefault again",
      "Update: `updateCourse(course)` maps the matching `_id`",
      "The link and `_id` stay. The title and description change",
    ],
    embed: "kambaz-styled-dashboard",
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
