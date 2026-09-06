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
import { REACT_ICONS_SLIDES } from "./decks/react-icons";
import { TAILWIND_INTRO_SLIDES } from "./decks/tailwind-intro";
import { TAILWIND_SPACING_SLIDES } from "./decks/tailwind-spacing";
import { TAILWIND_TYPOGRAPHY_SLIDES } from "./decks/tailwind-typography";
import { TAILWIND_COLORS_SLIDES } from "./decks/tailwind-colors";
import { TAILWIND_FLEX_AND_GRID_SLIDES } from "./decks/tailwind-flex-and-grid";
import { TAILWIND_RESPONSIVE_SLIDES } from "./decks/tailwind-responsive";
import { KAMBAZ_STYLING_SLIDES } from "./decks/kambaz-styling";
import { KAMBAZ_NAV_STYLING_SLIDES } from "./decks/kambaz-nav-styling";
import { KAMBAZ_DASHBOARD_STYLING_SLIDES } from "./decks/kambaz-dashboard-styling";
import { KAMBAZ_COURSES_STYLING_SLIDES } from "./decks/kambaz-courses-styling";
import { KAMBAZ_ASSIGNMENTS_STYLING_SLIDES } from "./decks/kambaz-assignments-styling";
import { KAMBAZ_ACCOUNT_STYLING_SLIDES } from "./decks/kambaz-account-styling";
import { INTRO_TO_JAVASCRIPT_SLIDES } from "./decks/intro-to-javascript";
import { VARIABLES_AND_CONSTANTS_SLIDES } from "./decks/variables-and-constants";
import { VARIABLE_TYPES_SLIDES } from "./decks/variable-types";
import { BOOLEANS_AND_CONDITIONALS_SLIDES } from "./decks/booleans-and-conditionals";
import { NULL_AND_UNDEFINED_SLIDES } from "./decks/null-and-undefined";
import { JAVASCRIPT_FUNCTIONS_SLIDES } from "./decks/javascript-functions";
import {
  BOOK_CHAPTERS,
  LECTURE_SLUGS,
  LECTURE_TOPICS,
  lectureThumbPath,
  type CanvasLectureGroup,
  type LectureChapterGroup,
  type LectureDeck,
  type LectureHubItem,
  type LectureNavChapter,
  type LectureSlide,
  type LectureSlug,
  type LectureTopicGroup,
  type LectureTopicId,
} from "./types";

export const COURSE_SITE_ORIGIN = "https://webdev-client.vercel.app";
export const SLIDES_PATH = "/slides";

export function bookChapterMeta(chapter: number) {
  return (
    BOOK_CHAPTERS.find((entry) => entry.chapter === chapter) ?? BOOK_CHAPTERS[0]
  );
}

export function lectureTopicMeta(topicId: LectureTopicId | undefined) {
  if (!topicId) return undefined;
  return LECTURE_TOPICS.find((entry) => entry.topicId === topicId);
}

export function lectureTopicByBookSection(sectionId: string) {
  return LECTURE_TOPICS.find((entry) => entry.bookSectionId === sectionId);
}

/** `sec-1-3-1` → `1.3.1`; `intro` → `Introduction`. */
export function bookSectionLabel(sectionId: string): string {
  if (sectionId === "intro") return "Introduction";
  if (sectionId.startsWith("sec-")) {
    return sectionId.slice(4).replaceAll("-", ".");
  }
  return sectionId;
}

export function bookHrefForSection(
  chapter: number,
  sectionId?: string,
): string {
  const href = bookChapterMeta(chapter).href;
  return sectionId ? `${href}#${sectionId}` : href;
}

export function slidesHref(slug: LectureSlug): string {
  return `${SLIDES_PATH}/${slug}`;
}

const LECTURE_SUMMARIES: Record<
  LectureSlug,
  {
    title: string;
    summary: string;
    chapter: number;
    topicId?: LectureTopicId;
    bookSectionId?: string;
    canvasLecture: number;
    slides: LectureSlide[];
  }
