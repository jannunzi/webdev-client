import type { CodeLineMarks } from "@/lib/code-block/lines";

export type { CodeLineMarks, CodeLineRange } from "@/lib/code-block/lines";

export const LECTURE_1_SLUGS = [
  "intro-to-web-development",
  "installing-nodejs",
  "creating-a-nextjs-react-application",
  "commit-to-github",
  "deploying-to-vercel",
] as const;

export const LECTURE_2_SLUGS = [
  "html-and-dom",
  "headings-and-paragraphs",
  "lists-and-tables",
  "web-forms",
  "anchors",
  "single-page-navigation",
] as const;

export const LECTURE_3_SLUGS = [
  "kambaz-overview",
  "kambaz-account",
  "kambaz-dashboard",
  "kambaz-navigation",
  "kambaz-courses",
  "kambaz-modules",
  "kambaz-assignments",
] as const;

export const LECTURE_4_SLUGS = [
  "css-intro",
  "css-colors",
  "css-box-model",
  "css-size-and-position",
  "css-media-queries",
  "css-float",
  "css-flex",
  "css-rotation",
] as const;

export const LECTURE_6_SLUGS = [
  "react-icons",
  "tailwind-intro",
  "tailwind-spacing",
  "tailwind-typography",
  "tailwind-colors",
  "tailwind-flex-and-grid",
  "tailwind-responsive",
] as const;

export const LECTURE_7_SLUGS = [
  "kambaz-styling",
  "kambaz-nav-styling",
  "kambaz-dashboard-styling",
  "kambaz-courses-styling",
  "kambaz-assignments-styling",
  "kambaz-account-styling",
] as const;

export const LECTURE_SLUGS = [
  ...LECTURE_1_SLUGS,
  ...LECTURE_2_SLUGS,
  ...LECTURE_3_SLUGS,
  ...LECTURE_4_SLUGS,
  ...LECTURE_6_SLUGS,
  ...LECTURE_7_SLUGS,
] as const;

/** Book spine used by the lectures hub and nav — not Canvas lecture folders. */
export const BOOK_CHAPTERS = [
  {
    chapter: 1,
    href: "/book/ch1",
    title: "Building Next.js User Interfaces with HTML",
  },
  {
    chapter: 2,
    href: "/book/ch2",
    title: "Styling User Interfaces with CSS and Tailwind",
  },
  {
    chapter: 3,
    href: "/book/ch3",
    title: "Creating Single Page Applications with JavaScript",
  },
  {
    chapter: 4,
    href: "/book/ch4",
    title: "Managing Client State",
  },
  {
    chapter: 5,
    href: "/book/ch5",
    title: "Implementing RESTful Web APIs with Express.js",
  },
  {
    chapter: 6,
    href: "/book/ch6",
    title: "Integrating React with MongoDB",
  },
] as const;

/**
 * Topic subgroups within a chapter (Jose’s book spine).
 * Slides: add a row here, then set `topicId` on each new deck.
 */
export const LECTURE_TOPICS = [
  { topicId: "intro", chapter: 1, title: "Intro" },
  { topicId: "setup", chapter: 1, title: "Setup" },
  { topicId: "html", chapter: 1, title: "HTML" },
  { topicId: "kambaz-html", chapter: 1, title: "Kambaz HTML" },
  { topicId: "css", chapter: 2, title: "CSS fundamentals" },
  { topicId: "tailwind", chapter: 2, title: "Tailwind" },
  { topicId: "kambaz-styling", chapter: 2, title: "Kambaz styling" },
] as const;

export type LectureTopicId = (typeof LECTURE_TOPICS)[number]["topicId"];

/** Slide headings stay on one line — keep titles at or under this length. */
export const LECTURE_TITLE_MAX_CHARS = 42;

export type LectureSlug = (typeof LECTURE_SLUGS)[number];

export type SlideKind = "title" | "content" | "demo" | "break";

export type LectureSlideDensity = "dense" | "spacious";

export const LECTURE_EMBED_IDS = [
  "user-card",
  "welcome-home",
  "lab1-stub",
  "link-nav",
  "heading-tags",
  "paragraph-tag",
  "list-tags",
  "tables",
  "text-fields",
  "anchors",
  "labs-index",
  "html-skeleton",
  "heading-scale",
  "radio-buttons",
  "file-field",
  "typed-fields",
  "mailto-tel",
  "hash-toc",
  "textarea",
  "checkboxes",
  "dropdowns",
  "alert-button",
  "buttons",
  "labs-layout",
  "kambaz-landing",
  "kambaz-signin",
  "kambaz-signup",
  "kambaz-profile",
  "kambaz-account-nav",
  "kambaz-dashboard",
  "kambaz-navigation",
  "kambaz-courses",
  "kambaz-modules",
  "kambaz-home",
  "kambaz-assignments",
  "kambaz-assignment-editor",
  "css-style-attr",
  "css-import",
  "css-id-selectors",
  "css-class-selectors",
  "css-structure-selectors",
  "css-foreground",
  "css-background",
  "css-borders",
  "css-padding",
  "css-margins",
  "css-box-model",
  "css-corners",
  "css-dimensions",
  "css-display",
  "css-position-relative",
  "css-position-absolute",
  "css-position-fixed",
  "css-zindex",
  "css-float",
  "css-grid-layout",
  "css-flex-row",
  "css-flex-grow",
  "css-flex-width",
  "css-media-queries",
  "css-rotate",
  "css-gradient",
  "react-icons",
  "tw-spacing",
  "tw-typography",
  "tw-backgrounds",
  "tw-filters",
  "tw-flex",
  "tw-grids",
  "tw-responsive",
  "kambaz-styled-nav",
  "kambaz-styled-dashboard",
  "kambaz-styled-course-nav",
  "kambaz-styled-modules",
  "kambaz-styled-home",
  "kambaz-styled-people",
  "kambaz-styled-assignments",
  "kambaz-styled-signin",
] as const;

