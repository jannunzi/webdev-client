import type { LectureSlide } from "../types";

export const KAMBAZ_OVERVIEW_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "KAMBAZ HTML UI",
      "A1: prototype the LMS screens in `app/(kambaz)`",
    ],
  },
  {
    id: "what",
    title: "Kambaz User Interface",
    kind: "content",
    bullets: [
      "Build **Kambaz**, a site inspired by a popular Online Learning Management System",
      "Start with **simple prototype** versions of common screens",
      "Improve iteratively over later assignments",
      "Do all Kambaz work in `app/(kambaz)`",
    ],
  },
  {
    id: "landing",
    title: "Create the Kambaz Landing Page",
    kind: "demo",
    embed: "kambaz-landing",
    bullets: [
      "A **landing page** is the screen for `/`",
      "Put it in the route group: `app/(kambaz)/page.tsx` — not a leftover `app/page.tsx`",
      "Wrapper id `wd-kambaz`",
    ],
    code: `export default function Kambaz() {
  return (
    <div id="wd-kambaz">
      <h1>Kambaz</h1>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/page.tsx",
  },
  {
    id: "route-group",
    title: "(kambaz) is a route group",
    kind: "content",
    bullets: [
      "Parentheses make a **route group**. The name does **not** appear in the URL",
      "`app/(kambaz)/dashboard/page.tsx` is still `/dashboard`",
      "Same App Router rule as Labs: a folder with `page.tsx` is a route",
    ],
    code: `app/(kambaz)/page.tsx                 →  /
app/(kambaz)/dashboard/page.tsx       →  /dashboard
app/(kambaz)/account/signin/page.tsx  →  /account/signin`,
    codeLanguage: "text",
  },
  {
    id: "labs-link",
    title: "Add Kambaz to TOC",
    kind: "content",
    bullets: [
      "Add a Kambaz `Link` in `app/labs/TOC.tsx`",
      "`href=\"/\"` — the group owns `/`",
      "Id `wd-kambaz-link` is what graders look for",
    ],
    code: `<li>
  <Link href="/" id="wd-kambaz-link">
    Kambaz
  </Link>
</li>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/TOC.tsx",
    codeAddedLines: [[1, 5]],
  },
  {
    id: "redirect",
    title: "Navigate to Signin by Default",
    kind: "content",
    bullets: [
      "After the heading works, Sign in becomes the default entry",
      "`redirect` from `next/navigation` runs when the route **renders**",
      "Replace the landing `h1` with a redirect to `/account/signin`",
    ],
    code: `import { redirect } from "next/navigation";

export default function Kambaz() {
  redirect("/account/signin");
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/page.tsx",
    codeAddedLines: [1, 4],
  },
  {
    id: "next-up",
    title: "Next: Account screens",
    kind: "title",
    bullets: [
      "Sign in, Sign up, Profile, then an account layout",
      "Absolute paths: `/account/signin`, not `href=\"signin\"`",
    ],
  },
];
