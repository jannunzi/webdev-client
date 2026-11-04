import type { LectureSlide } from "../types";

export const KAMBAZ_ACCOUNT_PAGES_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 4 · Account Pages and Sign Up",
      "Account Nav and Profile, plus Sign up",
    ],
  },
  {
    id: "purpose",
    title: "Implementing Account Pages and Sign Up",
    kind: "content",
    bullets: [
      "Account screens change depending on whether someone is signed in",
      "Profile lets the signed-in user edit their details and sign out",
      "Sign up adds a new user, so the context needs a list of users",
    ],
  },
  {
    id: "nav-intro",
    title: "Planning Account Navigation",
    kind: "content",
    bullets: [
      "Goal: the Account sidebar shows links that fit who is signed in",
      "Signed in: only a Profile link",
      "Signed out: Sign in and Sign up links",
      "The next slide builds the sidebar",
    ],
  },
  {
    id: "nav",
    title: "Account Navigation Component",
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
    title: "Planning the Account Landing Page",
    kind: "content",
    bullets: [
      "Goal: opening Account sends the user to the right screen",
      "Nobody signed in: go to Sign in. Someone signed in: go to Profile",
      "The next slide builds that landing page",
    ],
  },
  {
    id: "account-page",
    title: "Account Landing Page Redirects",
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
    title: "Planning the Profile Screen",
    kind: "content",
    bullets: [
      "Goal: a Profile form where the signed-in user edits their details",
      "Nobody signed in: send the visitor to Sign in",
      "The form edits a copy, so the stored user changes only on Update",
      "Sign out clears the signed-in user and returns to Sign in",
      "The next three slides build Profile in parts",
    ],
  },
  {
    id: "profile",
    title: "Profile Draft from currentUser",
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
    title: "Profile Text Inputs",
    kind: "content",
    code: `  if (!profile) return null;
  return (
    <div id="wd-profile-screen">
      <h3>Profile</h3>
      <input value={profile.username} id="wd-username"
        onChange={(e) => setProfile({ ...profile, username: e.target.value })} />
      <input value={profile.password} type="password" id="wd-password"
        onChange={(e) => setProfile({ ...profile, password: e.target.value })} />
      <input value={profile.firstName} id="wd-firstname"
        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
      <input value={profile.lastName} id="wd-lastname"
        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
      <input value={profile.email} type="email" id="wd-email"
        onChange={(e) => setProfile({ ...profile, email: e.target.value })} />`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/profile/page.tsx",
    codeStartLine: 29,
  },
  {
    id: "profile-part-3",
    title: "Profile Role and Account Buttons",
    kind: "content",
    code: `      <select value={profile.role} id="wd-role"
        onChange={(e) => setProfile({ ...profile, role: e.target.value })} >
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
    codeStartLine: 43,
  },
  {
    id: "profile-live",
    title: "Profile Demo",
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
    title: "Planning a Users List in Context",
    kind: "content",
    bullets: [
      "Goal: Sign up and the People table must add, edit and delete users",
      "So the account context now also holds the list of all users",
      "It gains actions to create, update and delete a user",
      "A blank user lives here too, the same way a blank course lives in the courses store",
      "The next two slides extend the context in parts",
    ],
  },
  {
    id: "people-context",
    title: "Blank User and Context Types",
    kind: "content",
    code: `"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import usersJson from "../database/users.json";

export type User = (typeof usersJson)[number];

const emptyUser: User = {
  _id: "0", username: "new_user", password: "", firstName: "New", lastName: "User",
  email: "", role: "STUDENT", loginId: "", section: "S101", lastActivity: "", totalActivity: "",
};

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
    title: "AccountProvider User CRUD",
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
        currentUser, setCurrentUser, users,
        createUser,  updateUser,     deleteUser,
      }} >
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
}

export { emptyUser };`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/AccountContext.tsx",
    codeStartLine: 24,
  },
  {
    id: "signup-intro",
    title: "Planning the Sign Up Screen",
    kind: "content",
    bullets: [
      "Goal: a Sign up screen with username and password fields",
      "Signing up adds a new user, signs them in and opens Profile",
      "The next two slides build the screen in parts",
    ],
  },
  {
    id: "signup",
    title: "Sign Up with createUser",
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
      _id: crypto.randomUUID(), username, password, firstName: "", lastName: "",
      email: "", role: "STUDENT", loginId: "", section: "", lastActivity: "", totalActivity: "",
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
    title: "Sign Up Form Inputs",
    kind: "content",
    code: `  return (
    <div id="wd-signup-screen">
      <h3>Sign up</h3>
      <input value={username} id="wd-username" placeholder="username"
        onChange={(e) => setUsername(e.target.value)} />
      <input value={password} id="wd-password" type="password" placeholder="password"
        onChange={(e) => setPassword(e.target.value)} />
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
    title: "Updating Sign In for New Users",
    kind: "content",
    bullets: [
      "Sign in must now find users added by Sign up, not only the JSON file",
      "So it searches the users list in the account context",
      "The next two slides show the updated Sign in screen",
    ],
  },
  {
    id: "signup-signin",
    title: "Sign In Lookup in Context Users",
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
    title: "Sign In Form Inputs",
    kind: "content",
    code: `  return (
    <div id="wd-signin-screen">
      <h3>Sign in</h3>
      <input value={credentials.username} id="wd-username" placeholder="username"
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        } />
      <input value={credentials.password} type="password" id="wd-password" placeholder="password"
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        } />
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
    title: "Sign Up Demo",
    kind: "demo",
    bullets: [
      "Sign up with a new username, then fill Profile and Update",
      "Sign out, then sign back in with the new username and password",
      "The new user only lives in memory until a later chapter",
    ],
    density: "spacious",
    embed: "kambaz-ch4-signup",
  },
  {
    id: "recap",
    title: "Account Pages and Sign Up Recap",
    kind: "content",
    bullets: [
      "Account Nav and landing pick screens from `currentUser`",
      "Profile copies the user into a draft before editing",
      "Sign up calls `createUser`; Sign in finds the new user in context",
    ],
  },
];