> = {
  "intro-to-web-development": {
    title: "Introduction to Web Development",
    summary:
      "Internet vs Web, browsers and URLs, client–server HTTP, framework history, and how we engineer large web apps in teams.",
    chapter: 1,
    topicId: "intro",
    bookSectionId: "intro",
    canvasLecture: 1,
    slides: INTRO_TO_WEB_DEVELOPMENT_SLIDES,
  },
  "installing-nodejs": {
    title: "Installing Node.js",
    summary:
      "Install the Node runtime, create a course folder, and run a one-route Express hello server on port 4000.",
    chapter: 1,
    topicId: "setup",
    bookSectionId: "sec-1-2-1",
    canvasLecture: 1,
    slides: INSTALLING_NODEJS_SLIDES,
  },
  "creating-a-nextjs-react-application": {
    title: "Creating a Next.js React Application",
    summary:
      "Scaffold kambaz-next-js with the App Router, replace the home page, add Lab 1, and link routes.",
    chapter: 1,
    topicId: "setup",
    bookSectionId: "sec-1-2-4",
    canvasLecture: 1,
    slides: CREATING_A_NEXTJS_REACT_APPLICATION_SLIDES,
  },
  "commit-to-github": {
    title: "Commit to GitHub",
    summary:
      "Install Git, keep node_modules out of the repo, create an empty GitHub.com repository, and push main.",
    chapter: 1,
    topicId: "source-control",
    bookSectionId: "sec-1-5",
    canvasLecture: 1,
    slides: COMMIT_TO_GITHUB_SLIDES,
  },
  "deploying-to-vercel": {
    title: "Deploying to Vercel",
    summary:
      "Connect GitHub to Vercel, deploy the Next.js app, share the URL, and turn off Vercel Authentication so TAs can open it.",
    chapter: 1,
    topicId: "deploy",
    bookSectionId: "sec-1-6",
    canvasLecture: 1,
    slides: DEPLOYING_TO_VERCEL_SLIDES,
  },
  "html-and-dom": {
    title: "HTML and the DOM",
    summary:
      "Markup, hello.html, DOCTYPE/html/head/body, comments, whitespace, and the Window → Document DOM tree.",
    chapter: 1,
    topicId: "html",
    bookSectionId: "sec-1-3",
    canvasLecture: 2,
    slides: HTML_AND_DOM_SLIDES,
  },
  "headings-and-paragraphs": {
    title: "Headings and Paragraphs",
    summary:
      "h1–h6 sizes, the Lab 1 wd-h-tag nest, and wrapping text in p (wd-p-2…wd-p-4) so vertical gaps stick.",
    chapter: 1,
    topicId: "html",
    bookSectionId: "sec-1-3-1",
    canvasLecture: 2,
    slides: HEADINGS_AND_PARAGRAPHS_SLIDES,
  },
  "lists-and-tables": {
    title: "Lists and Tables",
    summary:
      "ol vs ul, the pancake recipe, favorite-books ul, and a semantic quiz table (thead/tbody/tfoot/colSpan) — not layout.",
    chapter: 1,
    topicId: "html",
    bookSectionId: "sec-1-3-3",
    canvasLecture: 2,
    slides: LISTS_AND_TABLES_SLIDES,
  },
  "web-forms": {
    title: "Web Forms",
    summary:
      "Labels, text/password/textarea, buttons, file, radio vs checkbox, select one/many, and number/range/email/date.",
    chapter: 1,
    topicId: "html",
    bookSectionId: "sec-1-3-6",
    canvasLecture: 2,
    slides: WEB_FORMS_SLIDES,
  },
  anchors: {
    title: "Anchors",
    summary:
      "href to other documents, mailto: and tel:, and same-page TOC hashes that match an element id.",
    chapter: 1,
    topicId: "html",
    bookSectionId: "sec-1-3-9",
    canvasLecture: 2,
    slides: ANCHORS_SLIDES,
  },
  "single-page-navigation": {
    title: "Single-page Navigation",
    summary:
      "Next.js Link TOC, labs layout children swap, and moving Kambaz into app/(kambaz)/ so it can own /.",
    chapter: 1,
    topicId: "html",
    bookSectionId: "sec-1-3-10",
    canvasLecture: 2,
    slides: SINGLE_PAGE_NAVIGATION_SLIDES,
  },
  "kambaz-overview": {
    title: "Kambaz Overview",
    summary:
      "Route group (kambaz) owns /, a landing page with wd-kambaz, a Labs TOC link, then redirect to Sign in.",
    chapter: 1,
    topicId: "kambaz-html",
    bookSectionId: "sec-1-4-1",
    canvasLecture: 3,
    slides: KAMBAZ_OVERVIEW_SLIDES,
  },
  "kambaz-account": {
    title: "Kambaz Account",
    summary:
      "Sign in, Sign up, Profile, Account Navigation, and an account layout that swaps children.",
    chapter: 1,
    topicId: "kambaz-html",
    bookSectionId: "sec-1-4-2",
    canvasLecture: 3,
    slides: KAMBAZ_ACCOUNT_SLIDES,
  },
  "kambaz-dashboard": {
    title: "Kambaz Dashboard",
    summary:
      "CourseCard plus next/image, at least three published courses, and Sign in landing on /dashboard.",
    chapter: 1,
    topicId: "kambaz-html",
    bookSectionId: "sec-1-4-3",
    canvasLecture: 3,
    slides: KAMBAZ_DASHBOARD_SLIDES,
  },
  "kambaz-navigation": {
    title: "Kambaz Navigation",
    summary:
      "KambazNavigation sidebar, the (kambaz) layout table, and app/not-found.tsx for Calendar and Inbox.",
    chapter: 1,
    topicId: "kambaz-html",
    bookSectionId: "sec-1-4-3-1",
    canvasLecture: 3,
    slides: KAMBAZ_NAVIGATION_SLIDES,
  },
  "kambaz-courses": {
    title: "Kambaz Courses",
    summary:
      "Dynamic [cid], Home at /courses/[cid]/home, Course Navigation, and await params in the layout.",
    chapter: 1,
    topicId: "kambaz-html",
    bookSectionId: "sec-1-4-4",
    canvasLecture: 3,
    slides: KAMBAZ_COURSES_SLIDES,
  },
  "kambaz-modules": {
    title: "Kambaz Modules",
    summary:
      "Module and Lesson nested lists for Weeks 1–3, then Home as Modules plus Course Status.",
    chapter: 1,
    topicId: "kambaz-html",
    bookSectionId: "sec-1-4-5",
    canvasLecture: 3,
    slides: KAMBAZ_MODULES_SLIDES,
  },
  "kambaz-assignments": {
    title: "Kambaz Assignments",
    summary:
      "Assignments list, AssignmentItem, and the editor form — on your own, matching wd-* ids.",
    chapter: 1,
    topicId: "kambaz-html",
    bookSectionId: "sec-1-4-7",
    canvasLecture: 3,
    slides: KAMBAZ_ASSIGNMENTS_SLIDES,
  },
  "css-intro": {
    title: "CSS Intro",
    summary:
      "Style attribute vs imported CSS, tag / id / class / structure selectors, and how the cascade picks a winner.",
    chapter: 2,
    topicId: "css",
    bookSectionId: "sec-2-1",
    canvasLecture: 4,
    slides: CSS_INTRO_SLIDES,
  },
  "css-colors": {
    title: "Colors",
    summary:
      "Foreground color, background color, hex and named values, and stacking wd-fg-* / wd-bg-* classes.",
    chapter: 2,
    topicId: "css",
    bookSectionId: "sec-2-1-7",
    canvasLecture: 4,
    slides: CSS_COLORS_SLIDES,
  },
  "css-box-model": {
    title: "Box Model",
    summary:
      "Border, padding, margin, content-box vs border-box, and border-radius — the four layers of every box.",
    chapter: 2,
    topicId: "css",
    bookSectionId: "sec-2-1-10",
    canvasLecture: 4,
    slides: CSS_BOX_MODEL_SLIDES,
  },
  "css-size-and-position": {
    title: "Size and Position",
    summary:
      "Width and height, display, then relative, absolute, fixed, and z-index from Lab 2 Positions.",
    chapter: 2,
    topicId: "css",
    bookSectionId: "sec-2-1-12",
    canvasLecture: 4,
    slides: CSS_SIZE_AND_POSITION_SLIDES,
  },
  "css-media-queries": {
    title: "Media Queries",
    summary:
      "Lab 2 @media breakpoints that restyle a demo at 750, 1000, and 1250 — CSS first, utilities later.",
    chapter: 2,
    topicId: "css",
    bookSectionId: "sec-2-1-20",
    canvasLecture: 4,
    slides: CSS_MEDIA_QUERIES_SLIDES,
  },
  "css-float": {
    title: "Float",
    summary:
      "float left/right, clear both, and percentage columns that fake a grid before flex.",
    chapter: 2,
    topicId: "css",
    bookSectionId: "sec-2-1-17",
    canvasLecture: 4,
    slides: CSS_FLOAT_SLIDES,
  },
  "css-flex": {
    title: "Flex",
    summary:
      "display:flex rows, flex-grow for leftover space, and a pinned column from Lab 2 Flex.tsx.",
    chapter: 2,
    topicId: "css",
    bookSectionId: "sec-2-1-19",
    canvasLecture: 4,
    slides: CSS_FLEX_SLIDES,
  },
  "css-rotation": {
    title: "Rotation and Gradients",
    summary:
      "Optional extras: transform rotate plus linear and radial gradients. Not required for Lab 2.",
    chapter: 2,
    topicId: "css",
    canvasLecture: 4,
    slides: CSS_ROTATION_SLIDES,
  },
  "react-icons": {
    title: "React Icons",
    summary:
      "Install react-icons, import families as components, and size them with className — §2.2 sampler.",
    chapter: 2,
    canvasLecture: 6,
    topicId: "react-icons",
    bookSectionId: "sec-2-2",
    slides: REACT_ICONS_SLIDES,
  },
  "tailwind-intro": {
    title: "Tailwind Intro",
    summary:
      "Utility-first mental model, Preflight vs scoped import, and the Lab 2 /tailwind route.",
    chapter: 2,
    canvasLecture: 6,
    topicId: "tailwind",
    bookSectionId: "sec-2-3",
    slides: TAILWIND_INTRO_SLIDES,
  },
  "tailwind-spacing": {
    title: "Tailwind Spacing",
    summary:
      "m-* and p-* with direction letters from TailwindSpacing — §2.3.1.",
    chapter: 2,
    canvasLecture: 6,
    topicId: "tailwind",
    bookSectionId: "sec-2-3-1",
    slides: TAILWIND_SPACING_SLIDES,
  },
  "tailwind-typography": {
    title: "Tailwind Typography",
    summary:
      "text-* sizes and font-* weights from TailwindTypography — §2.3.2.",
    chapter: 2,
    canvasLecture: 6,
    topicId: "tailwind",
    bookSectionId: "sec-2-3-2",
    slides: TAILWIND_TYPOGRAPHY_SLIDES,
  },
  "tailwind-colors": {
    title: "Tailwind Colors",
    summary:
      "bg-{color}-{shade} bands plus blur filter utilities from Lab 2 — §2.3.3 and §2.3.5.",
    chapter: 2,
    canvasLecture: 6,
    topicId: "tailwind",
    bookSectionId: "sec-2-3-3",
    slides: TAILWIND_COLORS_SLIDES,
  },
  "tailwind-flex-and-grid": {
    title: "Tailwind Flex and Grid",
    summary:
      "flex / grow / shrink-0 and grid-cols / col-span — the Tailwind spelling of Lecture 4 layout.",
    chapter: 2,
    canvasLecture: 6,
    topicId: "tailwind",
    bookSectionId: "sec-2-3-6",
    slides: TAILWIND_FLEX_AND_GRID_SLIDES,
  },
  "tailwind-responsive": {
    title: "Tailwind Responsive",
    summary:
      "Mobile-first md: prefixes on the Lab 2 card — stacked on phones, row at md — §2.3.4.",
    chapter: 2,
    canvasLecture: 6,
    topicId: "tailwind",
    bookSectionId: "sec-2-3-4",
    slides: TAILWIND_RESPONSIVE_SLIDES,
  },
  "kambaz-styling": {
    title: "Kambaz Styling",
    summary:
      "Wire theme + utilities (no Preflight), kambaz.css, and a table-free Kambaz layout.",
    chapter: 2,
    canvasLecture: 7,
    topicId: "kambaz-styling",
    bookSectionId: "sec-2-4",
    slides: KAMBAZ_STYLING_SLIDES,
  },
  "kambaz-nav-styling": {
    title: "Kambaz Nav Styling",
    summary:
      "Fixed 120px icon sidebar, React Icons tiles, and wd-main-content-offset — §2.4.1.",
    chapter: 2,
    canvasLecture: 7,
    topicId: "kambaz-styling",
    bookSectionId: "sec-2-4-1",
    slides: KAMBAZ_NAV_STYLING_SLIDES,
  },
  "kambaz-dashboard-styling": {
    title: "Dashboard Styling",
    summary:
      "CourseCard borders and a 1/2/3/4-column responsive grid — §2.4.2.",
    chapter: 2,
    canvasLecture: 7,
    topicId: "kambaz-styling",
    bookSectionId: "sec-2-4-2",
    slides: KAMBAZ_DASHBOARD_STYLING_SLIDES,
  },
  "kambaz-courses-styling": {
    title: "Courses Chrome",
    summary:
      "Course Navigation via kambaz.css list-group, Modules, Home flex, and hide-order — §2.4.3–2.4.5.",
    chapter: 2,
    canvasLecture: 7,
    topicId: "kambaz-styling",
    bookSectionId: "sec-2-4-3",
    slides: KAMBAZ_COURSES_STYLING_SLIDES,
  },
  "kambaz-assignments-styling": {
    title: "People and Assignments",
    summary:
      "People table utilities, AssignmentItem rows, and the On-your-own editor — §2.4.6–2.4.8.",
    chapter: 2,
    canvasLecture: 7,
    topicId: "kambaz-styling",
    bookSectionId: "sec-2-4-6",
    slides: KAMBAZ_ASSIGNMENTS_STYLING_SLIDES,
  },
  "kambaz-account-styling": {
    title: "Account Styling",
    summary:
      "Sign in form utilities as the template for Sign up, Profile, and Account Nav — §2.4.9.",
    chapter: 2,
    canvasLecture: 7,
    topicId: "kambaz-styling",
    bookSectionId: "sec-2-4-9",
    slides: KAMBAZ_ACCOUNT_STYLING_SLIDES,
  },
  "intro-to-javascript": {
    title: "Introduction to JavaScript",
    summary:
      "Why JS belongs in the page, ECMAScript vs TypeScript, and a Lab 3 stub you grow one component at a time.",
    chapter: 3,
    topicId: "js-intro",
    bookSectionId: "sec-3-2",
    canvasLecture: 8,
    slides: INTRO_TO_JAVASCRIPT_SLIDES,
  },
  "variables-and-constants": {
    title: "Variables and Constants",
    summary:
      "var vs let vs const, interpolating values in JSX, and the first Lab 3 VariablesAndConstants component.",
    chapter: 3,
    topicId: "js-intro",
    bookSectionId: "sec-3-2-1",
    canvasLecture: 8,
    slides: VARIABLES_AND_CONSTANTS_SLIDES,
  },
  "variable-types": {
    title: "Variable Types",
    summary:
      "number, string, boolean, typeof, and why a bare boolean is invisible in JSX until you coerce it.",
    chapter: 3,
    topicId: "js-intro",
    bookSectionId: "sec-3-2-2",
    canvasLecture: 8,
    slides: VARIABLE_TYPES_SLIDES,
  },
  "booleans-and-conditionals": {
    title: "Booleans and Conditionals",
    summary:
      "&& || ! and ===, then if/else, the ternary, and two ways to render a welcome vs login heading.",
    chapter: 3,
    topicId: "js-intro",
    bookSectionId: "sec-3-2-3",
    canvasLecture: 8,
    slides: BOOLEANS_AND_CONDITIONALS_SLIDES,
  },
  "null-and-undefined": {
    title: "Null and Undefined",
    summary:
      "Assigned empty (null) vs never assigned (undefined), typeof quirks, and String() so they print.",
    chapter: 3,
    topicId: "js-intro",
    bookSectionId: "sec-3-2-7",
    canvasLecture: 8,
    slides: NULL_AND_UNDEFINED_SLIDES,
  },
  "javascript-functions": {
    title: "JavaScript Functions",
    summary:
      "Legacy function add, ES6 arrows, implied return, and template literals with ${} and a ternary.",
    chapter: 3,
    topicId: "js-functions",
    bookSectionId: "sec-3-3",
    canvasLecture: 8,
    slides: JAVASCRIPT_FUNCTIONS_SLIDES,
  },
};

