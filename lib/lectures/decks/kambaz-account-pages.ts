import type { LectureSlide } from "../types";

export const KAMBAZ_ACCOUNT_PAGES_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 4 · Account Pages and Sign Up",
      "§4.10.5.4–6 · Account Nav, Profile, Sign up",
    ],
  },
  {
    id: "purpose",
    title: "Account Pages and Sign Up",
    kind: "content",
    bullets: [
      "Account Navigation and the landing page react to `currentUser`",
      "Profile edits a draft copy of the user",
      "AccountContext grows a `users` list so Sign up can add to it",
    ],
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
    title: "Copy currentUser into a draft",
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
    title: "Edit profile fields and sign out",
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
    title: "Add users and CRUD to the type",
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
    title: "Provider implements user CRUD",
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
    title: "createUser, sign in, go to Profile",
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
    title: "Sign up inputs and button",
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
    title: "Find the user in context users",
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
    title: "Sign in form inputs",
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
    id: "recap",
    title: "Account Pages and Sign Up recap",
    kind: "content",
    bullets: [
      "Account Nav and landing pick screens from `currentUser`",
      "Profile copies the user into a draft before editing",
      "Sign up calls `createUser`; Sign in finds the new user in context",
    ],
  },
];
