import type { LectureSlide } from "../types";

export const KAMBAZ_ACCOUNT_CONTEXT_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 4 · Account Context",
      "§4.10.5 · who is signed in, shared down the tree",
    ],
  },
  {
    id: "purpose",
    title: "User belongs in Context",
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
    title: "AccountContext holds the user",
    kind: "content",
    bullets: [
      "Seed the `User` type from `users.json`",
      "`currentUser` starts `null` until someone signs in",
      "The hook throws outside the provider — same as `useCounterContext`",
    ],
  },
  {
    id: "context",
    title: "AccountContext holds the user (1/2)",
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
    title: "AccountContext holds the user (2/2)",
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
    title: "Wrap the Kambaz layout",
    kind: "content",
    bullets: [
      "The layout can stay a Server Component — it only renders the provider",
      "Every Kambaz screen then sits inside `AccountProvider`",
      "Confirm Sign in, Dashboard, and Profile can call the hook",
    ],
  },
  {
    id: "layout",
    title: "Wrap the Kambaz layout (code)",
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
    title: "Sign in writes currentUser",
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
    title: "Sign in writes currentUser (1/2)",
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
    title: "Sign in writes currentUser (2/2)",
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
    title: "Sign in demo",
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
    title: "Dashboard by Enrollment",
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
    title: "Dashboard by Enrollment (1/2)",
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
    title: "Dashboard by Enrollment (2/2)",
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
          <CourseCard key={c._id} {...c}
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
    id: "nav-intro",
    title: "Account Navigation reads the user",
    kind: "content",
    bullets: [
      "Signed in: the sidebar lists only Profile",
      "`currentUser` is `null`: list Signin and Signup",
      "Confirm the links change after sign in and again after sign out",
    ],
  },
  {
    id: "nav",
    title: "Account Navigation reads the user (code)",
    kind: "content",
    code: `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccountContext } from "./AccountContext";

export default function AccountNavigation() {
  const { currentUser } = useAccountContext();
  const links = currentUser
    ? (["profile"] as const)
    : (["signin", "signup"] as const);
  const pathname = usePathname() ?? "";
  return (
    <div id="wd-account-navigation">
      {links.map((link) => (
        <span key={link}>
          <Link href={\`/account/\${link}\`}>
            {link === "signin"
              ? "Signin"
              : link === "signup"
                ? "Signup"
                : "Profile"}
          </Link>
          <br />
        </span>
      ))}
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/Navigation.tsx",
  },
  {
    id: "account-page-intro",
    title: "Account landing picks the screen",
    kind: "content",
    bullets: [
      "Nobody signed in: the Account screen redirects to Sign in",
      "Someone signed in: it redirects to Profile",
      "The Account link in Kambaz Navigation follows the same rule",
    ],
  },
  {
    id: "account-page",
    title: "Account landing picks the screen (code)",
    kind: "content",
    code: `"use client";

import { redirect } from "next/navigation";
import { useAccountContext } from "./AccountContext";

export default function AccountPage() {
  const { currentUser } = useAccountContext();
  if (!currentUser) {
    redirect("/account/signin");
  } else {
    redirect("/account/profile");
  }
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/page.tsx",
  },
  {
    id: "profile-intro",
    title: "Profile reads the user",
    kind: "content",
    bullets: [
      "Profile gets `currentUser` from `AccountContext`",
      "No `currentUser`: navigate to Sign in",
      "`useEffect` copies the user into local `profile` state for the form",
      "Editing a field doesn't write the context on every keystroke",
      "Sign out sets `currentUser` to `null` and navigates to Sign in",
    ],
  },
  {
    id: "profile",
    title: "Profile reads the user (1/2)",
    kind: "content",
    code: `"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccountContext, type User } from "../AccountContext";

export default function Profile() {
  const [profile, setProfile] = useState<User | null>(null);
  const { currentUser, setCurrentUser } = useAccountContext();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/account/signin");
      return;
    }
    setProfile(currentUser);
  }, [currentUser, router]);

  const update = () => {
    setCurrentUser(profile);
  };

  const signout = () => {
    setCurrentUser(null);
    router.push("/account/signin");
  };
`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/profile/page.tsx",
  },
  {
    id: "profile-part-2",
    title: "Profile reads the user (2/2)",
    kind: "content",
    code: `  if (!profile) return null;
  return (
    <div id="wd-profile-screen">
      <h3>Profile</h3>
      <input
        id="wd-username"
        value={profile.username}
        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
      />
      <input
        id="wd-password"
        type="password"
        value={profile.password}
        onChange={(e) => setProfile({ ...profile, password: e.target.value })}
      />
      <input
        id="wd-firstname"
        value={profile.firstName}
        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
      />
      <input
        id="wd-lastname"
        value={profile.lastName}
        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
      />
      <input
        id="wd-email"
        type="email"
        value={profile.email}
        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
      />
      <select
        id="wd-role"
        value={profile.role}
        onChange={(e) => setProfile({ ...profile, role: e.target.value })}
      >
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
        <option value="FACULTY">Faculty</option>
        <option value="STUDENT">Student</option>
      </select>
      <button type="button" onClick={update} id="wd-update-btn">
        Update
      </button>
      <button type="button" onClick={signout} id="wd-signout-btn">
        Sign out
      </button>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/profile/page.tsx",
    codeStartLine: 29,
  },
  {
    id: "profile-live",
    title: "Profile demo",
    kind: "demo",
    bullets: [
      "Every input spreads `profile` and overwrites one property",
      "Update passes `profile` to `setCurrentUser`",
      "Sign out sets `currentUser` to `null`",
    ],
    embed: "kambaz-ch4-profile",
  },
  {
    id: "people-context-intro",
    title: "AccountContext holds the users",
    kind: "content",
    bullets: [
      "Users live in the React `AccountContext`, next to `currentUser`",
      "`users` is `useState` seeded from `users.json`; `createUser(user)` returns the new user",
      "Add `updateUser(user)` and `deleteUser(userId)`, the Chapter 5 client names",
    ],
  },
  {
    id: "people-context",
    title: "AccountContext with users (1/2)",
    kind: "content",
    code: `"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import usersJson from "../database/users.json";

export type User = (typeof usersJson)[number];

type AccountContextValue = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  createUser: (user: User) => User;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
};

const AccountContext = createContext<AccountContextValue | null>(null);
`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/AccountContext.tsx",
  },
  {
    id: "people-context-part-2",
    title: "AccountContext with users (2/2)",
    kind: "content",
    code: `export function AccountProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(usersJson);
  const createUser = (user: User) => {
    const newUser = { ...user, _id: crypto.randomUUID() };
    setUsers([...users, newUser]);
    return newUser;
  };
  const updateUser = (user: User) => {
    setUsers(users.map((u) => (u._id === user._id ? user : u)));
  };
  const deleteUser = (userId: string) => {
    setUsers(users.filter((u) => u._id !== userId));
  };
  return (
    <AccountContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        createUser,
        updateUser,
        deleteUser,
      }}
    >
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
    codeStartLine: 19,
  },
  {
    id: "signup-intro",
    title: "Sign up creates a user",
    kind: "content",
    bullets: [
      "`username` and `password` live in `useState`",
      "`createUser` adds a user with every `users.json` field to the context's `users`",
      "`setCurrentUser(newUser)` signs them in, then navigate to Profile",
    ],
  },
  {
    id: "signup",
    title: "Sign up creates a user (1/2)",
    kind: "content",
    code: `"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccountContext } from "../AccountContext";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setCurrentUser, createUser } = useAccountContext();
  const router = useRouter();

  const signup = () => {
    if (!username || !password) return;
    const newUser = createUser({
      _id: crypto.randomUUID(),
      username,
      password,
      firstName: "",
      lastName: "",
      email: "",
      role: "STUDENT",
      loginId: "",
      section: "",
      lastActivity: "",
      totalActivity: "",
    });
    setCurrentUser(newUser);
    router.push("/account/profile");
  };
`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/signup/page.tsx",
  },
  {
    id: "signup-part-2",
    title: "Sign up creates a user (2/2)",
    kind: "content",
    code: `  return (
    <div id="wd-signup-screen">
      <h3>Sign up</h3>
      <input
        id="wd-username"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        id="wd-password"
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="button" onClick={signup} id="wd-signup-btn">
        Sign up
      </button>
      <Link href="/account/signin" id="wd-signin-link">
        Sign in
      </Link>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/signup/page.tsx",
    codeStartLine: 33,
  },
  {
    id: "signup-signin-intro",
    title: "Sign in finds new users",
    kind: "content",
    bullets: [
      "Sign in now searches the context's `users`, not `users.json`",
      "A user created by Sign up can sign out and sign back in",
    ],
  },
  {
    id: "signup-signin",
    title: "Sign in reads context users (1/2)",
    kind: "content",
    code: `"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccountContext } from "../AccountContext";

export default function Signin() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const { setCurrentUser, users } = useAccountContext();
  const router = useRouter();

  const signin = () => {
    const user = users.find(
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
    id: "signup-signin-part-2",
    title: "Sign in reads context users (2/2)",
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
    codeStartLine: 27,
  },
  {
    id: "signup-live",
    title: "Sign up demo",
    kind: "demo",
    bullets: [
      "Sign up with a new username, then fill Profile and Update",
      "Sign out, then sign back in with the new username and password",
      "The new user only lives in memory until a later chapter",
    ],
    embed: "kambaz-ch4-signup",
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
      "`enrolled` is `null` when nobody is signed in. Delete calls `deleteCourse(_id)`",
      "Green **Enroll** or red **Unenroll**, hidden while `enrolled` is `null`",
      "`event.preventDefault()` keeps the click from following the card's `Link`",
    ],
  },
  {
    id: "enroll-card",
    title: "CourseCard enrollment button (1/4)",
    kind: "content",
    code: `import Link from "next/link";
import Image from "next/image";
import { useCoursesStore } from "../store/coursesStore";
import { useEnrollmentsStore } from "../store/enrollmentsStore";
import { useAccountContext } from "../account/AccountContext";

export default function CourseCard({
  _id,
  name,
  description,
  image,
  onEdit,
}: {
  _id: string;
  name: string;
  description: string;
  image: string;
  onEdit: () => void;
}) {`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
  },
  {
    id: "enroll-card-part-2",
    title: "CourseCard enrollment button (2/4)",
    kind: "content",
    code: `  const deleteCourse = useCoursesStore((state) => state.deleteCourse);
  const { currentUser } = useAccountContext();
  const { enrollments, enrollIntoCourse, unenrollFromCourse } =
    useEnrollmentsStore();
  const enrolled = currentUser
    ? enrollments.some((e) => e.user === currentUser._id && e.course === _id)
    : null;
  const toggleEnrollment = () => {
    if (!currentUser) return;
    if (enrolled) {
      unenrollFromCourse(currentUser._id, _id);
    } else {
      enrollIntoCourse(currentUser._id, _id);
    }
  };`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
    codeStartLine: 20,
  },
  {
    id: "enroll-card-part-3",
    title: "CourseCard enrollment button (3/4)",
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
          </button>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
    codeStartLine: 35,
  },
  {
    id: "enroll-card-part-4",
    title: "CourseCard enrollment button (4/4)",
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
              deleteCourse(_id);
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
    codeStartLine: 61,
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
    title: "Dashboard with enrollments (1/3)",
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
    title: "Dashboard with enrollments (2/3)",
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
    title: "Dashboard with enrollments (3/3)",
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
            {...c}
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
    title: "Course layout guard (1/2)",
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
    title: "Course layout guard (2/2)",
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
    id: "people-page-intro",
    title: "People table page",
    kind: "content",
    bullets: [
      "The server page reads `cid` and hands it to a client `PeopleTable`",
      "`PeopleTable` needs `\"use client\"` because a server page imports it",
    ],
  },
  {
    id: "people-page",
    title: "People table page",
    kind: "content",
    code: `import PeopleTable from "./PeopleTable";

export default async function PeopleTablePage({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;
  return <PeopleTable cid={cid} />;
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/people/table/page.tsx",
  },
  {
    id: "people-table-intro",
    title: "Add, edit, and delete people",
    kind: "content",
    bullets: [
      "A `user` draft feeds first and last name inputs, like the course draft",
      "**Add** calls the context's `createUser`, then `enrollIntoCourse` here",
      "Each row gets **Edit** (load the draft) and **Delete** (`deleteUser`)",
    ],
  },
  {
    id: "people-table",
    title: "PeopleTable with CRUD (1/3)",
    kind: "content",
    code: `"use client";

import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useEnrollmentsStore } from "../../../../store/enrollmentsStore";
import {
  useAccountContext,
  type User,
} from "../../../../account/AccountContext";

const emptyUser: User = {
  _id: "0",
  username: "new_user",
  password: "",
  firstName: "New",
  lastName: "User",
  email: "",
  role: "STUDENT",
  loginId: "",
  section: "S101",
  lastActivity: "",
  totalActivity: "",
};

export default function PeopleTable({ cid }: { cid: string }) {
  const { users, createUser, updateUser, deleteUser } = useAccountContext();
  const { enrollments, enrollIntoCourse } = useEnrollmentsStore();
  const [user, setUser] = useState<User>(emptyUser);
  const enrolled = users.filter((usr) =>
    enrollments.some(
      (enrollment) => enrollment.user === usr._id && enrollment.course === cid,
    ),
  );
  const addUser = () => {
    const newUser = createUser(user);
    enrollIntoCourse(newUser._id, cid);
  };`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/people/table/PeopleTable.tsx",
  },
  {
    id: "people-table-part-2",
    title: "PeopleTable with CRUD (2/3)",
    kind: "content",
    code: `  return (
    <div id="wd-people-table" className="overflow-x-auto">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input
          className="rounded border border-neutral-300 px-3 py-1.5"
          value={user.firstName}
          onChange={(e) => setUser({ ...user, firstName: e.target.value })}
          id="wd-user-first-name"
        />
        <input
          className="rounded border border-neutral-300 px-3 py-1.5"
          value={user.lastName}
          onChange={(e) => setUser({ ...user, lastName: e.target.value })}
          id="wd-user-last-name"
        />
        <button
          type="button"
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
          id="wd-add-user-click"
          onClick={addUser}
        >
          Add
        </button>
        <button
          type="button"
          className="rounded bg-yellow-400 px-3 py-1.5 text-sm font-medium"
          id="wd-update-user-click"
          onClick={() => updateUser(user)}
        >
          Update
        </button>
      </div>
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-300">
            <th className="p-2">Name</th>
            <th className="p-2">Login ID</th>
            <th className="p-2">Section</th>
            <th className="p-2">Role</th>
            <th className="p-2">Last Activity</th>
            <th className="p-2">Total Activity</th>
            <th className="p-2"></th>
          </tr>
        </thead>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/people/table/PeopleTable.tsx",
    codeStartLine: 38,
  },
  {
    id: "people-table-part-3",
    title: "PeopleTable with CRUD (3/3)",
    kind: "content",
    code: `        <tbody>
          {enrolled.map((usr) => (
            <tr key={usr._id} className="odd:bg-neutral-50">
              <td className="wd-full-name p-2 text-nowrap">
                <FaUserCircle className="me-2 inline align-middle text-3xl text-neutral-500" />
                <span className="wd-first-name">{usr.firstName}</span>{" "}
                <span className="wd-last-name">{usr.lastName}</span>
              </td>
              <td className="wd-login-id p-2">{usr.loginId}</td>
              <td className="wd-section p-2">{usr.section}</td>
              <td className="wd-role p-2">{usr.role}</td>
              <td className="wd-last-activity p-2">{usr.lastActivity}</td>
              <td className="wd-total-activity p-2">{usr.totalActivity}</td>
              <td className="p-2 text-nowrap">
                <button
                  type="button"
                  className="rounded bg-yellow-400 px-2 py-1 text-xs font-medium"
                  onClick={() => setUser(usr)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="ms-2 rounded bg-red-600 px-2 py-1 text-xs font-medium text-white"
                  onClick={() => deleteUser(usr._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/people/table/PeopleTable.tsx",
    codeStartLine: 82,
  },
  {
    id: "people-table-live",
    title: "People CRUD demo",
    kind: "demo",
    bullets: [
      "Type a name and **Add**: the new user joins this course's table",
      "**Edit** loads a row; change it and **Update**",
      "**Delete** removes the user everywhere",
    ],
    embed: "kambaz-people-crud",
  },
  {
    id: "recap",
    title: "Account and chapter recap",
    kind: "content",
    bullets: [
      "Context = current user. Zustand = courses and modules",
      "`useState` still owns drafts, dialogs, and one-screen flags",
      "Add, Edit, and Delete now change every screen that reads the store",
    ],
  },
];
