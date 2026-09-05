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
