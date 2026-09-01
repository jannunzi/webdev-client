import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import ChapterLink from "../../components/ChapterLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import BookFigure from "../../components/BookFigure";
import FigureLink from "../../components/FigureLink";
import LocalUrl from "../../components/LocalUrl";
import { OnYourOwn, WithAI } from "../../components/Practice";
import Dashboard from "@/app/(kambaz)/dashboard/page";
import Link from "next/link";
import KambazModules from "./KambazModules";
import KambazAccount from "./KambazAccount";

export default function KambazState() {
  return (
    <Section
      id="sec-4-10"
      title="4.10 Adding State to the Kambaz User Interface"
    >
      <p>
        <ChapterLink to={3} />{" "}made Kambaz <strong>data driven</strong>:
        the dashboard, modules, and assignments are no longer static
        markup you copy and paste for every course.         You iterate over a
        data structure such as arrays of courses, modules, or lessons, and the
        UI is <em>computed</em> from that data. Change a title in JSON
        and the screen changes with it, without rewriting a card by
        hand. The content is not hardcoded anymore, but the{" "}
        <em>data</em> still is: the files do not change while the app
        runs, so Add, Edit, and Delete do nothing, and a module you
        create on Modules never shows up on Home. Each screen is reading
        a fixed snapshot. The labs gave you a chance to learn those
        skills one at a time, such as events, state, sharing data between
        components, Context, and Zustand — and now they go together so you
        can actually build something: Kambaz that changes as the user
        works. State is how
        that computed UI can change over time — the same loops and
        maps, but the arrays can grow, shrink, and rename as the user
        interacts with the application. We will put courses and modules in Zustand
        so any Client Component can subscribe to the same list. A
        coverage checklist is in <SectionLink to="4.11" /> — work through
        each screen as you read, then use the list to confirm you did
        everything. It is a recap, not a reason to skip ahead.
      </p>
      <p>
        As discussed in the labs, there are several options for maintaining
        state, such as <code>useState</code>, Context, Zustand, and Redux. It is
        important to understand where each is appropriate, both in
        general and in Kambaz.
      </p>
      <p>
        <code>useState</code>{" "}belongs in the component that owns a
        value, or a parent that shares it with a few children. A counter,
        a form draft, a dialog that is open or closed — those stay local.
        In Kambaz that is the course you are typing before Add, the
        hamburger that hides Course Navigation, the module name in the
        editor: UI that one screen cares about, not the shared lists.
      </p>
      <p>
        Context lets a parent publish a value that any descendant can
        read without passing props through every layer. That fits a value
        that changes rarely, such as a theme or who is signed in. It is a poor
        place for courses and modules. Those arrays change whenever the
        user adds, edits, or deletes, and when a Context value changes,
        every component that reads it re-renders. Typing a new course on
        Dashboard would refresh Home, Modules, and anything else
        subscribed to that context.
      </p>
      <p>
        We will use Context in Kambaz for the signed-in user. Who is
        signed in changes at Sign in and Sign out, not while someone types
        a course name, so wrapping the Kambaz layout in a Provider is a
        reasonable cost. Sign in, Profile, Dashboard, and Account
        Navigation all sit under that layout, so they can read{" "}
        <code>currentUser</code>{" "}without passing it as a prop. We will
        not put courses or modules in that same context.
      </p>
      <p>
        We could have put <code>currentUser</code>{" "}in Zustand too. Local{" "}
        <code>useState</code>{" "}plus Zustand for everything shared would
        have worked — it would even have been simpler, with no Provider to
        wrap. We are using both so you practice each on a use that fits:
        Context for a stable value the tree needs, Zustand for the lists
        many screens mutate.
      </p>
      <p>
        Zustand is an external store you import as a hook — no Provider
        to wrap the tree. Components subscribe to the slices they need,
        so Dashboard and Home can add, edit, and delete the same courses
        array without living under one parent. That is how Kambaz will
        hold courses and modules.
      </p>
      <p>
        Redux Toolkit solves the same problem Zustand does — shared
        application state — but it takes more pieces to wire together:
        slices, a Provider, and <code>dispatch</code>. We are skipping
        Redux for Kambaz. It is mentioned here only for historical
        purposes: many existing apps still use it, and the lab counter is
        enough to read that code. Zustand already holds the lists.
        Context already holds who is signed in.
      </p>
      <table className="mb-4 w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-300">
            <th className="p-2">Tool</th>
            <th className="p-2">Use</th>
            <th className="p-2">Don&apos;t use</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-neutral-200">
            <td className="p-2">
              <code>useState</code>
            </td>
            <td className="p-2">One component or a small tree</td>
            <td className="p-2">
              Courses that Dashboard and Home both mutate
            </td>
          </tr>
          <tr className="border-b border-neutral-200">
            <td className="p-2">Context</td>
            <td className="p-2">
              Signed-in user (changes at sign-in / sign-out)
            </td>
            <td className="p-2">Courses, modules, or any list that changes often</td>
          </tr>
          <tr className="border-b border-neutral-200">
            <td className="p-2">Zustand</td>
            <td className="p-2">Kambaz courses and modules</td>
            <td className="p-2">
              Replacing <code>useState</code>{" "}on a single counter
            </td>
          </tr>
          <tr>
            <td className="p-2">Redux Toolkit</td>
            <td className="p-2">Historical literacy — skip for Kambaz</td>
            <td className="p-2">Porting courses and modules a second time</td>
          </tr>
        </tbody>
      </table>

      <Section
        level={3}
        id="sec-4-10-1"
        title="4.10.1 A Courses Store"
      >
        <p>
          Start the store from the same JSON{" "}
          <SectionLink to="3.9.2" />{" "}introduced, then export functions
          that add, update, and delete. Generate a new{" "}
          <code>_id</code>{" "}with <code>crypto.randomUUID()</code>{" "}so you
          do not need an extra library:
        </p>
        <CodeBlock
          language="tsx"
          name="coursesStore"
          file="app/(kambaz)/store/coursesStore.ts"
        >{`"use client";

import { create } from "zustand";
import coursesJson from "../database/courses.json";

export type Course = (typeof coursesJson)[number];

const emptyCourse: Course = {
  _id: "0",
  name: "New Course",
  number: "New Number",
  startDate: "2023-09-10",
  endDate: "2023-12-15",
  department: "D123",
  credits: 4,
  description: "New Description",
  image: "/images/reactjs.jpg",
};

type CoursesStore = {
  courses: Course[];
  addCourse: (course: Course) => void;
  deleteCourse: (courseId: string) => void;
  updateCourse: (course: Course) => void;
};

export const useCoursesStore = create<CoursesStore>((set) => ({
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

export { emptyCourse };`}</CodeBlock>
      </Section>

      <Section
        level={3}
        id="sec-4-10-2"
        title="4.10.2 Dashboard Create, Edit, and Delete"
      >
        <p>
          Dashboard has to be a Client Component because it calls store
          hooks and keeps a local form draft. The published list
          comes from the store, but the form still needs a local{" "}
          <code>course</code>{" "}draft — that is one-screen UI state, so{" "}
          <code>useState</code>{" "}is enough. Add, Update, Edit, and Delete
          call store functions: Edit copies a card into the form, and
          Update writes that draft back by <code>_id</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="Dashboard"
          file="app/(kambaz)/dashboard/page.tsx"
        >{`"use client";

import { useState } from "react";
import "@/app/labs/lab2/tailwind/utilities.css";
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

  return (
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
      </h5>
      <input
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
      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2>
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
}`}</CodeBlock>
        <p>
          The target Add row looks like <FigureLink to="4.10.2a" />. After
          you bind the form, it looks like <FigureLink to="4.10.2b" />:
        </p>
        <BookFigure
          sources={[
            {
              id: "fig-4.10.2a",
              src: "/images/book/ch4/figures/fig-4-10-2a-add-course.png",
              alt: "Dashboard heading with a New Course row and an Add button",
              caption: "Figure 4.10.2a — Creating a new course",
            },
            {
              id: "fig-4.10.2b",
              src: "/images/book/ch4/figures/fig-4-10-2b-course-form.png",
              alt: "New Course form with name and description fields",
              caption: "Figure 4.10.2b — Course name and description form",
            },
          ]}
        />
        <p>
          Convert the <code>course</code>{" "}constant into state so the
          fields can change. Bind <code>value</code>{" "}and{" "}
          <code>onChange</code>{" "}with the same object-spread pattern as{" "}
          <SectionLink to="4.2.8" />. Confirm you can type a title, click
          Add, and see the published count go up. The card still needs
          Delete and Edit.
        </p>
        <p>
          Delete filters the store by <code>_id</code>. The button sits
          inside a <code>Link</code>, so call{" "}
          <code>event.preventDefault()</code>{" "}or the card navigates away
          before the course disappears. The Delete control looks like{" "}
          <FigureLink to="4.10.2c" />:
        </p>
        <BookFigure
          id="fig-4.10.2c"
          src="/images/book/ch4/figures/fig-4-10-2c-delete-course.png"
          alt="Course card with Go and Delete buttons"
          caption="Figure 4.10.2c — Deleting a course"
        />
        <p>
          Edit copies that card into the form so you can change the name
          and description, then Update writes the draft back by{" "}
          <code>_id</code>. After Edit, the form and the card should match{" "}
          <FigureLink to="4.10.2d" />:
        </p>
        <BookFigure
          id="fig-4.10.2d"
          src="/images/book/ch4/figures/fig-4-10-2d-edit-course.png"
          alt="Course form filled from an existing course with Update, Edit, and Delete"
          caption="Figure 4.10.2d — Editing a course"
        />
        <CodeBlock
          language="tsx"
          name="CourseCard"
          file="app/(kambaz)/dashboard/CourseCard.tsx"
        >{`"use client";

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
}) {
  return (
    <div className="wd-dashboard-course w-[300px] max-w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
      <Link
        href={\`/courses/\${_id}/home\`}
        className="wd-dashboard-course-link block text-neutral-900 no-underline"
      >
        {/* image, title, description */}
        <button type="button">Go</button>
        <button
          type="button"
          id="wd-edit-course-click"
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
          onClick={(event) => {
            event.preventDefault();
            onDelete();
          }}
        >
          Delete
        </button>
      </Link>
    </div>
  );
}`}</CodeBlock>
        <p>
          The live dashboard below is the same component as{" "}
          <LocalUrl href="/dashboard" />. Add a course, confirm the
          published count increases, Edit a title, Update, then Delete:
        </p>
        <LiveDemo
          name="Dashboard"
          file="app/(kambaz)/dashboard/page.tsx"
          mode="styled"
        >
          <Dashboard />
        </LiveDemo>
        <OnYourOwn>
          Add controlled inputs for <code>number</code>{" "}and{" "}
          <code>startDate</code>{" "}on the Dashboard form so a new course
          can carry those fields too.
        </OnYourOwn>
        <WithAI
          prompt={`In app/(kambaz)/dashboard/page.tsx, keep any extra form fields I added. After the description textarea, add a sample controlled input id="wd-course-number" bound to course.number with the spread update pattern. Do not rename my personal fields.`}
        >
          Ask the assistant to add one extra sample course field:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-10-3"
        title="4.10.3 Course Navigation Toggle"
      >
        <p>
          The hamburger next to the breadcrumb should show and hide Course
          Navigation. That flag is local to the course layout, so{" "}
          <code>useState</code>{" "}is enough — leave it out of Zustand.
          Convert <code>app/(kambaz)/courses/[cid]/layout.tsx</code>{" "}to a
          Client Component, read <code>cid</code>{" "}with{" "}
          <code>useParams</code>, and look up the course in the Zustand
          store so a newly added course still has a name in the
          breadcrumb:
        </p>
        <CodeBlock
          language="tsx"
          name="CoursesLayout"
          file="app/(kambaz)/courses/[cid]/layout.tsx"
        >{`"use client";

import { ReactNode, useState } from "react";
import { useParams } from "next/navigation";
import { FaAlignJustify } from "react-icons/fa6";
import "@/app/labs/lab2/tailwind/utilities.css";
import CourseNavigation from "./Navigation";
import Breadcrumb from "./Breadcrumb";
import { useCoursesStore } from "../../store/coursesStore";

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

  return (
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
}`}</CodeBlock>
        <p>
          Open{" "}
          <Link href="/courses/RS101/home">/courses/RS101/home</Link>{" "}and
          click the hamburger (<FigureLink to="4.10.3" />). With the
          sidebar visible the screen looks like{" "}
          <FigureLink to="4.10.3a" />; after a click it looks like{" "}
          <FigureLink to="4.10.3b" />. Add a course on the dashboard, open
          it, and confirm the breadcrumb shows the name you typed.
        </p>
        <BookFigure
          id="fig-4.10.3"
          src="/images/book/ch4/figures/fig-4-10-3-hamburger.png"
          alt="Hamburger icon that toggles course navigation"
          caption="Figure 4.10.3 — Course navigation toggle"
          imageClassName="mx-auto h-auto w-16 max-w-full rounded border border-neutral-200 bg-white object-contain"
        />
        <BookFigure
          sources={[
            {
              id: "fig-4.10.3a",
              src: "/images/book/ch4/figures/fig-4-10-3a-nav-shown.png",
              alt: "Course Home with course navigation sidebar visible",
              caption: "Figure 4.10.3a — Course navigation shown",
            },
            {
              id: "fig-4.10.3b",
              src: "/images/book/ch4/figures/fig-4-10-3b-nav-hidden.png",
              alt: "Course Home with course navigation sidebar hidden",
              caption: "Figure 4.10.3b — Course navigation hidden",
            },
          ]}
        />
      </Section>

      <KambazModules />
      <KambazAccount />

    </Section>
  );
}
