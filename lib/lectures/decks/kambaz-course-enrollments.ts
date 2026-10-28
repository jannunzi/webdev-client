import type { LectureSlide } from "../types";

export const KAMBAZ_COURSE_ENROLLMENTS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 4 · Course Enrollments",
      "Enrollments · store, cards, and the course guard",
    ],
  },
  {
    id: "purpose",
    title: "Course Enrollments",
    kind: "content",
    bullets: [
      "An enrollments store records which user is in which course",
      "Each card can Enroll or Unenroll the signed-in user",
      "The course layout sends visitors away unless they are enrolled",
    ],
  },
  {
    id: "enroll-store-intro",
    title: "Implementing Enrollments",
    kind: "content",
    bullets: [
      "An **enrollment** is one `{ _id, user, course }` row from `enrollments.json`",
      "`useEnrollmentsStore` holds them, like the courses and modules stores",
      "`enrollIntoCourse(userId, courseId)` adds a row; `unenrollFromCourse` removes it",
      "Same names and arguments as the Chapter 5 client, so the swap is one line",
    ],
  },
  {
    id: "enroll-store",
    title: "Enrollments store",
    kind: "content",
    code: `"use client";

import { create } from "zustand";
import enrollmentsJson from "../database/enrollments.json";

export type Enrollment = (typeof enrollmentsJson)[number];

type EnrollmentsStore = {
  enrollments: Enrollment[];
  enrollIntoCourse: (userId: string, courseId: string) => void;
  unenrollFromCourse: (userId: string, courseId: string) => void;
};

export const useEnrollmentsStore = create<EnrollmentsStore>((set) => ({
  enrollments: enrollmentsJson,
  enrollIntoCourse: (userId, courseId) =>
    set((state) => ({
      enrollments: [
        ...state.enrollments,
        { _id: crypto.randomUUID(), user: userId, course: courseId },
      ],
    })),
  unenrollFromCourse: (userId, courseId) =>
    set((state) => ({
      enrollments: state.enrollments.filter(
        (e) => !(e.user === userId && e.course === courseId),
      ),
    })),
}));`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/store/enrollmentsStore.ts",
  },
  {
    id: "enroll-card-intro",
    title: "Enroll and Unenroll on each card",
    kind: "content",
    bullets: [
      "No new props: the card reads `currentUser` and `useEnrollmentsStore` itself",
      "`enrolled` is `null` when nobody is signed in. Delete calls `deleteCourse(course._id)`",
      "Green **Enroll** or red **Unenroll**, hidden while `enrolled` is `null`",
      "`event.preventDefault()` keeps the click from following the card's `Link`",
    ],
  },
  {
    id: "enroll-card",
    title: "Card imports and course prop",
    kind: "content",
    code: `import Link from "next/link";
import Image from "next/image";
import { useCoursesStore, type Course } from "../store/coursesStore";
import { useEnrollmentsStore } from "../store/enrollmentsStore";
import { useAccountContext } from "../account/AccountContext";

export default function CourseCard({
  course,
  onEdit,
}: {
  course: Course;
  onEdit: () => void;
}) {`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
  },
  {
    id: "enroll-card-part-2",
    title: "Compute enrolled and toggle it",
    kind: "content",
    code: `  const deleteCourse = useCoursesStore((state) => state.deleteCourse);
  const { currentUser } = useAccountContext();
  const { enrollments, enrollIntoCourse, unenrollFromCourse } =
    useEnrollmentsStore();
  const enrolled = currentUser
    ? enrollments.some((e) => e.user === currentUser._id && e.course === course._id)
    : null;
  const toggleEnrollment = () => {
    if (!currentUser) return;
    if (enrolled) {
      unenrollFromCourse(currentUser._id, course._id);
    } else {
      enrollIntoCourse(currentUser._id, course._id);
    }
  };`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
    codeStartLine: 14,
  },
  {
    id: "enroll-card-part-3",
    title: "Card image, title and description",
    kind: "content",
    code: `  return (
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
          </button>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
    codeStartLine: 29,
  },
  {
    id: "enroll-card-part-4",
    title: "Edit, Delete and Enroll buttons",
    kind: "content",
    code: `          <button
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
              deleteCourse(course._id);
            }}
          >
            Delete
          </button>
          {enrolled !== null && (
            <button
              type="button"
              id="wd-enrollment-click"
              className={\`ms-2 inline-flex items-center justify-center rounded px-3 py-1.5 text-sm font-medium text-white \${enrolled ? "bg-red-600" : "bg-green-600"}\`}
              onClick={(event) => {
                event.preventDefault();
                toggleEnrollment();
              }}
            >
              {enrolled ? "Unenroll" : "Enroll"}
            </button>
          )}
        </div>
      </Link>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
    codeStartLine: 55,
  },
  {
    id: "enroll-dash-intro",
    title: "Dashboard by enrollment",
    kind: "content",
    bullets: [
      "`isEnrolled(courseId)` checks for a row with the current user and course",
      "`showAllCourses` flag: the blue **Enrollments** button flips all vs. mine",
      "`visibleCourses` feeds the count and the cards; each card owns its toggle",
      "Add also enrolls the author, so the new course passes the filter",
    ],
  },
  {
    id: "enroll-dash",
    title: "Add a course and enroll its author",
    kind: "content",
    code: `"use client";

import { useState } from "react";
import CourseCard from "./CourseCard";
import {
  emptyCourse,
  useCoursesStore,
  type Course,
} from "../store/coursesStore";
import { useEnrollmentsStore } from "../store/enrollmentsStore";
import { useAccountContext } from "../account/AccountContext";

export default function Dashboard() {
  const courses = useCoursesStore((state) => state.courses);
  const addCourse = useCoursesStore((state) => state.addCourse);
  const updateCourse = useCoursesStore((state) => state.updateCourse);
  const [course, setCourse] = useState<Course>(emptyCourse);
  const { currentUser } = useAccountContext();
  const { enrollments, enrollIntoCourse } = useEnrollmentsStore();
  const [showAllCourses, setShowAllCourses] = useState(false);
  const isEnrolled = (courseId: string) =>
    currentUser !== null &&
    enrollments.some(
      (e) => e.user === currentUser._id && e.course === courseId,
    );
  const visibleCourses =
    currentUser && !showAllCourses
      ? courses.filter((c) => isEnrolled(c._id))
      : courses;
  const addCourseAndEnroll = () => {
    addCourse(course);
    const newCourse = useCoursesStore.getState().courses.at(-1);
    if (currentUser && newCourse) enrollIntoCourse(currentUser._id, newCourse._id);
  };
`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
  },
  {
    id: "enroll-dash-part-2",
    title: "Title bar and All/Enrolled toggle",
    kind: "content",
    code: `  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title" className="flex items-center justify-between">
        Dashboard
        {currentUser && (
          <button
            type="button"
            className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
            id="wd-enrollments-toggle"
            onClick={() => setShowAllCourses(!showAllCourses)}
          >
            Enrollments
          </button>
        )}
      </h1>
      <hr />
      <h5 className="flex flex-wrap items-center gap-2">
        New Course
        <button
          type="button"
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
          id="wd-add-new-course-click"
          onClick={addCourseAndEnroll}
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
    codeStartLine: 36,
  },
  {
    id: "enroll-dash-part-3",
    title: "Course form and the card grid",
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
      <hr />
      <h2 id="wd-dashboard-published">Published Courses ({visibleCourses.length})</h2>
      <hr />
      <div
        id="wd-dashboard-courses"
        className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      >
        {visibleCourses.map((c) => (
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
    codeStartLine: 71,
  },
  {
    id: "enroll-dash-live",
    title: "Enrollments demo",
    kind: "demo",
    bullets: [
      "Pick a user: Dashboard shows only their courses",
      "**Enrollments** shows every course; Enroll / Unenroll update the store",
      "Pick Nobody: no toggle and no enrollment buttons",
    ],
    embed: "kambaz-enrollments",
  },
  {
    id: "enroll-guard-intro",
    title: "Guard the course routes",
    kind: "content",
    bullets: [
      "Only enrolled users may open `/courses/[cid]/...`",
      "`useRouter().push(\"/dashboard\")` inside `useEffect` sends everyone else back",
      "`return null` hides the course until the check passes",
    ],
  },
  {
    id: "enroll-guard",
    title: "Redirect unless signed in, enrolled",
    kind: "content",
    code: `"use client";

import { ReactNode, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaAlignJustify } from "react-icons/fa6";
import CourseNavigation from "./Navigation";
import Breadcrumb from "./Breadcrumb";
import { useCoursesStore } from "../../store/coursesStore";
import { useEnrollmentsStore } from "../../store/enrollmentsStore";
import { useAccountContext } from "../../account/AccountContext";

export default function CoursesLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { cid } = useParams();
  const courseId = typeof cid === "string" ? cid : "";
  const courses = useCoursesStore((state) => state.courses);
  const course = courses.find((c) => c._id === courseId);
  const [showCourseNav, setShowCourseNav] = useState(true);
  const { currentUser } = useAccountContext();
  const enrollments = useEnrollmentsStore((state) => state.enrollments);
  const router = useRouter();
  const enrolled =
    currentUser !== null &&
    enrollments.some(
      (e) => e.user === currentUser._id && e.course === courseId,
    );

  useEffect(() => {
    if (!enrolled) router.push("/dashboard");
  }, [enrolled, router]);

  if (!enrolled) return null;
`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/layout.tsx",
  },
  {
    id: "enroll-guard-part-2",
    title: "Breadcrumb, course nav and content",
    kind: "content",
    code: `  return (
    <div id="wd-courses">
      <h2 className="text-2xl font-semibold text-red-600">
        <FaAlignJustify
          className="me-4 mb-1 inline cursor-pointer text-xl"
          onClick={() => setShowCourseNav(!showCourseNav)}
          title="Toggle course navigation"
        />
        <Breadcrumb course={course} />
      </h2>
      <hr className="my-3" />
      <div className="flex gap-4">
        {showCourseNav ? (
          <div className="hidden w-[140px] shrink-0 md:block">
            <CourseNavigation cid={courseId} />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/layout.tsx",
    codeStartLine: 37,
  },
  {
    id: "recap",
    title: "Course Enrollments recap",
    kind: "content",
    bullets: [
      "`useEnrollmentsStore` holds enrollments with enroll and unenroll",
      "CourseCard toggles enrollment; Dashboard filters All vs Enrolled",
      "The layout guard redirects unless signed in and enrolled",
    ],
  },
];
