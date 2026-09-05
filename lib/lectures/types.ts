export const LECTURE_SLUGS = [
  "intro-to-web-development",
  "installing-nodejs",
  "creating-a-nextjs-react-application",
  "commit-to-github",
  "deploying-to-vercel",
] as const;

export type LectureSlug = (typeof LECTURE_SLUGS)[number];

export type SlideKind = "title" | "content" | "demo" | "break";

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
};

export type LectureDeck = LectureHubItem & {
  slides: LectureSlide[];
};

export function lectureSlideAssetPath(
  slug: LectureSlug,
  slideNumber: number,
): string {
  return `/lectures/${slug}/slide-${String(slideNumber).padStart(2, "0")}.png`;
}

/** Original Google Slides index when our reconstructed deck is not 1:1. */
const INTRO_SLIDE_ASSET: Partial<Record<string, number>> = {
  title: 1,
  internet: 2,
  web: 3,
  "browsers-urls": 4,
  "network-of-networks": 5,
  "client-server": 6,
  http: 12,
  milestones: 7,
  "server-frameworks": 8,
  ssr: 9,
  "client-frameworks": 10,
  csr: 11,
  "web-app-se": 13,
  teams: 14,
  "large-projects": 15,
  architecture: 16,
  patterns: 17,
  "next-up": 1,
};

const DEPLOY_SLIDE_ASSET: Partial<Record<string, number>> = {
  break: 16,
  "office-hours": 17,
  recap: 1,
};

const NEXT_APP_SLIDE_ASSET: Partial<Record<string, number>> = {
  "developer-tools": 26,
  "browser-parses-dom": 27,
  "next-up": 1,
};

export function lectureSlideImageNumber(
  slug: LectureSlug,
  slide: LectureSlide,
  index: number,
): number | undefined {
  if (slug === "intro-to-web-development") {
    return INTRO_SLIDE_ASSET[slide.id] ?? index + 1;
  }
  if (slug === "deploying-to-vercel") {
    return DEPLOY_SLIDE_ASSET[slide.id] ?? index + 1;
  }
  if (slug === "creating-a-nextjs-react-application") {
    return NEXT_APP_SLIDE_ASSET[slide.id] ?? index + 1;
  }
  return index + 1;
}

export function withLectureSlideImages(
  slug: LectureSlug,
  slides: LectureSlide[],
): LectureSlide[] {
  return slides.map((slide, index) => {
    const number = lectureSlideImageNumber(slug, slide, index);
    if (number == null) return slide;
    return {
      ...slide,
      imageSrc: slide.imageSrc ?? lectureSlideAssetPath(slug, number),
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
