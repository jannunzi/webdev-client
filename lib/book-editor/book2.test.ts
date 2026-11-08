import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { courseNavItems, isCourseInfoCurrent, isCourseNavCurrent } from "../../app/course-info/links";
import { chaptersForBase } from "../../app/book/TOC";
import HeadingTags from "../../app/labs/lab1/HeadingTags";
import { PracticeIndex } from "../../app/book/practice/page";
import DraftChapter from "../../app/book2/draft-chapter";
import { BOOK_EMBEDS } from "./embed-registry";
import { loadSavedChapter1 } from "./book2-load";
import {
  book2View,
  chapterPager,
  rewriteBookPath,
  unsupportedNames,
} from "./book2-path";
import type { ChapterStore } from "./store";

const root = process.cwd();

describe("book2 navigation", () => {
  it("adds the book2 link only for staff, immediately after Book", () => {
    const hidden = courseNavItems(false).map((link) => link.href);
    assert.equal(hidden.includes("/book2"), false);
    const shown = courseNavItems(true);
    const bookAt = shown.findIndex((link) => link.href === "/book");
    assert.equal(shown[bookAt + 1]?.href, "/book2");
    assert.equal(shown[bookAt + 1]?.label, "book2");
    assert.equal(shown.filter((link) => link.label === "book2").length, 1);
  });

  it("does not treat book2 as the public book", () => {
    assert.equal(isCourseInfoCurrent("/book2", "/book"), false);
    assert.equal(isCourseInfoCurrent("/book2/ch1", "/book"), false);
    assert.equal(isCourseInfoCurrent("/book/ch1", "/book"), true);
    assert.equal(isCourseNavCurrent("/book2/ch1", "/book2"), true);
    assert.equal(isCourseNavCurrent("/book2/ch1", "/book"), false);
  });

  it("keeps table-of-contents links inside book2, including section anchors", () => {
    const chapters = chaptersForBase("/book2");
    assert.equal(chapters[0]?.href, "/book2/ch1");
    assert.equal(chapters[5]?.href, "/book2/ch6");
    assert.equal(chaptersForBase("/book")[0]?.href, "/book/ch1");
    assert.equal(rewriteBookPath("/book/ch1#intro", "/book2"), "/book2/ch1#intro");
    assert.equal(rewriteBookPath("/book/practice", "/book2"), "/book2/practice");
    assert.equal(rewriteBookPath("https://example.com/book/ch1", "/book2"), "https://example.com/book/ch1");
    const pager = chapterPager(1);
    assert.equal(pager.previous, null);
    assert.equal(pager.next?.href, "/book2/ch2");
    assert.equal(chapterPager(6).next, null);
    assert.equal(chapterPager(3).previous?.href, "/book2/ch2");
  });
});

describe("book2 chapter choice", () => {
  it("uses a saved chapter 1 draft and published chapters otherwise", () => {
    assert.deepEqual(book2View([], false), { kind: "home" });
    assert.deepEqual(book2View(["practice"], false), { kind: "practice" });
    assert.deepEqual(book2View(["ch1"], false), { kind: "published", chapter: 1 });
    assert.deepEqual(book2View(["ch1"], true), { kind: "draft", chapter: 1 });
    assert.deepEqual(book2View(["ch4"], true), { kind: "published", chapter: 4 });
    assert.deepEqual(book2View(["ch9"], true), { kind: "missing" });
    assert.deepEqual(book2View(["ch1", "extra"], true), { kind: "missing" });
  });

  it("reads a saved document without writing", async () => {
    let writes = 0;
    const doc = {
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "text", text: "saved draft marker" }] }],
    };
    const store: ChapterStore = {
      kind: "local-file",
      async get() {
        return {
          id: "chapter-1",
          revision: 3,
          doc,
          updatedAt: "2026-11-08T18:00:00.000Z",
          updatedBy: "staff@example.edu",
        };
      },
      async save() {
        writes += 1;
        return { ok: false, conflict: null };
      },
      async revisions() {
        writes += 1;
        return [];
      },
      async revision() {
        writes += 1;
        return null;
      },
    };
    const plan = { available: true as const, kind: "local-file" as const, message: "test store" };
    const saved = await loadSavedChapter1(store, plan);
    assert.equal(writes, 0);
    assert.equal(saved?.updatedAt, "2026-11-08T18:00:00.000Z");
    assert.equal(saved?.doc, doc);
    const empty = await loadSavedChapter1({ ...store, async get() { return null; } }, plan);
    assert.equal(empty, null);
    assert.equal(writes, 0);
  });
});

