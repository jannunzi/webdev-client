import type { LectureSlide } from "../types";

export const KAMBAZ_DASHBOARD_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Lecture 3 · Deck 3 — Kambaz Dashboard",
      "Course cards that open `/courses/[cid]/home`",
    ],
  },
  {
    id: "purpose",
    title: "Dashboard lists courses",
    kind: "content",
    bullets: [
      "Students see courses they are enrolled in; faculty see courses they teach",
      "Clicking a course goes to that course’s Home route",
      "Include **at least three** courses",
      "File: `app/(kambaz)/dashboard/page.tsx` — URL `/dashboard`",
    ],
  },
  {
    id: "image",
    title: "Use next/image, not img",
    kind: "content",
    bullets: [
      "`import Image from \"next/image\"`",
      "Still needs `src`, `alt`, `width`, and `height`",
      "Put course photos under `public/images/`",
      "Look images up or generate placeholders. The book uses `reactjs.jpg`, `nodejs.jpg`, `mongodb.jpg`",
    ],
  },
  {
    id: "course-card",
    title: "Extract a CourseCard",
    kind: "content",
    bullets: [
      "Each card repeats image, title, subtitle, and Go — that is a component",
      "Props: `id`, `title`, `subtitle`, `image`",
      "`Link` to `/courses/${id}/home` with class `wd-dashboard-course-link`",
      "`type=\"button\"` on Go so the click does not submit a form",
    ],
    code: `import Link from "next/link";
import Image from "next/image";

export default function CourseCard({
  id, title, subtitle, image,
}: {
  id: string; title: string; subtitle: string; image: string;
}) {
  return (
    <div className="wd-dashboard-course">
      <Link href={\`/courses/\${id}/home\`} className="wd-dashboard-course-link">
        <Image src={image} width={200} height={150} alt={title} />
        <div>
          <h5>{title}</h5>
          <p className="wd-dashboard-course-title">{subtitle}</p>
          <button type="button">Go</button>
        </div>
      </Link>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/CourseCard.tsx",
  },
  {
    id: "dashboard-page",
    title: "Mount at least three cards",
    kind: "demo",
    embed: "kambaz-dashboard",
    bullets: [
      "Ids: `wd-dashboard`, `wd-dashboard-title`, `wd-dashboard-published`, `wd-dashboard-courses`",
      "Published Courses (3) matches the three cards in the book",
      "Home is `/courses/[cid]/home` — not `/courses/1234` and not a hash route",
    ],
    code: `import CourseCard from "./CourseCard";

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (3)</h2> <hr />
      <div id="wd-dashboard-courses">
        <CourseCard
          id="1234"
          title="CS1234 React JS"
          subtitle="Full Stack software developer"
          image="/images/reactjs.jpg"
        />
        <CourseCard id="2345" title="CS2345 Node JS" subtitle="Server side JavaScript" image="/images/nodejs.jpg" />
        <CourseCard id="3456" title="CS3456 MongoDB" subtitle="NoSQL Databases" image="/images/mongodb.jpg" />
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/dashboard/page.tsx",
  },
  {
    id: "signin-to-dashboard",
    title: "Sign in lands on Dashboard",
    kind: "content",
    bullets: [
      "Point the Sign in button at `/dashboard`",
      "Keep id `wd-signin-btn` so the grader still finds it",
      "There is no real auth yet — the `Link` is the “success” path",
    ],
    code: `<Link href="/dashboard" id="wd-signin-btn">
  Sign in
</Link>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/signin/page.tsx",
    codeHighlightLines: [1],
  },
  {
    id: "next-up",
    title: "Next: Kambaz navigation",
    kind: "title",
    bullets: [
      "A global sidebar so Account, Dashboard, Calendar, Inbox, and Labs stay visible",
      "Calendar and Inbox 404 until `app/not-found.tsx` exists",
    ],
  },
];
