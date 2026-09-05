import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { existsSync } from "node:fs";
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
  listLectureDecks,
  listLectureSlugs,
  listLectures,
} from "./catalog";
import {
  LECTURE_DECK_THUMBNAILS,
  LECTURE_SLIDE_IMAGE_ALLOWLIST,
  LECTURE_SLUGS,
  lectureSlideAssetPath,
  lectureSlideFigurePath,
  lectureSlideCodeBlocks,
} from "./types";

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
  it("lists the five Lecture 1 slugs in locked order", () => {
    assert.deepEqual(listLectureSlugs(), [
      "intro-to-web-development",
      "installing-nodejs",
      "creating-a-nextjs-react-application",
      "commit-to-github",
      "deploying-to-vercel",
    ]);
    assert.deepEqual(listLectureSlugs(), [...LECTURE_SLUGS]);
  });

  it("marks every catalog entry as Canvas Lecture 1 / Chapter 1", () => {
    const items = listLectures();
    assert.equal(items.length, 5);
    for (const item of items) {
      assert.equal(item.chapter, 1);
      assert.equal(item.canvasLecture, 1);
      assert.equal(item.chapterHref, "/book/ch1");
      assert.ok(item.chapterTitle.length > 0);
      assert.ok(item.title.length > 0);
      assert.ok(item.summary.length > 0);
      assert.equal(item.publicUrl, `${COURSE_SITE_ORIGIN}/lectures/${item.slug}`);
      assert.equal(lecturePublicUrl(item.slug), item.publicUrl);
      assert.equal(item.thumbnailSrc, lectureDeckThumbnail(item.slug));
      assert.doesNotMatch(item.thumbnailSrc, /slide-01\.png$/);
    }
  });

  it("returns undefined for unknown slugs", () => {
    assert.equal(getLecture("not-a-deck"), undefined);
    assert.equal(getLectureDeck("vite-spa"), undefined);
    assert.equal(isLectureSlug("intro-to-web-development"), true);
    assert.equal(isLectureSlug("intro"), false);
  });

  it("groups decks under Canvas lecture folders with later weeks empty", () => {
    const groups = listCanvasLectureGroups();
    assert.ok(groups.length >= 11);
    assert.equal(groups[0]?.title, "Lecture 1");
    assert.equal(groups[0]?.canvasLecture, 1);
    assert.equal(groups[0]?.decks.length, 5);
    assert.deepEqual(
      groups[0]?.decks.map((deck) => deck.slug),
      [...LECTURE_SLUGS],
    );
    assert.equal(
      lectureDeckThumbnail(groups[0]!.decks[0]!),
      "/lectures/intro-to-web-development/slide-06-figure.png",
    );
    assert.equal(
      lectureDeckThumbnail("commit-to-github"),
      "/lectures/commit-to-github/slide-05-figure.png",
    );
    for (const slug of LECTURE_SLUGS) {
      const thumb = lectureDeckThumbnail(slug);
      assert.notEqual(thumb, lectureSlideAssetPath(slug, 1));
      assert.equal(
        thumb,
        lectureSlideFigurePath(slug, LECTURE_DECK_THUMBNAILS[slug]),
      );
      const disk = join(process.cwd(), thumb.replace(/^\//, "public/"));
      assert.ok(existsSync(disk), `${thumb} is missing on disk`);
    }
    for (const group of groups.slice(1)) {
      assert.equal(group.title, `Lecture ${group.canvasLecture}`);
      assert.equal(group.decks.length, 0);
    }
  });

  it("walks adjacent decks", () => {
    const first = adjacentLectureSlugs("intro-to-web-development");
    assert.equal(first.prev, undefined);
    assert.equal(first.next?.slug, "installing-nodejs");
    const last = adjacentLectureSlugs("deploying-to-vercel");
    assert.equal(last.next, undefined);
    assert.equal(last.prev?.slug, "commit-to-github");
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
    for (const deck of decks) {
      const ids = deck.slides.map((slide) => slide.id);
      assert.equal(new Set(ids).size, ids.length, `${deck.slug} duplicate slide id`);
      for (const slide of deck.slides) {
        assert.ok(slide.id);
        assert.ok(slide.title);
      }
    }
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

  it("attaches rasters only for allowlisted diagrams and screenshots", () => {
    for (const deck of listLectureDecks()) {
      const allowed = LECTURE_SLIDE_IMAGE_ALLOWLIST[deck.slug] ?? {};
      for (const slide of deck.slides) {
        const number = allowed[slide.id];
        if (number == null) {
          assert.equal(
            slide.imageSrc,
            undefined,
            `${deck.slug} ${slide.id} should not auto-attach a PNG`,
          );
          continue;
        }
        assert.equal(slide.imageSrc, lectureSlideFigurePath(deck.slug, number));
        assert.match(slide.imageSrc, /-figure\.png$/);
        assert.ok(slide.imageAlt);
        const disk = join(
          process.cwd(),
          slide.imageSrc.replace(/^\//, "public/"),
        );
        assert.ok(existsSync(disk), `${slide.imageSrc} is missing on disk`);
      }
    }
    assert.equal(
      findSlide("intro-to-web-development", "client-server").imageSrc,
      "/lectures/intro-to-web-development/slide-06-figure.png",
    );
    assert.equal(
      findSlide("intro-to-web-development", "ssr").imageSrc,
      "/lectures/intro-to-web-development/slide-09-figure.png",
    );
    assert.equal(
      findSlide("intro-to-web-development", "csr").imageSrc,
      "/lectures/intro-to-web-development/slide-11-figure.png",
    );
    assert.equal(findSlide("installing-nodejs", "title").imageSrc, undefined);
    assert.equal(
      findSlide("commit-to-github", "from-project").imageSrc,
      undefined,
    );
    assert.equal(
      findSlide("creating-a-nextjs-react-application", "browser-parses-dom")
        .imageSrc,
      "/lectures/creating-a-nextjs-react-application/slide-27-figure.png",
    );
    assert.equal(
      findSlide("deploying-to-vercel", "office-hours").imageSrc,
      undefined,
    );
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
  });
});
