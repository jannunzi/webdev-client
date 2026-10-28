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
    title: "Dashboard by Enrollment (code)",
    kind: "content",
    code: `const { currentUser } = useAccountContext();
const visibleCourses = currentUser
  ? courses.filter((c) =>
      db.enrollments.some(
        (enrollment) =>
          enrollment.user === currentUser._id && enrollment.course === c._id,
      ),
    )
  : courses;`,
    codeLanguage: "tsx",
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
      {/* password, firstName, lastName, email, role */}
      <button type="button" onClick={signout} id="wd-signout-btn">
        Sign out
      </button>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/profile/page.tsx",
    codeStartLine: 25,
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
