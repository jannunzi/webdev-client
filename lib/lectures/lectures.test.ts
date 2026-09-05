import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  COURSE_SITE_ORIGIN,
  adjacentLectureSlugs,
  getLecture,
  getLectureDeck,
  isLectureSlug,
  lecturePublicUrl,
  listLectureDecks,
  listLectureSlugs,
  listLectures,
} from "./catalog";
import { LECTURE_SLUGS } from "./types";

function slideText(deckSlug: string): string {
  const deck = getLectureDeck(deckSlug);
  assert.ok(deck);
  return deck.slides
    .flatMap((slide) => [
      slide.title,
      ...(slide.bullets ?? []),
      slide.interactiveHint ?? "",
    ])
    .join("\n");
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
    }
  });

  it("returns undefined for unknown slugs", () => {
    assert.equal(getLecture("not-a-deck"), undefined);
    assert.equal(getLectureDeck("vite-spa"), undefined);
    assert.equal(isLectureSlug("intro-to-web-development"), true);
    assert.equal(isLectureSlug("intro"), false);
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
    assert.equal(counts["creating-a-nextjs-react-application"], 25);
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

  it("uses Fall 2026 and kambaz spelling in the Node deck", () => {
    const text = slideText("installing-nodejs");
    assert.match(text, /Fall 2026/);
    assert.match(text, /2026\/fall\/webdev/);
    assert.match(text, /kambaz-node-server-app/);
    assert.match(text, /localhost:4000\/hello/);
    assert.doesNotMatch(text, /Winter 2034/);
    assert.doesNotMatch(text, /kanbas/);
    assert.doesNotMatch(text, /kanbaz-node/);
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
});
