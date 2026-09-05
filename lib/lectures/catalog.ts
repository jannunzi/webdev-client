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
import { SINGLE_PAGE_NAVIGATION_SLIDES } from "./decks/single-page-navigation";
import { WEB_FORMS_SLIDES } from "./decks/web-forms";
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
      "HTML as markup, tags versus elements, attributes, JSX in Next.js, and the live DOM you inspect in DevTools.",
    chapter: 1,
    canvasLecture: 2,
    slides: HTML_AND_DOM_SLIDES,
  },
  "headings-and-paragraphs": {
    title: "Headings and Paragraphs",
    summary:
      "h1–h6 outlines, div versus span, block versus inline, and wrapping text in p so the browser keeps vertical gaps.",
    chapter: 1,
    canvasLecture: 2,
    slides: HEADINGS_AND_PARAGRAPHS_SLIDES,
  },
  "lists-and-tables": {
    title: "Lists and Tables",
    summary:
      "Ordered and unordered lists, table anatomy (thead, tbody, tfoot), and the Lab 1 image tag.",
    chapter: 1,
    canvasLecture: 2,
    slides: LISTS_AND_TABLES_SLIDES,
  },
  "web-forms": {
    title: "Web Forms",
    summary:
      "Uncontrolled inputs with defaultValue, labels, text fields, radios, checkboxes, selects, typed inputs, and buttons.",
    chapter: 1,
    canvasLecture: 2,
    slides: WEB_FORMS_SLIDES,
  },
  anchors: {
    title: "Anchors",
    summary:
      "The a tag, absolute and relative hrefs, in-page fragments, and safer new-tab links with rel=noreferrer.",
    chapter: 1,
    canvasLecture: 2,
    slides: ANCHORS_SLIDES,
  },
  "single-page-navigation": {
    title: "Single-page Navigation",
    summary:
      "next/link instead of a full reload, the Labs index, App Router layouts, and when hash fragments are (not) a route.",
    chapter: 1,
    canvasLecture: 2,
    slides: SINGLE_PAGE_NAVIGATION_SLIDES,
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
    chapter: entry.chapter,
    canvasLecture: entry.canvasLecture,
    title: entry.title,
    summary: entry.summary,
    chapterHref: CHAPTER_1.href,
    chapterTitle: CHAPTER_1.title,
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
