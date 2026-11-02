import type { LectureSlide } from "../types";

export const KAMBAZ_COURSES_STORE_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 4 · A Courses Store",
      "§4.10.1 · Zustand holds the published list",
    ],
  },
  {
    id: "purpose",
    title: "Implementing Course State Management",
    kind: "content",
    bullets: [
      "Chapter 3 made Kambaz data-driven, but the data never changes",
      "Application state is data many screens share and users can change",
      "When that data changes, every screen that shows it must re-render",
      "This module moves the course list into shared state so it can change",
    ],
  },
  {
    id: "where-each",
    title: "State Management Options",
    kind: "content",
    bullets: [
      "`useState` is great for local component state, such as form fields",
      "It is not great for application state that many screens share",
      "Redux (2015): first widely adopted, very verbose, still popular",
      "React Context (2018): React's built-in solution, also verbose",
      "Zustand (2019): small and concise, most popular today. We'll use it",
    ],
  },
  {
    id: "why-not-local",
    title: "Limits of Dashboard useState",
    kind: "content",
    bullets: [
      "A course added on the Dashboard would exist only on the Dashboard",
      "The course Home screen and layout would still read the JSON file",
      "A newly added course would have no name in the breadcrumb",
    ],
    embed: "kambaz-ch4-course-form",
  },
  {
    id: "store-intro",
    title: "Planning a Courses Store",
    kind: "content",
    bullets: [
      "Goal: one shared list of courses that any screen can read and change",
      "A store is a shared object holding that state and the actions on it",
      "It starts with the courses in `courses.json`",
      "Next: the datatypes for a course, a blank course, and the store",
      "Then: the actions that add, delete and update courses",
    ],
  },
  {
    id: "store",
    title: "Declaring Course State Datatypes",
    kind: "content",
    code: `"use client";

import { create } from "zustand";
import coursesJson from "../database/courses.json";

export type Course = (typeof coursesJson)[number];

const emptyCourse: Course = {
  _id: "0",
  name: "New Course",       number: "New Number",
  startDate: "2023-09-10",  endDate: "2023-12-15",
  department: "D123",       credits: 4,
  description: "New Description",
  image: "/images/reactjs.jpg",
};

type CoursesStore = {
  courses: Course[];
  addCourse: (course: Course) => void;
  deleteCourse: (courseId: string) => void;
  updateCourse: (course: Course) => void;
};
`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/store/coursesStore.ts",
    codeHighlightLines: [],
  },
  {
    id: "store-part-2",
    title: "Course CRUD Operations",
    kind: "content",
    code: `export const useCoursesStore = create<CoursesStore>((set) => ({
  courses: coursesJson,
  addCourse: (course) =>
    set((state) => ({
      courses: [
        ...state.courses,
        { ...emptyCourse, ...course, _id: crypto.randomUUID() },
      ],
    })),
  deleteCourse: (courseId) =>
    set((state) => ({
      courses: state.courses.filter((course) => course._id !== courseId),
    })),
  updateCourse: (course) =>
    set((state) => ({
      courses: state.courses.map((c) => (c._id === course._id ? course : c)),
    })),
}));

export { emptyCourse };`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/store/coursesStore.ts",
    codeStartLine: 27,
    codeHighlightLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  },
  {
    id: "store-live",
    title: "Dashboard Demo",
    kind: "demo",
    bullets: [
      "This is the live Dashboard reading courses from `store/coursesStore.ts`",
      "The next module adds buttons that create, edit and delete courses",
    ],
    embed: "kambaz-courses-crud",
  },
  {
    id: "recap",
    title: "Courses store recap",
    kind: "content",
    bullets: [
      "Same CRUD as the Zustand todo list, with course fields",
      "Draft stays local. The published array lives in the store",
      "Do not wrap the Kambaz layout in a store Provider",
    ],
  },
  {
    id: "next-up",
    title: "Next: Dashboard CRUD",
    kind: "title",
    bullets: [
      "Select the store. Keep a local `course` draft for the form",
      "§4.10.2: Add, Delete with `preventDefault`, Edit then Update",
    ],
  },
];
