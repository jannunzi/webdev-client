import type { LectureSlide } from "../types";

export const KAMBAZ_NAVIGATION_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 1 · Kambaz Navigation",
      "Global sidebar + Kambaz layout",
    ],
  },
  {
    id: "purpose",
    title: "Chrome stays while screens swap",
    kind: "content",
    bullets: [
      "Account, Dashboard, Calendar, Inbox, and Labs should stay visible",
      "Same layout idea as Labs: nav is not copied into every page",
      "Northeastern can stay an external `<a>` with `target=\"_blank\"`",
      "In-app destinations use `Link` from `next/link`",
    ],
  },
  {
    id: "nav-component",
    title: "KambazNavigation + wd-* ids",
    kind: "content",
    bullets: [
      "`app/(kambaz)/Navigation.tsx` — wrapper `wd-kambaz-navigation`",
      "Ids: `wd-neu-link`, `wd-account-link`, `wd-dashboard-link`, `wd-course-link`, `wd-calendar-link`, `wd-inbox-link`, `wd-labs-link`",
      "Courses can point at `/dashboard` for now — there is no `/courses` index",
      "Keep the `rel=\"noreferrer\"` on the Northeastern tab",
    ],
    code: `import Link from "next/link";

export default function KambazNavigation() {
  return (
    <div id="wd-kambaz-navigation">
      <a href="https://www.northeastern.edu/" id="wd-neu-link" target="_blank" rel="noreferrer">
        Northeastern
      </a>
      <br />
      <Link href="/account" id="wd-account-link">Account</Link>
      <br />
      <Link href="/dashboard" id="wd-dashboard-link">Dashboard</Link>
      <br />
      <Link href="/dashboard" id="wd-course-link">Courses</Link>
      <br />
      <Link href="/calendar" id="wd-calendar-link">Calendar</Link>
      <br />
      <Link href="/inbox" id="wd-inbox-link">Inbox</Link>
      <br />
      <Link href="/labs" id="wd-labs-link">Labs</Link>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/Navigation.tsx",
  },
  {
    id: "layout",
    title: "layout.tsx: nav left, children right",
    kind: "demo",
    embed: "kambaz-navigation",
    bullets: [
      "`app/(kambaz)/layout.tsx` wraps every Kambaz route",
      "Temporary `<table>`: nav `width=\"200\"`, content `width=\"100%\"`",
      "Click Account / Dashboard / Calendar in the live chrome",
      "Chapter 2 replaces the table with Flex / Grid / Tailwind",
    ],
    code: `import { ReactNode } from "react";
import KambazNavigation from "./Navigation";

export default function KambazLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <table>
      <tbody>
        <tr>
          <td valign="top" width="200">
            <KambazNavigation />
          </td>
          <td valign="top" width="100%">
            {children}
          </td>
        </tr>
      </tbody>
    </table>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/layout.tsx",
    interactiveHint:
      "Click Calendar or Inbox. Those routes 404 until not-found.tsx exists.",
  },
  {
    id: "not-found",
    title: "not-found.tsx for missing pages",
    kind: "content",
    bullets: [
      "Calendar and Inbox have no `page.tsx` yet — they 404",
      "`app/not-found.tsx` is a reserved App Router filename, like `page.tsx` and `layout.tsx`",
      "Id `wd-not-found`. Link `wd-not-found-dashboard-link` back to `/dashboard`",
      "Keep the markup simple. Fancy `className` values can wait for Chapter 2",
    ],
    code: `import Link from "next/link";

export default function NotFound() {
  return (
    <div id="wd-not-found">
      <h2>Page Not Found</h2>
      <p>
        The requested page could not be found. Please check the page URL or
        return to the dashboard.
      </p>
      <Link href="/dashboard" id="wd-not-found-dashboard-link">
        Back to Dashboard
      </Link>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/not-found.tsx",
  },
  {
    id: "next-up",
    title: "Next: Courses + course nav",
    kind: "title",
    bullets: [
      "Dynamic `[cid]` and Home at `/courses/[cid]/home`",
      "Course Navigation is a second sidebar beside Kambaz chrome",
    ],
  },
];