describe("book2 draft reader", () => {
  it("renders headings, deep-link ids, rewritten links, lists, code, figures, and demos", () => {
    const html = renderToStaticMarkup(
      createElement(DraftChapter, {
        doc: {
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 2, id: "intro" },
              content: [{ type: "text", text: "Introduction" }],
            },
            {
              type: "paragraph",
              content: [
                { type: "text", text: "Read " },
                {
                  type: "text",
                  text: "the section",
                  marks: [{ type: "link", attrs: { href: "/book/ch1#sec-1-2" } }, { type: "underline" }],
                },
                { type: "text", text: " and " },
                {
                  type: "text",
                  text: "skip this",
                  marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }],
                },
              ],
            },
            {
              type: "bulletList",
              content: [
                {
                  type: "listItem",
                  content: [{ type: "paragraph", content: [{ type: "text", text: "Install Node" }] }],
                },
              ],
            },
            {
              type: "paragraph",
              content: [{ type: "text", text: "Code stays in its own highlighted block." }],
            },
            {
              type: "bookFigure",
              attrs: { src: "/book/figures/example.png", alt: "Example figure", caption: "Figure 1", id: "fig-1" },
            },
            {
              type: "bookEmbed",
              attrs: { component: "HeadingTags", name: "Heading tags demo" },
            },
            {
              type: "paragraph",
              content: [{ type: "text", text: "Name | Purpose" }],
            },
            {
              type: "unsupported",
              attrs: { name: "PracticeCard", reason: "The practice quiz stays on the published chapter." },
            },
          ],
        },
      }),
    );

    assert.match(html, /id="intro"/);
    assert.match(html, /Introduction/);
    assert.match(html, /href="\/book2\/ch1#sec-1-2"/);
    assert.match(html, /<u>/);
    assert.doesNotMatch(html, /javascript:alert/);
    assert.match(html, /<li>[\s\S]*Install Node/);
    assert.match(html, /Code stays in its own highlighted block/);
    assert.match(html, /alt="Example figure"/);
    assert.match(html, /src="\/book\/figures\/example.png"/);
    assert.match(html, /id="fig-1"/);
    assert.match(html, /data-book-embed="HeadingTags"/);
    assert.match(html, /Heading tags demo/);
    assert.match(html, /data-unsupported="PracticeCard"/);
    assert.match(html, /practice quiz stays on the published chapter/);
    assert.doesNotMatch(html, /<table/);
    assert.match(html, /Name \| Purpose/);
    assert.ok(BOOK_EMBEDS.HeadingTags);
    const demo = renderToStaticMarkup(createElement(HeadingTags));
    assert.match(demo, /id="wd-h-tag"/);
    assert.match(demo, /Heading Tags/);
    assert.deepEqual(
      unsupportedNames({
        type: "doc",
        content: [{ type: "unsupported", attrs: { name: "PracticeCard", reason: "kept" } }],
      }),
      ["PracticeCard"],
    );
  });

  it("keeps practice chapter links in book2 and quiz pages on the public route", () => {
    const html = renderToStaticMarkup(createElement(PracticeIndex, { linkBase: "/book2" }));
    assert.match(html, /href="\/book2\/ch1#sec-1-3-13"/);
    assert.match(html, /href="\/book\/practice\/1\.lab"/);
    assert.doesNotMatch(html, /href="\/book\/ch1"/);
    const published = renderToStaticMarkup(createElement(PracticeIndex, {}));
    assert.match(published, /href="\/book\/ch1#sec-1-3-13"/);
  });
});

describe("book2 route boundaries", () => {
  it("checks staff before reading a draft and leaves the public chapter page alone", () => {
    const page = readFileSync(join(root, "app/book2/[[...path]]/page.tsx"), "utf8");
    const layout = readFileSync(join(root, "app/book2/layout.tsx"), "utf8");
    const publicChapter = readFileSync(join(root, "app/book/ch1/page.tsx"), "utf8");
    const publicLayout = readFileSync(join(root, "app/book/layout.tsx"), "utf8");
    const nav = readFileSync(join(root, "app/course-info/CourseSiteNav.tsx"), "utf8");
    const body = page.slice(page.indexOf("export default async function"));
    assert.ok(body.indexOf("if (!allowed) return null") < body.indexOf("readChapter"));
    assert.match(page, /Book2Chapter1/);
    assert.match(layout, /getStaffAccess/);
    assert.match(layout, /base="\/book2"/);
    assert.doesNotMatch(layout, /InlineEditMount/);
    assert.match(layout, /force-dynamic/);
    assert.match(publicLayout, /<BookTOC \/>/);
    assert.match(publicLayout, /InlineEditMount/);
    assert.equal(publicChapter.trim(), `import Chapter1 from "./Chapter1";

export default function Chapter1Page() {
  return <Chapter1 />;
}`);
    assert.match(nav, /useState\(false\)/);
    assert.match(nav, /\/api\/book2\/visible/);
    const visible = readFileSync(join(root, "app/api/book2/visible/route.ts"), "utf8");
    assert.match(visible, /canSeeBook2/);
    assert.doesNotMatch(visible, /readChapter|loadSavedChapter1|openChapterStore/);
    assert.match(visible, /no-store/);
    const links = readFileSync(join(root, "app/course-info/links.ts"), "utf8");
    const constant = links.slice(0, links.indexOf("export function courseNavItems"));
    assert.doesNotMatch(constant, /book2/);
  });
});
