import { lectureTopics } from "@/app/syllabus/data/topics";
import { ANCHORS_SLIDES } from "./decks/anchors";
import { COMMIT_TO_GITHUB_SLIDES } from "./decks/commit-to-github";
import { CREATING_A_NEXTJS_REACT_APPLICATION_SLIDES } from "./decks/creating-a-nextjs-react-application";
import { DEPLOYING_TO_VERCEL_SLIDES } from "./decks/deploying-to-vercel";
import { HEADINGS_AND_PARAGRAPHS_SLIDES } from "./decks/headings-and-paragraphs";
import { HTML_AND_DOM_SLIDES } from "./decks/html-and-dom";
import { INSTALLING_NODEJS_SLIDES } from "./decks/installing-nodejs";
import { INTRO_TO_WEB_DEVELOPMENT_SLIDES } from "./decks/intro-to-web-development";
import { LISTS_AND_TABLES_SLIDES } from "./decks/lists-and-tables";
import { KAMBAZ_ACCOUNT_SLIDES } from "./decks/kambaz-account";
import { KAMBAZ_ASSIGNMENTS_SLIDES } from "./decks/kambaz-assignments";
import { KAMBAZ_COURSES_SLIDES } from "./decks/kambaz-courses";
import { KAMBAZ_DASHBOARD_SLIDES } from "./decks/kambaz-dashboard";
import { KAMBAZ_MODULES_SLIDES } from "./decks/kambaz-modules";
import { KAMBAZ_NAVIGATION_SLIDES } from "./decks/kambaz-navigation";
import { KAMBAZ_OVERVIEW_SLIDES } from "./decks/kambaz-overview";
import { SINGLE_PAGE_NAVIGATION_SLIDES } from "./decks/single-page-navigation";
import { WEB_FORMS_SLIDES } from "./decks/web-forms";
import { CSS_BOX_MODEL_SLIDES } from "./decks/css-box-model";
import { CSS_COLORS_SLIDES } from "./decks/css-colors";
import { CSS_FLEX_SLIDES } from "./decks/css-flex";
import { CSS_FLOAT_SLIDES } from "./decks/css-float";
import { CSS_INTRO_SLIDES } from "./decks/css-intro";
import { CSS_MEDIA_QUERIES_SLIDES } from "./decks/css-media-queries";
import { CSS_ROTATION_SLIDES } from "./decks/css-rotation";
import { CSS_SIZE_AND_POSITION_SLIDES } from "./decks/css-size-and-position";
import {
  LECTURE_SLUGS,
  lectureThumbPath,
  type CanvasLectureGroup,
  type LectureDeck,
  type LectureHubItem,
  type LectureSlide,
  type LectureSlug,
} from "./types";

export const COURSE_SITE_ORIGIN = "https://webdev-client.vercel.app";

const CHAPTER_1 = {
  href: "/book/ch1",
  title: "Building Next.js User Interfaces with HTML",
} as const;

const CHAPTER_2 = {
  href: "/book/ch2",
  title: "Styling User Interfaces with CSS and Tailwind",
} as const;

function chapterMeta(chapter: number) {
  if (chapter === 2) return CHAPTER_2;
  return CHAPTER_1;
}

const LECTURE_SUMMARIES: Record<
  LectureSlug,
  {
    title: string;
    summary: string;
    chapter: number;
    canvasLecture: number;
    slides: LectureSlide[];
  }
