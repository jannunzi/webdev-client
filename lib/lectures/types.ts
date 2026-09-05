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
}

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
 * Decks are authored TypeScript — titles, bullets, code, and room for React
 * embeds / book links. Google Slides PNGs under `/public/lectures` are
 * supporting assets for diagrams and UI screenshots only. Do not treat a
 * raster as the slide face.
 */
export function lectureSlideAssetPath(
  slug: LectureSlug,
  slideNumber: number,
): string {
  return `/lectures/${slug}/slide-${String(slideNumber).padStart(2, "0")}.png`;
}

/** Title-band cropped variant used as a supporting figure (not the slide face). */
export function lectureSlideFigurePath(
  slug: LectureSlug,
  slideNumber: number,
): string {
  return `/lectures/${slug}/slide-${String(slideNumber).padStart(2, "0")}-figure.png`;
}

/** `{slug, slideId} → original Google Slides export number`. Default: no image. */
export const LECTURE_SLIDE_IMAGE_ALLOWLIST: {
  [K in LectureSlug]?: Partial<Record<string, number>>;
} = {
  "intro-to-web-development": {
    "network-of-networks": 5,
    "client-server": 6,
    ssr: 9,
    csr: 11,
  },
  "installing-nodejs": {
    "course-stack": 4,
  },
  "creating-a-nextjs-react-application": {
    "npm-run-dev": 8,
    "browser-parses-dom": 27,
  },
  "commit-to-github": {
    "create-repo": 5,
  },
  "deploying-to-vercel": {
    "select-repo": 8,
    deploy: 9,
    congratulations: 10,
    protections: 12,
    "disable-auth": 13,
  },
};

/** Index card thumbs — diagrams/screenshots, not slide-01 (WEB DEV). */
export const LECTURE_DECK_THUMBNAILS: Record<LectureSlug, number> = {
  "intro-to-web-development": 6,
  "installing-nodejs": 4,
  "creating-a-nextjs-react-application": 8,
  "commit-to-github": 5,
  "deploying-to-vercel": 9,
};

export function lectureSlideImageNumber(
  slug: LectureSlug,
  slide: LectureSlide,
): number | undefined {
  return LECTURE_SLIDE_IMAGE_ALLOWLIST[slug]?.[slide.id];
}

export function withLectureSlideImages(
  slug: LectureSlug,
  slides: LectureSlide[],
): LectureSlide[] {
  return slides.map((slide) => {
    const number = lectureSlideImageNumber(slug, slide);
    if (number == null) return slide;
    return {
      ...slide,
      imageSrc: slide.imageSrc ?? lectureSlideFigurePath(slug, number),
      imageAlt: slide.imageAlt ?? slide.title,
    };
  });
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
