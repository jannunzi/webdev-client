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
    id: "wire",
    title: "Select the four store slices",
    kind: "content",
    bullets: [
      "`courses`, `addCourse`, `deleteCourse`, `updateCourse`",
      "Typing a name must not rewrite every card until Add or Update",
    ],
    code: `"use client";

import { useState } from "react";
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
  // …
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeAddedLines: [[4, 8], [11, 15]],
  },
  {
    id: "add",
    title: "Add appends the draft",
    kind: "demo",
    bullets: [
      "`onClick={() => addCourse(course)}` — pass the object, wrapped",
      "Bind name and description with `{ ...course, name: e.target.value }`",
      "id `wd-add-new-course-click`. Confirm the published count goes up",
    ],
    code: `<button
  type="button"
  id="wd-add-new-course-click"
  onClick={() => addCourse(course)}
>
  Add
</button>
<input
  value={course.name}
  onChange={(e) => setCourse({ ...course, name: e.target.value })}
  id="wd-course-name"
/>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeHighlightLines: [4, [9, 10]],
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