> = {
  "intro-to-web-development": {
    title: "Introduction to Web Development",
    summary:
      "Internet vs Web, browsers and URLs, client–server HTTP, framework history, and how we engineer large web apps in teams.",
    chapter: 1,
    canvasLecture: 1,
    slides: INTRO_TO_WEB_DEVELOPMENT_SLIDES,
  },
  "installing-nodejs": {
    title: "Installing Node.js",
    summary:
      "Install the Node runtime, create a course folder, and run a one-route Express hello server on port 4000.",
    chapter: 1,
    canvasLecture: 1,
    slides: INSTALLING_NODEJS_SLIDES,
  },
  "creating-a-nextjs-react-application": {
    title: "Creating a Next.js React Application",
    summary:
      "Scaffold kambaz-next-js with the App Router, replace the home page, add Lab 1, and link routes.",
    chapter: 1,
    canvasLecture: 1,
    slides: CREATING_A_NEXTJS_REACT_APPLICATION_SLIDES,
  },
  "commit-to-github": {
    title: "Commit to GitHub",
    summary:
      "Install Git, keep node_modules out of the repo, create an empty GitHub.com repository, and push main.",
    chapter: 1,
    canvasLecture: 1,
    slides: COMMIT_TO_GITHUB_SLIDES,
  },
  "deploying-to-vercel": {
    title: "Deploying to Vercel",
    summary:
      "Connect GitHub to Vercel, deploy the Next.js app, share the URL, and turn off Vercel Authentication so TAs can open it.",
    chapter: 1,
    canvasLecture: 1,
    slides: DEPLOYING_TO_VERCEL_SLIDES,
  },
  "html-and-dom": {
    title: "HTML and the DOM",
    summary:
      "Markup, hello.html, DOCTYPE/html/head/body, comments, whitespace, and the Window → Document DOM tree.",
    chapter: 1,
    canvasLecture: 2,
    slides: HTML_AND_DOM_SLIDES,
  },
  "headings-and-paragraphs": {
    title: "Headings and Paragraphs",
    summary:
      "h1–h6 sizes, the Lab 1 wd-h-tag nest, and wrapping text in p (wd-p-2…wd-p-4) so vertical gaps stick.",
    chapter: 1,
    canvasLecture: 2,
    slides: HEADINGS_AND_PARAGRAPHS_SLIDES,
  },
  "lists-and-tables": {
    title: "Lists and Tables",
    summary:
      "ol vs ul, the pancake recipe, favorite-books ul, and a semantic quiz table (thead/tbody/tfoot/colSpan) — not layout.",
    chapter: 1,
    canvasLecture: 2,
    slides: LISTS_AND_TABLES_SLIDES,
  },
  "web-forms": {
    title: "Web Forms",
    summary:
      "Labels, text/password/textarea, buttons, file, radio vs checkbox, select one/many, and number/range/email/date.",
    chapter: 1,
    canvasLecture: 2,
    slides: WEB_FORMS_SLIDES,
  },
  anchors: {
    title: "Anchors",
    summary:
      "href to other documents, mailto: and tel:, and same-page TOC hashes that match an element id.",
    chapter: 1,
    canvasLecture: 2,
    slides: ANCHORS_SLIDES,
  },
  "single-page-navigation": {
    title: "Single-page Navigation",
    summary:
      "Next.js Link TOC, labs layout children swap, and moving Kambaz into app/(kambaz)/ so it can own /.",
    chapter: 1,
    canvasLecture: 2,
    slides: SINGLE_PAGE_NAVIGATION_SLIDES,
  },
  "kambaz-overview": {
    title: "Kambaz Overview",
    summary:
      "Route group (kambaz) owns /, a landing page with wd-kambaz, a Labs TOC link, then redirect to Sign in.",
    chapter: 1,
    canvasLecture: 3,
    slides: KAMBAZ_OVERVIEW_SLIDES,
  },
  "kambaz-account": {
    title: "Kambaz Account",
    summary:
      "Sign in, Sign up, Profile, Account Navigation, and an account layout that swaps children.",
    chapter: 1,
    canvasLecture: 3,
    slides: KAMBAZ_ACCOUNT_SLIDES,
  },
  "kambaz-dashboard": {
    title: "Kambaz Dashboard",
    summary:
      "CourseCard plus next/image, at least three published courses, and Sign in landing on /dashboard.",
    chapter: 1,
    canvasLecture: 3,
    slides: KAMBAZ_DASHBOARD_SLIDES,
  },
  "kambaz-navigation": {
    title: "Kambaz Navigation",
    summary:
      "KambazNavigation sidebar, the (kambaz) layout table, and app/not-found.tsx for Calendar and Inbox.",
    chapter: 1,
    canvasLecture: 3,
    slides: KAMBAZ_NAVIGATION_SLIDES,
  },
  "kambaz-courses": {
    title: "Kambaz Courses",
    summary:
      "Dynamic [cid], Home at /courses/[cid]/home, Course Navigation, and await params in the layout.",
    chapter: 1,
    canvasLecture: 3,
    slides: KAMBAZ_COURSES_SLIDES,
  },
  "kambaz-modules": {
    title: "Kambaz Modules",
    summary:
      "Module and Lesson nested lists for Weeks 1–3, then Home as Modules plus Course Status.",
    chapter: 1,
    canvasLecture: 3,
    slides: KAMBAZ_MODULES_SLIDES,
  },
  "kambaz-assignments": {
    title: "Kambaz Assignments",
    summary:
      "Assignments list, AssignmentItem, and the editor form — on your own, matching wd-* ids.",
    chapter: 1,
    canvasLecture: 3,
    slides: KAMBAZ_ASSIGNMENTS_SLIDES,
  },
  "css-intro": {
    title: "CSS Intro",
    summary:
      "Style attribute vs imported CSS, tag / id / class / structure selectors, and how the cascade picks a winner.",
    chapter: 2,
    canvasLecture: 4,
    slides: CSS_INTRO_SLIDES,
  },
  "css-colors": {
    title: "Colors",
    summary:
      "Foreground color, background color, hex and named values, and stacking wd-fg-* / wd-bg-* classes.",
    chapter: 2,
    canvasLecture: 4,
    slides: CSS_COLORS_SLIDES,
  },
  "css-box-model": {
    title: "Box Model",
    summary:
      "Border, padding, margin, content-box vs border-box, and border-radius — the four layers of every box.",
    chapter: 2,
    canvasLecture: 4,
    slides: CSS_BOX_MODEL_SLIDES,
  },
  "css-size-and-position": {
    title: "Size and Position",
    summary:
      "Width and height, display, then relative, absolute, fixed, and z-index from Lab 2 Positions.",
    chapter: 2,
    canvasLecture: 4,
    slides: CSS_SIZE_AND_POSITION_SLIDES,
  },
  "css-media-queries": {
    title: "Media Queries",
    summary:
      "Lab 2 @media breakpoints that restyle a demo at 750, 1000, and 1250 — CSS first, utilities later.",
    chapter: 2,
    canvasLecture: 4,
    slides: CSS_MEDIA_QUERIES_SLIDES,
  },
  "css-float": {
    title: "Float",
    summary:
      "float left/right, clear both, and percentage columns that fake a grid before flex.",
    chapter: 2,
    canvasLecture: 4,
    slides: CSS_FLOAT_SLIDES,
  },
  "css-flex": {
    title: "Flex",
    summary:
      "display:flex rows, flex-grow for leftover space, and a pinned column from Lab 2 Flex.tsx.",
    chapter: 2,
    canvasLecture: 4,
    slides: CSS_FLEX_SLIDES,
  },
  "css-rotation": {
    title: "Rotation and Gradients",
    summary:
      "Optional extras: transform rotate plus linear and radial gradients. Not required for Lab 2.",
    chapter: 2,
    canvasLecture: 4,
    slides: CSS_ROTATION_SLIDES,
  },
};

