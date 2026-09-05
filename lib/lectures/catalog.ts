import { lectureTopics } from "@/app/syllabus/data/topics";
import { COMMIT_TO_GITHUB_SLIDES } from "./decks/commit-to-github";
import { CREATING_A_NEXTJS_REACT_APPLICATION_SLIDES } from "./decks/creating-a-nextjs-react-application";
import { DEPLOYING_TO_VERCEL_SLIDES } from "./decks/deploying-to-vercel";
import { INSTALLING_NODEJS_SLIDES } from "./decks/installing-nodejs";
import { INTRO_TO_WEB_DEVELOPMENT_SLIDES } from "./decks/intro-to-web-development";
import {
  LECTURE_SLUGS,
  lectureSlideAssetPath,
  withLectureSlideImages,
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

const LECTURE_SUMMARIES: Record<
  LectureSlug,
  { title: string; summary: string; slides: LectureSlide[] }
> = {
  "intro-to-web-development": {
    title: "Introduction to Web Development",
    summary:
      "Internet vs Web, browsers and URLs, client–server HTTP, framework history, and how we engineer large web apps in teams.",
    slides: INTRO_TO_WEB_DEVELOPMENT_SLIDES,
  },
  "installing-nodejs": {
    title: "Installing Node.js",
    summary:
      "Install the Node runtime, create the Fall 2026 course folder, and run a one-route Express hello server on port 4000.",
    slides: INSTALLING_NODEJS_SLIDES,
  },
  "creating-a-nextjs-react-application": {
    title: "Creating a Next.js React Application",
    summary:
      "Scaffold kambaz-next-js with the App Router, replace the home page, add Lab 1, and link routes — no Vite SPA leftover.",
    slides: CREATING_A_NEXTJS_REACT_APPLICATION_SLIDES,
  },
  "commit-to-github": {
    title: "Commit to GitHub",
    summary:
      "Install Git, keep node_modules out of the repo, create an empty GitHub.com repository, and push main.",
    slides: COMMIT_TO_GITHUB_SLIDES,
  },
  "deploying-to-vercel": {
    title: "Deploying to Vercel",
    summary:
      "Connect GitHub to Vercel, deploy the Next.js app, share the URL, and turn off Vercel Authentication so TAs can open it.",
    slides: DEPLOYING_TO_VERCEL_SLIDES,
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
  return {
    slug,
    chapter: 1,
    canvasLecture: 1,
    title: entry.title,
    summary: entry.summary,
    chapterHref: CHAPTER_1.href,
    chapterTitle: CHAPTER_1.title,
    publicUrl: lecturePublicUrl(slug),
  };
}

export function getLectureDeck(slug: string): LectureDeck | undefined {
  const item = getLecture(slug);
  if (!item) return undefined;
  return {
    ...item,
    slides: withLectureSlideImages(
      item.slug,
      LECTURE_SUMMARIES[item.slug].slides,
    ),
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
  const slug = typeof deck === "string" ? deck : deck.slug;
  return lectureSlideAssetPath(slug, 1);
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
