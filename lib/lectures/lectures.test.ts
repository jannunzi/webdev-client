import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  COURSE_SITE_ORIGIN,
  adjacentLectureSlugs,
  getLecture,
  getLectureDeck,
  isLectureSlug,
  lectureDeckThumbnail,
  lecturePublicUrl,
  listCanvasLectureGroups,
  listChapterTopicGroups,
  listDecksForBookSection,
  listLectureChapters,
  listLectureDecks,
  listLectureSlugs,
  listLectures,
} from "./catalog";
import {
  BOOK_CHAPTERS,
  LECTURE_1_SLUGS,
  LECTURE_2_SLUGS,
  LECTURE_3_SLUGS,
  LECTURE_4_SLUGS,
  LECTURE_6_SLUGS,
  LECTURE_7_SLUGS,
  LECTURE_TOPICS,
  LECTURE_DIAGRAM_IDS,
  LECTURE_EMBED_IDS,
  LECTURE_SLUGS,
  LECTURE_TITLE_MAX_CHARS,
  lectureSlideAssetPath,
  lectureSlideDensity,
  lectureSlideCodeBlocks,
  lectureThumbPath,
} from "./types";
import { slidePaneOverflows, slidePaneScrollStep } from "./slide-pane";
import {
  LECTURE_PRESENT_STATE,
  isLecturePresentHistoryState,
  lecturePresentHref,
  lectureSearchIsPresent,
  nativeFullscreenEnabled,
  nativeFullscreenElement,
  preferNativeFullscreen,
  swipeSlideDelta,
  swipeTargetIsInteractive,
} from "./present-mode";

function slideText(deckSlug: string): string {
  const deck = getLectureDeck(deckSlug);
  assert.ok(deck);
  return deck.slides
    .flatMap((slide) => [
      slide.title,
      ...(slide.bullets ?? []),
      slide.interactiveHint ?? "",
      ...lectureSlideCodeBlocks(slide).map((block) => block.code),
    ])
    .join("\n");
}

function findSlide(deckSlug: string, id: string) {
  const deck = getLectureDeck(deckSlug);
  assert.ok(deck);
  const slide = deck.slides.find((row) => row.id === id);
  assert.ok(slide, `${deckSlug} missing slide ${id}`);
  return slide;
}