export type LectureEmbedId = (typeof LECTURE_EMBED_IDS)[number];

export const LECTURE_DIAGRAM_IDS = [
  "network-of-networks",
  "client-server",
  "ssr",
  "csr",
  "course-stack",
  "dom-tree",
  "npm-run-dev-mock",
  "github-create-repo-mock",
  "vercel-import-mock",
  "vercel-deploy-mock",
  "vercel-success-mock",
  "vercel-protect-mock",
  "vercel-auth-mock",
  "box-model",
] as const;

export type LectureDiagramId = (typeof LECTURE_DIAGRAM_IDS)[number];

export type LectureCodeBlock = {
  code: string;
  language?: string;
  file?: string;
  /** 1-based lines to call out (amber). Same API as the book CodeBlock. */
  highlightLines?: CodeLineMarks;
  /** 1-based lines added vs the prior example (green). */
  addedLines?: CodeLineMarks;
  /** Server-rendered Shiki HTML. Set by `withHighlightedLectureCode`. */
  html?: string;
};

export type LectureSlide = {
  id: string;
  title: string;
  bullets?: string[];
  kind?: SlideKind;
  interactiveHint?: string;
  imageSrc?: string;
  imageAlt?: string;
  /** Single snippet. Prefer this (or `codeBlocks`) over putting source in `bullets`. */
  code?: string;
  /** Highlight hint for `code`. Defaults to `tsx` in the shell. */
  codeLanguage?: string;
  /** Optional path shown above `code`, e.g. `app/page.tsx`. */
  codeFile?: string;
  /** `highlightLines` for `code`. */
  codeHighlightLines?: CodeLineMarks;
  /** `addedLines` for `code`. */
  codeAddedLines?: CodeLineMarks;
  /** Extra snippets when a slide needs more than one block. */
  codeBlocks?: LectureCodeBlock[];
  /** Live React demo under the authored slide. Prefer this over a UI screenshot. */
  embed?: LectureEmbedId;
  /** Authored SVG/React figure — not a Google Slides raster. */
  diagram?: LectureDiagramId;
  /**
   * Force dense/spacious type. Default: dense when a diagram or embed is present.
   * Spacious is for text-only slides (larger bullets). Dense stays a step
   * tighter so diagrams/embeds still fit, but does not shrink-to-avoid-scroll.
   */
  density?: LectureSlideDensity;
};

export type LectureHubItem = {
  slug: LectureSlug;
  chapter: number;
  /** Book-spine topic within the chapter, when set. */
  topicId?: LectureTopicId;
  topic?: string;
  /** Canvas week mapping — metadata / badge only, not a hub heading. */
  canvasLecture: number;
  title: string;
  summary: string;
  chapterHref: string;
  chapterTitle: string;
  publicUrl: string;
  /** Authored logo card under `/public/lectures/thumbs`. */
  thumbnailSrc: string;
};

export type LectureDeck = LectureHubItem & {
  slides: LectureSlide[];
};

/** Kept for Canvas sync / tests. The hub groups with `LectureChapterGroup`. */
export type CanvasLectureGroup = {
  canvasLecture: number;
  title: string;
  topic?: string;
  decks: LectureHubItem[];
};

export type LectureTopicGroup = {
  topicId: string;
  title: string;
  decks: LectureHubItem[];
};

export type LectureChapterGroup = {
  chapter: number;
  href: string;
  title: string;
  topics: LectureTopicGroup[];
};

export type LectureNavChapter = {
  chapter: number;
  href: string;
  title: string;
};

/**
 * Decks are authored TypeScript — titles, bullets, code, embeds, and SVG
 * diagrams. Index thumbs are branded logo cards, not Google Slides rasters.
 */
export function lectureSlideAssetPath(
  slug: LectureSlug,
  slideNumber: number,
): string {
  return `/lectures/${slug}/slide-${String(slideNumber).padStart(2, "0")}.png`;
}

/** Legacy PNG figure path — do not use for new index cards. */
export function lectureSlideFigurePath(
  slug: LectureSlug,
  slideNumber: number,
): string {
  return `/lectures/${slug}/slide-${String(slideNumber).padStart(2, "0")}-figure.png`;
}

/** Authored 16:9 logo card for the lectures index. */
export function lectureThumbPath(slug: LectureSlug): string {
  return `/lectures/thumbs/${slug}.svg`;
}

export function lectureSlideDensity(
  slide: LectureSlide,
): LectureSlideDensity {
  if (slide.density) return slide.density;
  if (slide.diagram || slide.embed || slide.imageSrc) return "dense";
  return "spacious";
}

export function lectureSlideCodeBlocks(slide: LectureSlide): LectureCodeBlock[] {
  const blocks: LectureCodeBlock[] = [];
  if (slide.code) {
    blocks.push({
      code: slide.code,
      language: slide.codeLanguage,
      file: slide.codeFile,
      highlightLines: slide.codeHighlightLines,
      addedLines: slide.codeAddedLines,
    });
  }
  if (slide.codeBlocks) {
    blocks.push(...slide.codeBlocks);
  }
  return blocks;
}