export function lecturePublicUrl(slug: LectureSlug): string {
  return `${COURSE_SITE_ORIGIN}${slidesHref(slug)}`;
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
  const chapter = bookChapterMeta(entry.chapter);
  const topic = lectureTopicMeta(entry.topicId);
  return {
    slug,
    chapter: entry.chapter,
    topicId: entry.topicId,
    topic: topic?.title,
    bookSectionId: entry.bookSectionId,
    bookHref: bookHrefForSection(entry.chapter, entry.bookSectionId),
    canvasLecture: entry.canvasLecture,
    title: entry.title,
    summary: entry.summary,
    chapterHref: chapter.href,
    chapterTitle: chapter.title,
    publicUrl: lecturePublicUrl(slug),
    thumbnailSrc: lectureThumbPath(slug),
  };
}

/** Decks whose `bookSectionId` exactly matches a book TOC anchor. */
export function listDecksForBookSection(sectionId: string): LectureHubItem[] {
  return listLectures().filter((item) => item.bookSectionId === sectionId);
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

/** Canvas week buckets — keep for tests / future Canvas sync. Hub uses chapters. */
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

/**
 * Hub grouping: book chapter, then optional topic sections in spine order.
 * Empty registered topics stay visible so Slides can drop in new decks.
 */
export function listChapterTopicGroups(): LectureChapterGroup[] {
  const items = listLectures();
  const chapterNumbers = new Set<number>();
  for (const item of items) chapterNumbers.add(item.chapter);
  for (const topic of LECTURE_TOPICS) chapterNumbers.add(topic.chapter);

  return [...chapterNumbers]
    .sort((a, b) => a - b)
    .filter((chapter) => {
      const hasDecks = items.some((item) => item.chapter === chapter);
      const hasTopics = LECTURE_TOPICS.some((topic) => topic.chapter === chapter);
      return hasDecks || hasTopics;
    })
    .map((chapter) => {
      const meta = bookChapterMeta(chapter);
      const decks = items.filter((item) => item.chapter === chapter);
      const registered = LECTURE_TOPICS.filter((topic) => topic.chapter === chapter);
      const topics: LectureTopicGroup[] = registered.map((topic) => ({
        topicId: topic.topicId,
        title: topic.title,
        bookSectionId: topic.bookSectionId,
        bookHref: bookHrefForSection(chapter, topic.bookSectionId),
        decks: decks.filter((item) => item.topicId === topic.topicId),
      }));
      const knownIds = new Set(registered.map((topic) => topic.topicId));
      const leftovers = decks.filter(
        (item) => !item.topicId || !knownIds.has(item.topicId),
      );
      if (leftovers.length > 0) {
        topics.push({
          topicId: "more",
          title: "More",
          decks: leftovers,
        });
      }
      return {
        chapter,
        href: meta.href,
        title: meta.title,
        topics,
      };
    });
}

/** Chapters that already have published decks — drives hub nav. */
export function listLectureChapters(): LectureNavChapter[] {
  const seen = new Set<number>();
  const chapters: LectureNavChapter[] = [];
  for (const item of listLectures()) {
    if (seen.has(item.chapter)) continue;
    seen.add(item.chapter);
    chapters.push({
      chapter: item.chapter,
      href: item.chapterHref,
      title: item.chapterTitle,
    });
  }
  return chapters.sort((a, b) => a.chapter - b.chapter);
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
