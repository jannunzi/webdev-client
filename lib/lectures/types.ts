export const LECTURE_SLUGS = [
  "intro-to-web-development",
  "installing-nodejs",
  "creating-a-nextjs-react-application",
  "commit-to-github",
  "deploying-to-vercel",
] as const;

export type LectureSlug = (typeof LECTURE_SLUGS)[number];

export type SlideKind = "title" | "content" | "demo" | "break";

export type LectureSlide = {
  id: string;
  title: string;
  bullets?: string[];
  kind?: SlideKind;
  interactiveHint?: string;
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
