export const LECTURE_SLUGS = [
  "intro-to-web-development",
  "installing-nodejs",
  "creating-a-nextjs-react-application",
  "commit-to-github",
  "deploying-to-vercel",
] as const;

export type LectureSlug = (typeof LECTURE_SLUGS)[number];

export type SlideKind = "title" | "content" | "demo" | "break";

export const LECTURE_EMBED_IDS = [
  "user-card",
  "welcome-home",
  "lab1-stub",
  "link-nav",
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
] as const;

export type LectureDiagramId = (typeof LECTURE_DIAGRAM_IDS)[number];

export type LectureCodeBlock = {
  code: string;
  language?: string;
  file?: string;
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
  /** Extra snippets when a slide needs more than one block. */
  codeBlocks?: LectureCodeBlock[];
  /** Live React demo under the authored slide. Prefer this over a UI screenshot. */
  embed?: LectureEmbedId;
  /** Authored SVG/React figure — not a Google Slides raster. */
  diagram?: LectureDiagramId;
};

export type LectureHubItem = {
  slug: LectureSlug;
  chapter: 1;
  canvasLecture: 1;
  title: string;
  summary: string;
  chapterHref: string;
  chapterTitle: string;
  publicUrl: string;
  /** Distinctive diagram/screenshot — never the shared WEB DEV title slide. */
  thumbnailSrc: string;
};

export type LectureDeck = LectureHubItem & {
  slides: LectureSlide[];
};

export type CanvasLectureGroup = {
  canvasLecture: number;
  title: string;
  topic?: string;
  decks: LectureHubItem[];
};

/**
 * Decks are authored TypeScript — titles, bullets, code, embeds, and SVG
 * diagrams. Index thumbs may still use a distinctive PNG under
 * `/public/lectures`. Do not treat a raster as the slide face.
 */
export function lectureSlideAssetPath(
  slug: LectureSlug,
  slideNumber: number,
): string {
  return `/lectures/${slug}/slide-${String(slideNumber).padStart(2, "0")}.png`;
}

/** Optional index-card thumb (not the slide figure). */
export function lectureSlideFigurePath(
  slug: LectureSlug,
  slideNumber: number,
): string {
  return `/lectures/${slug}/slide-${String(slideNumber).padStart(2, "0")}-figure.png`;
}

/** Index card thumbs — distinctive mid-deck art, never slide-01 (WEB DEV). */
export const LECTURE_DECK_THUMBNAILS: Record<LectureSlug, number> = {
  "intro-to-web-development": 6,
  "installing-nodejs": 4,
  "creating-a-nextjs-react-application": 8,
  "commit-to-github": 5,
  "deploying-to-vercel": 9,
};

export function lectureSlideCodeBlocks(slide: LectureSlide): LectureCodeBlock[] {
  const blocks: LectureCodeBlock[] = [];
  if (slide.code) {
    blocks.push({
      code: slide.code,
      language: slide.codeLanguage,
      file: slide.codeFile,
    });
  }
  if (slide.codeBlocks) {
    blocks.push(...slide.codeBlocks);
  }
  return blocks;
}
