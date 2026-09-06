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
    id: "context",
    title: "AccountContext holds the user",
    kind: "content",
    bullets: [
      "Seed the `User` type from `users.json`",
      "`currentUser` starts `null` until someone signs in",
      "The hook throws outside the provider — same as `useCounterContext`",
    ],
    code: `"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import usersJson from "../database/users.json";

export type User = (typeof usersJson)[number];

type AccountContextValue = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
};

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
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
    codeHighlightLines: [[8, 11], [15, 21], [24, 29]],
  },
  {
    id: "layout",
    title: "Wrap the Kambaz layout",
    kind: "content",
    bullets: [
      "The layout can stay a Server Component — it only renders the provider",
      "Every Kambaz screen then sits inside `AccountProvider`",
      "Confirm Sign in, Dashboard, and Profile can call the hook",
    ],
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
    id: "signin",
    title: "Sign in writes currentUser",
    kind: "demo",
    bullets: [
      "Controlled `credentials` for username and password",
      "`users.json.find` — match both fields or ignore the click",
      "`setCurrentUser(user)` then navigate to `/dashboard`",
    ],
    embed: "kambaz-styled-signin",
  },
  {
    id: "nav-profile",
    title: "Nav and Profile read the user",
    kind: "content",
    bullets: [
      "Account Nav hides Sign in / Sign up once someone is signed in",
      "Profile copies `currentUser` into a local form — `useEffect` with `[]`",
      "Sign out calls `setCurrentUser(null)`",
    ],
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