describe("lecture catalog", () => {
  it("lists slugs in book-spine order (Ch1, Ch2 CSS, then Tailwind and Kambaz styling)", () => {
    assert.deepEqual(listLectureSlugs(), [
      ...LECTURE_1_SLUGS,
      ...LECTURE_2_SLUGS,
      ...LECTURE_3_SLUGS,
      ...LECTURE_4_SLUGS,
      ...LECTURE_6_SLUGS,
      ...LECTURE_7_SLUGS,
    ]);
    assert.deepEqual(listLectureSlugs(), [...LECTURE_SLUGS]);
    assert.equal(LECTURE_1_SLUGS.length, 5);
    assert.equal(LECTURE_2_SLUGS.length, 6);
    assert.equal(LECTURE_3_SLUGS.length, 7);
    assert.equal(LECTURE_4_SLUGS.length, 8);
    assert.equal(LECTURE_6_SLUGS.length, 7);
    assert.equal(LECTURE_7_SLUGS.length, 6);
  });

  it("marks Lecture 1 entries as Canvas Lecture 1 / Chapter 1", () => {
    const items = listLectures().filter((item) => item.canvasLecture === 1);
    assert.equal(items.length, 5);
    for (const item of items) {
      assert.equal(item.chapter, 1);
      assert.equal(item.canvasLecture, 1);
      assert.equal(item.chapterHref, "/book/ch1");
      assert.ok(item.chapterTitle.length > 0);
      assert.ok(item.title.length > 0);
      assert.ok(item.summary.length > 0);
      assert.equal(item.publicUrl, `${COURSE_SITE_ORIGIN}/slides/${item.slug}`);
      assert.equal(lecturePublicUrl(item.slug), item.publicUrl);
      assert.equal(item.thumbnailSrc, lectureDeckThumbnail(item.slug));
      assert.doesNotMatch(item.thumbnailSrc, /slide-01/);
      assert.match(item.thumbnailSrc, /\/lectures\/thumbs\/.+\.svg$/);
    }
    assert.equal(items[0]?.topicId, "intro");
    assert.equal(items[0]?.topic, "Introduction");
    assert.equal(items[0]?.bookSectionId, "intro");
    assert.equal(items[0]?.bookHref, "/book/ch1#intro");
    assert.equal(items[1]?.topicId, "setup");
    assert.equal(items[2]?.topicId, "setup");
    assert.equal(items[3]?.topicId, "source-control");
    assert.equal(items[3]?.bookSectionId, "sec-1-5");
    assert.equal(items[3]?.bookHref, "/book/ch1#sec-1-5");
    assert.equal(items[4]?.topicId, "deploy");
    assert.equal(items[4]?.bookSectionId, "sec-1-6");
  });

  it("marks Lecture 2 entries as Canvas Lecture 2 / Chapter 1", () => {
    const items = listLectures().filter((item) => item.canvasLecture === 2);
    assert.equal(items.length, 6);
    assert.deepEqual(
      items.map((item) => item.slug),
      [...LECTURE_2_SLUGS],
    );
    for (const item of items) {
      assert.equal(item.chapter, 1);
      assert.equal(item.topicId, "html");
      assert.equal(item.topic, "1.3 Introduction to HTML");
      assert.equal(item.canvasLecture, 2);
      assert.equal(item.chapterHref, "/book/ch1");
      assert.match(item.thumbnailSrc, /\/lectures\/thumbs\/.+\.svg$/);
    }
  });

  it("returns undefined for unknown slugs", () => {
    assert.equal(getLecture("not-a-deck"), undefined);
    assert.equal(getLectureDeck("vite-spa"), undefined);
    assert.equal(isLectureSlug("intro-to-web-development"), true);
    assert.equal(isLectureSlug("html-and-dom"), true);
    assert.equal(isLectureSlug("css-intro"), true);
    assert.equal(isLectureSlug("react-icons"), true);
    assert.equal(isLectureSlug("kambaz-styling"), true);
    assert.equal(isLectureSlug("intro"), false);
  });

  it("marks Tailwind library decks as Canvas Lecture 6 / Chapter 2", () => {
    const items = listLectures().filter((item) => item.canvasLecture === 6);
    assert.equal(items.length, 7);
    assert.deepEqual(
      items.map((item) => item.slug),
      [...LECTURE_6_SLUGS],
    );
    for (const item of items) {
      assert.equal(item.chapter, 2);
      assert.equal(item.topicId, item.slug === "react-icons" ? "react-icons" : "tailwind");
      assert.equal(
        item.topic,
        item.slug === "react-icons"
          ? "2.2 Decorating Documents with React Icons"
          : "2.3 Styling Webpages with Tailwind CSS",
      );
      assert.equal(item.canvasLecture, 6);
      assert.equal(item.chapterHref, "/book/ch2");
      assert.match(item.thumbnailSrc, /\/lectures\/thumbs\/.+\.svg$/);
    }
  });

  it("marks Kambaz styling decks as Canvas Lecture 7 / Chapter 2", () => {
    const items = listLectures().filter((item) => item.canvasLecture === 7);
    assert.equal(items.length, 6);
    assert.deepEqual(
      items.map((item) => item.slug),
      [...LECTURE_7_SLUGS],
    );
    for (const item of items) {
      assert.equal(item.chapter, 2);
      assert.equal(item.topicId, "kambaz-styling");
      assert.equal(item.topic, "2.4 Styling Kambaz with CSS and Tailwind");
      assert.equal(item.canvasLecture, 7);
      assert.equal(item.chapterHref, "/book/ch2");
      assert.match(item.thumbnailSrc, /\/lectures\/thumbs\/.+\.svg$/);
    }
  });

  it("marks Lecture 4 entries as Canvas Lecture 4 / Chapter 2", () => {
    const items = listLectures().filter((item) => item.canvasLecture === 4);
    assert.equal(items.length, 8);
    assert.deepEqual(
      items.map((item) => item.slug),
      [...LECTURE_4_SLUGS],
    );
    for (const item of items) {
      assert.equal(item.chapter, 2);
      assert.equal(item.topicId, "css");
      assert.equal(item.topic, "2.1 Styling React Components with CSS");
      assert.equal(item.canvasLecture, 4);
      assert.equal(item.chapterHref, "/book/ch2");
      assert.equal(
        item.chapterTitle,
        "Styling User Interfaces with CSS and Tailwind",
      );
      assert.match(item.thumbnailSrc, /\/lectures\/thumbs\/.+\.svg$/);
    }
  });

  it("marks Lecture 3 entries as Canvas Lecture 3 / Chapter 1", () => {
    const items = listLectures().filter((item) => item.canvasLecture === 3);
    assert.equal(items.length, 7);
    assert.deepEqual(
      items.map((item) => item.slug),
      [...LECTURE_3_SLUGS],
    );
    for (const item of items) {
      assert.equal(item.chapter, 1);
      assert.equal(item.topicId, "kambaz-html");
      assert.equal(item.topic, "1.4 Prototyping the React Kambaz User Interface with HTML");
      assert.equal(item.canvasLecture, 3);
      assert.equal(item.chapterHref, "/book/ch1");
      assert.match(item.thumbnailSrc, /\/lectures\/thumbs\/.+\.svg$/);
    }
  });

  it("groups the hub by book chapter and topic, not Canvas lecture folders", () => {
    const groups = listChapterTopicGroups();
    assert.deepEqual(
      groups.map((group) => group.chapter),
      [1, 2],
    );
    assert.equal(groups[0]?.href, "/book/ch1");
    assert.equal(
      groups[0]?.title,
      "Building Next.js User Interfaces with HTML",
    );
    assert.deepEqual(
      groups[0]?.topics.map((topic) => topic.topicId),
      ["intro", "setup", "html", "kambaz-html", "source-control", "deploy"],
    );
    assert.deepEqual(
      groups[0]?.topics.map((topic) => topic.title),
      [
        "Introduction",
        "1.2 Setting Up the Development Environment",
        "1.3 Introduction to HTML",
        "1.4 Prototyping the React Kambaz User Interface with HTML",
        "1.5 Committing Code to Source Control",
        "1.6 Deploying Next.js Projects to the Web",
      ],
    );
    assert.deepEqual(
      groups[0]?.topics[0]?.decks.map((deck) => deck.slug),
      ["intro-to-web-development"],
    );
    assert.deepEqual(
      groups[0]?.topics[1]?.decks.map((deck) => deck.slug),
      ["installing-nodejs", "creating-a-nextjs-react-application"],
    );
    assert.deepEqual(
      groups[0]?.topics[2]?.decks.map((deck) => deck.slug),
      [...LECTURE_2_SLUGS],
    );
    assert.deepEqual(
      groups[0]?.topics[3]?.decks.map((deck) => deck.slug),
      [...LECTURE_3_SLUGS],
    );
    assert.deepEqual(
      groups[0]?.topics[4]?.decks.map((deck) => deck.slug),
      ["commit-to-github"],
    );
    assert.deepEqual(
      groups[0]?.topics[5]?.decks.map((deck) => deck.slug),
      ["deploying-to-vercel"],
    );

    assert.equal(groups[1]?.href, "/book/ch2");
    assert.deepEqual(
      groups[1]?.topics.map((topic) => topic.topicId),
      ["css", "react-icons", "tailwind", "kambaz-styling"],
    );
    assert.deepEqual(
      groups[1]?.topics.map((topic) => topic.title),
      [
        "2.1 Styling React Components with CSS",
        "2.2 Decorating Documents with React Icons",
        "2.3 Styling Webpages with Tailwind CSS",
        "2.4 Styling Kambaz with CSS and Tailwind",
      ],
    );
    assert.deepEqual(
      groups[1]?.topics[0]?.decks.map((deck) => deck.slug),
      [...LECTURE_4_SLUGS],
    );
    assert.deepEqual(
      groups[1]?.topics[1]?.decks.map((deck) => deck.slug),
      ["react-icons"],
    );
    assert.deepEqual(
      groups[1]?.topics[2]?.decks.map((deck) => deck.slug),
      LECTURE_6_SLUGS.filter((slug) => slug !== "react-icons"),
    );
    assert.deepEqual(
      groups[1]?.topics[3]?.decks.map((deck) => deck.slug),
      [...LECTURE_7_SLUGS],
    );

    for (const group of groups) {
      assert.doesNotMatch(group.title, /^Lecture \d+$/);
      for (const topic of group.topics) {
        assert.doesNotMatch(topic.title, /^Lecture \d+$/);
      }
    }
  });

  it("derives hub nav chapters from published decks, not a hardcoded Ch1/Ch2 list", () => {
    const chapters = listLectureChapters();
    assert.deepEqual(
      chapters.map((entry) => entry.chapter),
      [1, 2],
    );
    assert.deepEqual(
      chapters.map((entry) => entry.href),
      ["/book/ch1", "/book/ch2"],
    );
    assert.equal(chapters[0]?.title, BOOK_CHAPTERS[0]?.title);
    assert.equal(chapters[1]?.title, BOOK_CHAPTERS[1]?.title);
    assert.ok(LECTURE_TOPICS.some((topic) => topic.topicId === "tailwind"));
    assert.ok(LECTURE_TOPICS.some((topic) => topic.topicId === "kambaz-styling"));
    assert.ok(LECTURE_TOPICS.some((topic) => topic.topicId === "react-icons"));
    assert.ok(LECTURE_TOPICS.some((topic) => topic.topicId === "source-control"));
  });

  it("maps Ch1–Ch2 decks to book section anchors for bidirectional links", () => {
    assert.equal(getLecture("installing-nodejs")?.bookHref, "/book/ch1#sec-1-2-1");
    assert.equal(
      getLecture("creating-a-nextjs-react-application")?.bookHref,
      "/book/ch1#sec-1-2-4",
    );
    assert.equal(getLecture("html-and-dom")?.bookHref, "/book/ch1#sec-1-3");
    assert.equal(getLecture("headings-and-paragraphs")?.bookHref, "/book/ch1#sec-1-3-1");
    assert.equal(getLecture("css-intro")?.bookHref, "/book/ch2#sec-2-1");
    assert.equal(getLecture("react-icons")?.bookHref, "/book/ch2#sec-2-2");
    assert.equal(getLecture("tailwind-spacing")?.bookHref, "/book/ch2#sec-2-3-1");
    assert.equal(getLecture("kambaz-nav-styling")?.bookHref, "/book/ch2#sec-2-4-1");
    assert.equal(listDecksForBookSection("sec-1-2-1")[0]?.slug, "installing-nodejs");
    assert.equal(listDecksForBookSection("sec-2-3")[0]?.slug, "tailwind-intro");
    assert.equal(listDecksForBookSection("sec-2-2")[0]?.slug, "react-icons");
    assert.equal(getLecture("css-rotation")?.bookSectionId, undefined);
    assert.equal(getLecture("css-rotation")?.bookHref, "/book/ch2");
    for (const item of listLectures()) {
      if (item.bookSectionId) {
        assert.match(item.bookHref, /^\/book\/ch\d#/);
      }
    }
  });

  it("keeps canvasLecture metadata grouped for Canvas sync", () => {
    const groups = listCanvasLectureGroups();
    assert.ok(groups.length >= 11);
    assert.equal(groups[0]?.title, "Lecture 1");
    assert.equal(groups[0]?.canvasLecture, 1);
    assert.equal(groups[0]?.decks.length, 5);
    assert.deepEqual(
      groups[0]?.decks.map((deck) => deck.slug),
      [...LECTURE_1_SLUGS],
    );
    assert.equal(groups[1]?.title, "Lecture 2");
    assert.equal(groups[1]?.canvasLecture, 2);
    assert.equal(groups[1]?.decks.length, 6);
    assert.deepEqual(
      groups[1]?.decks.map((deck) => deck.slug),
      [...LECTURE_2_SLUGS],
    );
    assert.equal(
      lectureDeckThumbnail(groups[0]!.decks[0]!),
      "/lectures/thumbs/intro-to-web-development.svg",
    );
    assert.equal(
      lectureDeckThumbnail("commit-to-github"),
      "/lectures/thumbs/commit-to-github.svg",
    );
    assert.equal(
      lectureDeckThumbnail("html-and-dom"),
      "/lectures/thumbs/html-and-dom.svg",
    );
    for (const slug of LECTURE_SLUGS) {
      const thumb = lectureDeckThumbnail(slug);
      assert.notEqual(thumb, lectureSlideAssetPath(slug, 1));
      assert.equal(thumb, lectureThumbPath(slug));
      assert.doesNotMatch(thumb, /slide-\d\d/);
      const disk = join(process.cwd(), thumb.replace(/^\//, "public/"));
      assert.ok(existsSync(disk), `${thumb} is missing on disk`);
    }
    assert.equal(groups[2]?.title, "Lecture 3");
    assert.equal(groups[2]?.canvasLecture, 3);
    assert.equal(groups[2]?.decks.length, 7);
    assert.deepEqual(
      groups[2]?.decks.map((deck) => deck.slug),
      [...LECTURE_3_SLUGS],
    );
    assert.equal(
      lectureDeckThumbnail("kambaz-overview"),
      "/lectures/thumbs/kambaz-overview.svg",
    );
    assert.equal(groups[3]?.title, "Lecture 4");
    assert.equal(groups[3]?.canvasLecture, 4);
    assert.equal(groups[3]?.decks.length, 8);
    assert.deepEqual(
      groups[3]?.decks.map((deck) => deck.slug),
      [...LECTURE_4_SLUGS],
    );
    assert.equal(
      lectureDeckThumbnail("css-intro"),
      "/lectures/thumbs/css-intro.svg",
    );
    assert.equal(groups[4]?.title, "Lecture 5");
    assert.equal(groups[4]?.canvasLecture, 5);
    assert.equal(groups[4]?.decks.length, 0);
    assert.equal(groups[5]?.title, "Lecture 6");
    assert.equal(groups[5]?.canvasLecture, 6);
    assert.equal(groups[5]?.decks.length, 7);
    assert.deepEqual(
      groups[5]?.decks.map((deck) => deck.slug),
      [...LECTURE_6_SLUGS],
    );
    assert.equal(groups[6]?.title, "Lecture 7");
    assert.equal(groups[6]?.canvasLecture, 7);
    assert.equal(groups[6]?.decks.length, 6);
    assert.deepEqual(
      groups[6]?.decks.map((deck) => deck.slug),
      [...LECTURE_7_SLUGS],
    );
    assert.equal(
      lectureDeckThumbnail("react-icons"),
      "/lectures/thumbs/react-icons.svg",
    );
    for (const group of groups.slice(7)) {
      assert.equal(group.title, `Lecture ${group.canvasLecture}`);
      assert.equal(group.decks.length, 0);
    }
  });

  it("walks adjacent decks across Lecture 1 into Lecture 7", () => {
    const first = adjacentLectureSlugs("intro-to-web-development");
    assert.equal(first.prev, undefined);
    assert.equal(first.next?.slug, "installing-nodejs");
    const lastLecture1 = adjacentLectureSlugs("deploying-to-vercel");
    assert.equal(lastLecture1.next?.slug, "html-and-dom");
    assert.equal(lastLecture1.prev?.slug, "commit-to-github");
    const lastLecture2 = adjacentLectureSlugs("single-page-navigation");
    assert.equal(lastLecture2.next?.slug, "kambaz-overview");
    assert.equal(lastLecture2.prev?.slug, "anchors");
    const lastLecture3 = adjacentLectureSlugs("kambaz-assignments");
    assert.equal(lastLecture3.next?.slug, "css-intro");
    assert.equal(lastLecture3.prev?.slug, "kambaz-modules");
    const lastLecture4 = adjacentLectureSlugs("css-rotation");
    assert.equal(lastLecture4.next?.slug, "react-icons");
    assert.equal(lastLecture4.prev?.slug, "css-flex");
    const lastLecture6 = adjacentLectureSlugs("tailwind-responsive");
    assert.equal(lastLecture6.next?.slug, "kambaz-styling");
    const last = adjacentLectureSlugs("kambaz-account-styling");
    assert.equal(last.next, undefined);
    assert.equal(last.prev?.slug, "kambaz-assignments-styling");
  });
});

describe("lecture decks", () => {
  it("exports typed slides at the expected lengths", () => {
    const decks = listLectureDecks();
    const counts = Object.fromEntries(
      decks.map((deck) => [deck.slug, deck.slides.length]),
    );
    assert.equal(counts["intro-to-web-development"], 18);
    assert.ok((counts["installing-nodejs"] ?? 0) >= 16);
    assert.equal(counts["creating-a-nextjs-react-application"], 27);
    assert.equal(counts["commit-to-github"], 7);
    assert.ok((counts["deploying-to-vercel"] ?? 0) >= 14);
    assert.ok((counts["deploying-to-vercel"] ?? 0) <= 17);
    assert.equal(counts["html-and-dom"], 16);
    assert.equal(counts["headings-and-paragraphs"], 9);
    assert.equal(counts["lists-and-tables"], 13);
    assert.equal(counts["web-forms"], 21);
    assert.equal(counts["anchors"], 5);
    assert.equal(counts["single-page-navigation"], 14);
    assert.equal(counts["kambaz-overview"], 8);
    assert.equal(counts["kambaz-account"], 9);
    assert.equal(counts["kambaz-dashboard"], 7);
    assert.equal(counts["kambaz-navigation"], 6);
    assert.equal(counts["kambaz-courses"], 7);
    assert.equal(counts["kambaz-modules"], 8);
    assert.equal(counts["kambaz-assignments"], 9);
    assert.equal(counts["css-intro"], 12);
    assert.equal(counts["css-colors"], 9);
    assert.equal(counts["css-box-model"], 10);
    assert.equal(counts["css-size-and-position"], 10);
    assert.equal(counts["css-media-queries"], 8);
    assert.equal(counts["css-float"], 8);
    assert.equal(counts["css-flex"], 7);
    assert.equal(counts["css-rotation"], 6);
    assert.equal(counts["react-icons"], 8);
    assert.equal(counts["tailwind-intro"], 9);
    assert.equal(counts["tailwind-spacing"], 7);
    assert.equal(counts["tailwind-typography"], 6);
    assert.equal(counts["tailwind-colors"], 8);
    assert.equal(counts["tailwind-flex-and-grid"], 8);
    assert.equal(counts["tailwind-responsive"], 7);
    assert.equal(counts["kambaz-styling"], 8);
    assert.equal(counts["kambaz-nav-styling"], 7);
    assert.equal(counts["kambaz-dashboard-styling"], 7);
    assert.equal(counts["kambaz-courses-styling"], 13);
    assert.equal(counts["kambaz-assignments-styling"], 9);
    assert.equal(counts["kambaz-account-styling"], 7);
    for (const deck of decks) {
      const ids = deck.slides.map((slide) => slide.id);
      assert.equal(new Set(ids).size, ids.length, `${deck.slug} duplicate slide id`);
      for (const slide of deck.slides) {
        assert.ok(slide.id);
        assert.ok(slide.title);
        assert.ok(
          slide.title.length <= LECTURE_TITLE_MAX_CHARS,
          `${deck.slug} ${slide.id} title is ${slide.title.length} chars: ${slide.title}`,
        );
      }
    }
  });

  it("keeps spacious bullets ~50% larger than the crushed post-#31 sizes", () => {
    const css = readFileSync(join(process.cwd(), "app/book/book.css"), "utf8");
    assert.match(css, /\.lecture-slide-title\s*\{[^}]*white-space:\s*nowrap/);
    assert.match(css, /max\(0\.95rem,\s*calc\(100cqi \/ 24\)\)/);
    assert.match(
      css,
      /\.lecture-slide-spacious \.lecture-slide-bullets \{[^}]*font-size:\s*2\.25rem/,
    );
    assert.match(css, /font-size:\s*2\.75rem/);
    assert.match(css, /font-size:\s*3\.15rem/);
    assert.match(
      css,
      /\.lecture-slide-dense \.lecture-slide-bullets \{[^}]*font-size:\s*1\.7rem/,
    );
    assert.doesNotMatch(
      css,
      /\.lecture-slide-spacious \.lecture-slide-bullets \{[^}]*font-size:\s*1\.5rem/,
    );
  });

  it("sizes text-only slides spacious and diagram/embed slides dense", () => {
    const textOnly = findSlide("intro-to-web-development", "internet");
    const diagram = findSlide("intro-to-web-development", "client-server");
    const embed = findSlide("creating-a-nextjs-react-application", "welcome-page");
    const htmlText = findSlide("html-and-dom", "html-means");
    const htmlDiagram = findSlide("html-and-dom", "the-dom");
    const htmlEmbed = findSlide("headings-and-paragraphs", "lab1-nest");
    assert.equal(lectureSlideDensity(textOnly), "spacious");
    assert.equal(lectureSlideDensity(diagram), "dense");
    assert.equal(lectureSlideDensity(embed), "dense");
    assert.equal(lectureSlideDensity(htmlText), "spacious");
    assert.equal(lectureSlideDensity(htmlDiagram), "dense");
    assert.equal(lectureSlideDensity(htmlEmbed), "dense");
    assert.equal(
      lectureSlideDensity({ id: "forced", title: "Forced", density: "dense" }),
      "dense",
    );
  });

  it("teaches App Router only in the Next.js deck", () => {
    const text = slideText("creating-a-nextjs-react-application");
    assert.match(text, /App Router/);
    assert.match(text, /Welcome to Web Dev/);
    assert.match(text, /labs\/lab1/);
    assert.match(text, /globals\.css/);
    assert.match(text, /next\/link/);
    assert.doesNotMatch(text, /npm create vite/i);
    assert.doesNotMatch(text, /create-vite/);
    assert.doesNotMatch(text, /vite\.config/i);
    assert.doesNotMatch(text, /Vite SPA leftover/i);
    assert.doesNotMatch(text, /No Vite SPA setup/i);
  });

  it("drops Vite SPA leftover phrasing from authored decks", () => {
    for (const deck of listLectureDecks()) {
      const text = slideText(deck.slug);
      assert.doesNotMatch(text, /Vite SPA leftover/i);
      assert.doesNotMatch(text, /No Vite SPA setup/i);
      assert.doesNotMatch(text, /Vite-only SPA/i);
    }
    const creating = getLecture("creating-a-nextjs-react-application");
    assert.ok(creating);
    assert.doesNotMatch(creating.summary, /Vite SPA leftover/i);
    const nextUp = findSlide("installing-nodejs", "next-up");
    assert.match(nextUp.title, /Next: create the Next\.js app/);
    assert.ok(!(nextUp.bullets ?? []).some((row) => /vite/i.test(row)));
  });

  it("embeds live Ch1 demos instead of UI screenshots", () => {
    const expected = {
      "user-component": "user-card",
      "welcome-page": "welcome-home",
      "lab1-route": "lab1-stub",
      "link-to-lab1": "link-nav",
      "user-on-page": "user-card",
    } as const;
    for (const [id, embed] of Object.entries(expected)) {
      const slide = findSlide("creating-a-nextjs-react-application", id);
      assert.equal(slide.embed, embed);
      assert.equal(slide.imageSrc, undefined);
      assert.ok((LECTURE_EMBED_IDS as readonly string[]).includes(embed));
    }
  });

  it("embeds Lab 1 HTML previews on Lecture 2 decks", () => {
    const expected = {
      "html-and-dom": { "hello-html": "html-skeleton", "jsx-lab1": "lab1-stub" },
      "headings-and-paragraphs": {
        "heading-scale": "heading-scale",
        "lab1-nest": "heading-tags",
        "wrap-p": "paragraph-tag",
      },
      "lists-and-tables": {
        "pancakes-after": "list-tags",
        "books-ul": "list-tags",
        "quiz-table": "tables",
      },
      "web-forms": {
        "text-fields-demo": "text-fields",
        textarea: "textarea",
        buttons: "buttons",
        "onclick-alert": "alert-button",
        file: "file-field",
        "radio-same-name": "radio-buttons",
        "checkboxes-multi": "checkboxes",
        "select-one": "dropdowns",
        "select-many": "dropdowns",
        number: "typed-fields",
        range: "typed-fields",
        email: "typed-fields",
        date: "typed-fields",
      },
      anchors: {
        "href-documents": "anchors",
        "mailto-tel": "mailto-tel",
        "hash-toc": "hash-toc",
      },
      "single-page-navigation": {
        "link-toc": "labs-index",
        "labs-index-toc": "labs-index",
        "layout-children": "labs-layout",
        "lab2-page": "labs-layout",
        "lab3-page": "labs-layout",
      },
      "kambaz-overview": { landing: "kambaz-landing" },
      "kambaz-account": {
        signin: "kambaz-signin",
        signup: "kambaz-signup",
        profile: "kambaz-profile",
        "account-layout": "kambaz-account-nav",
      },
      "kambaz-dashboard": { "dashboard-page": "kambaz-dashboard" },
      "kambaz-navigation": { layout: "kambaz-navigation" },
      "kambaz-courses": { layout: "kambaz-courses" },
      "kambaz-modules": { "modules-page": "kambaz-modules", home: "kambaz-home" },
      "kambaz-assignments": {
        "list-screen": "kambaz-assignments",
        editor: "kambaz-assignment-editor",
      },
      "css-intro": {
        "style-attr": "css-style-attr",
        "import-css": "css-import",
        "id-selectors": "css-id-selectors",
        "class-selectors": "css-class-selectors",
        structure: "css-structure-selectors",
      },
      "css-colors": {
        "fg-demo": "css-foreground",
        "bg-demo": "css-background",
      },
      "css-box-model": {
        "borders-demo": "css-borders",
        padding: "css-padding",
        margins: "css-margins",
        "box-model-demo": "css-box-model",
        corners: "css-corners",
      },
      "css-size-and-position": {
        dimensions: "css-dimensions",
        "display-demo": "css-display",
        relative: "css-position-relative",
        absolute: "css-position-absolute",
        fixed: "css-position-fixed",
        zindex: "css-zindex",
      },
      "css-media-queries": { demo: "css-media-queries" },
      "css-float": {
        "float-demo": "css-float",
        "grid-demo": "css-grid-layout",
      },
      "css-flex": {
        row: "css-flex-row",
        grow: "css-flex-grow",
        pin: "css-flex-width",
      },
      "css-rotation": {
        rotate: "css-rotate",
        gradient: "css-gradient",
      },
      "react-icons": { sampler: "react-icons" },
      "tailwind-spacing": { demo: "tw-spacing" },
      "tailwind-typography": { demo: "tw-typography" },
      "tailwind-colors": {
        demo: "tw-backgrounds",
        "filters-demo": "tw-filters",
      },
      "tailwind-flex-and-grid": {
        "flex-demo": "tw-flex",
        "grid-demo": "tw-grids",
      },
      "tailwind-responsive": { demo: "tw-responsive" },
      "kambaz-nav-styling": { demo: "kambaz-styled-nav" },
      "kambaz-dashboard-styling": { demo: "kambaz-styled-dashboard" },
      "kambaz-courses-styling": {
        "course-nav-demo": "kambaz-styled-course-nav",
        "modules-demo": "kambaz-styled-modules",
        "home-demo": "kambaz-styled-home",
      },
      "kambaz-assignments-styling": {
        "people-demo": "kambaz-styled-people",
        "assignments-demo": "kambaz-styled-assignments",
      },
      "kambaz-account-styling": { demo: "kambaz-styled-signin" },
    } as const;
    const used = new Set<string>();
    for (const [slug, slides] of Object.entries(expected)) {
      for (const [id, embed] of Object.entries(slides)) {
        const slide = findSlide(slug, id);
        assert.equal(slide.embed, embed);
        assert.equal(slide.imageSrc, undefined);
        assert.ok((LECTURE_EMBED_IDS as readonly string[]).includes(embed));
        used.add(embed);
      }
    }
    for (const deck of listLectureDecks()) {
      for (const slide of deck.slides) {
        if (slide.embed) used.add(slide.embed);
      }
    }
    assert.deepEqual(
      [...LECTURE_EMBED_IDS].sort(),
      [...used].sort(),
      "every embed id should be wired to a slide",
    );
  });

  it("keeps Node deck evergreen and uses kambaz spelling", () => {
    const text = slideText("installing-nodejs");
    assert.match(text, /mkdir -p webdev/);
    assert.match(text, /kambaz-node-server-app/);
    assert.match(text, /localhost:4000\/hello/);
    assert.doesNotMatch(text, /Fall 2026/);
    assert.doesNotMatch(text, /2026\/fall\/webdev/);
    assert.doesNotMatch(text, /Winter 2034/);
    assert.doesNotMatch(text, /kanbas/);
    assert.doesNotMatch(text, /kanbaz-node/);
  });

  it("omits semester and course-section strings from authored slides", () => {
    for (const deck of listLectureDecks()) {
      const text = slideText(deck.slug);
      assert.doesNotMatch(text, /Fall 20\d\d/);
      assert.doesNotMatch(text, /Winter 20\d\d/);
      assert.doesNotMatch(text, /CS 4550/);
      assert.doesNotMatch(text, /CS 5610/);
      assert.doesNotMatch(text, /2026\/fall/);
      assert.doesNotMatch(text, /Kanbas/);
      assert.doesNotMatch(text, /HashRouter/);
      assert.doesNotMatch(text, /src\/Kanbas/);
    }
  });

  it("rewrites deploy notes to Vercel and not Netlify", () => {
    const text = slideText("deploying-to-vercel");
    assert.match(text, /Vercel/);
    assert.match(text, /Deployment Protection/);
    assert.match(text, /Vercel Authentication/);
    assert.match(text, /OFFICE HOURS/);
    assert.match(text, /BREAK/);
    assert.doesNotMatch(text, /netlify\.com/i);
    assert.doesNotMatch(text, /Deploy to Netlify/);
  });

  it("normalizes kambaz naming in the GitHub deck", () => {
    const text = slideText("commit-to-github");
    assert.match(text, /kambaz/);
    assert.match(text, /node_modules/);
    assert.match(text, /git push -u origin main/);
    assert.doesNotMatch(text, /kanbas/);
    assert.doesNotMatch(text, /kanbaz/);
  });

  it("teaches Chapter 1 HTML topics in the Lecture 2 decks", () => {
    const html = slideText("html-and-dom");
    assert.match(html, /HyperText Markup Language|HTML = HyperText/);
    assert.match(html, /DOCTYPE/);
    assert.match(html, /hello\.html/);
    assert.match(html, /<!--/);
    assert.match(html, /\{\/\*/);
    assert.match(html, /Window/);
    assert.match(html, /wd-lab1/);

    const headings = slideText("headings-and-paragraphs");
    assert.match(headings, /h1/);
    assert.match(headings, /wd-h-tag/);
    assert.match(headings, /wd-p-2/);
    assert.match(headings, /wd-p-4/);

    const lists = slideText("lists-and-tables");
    assert.match(lists, /wd-pancakes/);
    assert.match(lists, /wd-tables/);
    assert.match(lists, /colSpan/);
    assert.match(lists, /not layout|not a layout/i);

    const forms = slideText("web-forms");
    assert.match(forms, /defaultValue/);
    assert.match(forms, /htmlFor/);
    assert.match(forms, /type="file"/);
    assert.match(forms, /radio-genre/);
    assert.match(forms, /preventDefault/);
    assert.doesNotMatch(forms, /Fall 2026/);

    const anchors = slideText("anchors");
    assert.match(anchors, /wd-lipsum/);
    assert.match(anchors, /mailto:/);
    assert.match(anchors, /tel:/);
    assert.match(anchors, /#wd-anchor-bottom/);

    const spa = slideText("single-page-navigation");
    assert.match(spa, /next\/link/);
    assert.match(spa, /History API/);
    assert.match(spa, /layout\.tsx/);
    assert.match(spa, /app\/labs\/page\.tsx/);
    assert.match(spa, /TOC\.tsx/);
    assert.match(spa, /app\/labs\/lab2\/page\.tsx/);
    assert.match(spa, /app\/labs\/lab3\/page\.tsx/);
    assert.match(spa, /\(kambaz\)/);
    assert.match(spa, /#\/lab1/);
    const tocSlide = findSlide("single-page-navigation", "labs-index-toc");
    const tocFiles = lectureSlideCodeBlocks(tocSlide).map((block) => block.file);
    assert.ok(tocFiles.includes("app/labs/page.tsx"));
    assert.ok(tocFiles.includes("app/labs/TOC.tsx"));
  });

  it("teaches Chapter 1 Kambaz A1 screens in the Lecture 3 decks", () => {
    const overview = slideText("kambaz-overview");
    assert.match(overview, /app\/\(kambaz\)\/page\.tsx/);
    assert.match(overview, /wd-kambaz/);
    assert.match(overview, /wd-kambaz-link/);
    assert.match(overview, /next\/navigation/);
    assert.match(overview, /redirect\("\/account\/signin"\)/);
    assert.doesNotMatch(overview, /HashRouter/);
    assert.doesNotMatch(overview, /src\/Kanbas/);

    const account = slideText("kambaz-account");
    assert.match(account, /wd-signin-screen/);
    assert.match(account, /wd-signin-btn/);
    assert.match(account, /\/account\/signin/);
    assert.match(account, /wd-password-verify/);
    assert.match(account, /wd-firstname/);
    assert.match(account, /wd-kambaz-account/);
    assert.match(account, /app\/\(kambaz\)\/account\/layout\.tsx/);
    assert.doesNotMatch(account, /next\/dist\/client/);
    assert.doesNotMatch(account, /href=\{?"signin"/);

    const dashboard = slideText("kambaz-dashboard");
    assert.match(dashboard, /CourseCard/);
    assert.match(dashboard, /next\/image/);
    assert.match(dashboard, /\/courses\/\$\{id\}\/home/);
    assert.match(dashboard, /wd-dashboard/);
    assert.match(dashboard, /Published Courses \(3\)/);
    assert.match(dashboard, /wd-signin-btn/);
    assert.doesNotMatch(dashboard, /#\/Kanbas/);

    const navigation = slideText("kambaz-navigation");
    assert.match(navigation, /wd-kambaz-navigation/);
    assert.match(navigation, /wd-neu-link/);
    assert.match(navigation, /app\/not-found\.tsx/);
    assert.match(navigation, /wd-not-found-dashboard-link/);

    const courses = slideText("kambaz-courses");
    assert.match(courses, /\/courses\/\[cid\]\/home/);
    assert.match(courses, /wd-courses-navigation/);
    assert.match(courses, /await params/);
    assert.match(courses, /wd-course-people-link/);
    assert.match(courses, /people\/table/);

    const modules = slideText("kambaz-modules");
    assert.match(modules, /wd-modules/);
    assert.match(modules, /wd-module/);
    assert.match(modules, /LEARNING OBJECTIVES/);
    assert.match(modules, /wd-course-status/);
    assert.match(modules, /import Modules from "\.\.\/modules\/page"/);

    const assignments = slideText("kambaz-assignments");
    assert.match(assignments, /wd-search-assignment/);
    assert.match(assignments, /wd-assignment-link/);
    assert.match(assignments, /AssignmentItem/);
    assert.match(assignments, /defaultValue/);
    assert.match(assignments, /wd-assignments-editor/);
    assert.match(assignments, /wd-cancel/);
    assert.doesNotMatch(assignments, /<a href="\/courses/);
  });

  it("teaches Chapter 2 CSS topics in the Lecture 4 decks", () => {
    const intro = slideText("css-intro");
    assert.match(intro, /backgroundColor/);
    assert.match(intro, /import "\.\/index\.css"/);
    assert.match(intro, /wd-id-selector-1/);
    assert.match(intro, /wd-class-selector/);
    assert.match(intro, /\.wd-selector-1 \.wd-selector-3/);
    assert.match(intro, /Specificity/);
    assert.doesNotMatch(intro, /Bootstrap/);

    const colors = slideText("css-colors");
    assert.match(colors, /wd-fg-color-blue/);
    assert.match(colors, /wd-bg-color-yellow/);
    assert.match(colors, /#7070ff/);
    assert.match(colors, /ForegroundColors\.tsx/);
    assert.match(colors, /BackgroundColors\.tsx/);

    const box = slideText("css-box-model");
    assert.match(box, /wd-border-fat/);
    assert.match(box, /wd-padded-top-left/);
    assert.match(box, /wd-margin-bottom/);
    assert.match(box, /border-box/);
    assert.match(box, /content-box/);
    assert.match(box, /wd-rounded-corners-top/);
    const layers = findSlide("css-box-model", "layers");
    assert.equal(layers.diagram, "box-model");

    const size = slideText("css-size-and-position");
    assert.match(size, /wd-dimension-portrait/);
    assert.match(size, /inline-block/);
    assert.match(size, /wd-pos-relative-nudge-down-right/);
    assert.match(size, /wd-pos-absolute-10-10/);
    assert.match(size, /wd-pos-fixed/);
    assert.match(size, /wd-zindex-bring-to-front/);

    const mq = slideText("css-media-queries");
    assert.match(mq, /@media/);
    assert.match(mq, /750px/);
    assert.match(mq, /MediaQueriesDemo\.tsx/);
    assert.match(mq, /MediaQueriesDemo\.css/);
    assert.doesNotMatch(mq, /@screen-sm-min/);
    assert.doesNotMatch(mq, /min-width: 576px/);

    const float = slideText("css-float");
    assert.match(float, /wd-float-left/);
    assert.match(float, /wd-float-done/);
    assert.match(float, /wd-grid-col-half-page/);
    assert.doesNotMatch(float, /staradvertiser/i);
    assert.doesNotMatch(float, /googleusercontent/i);

    const flex = slideText("css-flex");
    assert.match(flex, /wd-flex-row-container/);
    assert.match(flex, /wd-flex-grow-1/);
    assert.match(flex, /wd-width-75px/);
    assert.match(flex, /Flex\.tsx/);

    const rotation = slideText("css-rotation");
    assert.match(rotation, /transform: rotate/);
    assert.match(rotation, /linear-gradient/);
    assert.match(rotation, /radial-gradient/);
    assert.match(rotation, /Not required for Lab 2/);
  });

  it("teaches Chapter 2 Tailwind and Kambaz styling after Lecture 4", () => {
    const icons = slideText("react-icons");
    assert.match(icons, /npm install react-icons/);
    assert.match(icons, /ReactIconsSampler/);
    assert.match(icons, /react-icons\/fa/);
    assert.match(icons, /text-3xl/);
    assert.doesNotMatch(icons, /kit\.fontawesome/);

    const intro = slideText("tailwind-intro");
    assert.match(intro, /@import "tailwindcss"/);
    assert.match(intro, /app\/labs\/lab2\/tailwind\/index\.css/);
    assert.match(intro, /Preflight/);
    assert.match(intro, /create-next-app/);
    assert.match(intro, /\/labs\/lab2\/tailwind/);
    assert.doesNotMatch(intro, /npm install bootstrap/i);
    assert.doesNotMatch(intro, /from ["']react-bootstrap["']/);

    const spacing = slideText("tailwind-spacing");
    assert.match(spacing, /TailwindSpacing/);
    assert.match(spacing, /mb-4/);
    assert.match(spacing, /ms-4 me-8/);

    const type = slideText("tailwind-typography");
    assert.match(type, /TailwindTypography/);
    assert.match(type, /text-sm/);
    assert.match(type, /font-black/);

    const colors = slideText("tailwind-colors");
    assert.match(colors, /bg-red-500/);
    assert.match(colors, /yellow-500/);
    assert.match(colors, /blur-lg/);
    assert.match(colors, /TailwindFilters/);

    const flexGrid = slideText("tailwind-flex-and-grid");
    assert.match(flexGrid, /shrink-0/);
    assert.match(flexGrid, /grid-cols-4/);
    assert.match(flexGrid, /col-span-4/);
    assert.match(flexGrid, /wd-tailwind-grid-system/);
    assert.doesNotMatch(flexGrid, /wd-flex-row-container/);

    const responsive = slideText("tailwind-responsive");
    assert.match(responsive, /md:flex/);
    assert.match(responsive, /TailwindResponsiveDesign/);
    assert.match(responsive, /mobile-first/i);

    const shell = slideText("kambaz-styling");
    assert.match(shell, /tailwindcss\/theme/);
    assert.match(shell, /utilities\.css/);
    assert.match(shell, /kambaz\.css/);
    assert.match(shell, /wd-main-content-offset/);
    assert.match(shell, /font-sans/);

    const nav = slideText("kambaz-nav-styling");
    assert.match(nav, /wd-kambaz-navigation/);
    assert.match(nav, /hidden md:block/);
    assert.match(nav, /FaRegCircleUser/);
    assert.match(nav, /margin-left: 120px/);

    const dash = slideText("kambaz-dashboard-styling");
    assert.match(dash, /CourseCard/);
    assert.match(dash, /wd-dashboard-courses/);
    assert.match(dash, /sm:grid-cols-2/);
    assert.match(dash, /Published Courses \(3\)/);
    assert.doesNotMatch(dash, /Bootstrap/);
    assert.doesNotMatch(dash, /react-bootstrap/i);
    assert.doesNotMatch(dash, /\bd-flex\b/);

    const courses = slideText("kambaz-courses-styling");
    assert.match(courses, /wd-courses-navigation/);
    assert.match(courses, /list-group-item/);
    assert.match(courses, /kambaz\.css/);
    assert.match(courses, /GreenCheckmark/);
    assert.match(courses, /hidden lg:block/);
    assert.match(courses, /wd-course-status/);
    assert.doesNotMatch(courses, /react-bootstrap/i);
    assert.doesNotMatch(courses, /\bd-flex\b/);

    const assignments = slideText("kambaz-assignments-styling");
    assert.match(assignments, /wd-people-table/);
    assert.match(assignments, /odd:bg-neutral-50/);
    assert.match(assignments, /wd-search-assignment/);
    assert.match(assignments, /AssignmentItem/);
    assert.match(assignments, /wd-assignments-editor/);
    assert.match(assignments, /wd-cancel/);

    const account = slideText("kambaz-account-styling");
    assert.match(account, /wd-signin-screen/);
    assert.match(account, /wd-signin-btn/);
    assert.match(account, /max-w-sm/);
    assert.match(account, /kambaz\.css/);
    assert.doesNotMatch(account, /HashRouter/);
    assert.doesNotMatch(account, /react-bootstrap/i);
    assert.doesNotMatch(account, /\bd-flex\b/);
  });


  it("scrolls the slide pane with Up\/Down only when content overflows", () => {
    assert.equal(slidePaneOverflows(null), false);
    assert.equal(slidePaneOverflows({ scrollHeight: 400, clientHeight: 400 }), false);
    assert.equal(slidePaneOverflows({ scrollHeight: 401, clientHeight: 400 }), false);
    assert.equal(slidePaneOverflows({ scrollHeight: 480, clientHeight: 400 }), true);
    assert.equal(slidePaneScrollStep(400), 280);
  });

  it("treats missing Fullscreen API as unsupported so phones can use CSS present", () => {
    assert.equal(nativeFullscreenEnabled({}), false);
    assert.equal(nativeFullscreenEnabled({ fullscreenEnabled: false }), false);
    assert.equal(nativeFullscreenEnabled({ fullscreenEnabled: true }), true);
    assert.equal(nativeFullscreenEnabled({ webkitFullscreenEnabled: true }), true);
    assert.equal(nativeFullscreenElement({}), null);
    assert.equal(
      nativeFullscreenElement({ webkitFullscreenElement: null, fullscreenElement: null }),
      null,
    );
    assert.equal(
      preferNativeFullscreen({
        fullscreenEnabled: true,
        coarsePointer: false,
        viewportWidth: 1280,
        userAgent: "Mozilla/5.0 Macintosh",
      }),
      true,
    );
    assert.equal(
      preferNativeFullscreen({
        fullscreenEnabled: true,
        coarsePointer: true,
        viewportWidth: 1280,
        userAgent: "Mozilla/5.0 Macintosh",
      }),
      false,
    );
    assert.equal(
      preferNativeFullscreen({
        fullscreenEnabled: true,
        coarsePointer: false,
        viewportWidth: 390,
        userAgent: "Mozilla/5.0 Macintosh",
      }),
      false,
    );
    assert.equal(
      preferNativeFullscreen({
        fullscreenEnabled: true,
        coarsePointer: false,
        viewportWidth: 1024,
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
      }),
      false,
    );
  });

  it("maps present-mode URLs and history state for Back-to-exit", () => {
    assert.equal(lectureSearchIsPresent(""), false);
    assert.equal(lectureSearchIsPresent("slide=2"), false);
    assert.equal(lectureSearchIsPresent("fullscreen=1"), true);
    assert.equal(lectureSearchIsPresent("?fullscreen=1"), true);
    assert.equal(
      lecturePresentHref({
        href: "https://webdev-client.vercel.app/slides/html-and-dom#slide-2",
        slideNumber: 3,
        present: true,
      }),
      "/slides/html-and-dom?fullscreen=1#slide-3",
    );
    assert.equal(
      lecturePresentHref({
        href: "https://webdev-client.vercel.app/slides/html-and-dom?fullscreen=1#slide-3",
        slideNumber: 3,
        present: false,
      }),
      "/slides/html-and-dom#slide-3",
    );
    assert.equal(isLecturePresentHistoryState(null), false);
    assert.equal(isLecturePresentHistoryState(LECTURE_PRESENT_STATE), true);
  });

  it("turns horizontal swipes into slide steps and ignores vertical pans", () => {
    assert.equal(swipeSlideDelta(200, 100, 80, 110), 1);
    assert.equal(swipeSlideDelta(80, 100, 200, 110), -1);
    assert.equal(swipeSlideDelta(200, 100, 180, 110), 0);
    assert.equal(swipeSlideDelta(200, 100, 80, 220), 0);
    assert.equal(swipeTargetIsInteractive(null), false);
  });

  it("uses authored diagrams instead of Google Slides rasters", () => {
    const expected = {
      "intro-to-web-development": {
        "network-of-networks": "network-of-networks",
        "client-server": "client-server",
        ssr: "ssr",
        csr: "csr",
      },
      "installing-nodejs": {
        "course-stack": "course-stack",
      },
      "creating-a-nextjs-react-application": {
        "npm-run-dev": "npm-run-dev-mock",
        "browser-parses-dom": "dom-tree",
      },
      "commit-to-github": {
        "create-repo": "github-create-repo-mock",
      },
      "deploying-to-vercel": {
        "select-repo": "vercel-import-mock",
        deploy: "vercel-deploy-mock",
        congratulations: "vercel-success-mock",
        protections: "vercel-protect-mock",
        "disable-auth": "vercel-auth-mock",
      },
      "html-and-dom": {
        "the-dom": "dom-tree",
      },
      "css-box-model": {
        layers: "box-model",
      },
    } as const;

    const used = new Set<string>();
    for (const [slug, slides] of Object.entries(expected)) {
      for (const [id, diagram] of Object.entries(slides)) {
        const slide = findSlide(slug, id);
        assert.equal(slide.diagram, diagram);
        assert.equal(
          slide.imageSrc,
          undefined,
          `${slug} ${id} should not attach a PNG figure`,
        );
        assert.ok((LECTURE_DIAGRAM_IDS as readonly string[]).includes(diagram));
        used.add(diagram);
      }
    }

    assert.deepEqual(
      [...LECTURE_DIAGRAM_IDS].sort(),
      [...used].sort(),
      "every diagram id should be wired to a slide",
    );

    for (const deck of listLectureDecks()) {
      for (const slide of deck.slides) {
        assert.equal(
          slide.imageSrc,
          undefined,
          `${deck.slug} ${slide.id} should not auto-attach a PNG`,
        );
        if (slide.diagram) {
          assert.ok(
            (LECTURE_DIAGRAM_IDS as readonly string[]).includes(slide.diagram),
          );
        }
      }
    }
  });

  it("keeps commands and source in code blocks, not bullets", () => {
    const hello = findSlide("installing-nodejs", "hello-js");
    const express = findSlide("installing-nodejs", "express");
    const createApp = findSlide(
      "creating-a-nextjs-react-application",
      "create-next-app",
    );
    const welcome = findSlide(
      "creating-a-nextjs-react-application",
      "welcome-page",
    );
    const git = findSlide("commit-to-github", "from-project");
    const ignore = findSlide("commit-to-github", "gitignore");
    const lab1 = findSlide("html-and-dom", "jsx-lab1");

    assert.match(hello.code ?? "", /console\.log/);
    assert.ok(!(hello.bullets ?? []).some((row) => row.includes("console.log")));

    const expressCode = lectureSlideCodeBlocks(express)
      .map((block) => block.code)
      .join("\n");
    assert.match(expressCode, /npm install express/);
    assert.match(expressCode, /app\.listen\(4000\)/);
    assert.ok(!(express.bullets ?? []).some((row) => row.includes("app.listen")));

    assert.equal(createApp.code, "npx create-next-app@latest kambaz-next-js");
    assert.equal(createApp.codeLanguage, "bash");
    assert.match(welcome.code ?? "", /Welcome to Web Dev/);
    assert.equal(welcome.codeFile, "app/page.tsx");
    assert.match(git.code ?? "", /git push -u origin main/);
    assert.ok(!(git.bullets ?? []).some((row) => row.startsWith("`git ")));
    assert.match(ignore.code ?? "", /node_modules\//);
    assert.equal(ignore.codeFile, ".gitignore");
    assert.match(lab1.code ?? "", /wd-lab1/);
    assert.equal(lab1.codeFile, "app/labs/lab1/page.tsx");
  });

  it("marks incremental lecture snippets with added or highlight lines", () => {
    const link = findSlide("creating-a-nextjs-react-application", "link-to-lab1");
    const pancakes = findSlide("lists-and-tables", "pancakes-after");
    const signup = findSlide("kambaz-account", "signup");
    const cssImport = findSlide("css-intro", "import-css");
    const express = findSlide("installing-nodejs", "express");

    assert.deepEqual(link.codeAddedLines, [1, 5, [7, 8]]);
    assert.deepEqual(pancakes.codeAddedLines, [[2, 11]]);
    assert.deepEqual(signup.codeAddedLines, [11]);
    assert.deepEqual(cssImport.codeAddedLines, [1]);
    const twPage = findSlide("tailwind-intro", "page");
    const navOffset = findSlide("kambaz-nav-styling", "offset");
    assert.deepEqual(twPage.codeAddedLines, [1, [5, 6]]);
    assert.deepEqual(navOffset.codeAddedLines, [[1, 5]]);
    const server = lectureSlideCodeBlocks(express).find((block) =>
      block.file === "server.js",
    );
    assert.ok(server);
    assert.deepEqual(server.addedLines, [[3, 6]]);
  });
});
