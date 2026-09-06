import type { LectureSlide } from "../types";

export const KAMBAZ_ACCOUNT_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 1 · Kambaz Account",
      "Sign in, Sign up, Profile, account layout",
    ],
  },
  {
    id: "screens",
    title: "Three account screens",
    kind: "content",
    bullets: [
      "**Sign up** registers a new user",
      "**Sign in** identifies a returning user",
      "**Profile** lets them view and edit account fields",
      "Account Navigation keeps those screens a click apart without a full reload",
    ],
  },
  {
    id: "signin",
    title: "Sign in — username and password",
    kind: "demo",
    embed: "kambaz-signin",
    bullets: [
      "`app/(kambaz)/account/signin/page.tsx` — URL `/account/signin`",
      "Wrapper id `wd-signin-screen`. Classes `wd-username` and `wd-password`",
      "`defaultValue` is starter credentials while there is no real auth",
      "`Link` to Profile (`wd-signin-btn`) and Sign up (`wd-signup-link`)",
    ],
    code: `import Link from "next/link";

export default function Signin() {
  return (
    <div id="wd-signin-screen">
      <h3>Sign in</h3>
      <input
        placeholder="username"
        className="wd-username"
        defaultValue="ada"
      />{" "}
      <br />
      <input
        placeholder="password"
        type="password"
        className="wd-password"
        defaultValue="123"
      />{" "}
      <br />
      <Link href="/account/profile" id="wd-signin-btn">
        Sign in
      </Link>{" "}
      <br />
      <Link href="/account/signup" id="wd-signup-link">
        Sign up
      </Link>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/signin/page.tsx",
  },
  {
    id: "redirects",
    title: "Redirect /account and / to Sign in",
    kind: "content",
    bullets: [
      "`redirect` from `next/navigation` — not a deep Next internals import",
      "`app/(kambaz)/account/page.tsx` sends `/account` to `/account/signin`",
      "The Kambaz landing (`app/(kambaz)/page.tsx`) does the same for `/`",
      "Unlike `Link`, `redirect` runs on render",
    ],
    code: `import { redirect } from "next/navigation";

export default function AccountPage() {
  redirect("/account/signin");
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/page.tsx",
    codeBlocks: [
      {
        file: "app/(kambaz)/page.tsx",
        language: "tsx",
        code: `import { redirect } from "next/navigation";

export default function Kambaz() {
  redirect("/account/signin");
}`,
      },
    ],
  },
  {
    id: "signup",
    title: "Sign up adds verify password",
    kind: "demo",
    embed: "kambaz-signup",
    bullets: [
      "`app/(kambaz)/account/signup/page.tsx` — URL `/account/signup`",
      "Wrapper id `wd-signup-screen`. Third field class `wd-password-verify`",
      "Links: Sign up → `/account/profile`, Sign in → `/account/signin`",
      "Absolute paths — not `href=\"profile\"`",
    ],
    code: `import Link from "next/link";

export default function Signup() {
  return (
    <div id="wd-signup-screen">
      <h3>Sign up</h3>
      <input placeholder="username" className="wd-username" defaultValue="ada" />
      <br />
      <input placeholder="password" type="password" className="wd-password" defaultValue="123" />
      <br />
      <input placeholder="verify password" type="password" className="wd-password-verify" />
      <br />
      <Link href="/account/profile">Sign up</Link>
      <br />
      <Link href="/account/signin">Sign in</Link>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/signup/page.tsx",
    codeAddedLines: [11],
  },
  {
    id: "profile",
    title: "Profile reuses Lab 1 fields",
    kind: "demo",
    embed: "kambaz-profile",
    bullets: [
      "`app/(kambaz)/account/profile/page.tsx`",
      "Ids: `wd-firstname`, `wd-lastname`, `wd-dob`, `wd-email`, `wd-role`",
      "Reuse `date`, `email`, and a `select` from Lab 1 forms",
      "Sign out is a `Link` to `/account/signin`",
    ],
    code: `<div id="wd-profile-screen">
  <h3>Profile</h3>
  <input defaultValue="alice" placeholder="username" className="wd-username" />
  <br />
  <input defaultValue="123" placeholder="password" type="password" className="wd-password" />
  <br />
  <input defaultValue="Alice" placeholder="First Name" id="wd-firstname" />
  <br />
  <input defaultValue="Wonderland" placeholder="Last Name" id="wd-lastname" />
  <br />
  <input defaultValue="2000-01-01" type="date" id="wd-dob" />
  <br />
  <input defaultValue="alice@wonderland" type="email" id="wd-email" />
  <br />
  <select defaultValue="FACULTY" id="wd-role">
    <option value="USER">User</option>
    <option value="ADMIN">Admin</option>
    <option value="FACULTY">Faculty</option>
    <option value="STUDENT">Student</option>
  </select>
  <br />
  <Link href="/account/signin">Sign out</Link>
</div>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/profile/page.tsx",
  },
  {
    id: "account-nav",
    title: "Account Navigation sidebar",
    kind: "content",
    bullets: [
      "`app/(kambaz)/account/Navigation.tsx` — wrapper `wd-account-navigation`",
      "Three absolute `Link`s: `/account/signin`, `/account/signup`, `/account/profile`",
      "Same idea as the Labs TOC: nav is a component, not copied into every screen",
    ],
    code: `import Link from "next/link";

export default function AccountNavigation() {
  return (
    <div id="wd-account-navigation">
      <Link href="/account/signin">Signin</Link> <br />
      <Link href="/account/signup">Signup</Link> <br />
      <Link href="/account/profile">Profile</Link> <br />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/Navigation.tsx",
  },
  {
    id: "account-layout",
    title: "Account layout: nav left",
    kind: "demo",
    embed: "kambaz-account-nav",
    bullets: [
      "`app/(kambaz)/account/layout.tsx` does **not** create a URL",
      "Two-column `<table>`: navigation left, `{children}` right",
      "Wrapper id `wd-kambaz-account`",
      "Click Signin / Signup / Profile in the live nav — only the right column swaps",
    ],
    code: `import { ReactNode } from "react";
import AccountNavigation from "./Navigation";

export default function AccountLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div id="wd-kambaz-account">
      <table>
        <tbody>
          <tr>
            <td valign="top">
              <AccountNavigation />
            </td>
            <td valign="top" width="100%">
              {children}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/layout.tsx",
    codeAddedLines: [2, 12, 15],
    interactiveHint:
      "Click Signup in the live sidebar. Nav stays. Only {children} changes.",
  },
  {
    id: "next-up",
    title: "Next: Dashboard cards",
    kind: "title",
    bullets: [
      "After Sign in works, point `wd-signin-btn` at `/dashboard`",
      "Extract a `CourseCard` so you do not copy the markup three times",
    ],
  },
];
