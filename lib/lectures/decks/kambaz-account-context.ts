import type { LectureSlide } from "../types";

export const KAMBAZ_ACCOUNT_CONTEXT_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 4 · Account Context and Sign In",
      "§4.10.5.1–3 · context, Sign in, Dashboard",
    ],
  },
  {
    id: "purpose",
    title: "Implementing Account Context",
    kind: "content",
    bullets: [
      "Sign in, Profile, Dashboard, and Account Nav all need `currentUser`",
      "That value changes at sign-in / sign-out — not while typing a course",
      "Same provider pattern as the lab counter in §4.4",
      "Zustand would have worked. Using both is practice, not a requirement",
    ],
  },
  {
    id: "context-intro",
    title: "AccountContext Overview",
    kind: "content",
    bullets: [
      "Seed the `User` type from `users.json`",
      "`currentUser` starts `null` until someone signs in",
      "The hook throws outside the provider — same as `useCounterContext`",
    ],
  },
  {
    id: "context",
    title: "Context and User Types",
    kind: "content",
    code: `"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import usersJson from "../database/users.json";

export type User = (typeof usersJson)[number];

type AccountContextValue = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
};

const AccountContext = createContext<AccountContextValue | null>(null);
`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/AccountContext.tsx",
    codeHighlightLines: [[8, 11]],
  },
  {
    id: "context-part-2",
    title: "AccountProvider and useAccountContext",
    kind: "content",
    code: `export function AccountProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  return (
    <AccountContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccountContext() {
  const value = useContext(AccountContext);
  if (!value) {
    throw new Error("useAccountContext must be used inside AccountProvider");
  }
  return value;
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/AccountContext.tsx",
    codeStartLine: 15,
    codeHighlightLines: [[1, 7], [10, 15]],
  },
  {
    id: "layout-intro",
    title: "Wrapping the Kambaz Layout",
    kind: "content",
    bullets: [
      "The layout can stay a Server Component — it only renders the provider",
      "Every Kambaz screen then sits inside `AccountProvider`",
      "Confirm Sign in, Dashboard, and Profile can call the hook",
    ],
  },
  {
    id: "layout",
    title: "Kambaz Layout with AccountProvider",
    kind: "content",
    code: `import { AccountProvider } from "./account/AccountContext";

export default function KambazLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <AccountProvider>
      <div id="wd-kambaz" className="font-sans">
        <KambazNavigation />
        <div className="wd-main-content-offset p-3">{children}</div>
      </div>
    </AccountProvider>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/layout.tsx",
    codeAddedLines: [1, 7, 12],
  },
  {
    id: "signin-intro",
    title: "Sign In Overview",
    kind: "content",
    bullets: [
      "`credentials` state holds the username and password the user types",
      "Sign in is a Client Component so the fields are controlled",
      "On click, find a user in `users.json` whose username and password match",
      "Match: `setCurrentUser(user)`, then `router.push(\"/dashboard\")`",
      "No match: ignore the click — no navigation, no user written",
      "Use the router in a click handler, not the server `redirect` helper",
    ],
  },
  {
    id: "signin",
    title: "Sign In Lookup and setCurrentUser",
    kind: "content",
    code: `"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as db from "../../database";
import { useAccountContext } from "../AccountContext";

export default function Signin() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const { setCurrentUser } = useAccountContext();
  const router = useRouter();

  const signin = () => {
    const user = db.users.find(
      (u) =>
        u.username === credentials.username &&
        u.password === credentials.password,
    );
    if (!user) return;
    setCurrentUser(user);
    router.push("/dashboard");
  };
`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/signin/page.tsx",
  },
  {
    id: "signin-part-2",
    title: "Sign In Form Inputs",
    kind: "content",
    code: `  return (
    <div id="wd-signin-screen">
      <h3>Sign in</h3>
      <input
        placeholder="username"
        id="wd-username"
        value={credentials.username}
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        }
      />
      <input
        placeholder="password"
        type="password"
        id="wd-password"
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
      />
      <button type="button" onClick={signin} id="wd-signin-btn">
        Sign in
      </button>
      <Link href="/account/signup" id="wd-signup-link">
        Sign up
      </Link>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/signin/page.tsx",
    codeStartLine: 28,
  },
  {
    id: "signin-live",
    title: "Sign In Demo",
    kind: "demo",
    bullets: [
      "Each field uses the object-spread update from §4.2.8",
      "`type=\"password\"` hides the value as you type",
      "Try `iron_man` / `stark123`: a match lands on Dashboard",
      "A wrong password stays on Sign in",
    ],
    embed: "kambaz-styled-signin",
  },
  {
    id: "dashboard-intro",
    title: "Dashboard by Enrollment Overview",
    kind: "content",
    bullets: [
      "Dashboard reads `currentUser` from `AccountContext`",
      "Show only the courses the signed-in user is enrolled in",
      "Same `enrollments.some` pattern as the People table in §3.10.9",
      "Nobody signed in: keep showing every course for Add / Edit / Delete",
      "New courses won't show until you enroll in them — that's §4.10.7",
    ],
  },
  {
    id: "dashboard",
    title: "Filtering Courses by Enrollment",
    kind: "content",
    code: `"use client";

import { useState } from "react";
import CourseCard from "./CourseCard";
import {
  emptyCourse,
  useCoursesStore,
  type Course,
} from "../store/coursesStore";
import * as db from "../database";
import { useAccountContext } from "../account/AccountContext";

export default function Dashboard() {
  const courses = useCoursesStore((state) => state.courses);
  const addCourse = useCoursesStore((state) => state.addCourse);
  const updateCourse = useCoursesStore((state) => state.updateCourse);
  const [course, setCourse] = useState<Course>(emptyCourse);
  const { currentUser } = useAccountContext();
  const visibleCourses = currentUser
    ? courses.filter((c) =>
        db.enrollments.some(
          (enrollment) =>
            enrollment.user === currentUser._id && enrollment.course === c._id,
        ),
      )
    : courses;
`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeAddedLines: [[10, 11], [18, 26]],
  },
  {
    id: "dashboard-part-2",
    title: "Course Editor and Enrolled Cards",
    kind: "content",
    code: `  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      <h5 className="flex flex-wrap items-center gap-2">
        New Course
        <button type="button" className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
          id="wd-add-new-course-click" onClick={() => addCourse(course)} >
          Add
        </button>
        <button type="button" className="rounded bg-yellow-400 px-3 py-1.5 text-sm font-medium"
          id="wd-update-course-click" onClick={() => updateCourse(course)} >
          Update
        </button>
      </h5>
      <input className="mb-2 mt-2 block w-full max-w-xl rounded border border-neutral-300 px-3 py-1.5"
        value={course.name} id="wd-course-name"
        onChange={(e) => setCourse({ ...course, name: e.target.value })} />
      <textarea className="mb-3 block w-full max-w-xl rounded border border-neutral-300 px-3 py-1.5"
        rows={3} value={course.description} id="wd-course-description"
        onChange={(e) => setCourse({ ...course, description: e.target.value })} />
      <hr />
      <h2 id="wd-dashboard-published">Published Courses ({visibleCourses.length})</h2>
      <hr />
      <div id="wd-dashboard-courses" className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {visibleCourses.map((c) => (
          <CourseCard key={c._id} course={c}
            onEdit={() => setCourse(c)} />
        ))}
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
    codeStartLine: 27,
    codeHighlightLines: [23, 26],
  },
  {
    id: "recap",
    title: "Account Context and Sign In Recap",
    kind: "content",
    bullets: [
      "Context = who is signed in; Zustand keeps courses and modules",
      "Sign in writes `currentUser`; Dashboard reads it to filter by enrollment",
      "Next: Account pages and Sign up",
    ],
  },
];