export function lecturePublicUrl(slug: LectureSlug): string {
  return `${COURSE_SITE_ORIGIN}/lectures/${slug}`;
}

export function listLectureSlugs(): LectureSlug[] {
  return [...LECTURE_SLUGS];
}

export function isLectureSlug(value: string): value is LectureSlug {
  return (LECTURE_SLUGS as readonly string[]).includes(value);
}

export function getLecture(slug: string): LectureHubItem | undefined {
  if (!isLectureSlug(slug)) return undefined;
  const entry = LECTURE_SUMMARIES[slug];
  const chapter = chapterMeta(entry.chapter);
  return {
    slug,
    chapter: entry.chapter,
    canvasLecture: entry.canvasLecture,
    title: entry.title,
    summary: entry.summary,
    chapterHref: chapter.href,
    chapterTitle: chapter.title,
    publicUrl: lecturePublicUrl(slug),
    thumbnailSrc: lectureThumbPath(slug),
  };
}

export function getLectureDeck(slug: string): LectureDeck | undefined {
  const item = getLecture(slug);
  if (!item) return undefined;
  return {
    ...item,
    slides: LECTURE_SUMMARIES[item.slug].slides,
  };
}

export function listLectures(): LectureHubItem[] {
  return listLectureSlugs()
    .map((slug) => getLecture(slug))
    .filter((item): item is LectureHubItem => Boolean(item));
}

export function listLectureDecks(): LectureDeck[] {
  return listLectureSlugs()
    .map((slug) => getLectureDeck(slug))
    .filter((deck): deck is LectureDeck => Boolean(deck));
}

export function lectureDeckThumbnail(
  deck: LectureHubItem | LectureSlug,
): string {
  if (typeof deck !== "string" && deck.thumbnailSrc) {
    return deck.thumbnailSrc;
  }
  const slug = typeof deck === "string" ? deck : deck.slug;
  return lectureThumbPath(slug);
}

export function listCanvasLectureGroups(): CanvasLectureGroup[] {
  const items = listLectures();
  const maxFromCatalog = items.reduce(
    (max, item) => Math.max(max, item.canvasLecture),
    0,
  );
  const count = Math.max(lectureTopics.length, maxFromCatalog, 1);
  return Array.from({ length: count }, (_, index) => {
    const canvasLecture = index + 1;
    const groupDecks = items.filter(
      (item) => item.canvasLecture === canvasLecture,
    );
    return {
      canvasLecture,
      title: `Lecture ${canvasLecture}`,
      topic: lectureTopics[index]?.topic,
      decks: groupDecks,
    };
  });
}

export function adjacentLectureSlugs(slug: LectureSlug): {
  prev?: LectureHubItem;
  next?: LectureHubItem;
} {
  const slugs = listLectureSlugs();
  const index = slugs.indexOf(slug);
  return {
    prev: index > 0 ? getLecture(slugs[index - 1]) : undefined,
    next: index >= 0 && index < slugs.length - 1 ? getLecture(slugs[index + 1]) : undefined,
  };
}
