import type { LectureSlide } from "../types";

export const KAMBAZ_COURSES_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 1 · Kambaz Courses",
      "Dynamic [cid] + Course Navigation",
    ],
  },
  {
    id: "dynamic",
    title: "[cid] is a dynamic segment",
    kind: "content",
    bullets: [
      "Dashboard cards already link to `/courses/${id}/home`",
      "`[cid]` is a **dynamic segment**: Next.js fills `cid` from the URL (`1234` in `/courses/1234/home`)",
      "You do **not** need a `page.tsx` directly under `[cid]` — Home lives in the `home` folder",
      "If a leftover `courses/[cid]/page.tsx` exists, delete it. The book does not keep that file",
    ],
  },
  {
    id: "home-stub",
    title: "Start with a Home placeholder",
    kind: "content",
    bullets: [
      "`app/(kambaz)/courses/[cid]/home/page.tsx` — URL `/courses/1234/home`",
      "Wrapper id `wd-home`. A heading is enough until Modules exists",
      "Point each `CourseCard` at `href={\`/courses/${id}/home\`}`",
    ],
    code: `export default function Home() {
  return (
    <div id="wd-home">
      <h2>Home 1234</h2>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/home/page.tsx",
  },
  {
    id: "course-nav",
    title: "Course Navigation + cid",
    kind: "content",
    bullets: [
      "Home, Modules, Piazza, Zoom, Assignments, Quizzes, Grades, People",
      "Pass `cid` so links stay correct for every course",
      "Template literal: `` `/courses/${cid}/home` `` — backticks insert `cid`",
      "Ids: `wd-courses-navigation`, `wd-course-home-link`, `wd-course-modules-link`, … `wd-course-people-link`",
    ],
    code: `import Link from "next/link";

export default function CourseNavigation({ cid }: { cid: string }) {
  return (
    <div id="wd-courses-navigation">
      <Link href={\`/courses/\${cid}/home\`} id="wd-course-home-link">Home</Link> <br />
      <Link href={\`/courses/\${cid}/modules\`} id="wd-course-modules-link">Modules</Link> <br />
      <Link href={\`/courses/\${cid}/piazza\`} id="wd-course-piazza-link">Piazza</Link> <br />
      <Link href={\`/courses/\${cid}/zoom\`} id="wd-course-zoom-link">Zoom</Link> <br />
      <Link href={\`/courses/\${cid}/assignments\`} id="wd-course-assignments-link">Assignments</Link> <br />
      <Link href={\`/courses/\${cid}/quizzes\`} id="wd-course-quizzes-link">Quizzes</Link> <br />
      <Link href={\`/courses/\${cid}/grades\`} id="wd-course-grades-link">Grades</Link> <br />
      <Link href={\`/courses/\${cid}/people/table\`} id="wd-course-people-link">People</Link>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/Navigation.tsx",
  },
  {
    id: "layout",
    title: "Courses layout awaits params",
    kind: "demo",
    embed: "kambaz-courses",
    bullets: [
      "`params` is a Promise — mark the layout `async` and `await params` before reading `cid`",
      "Copy this shape for now; Chapter 3 explains `async` / `await`",
      "Wrapper `wd-courses`. Heading shows `Courses {cid}`",
      "Nav left, `{children}` right — same table chrome as Labs and Account",
    ],
    code: `import { ReactNode } from "react";
import CourseNavigation from "./Navigation";

export default async function CoursesLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ cid: string }>;
}>) {
  const { cid } = await params;
  return (
    <div id="wd-courses">
      <h2>Courses {cid}</h2>
      <hr />
      <table>
        <tbody>
          <tr>
            <td valign="top" width="200">
              <CourseNavigation cid={cid} />
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
    codeFile: "app/(kambaz)/courses/[cid]/layout.tsx",
    interactiveHint:
      "Click Piazza or Zoom. Placeholder heading pages are enough this week.",
  },
  {
    id: "placeholders",
    title: "Placeholder pages this week",
    kind: "content",
    bullets: [
      "Real screens this chapter: Home, Modules, Assignments",
      "Heading-only stubs: `piazza/page.tsx`, `zoom/page.tsx`, `quizzes/page.tsx`, `grades/page.tsx`, `people/table/page.tsx`",
      "People’s URL is `/courses/[cid]/people/table` — keep that path",
    ],
    code: `export default function Piazza() {
  return <h2>Piazza</h2>;
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/piazza/page.tsx",
  },
  {
    id: "next-up",
    title: "Next: Modules nested lists",
    kind: "title",
    bullets: [
      "Weeks → lessons → content items, then reuse that list on Home",
      "Extract `Module` and `Lesson` the same way you extracted `CourseCard`",
    ],
  },
];
