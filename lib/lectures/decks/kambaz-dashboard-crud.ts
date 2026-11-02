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
    title: "Implementing Dashboard CRUD",
    kind: "content",
    bullets: [
      "The Dashboard will let users create, edit and delete courses (CRUD)",
      "The published courses come from the shared courses store",
      "A form holds a draft course while the user types, before saving it",
      "Saving changes the store, so every screen showing courses re-renders",
    ],
    density: "spacious",
    embed: "kambaz-ch4-course-form",
  },
  {
    id: "add-intro",
    title: "Planning the Dashboard Form",
    kind: "content",
    bullets: [
      "Goal: a form above the course cards with Add and Update buttons",
      "Typing in the form changes only a draft course, not the published cards",
      "Add saves the draft as a new course. Update saves it over the original",
      "The next four slides build the Dashboard in parts",
    ],
  },
  {
    id: "add",
    title: "Store actions and the course draft",
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
  const updateCourse = useCoursesStore((state) => state.updateCourse);
  const [course, setCourse] = useState<Course>(emptyCourse);
`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeHighlightLines: [],
  },
  {
    id: "add-part-2",
    title: "Add and Update buttons",
    kind: "content",
    code: `  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      <h5 className="flex flex-wrap items-center gap-2">
        New Course
        <button type="button" id="wd-add-new-course-click" className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
          onClick={() => addCourse(course)} >
          Add
        </button>
        <button type="button" id="wd-update-course-click" className="rounded bg-yellow-400 px-3 py-1.5 text-sm font-medium"
          onClick={() => updateCourse(course)} >
          Update
        </button>
      </h5>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeStartLine: 17,
    codeHighlightLines: [11],
  },
  {
    id: "add-part-3",
    title: "Name and description inputs",
    kind: "content",
    code: `      <input value={course.name} id="wd-course-name" className="mb-2 mt-2 block w-full max-w-xl rounded border border-neutral-300 px-3 py-1.5"
        onChange={(e) =>
          setCourse({ ...course, name: e.target.value })
        }
      />
      <textarea value={course.description} rows={3} id="wd-course-description" className="mb-3 block w-full max-w-xl rounded border border-neutral-300 px-3 py-1.5"
        onChange={(e) =>
          setCourse({ ...course, description: e.target.value })
        }
      />
      <hr />`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeStartLine: 40,
    codeHighlightLines: [3, 4],
  },
  {
    id: "add-part-4",
    title: "Map courses to cards",
    kind: "content",
    code: `      <h2 id="wd-dashboard-published">
        Published Courses ({courses.length})
      </h2>
      <hr />
      <div id="wd-dashboard-courses" className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" >
        {courses.map((c) => (
          <CourseCard
            key={c._id}
            course={c}
            onEdit={() => setCourse(c)}
          />
        ))}
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeStartLine: 56,
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
    title: "Adding Edit and Delete Buttons to the CourseCard Component",
    kind: "content",
    bullets: [
      "Each course card needs Edit and Delete buttons",
      "The whole card is a link to the course, so a click would also open it",
      "The buttons must stop that navigation before doing their own work",
      "The next three slides show the course card, `CourseCard`, with both buttons",
    ],
    density: "spacious",
    layout: "split",
    embed: "kambaz-ch4-course-card",
  },
  {
    id: "card-props",
    title: "CourseCard takes course and onEdit properties",
    kind: "content",
    code: `import Link from "next/link";
import Image from "next/image";
import { useCoursesStore, type Course } from "../store/coursesStore";

export default function CourseCard({
  course,
  onEdit,
}: {
  course: Course;
  onEdit: () => void;
}) {
  const deleteCourse = useCoursesStore((state) => state.deleteCourse);`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
    codeHighlightLines: [3, 6, 9, 12],
  },
  {
    id: "card-buttons",
    title: "CourseCard Image, Title and Go",
    kind: "content",
    code: `  return (
    <div className="wd-dashboard-course w-[300px] max-w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
      <Link href={\`/courses/\${course._id}/home\`}
        className="wd-dashboard-course-link block text-neutral-900 no-underline" >

        <Image src={course.image} width={300} height={160} alt={course.name} className="h-40 w-full object-cover" />

        <div className="p-4">
          <h5 className="wd-dashboard-course-title m-0 mb-2 truncate text-lg font-semibold whitespace-nowrap">
            {course.name}
          </h5>

          <p className="wd-dashboard-course-description m-0 mb-3 h-[100px] overflow-hidden text-sm text-neutral-600">
            {course.description}
          </p>

          <button type="button" className="inline-flex items-center justify-center rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white" >
            Go
          </button>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
    codeStartLine: 13,
  },
  {
    id: "card-buttons-part-2",
    title: "CourseCard Edit and Delete Buttons",
    kind: "content",
    code: `          <button type="button" id="wd-edit-course-click" className="ms-2 inline-flex items-center justify-center rounded bg-yellow-400 px-3 py-1.5 text-sm font-medium"
            onClick={(event) => {
              event.preventDefault();
              onEdit();
            }} >
            Edit
          </button>
          <button type="button" id="wd-delete-course-click" className="ms-2 inline-flex items-center justify-center rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
            onClick={(event) => {
              event.preventDefault();
              deleteCourse(course._id);
            }} >
            Delete
          </button>
        </div>
      </Link>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
    codeStartLine: 28,
    codeHighlightLines: [4, 11],
  },
  {
    id: "edit",
    title: "Editing and Updating a Course",
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
