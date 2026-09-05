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

export const LECTURE_SLUGS = [
  ...LECTURE_1_SLUGS,
  ...LECTURE_2_SLUGS,
] as const;

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
  /** Force dense/spacious type. Default: dense when a diagram or embed is present. */
  density?: LectureSlideDensity;
};

export type LectureHubItem = {
  slug: LectureSlug;
  chapter: number;
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

export type CanvasLectureGroup = {
  canvasLecture: number;
  title: string;
  topic?: string;
  decks: LectureHubItem[];
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
    });
  }
  if (slide.codeBlocks) {
    blocks.push(...slide.codeBlocks);
  }
  return blocks;
}
