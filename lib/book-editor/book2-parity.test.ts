import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import BookSectionSlidesLink from "../../app/book/components/BookSectionSlidesLink";
import PracticeCard from "../../app/book/components/PracticeCard";
import { PracticeQuizArticle } from "../../app/book/practice/[quizId]/page";
import DraftChapter from "../../app/book2/draft-chapter";
import { PublishedTable } from "../../app/book2/source-blocks";
import { getPracticeQuiz } from "../../app/book/quizzes/registry";
import { composeDraft } from "./book2-compose";
import { nextChapterEdit, UNSAVED_EDIT_MESSAGE } from "./book2-edit";
import { book2Destination, book2FixtureEnabled, book2View } from "./book2-path";
import { handleChapterPut } from "./handle";
import { loadSavedChapter1 } from "./book2-load";
import type { ChapterStore } from "./store";
import { extractChapter1 } from "./extract";
import { chapter1Supplements, type Supplement } from "./source-catalog";
import type { JSONContent } from "@tiptap/core";

const root = process.cwd();

function paragraph(text: string): JSONContent {
  return { type: "paragraph", content: [{ type: "text", text }] };
}

function heading(id: string, text: string): JSONContent {
  return { type: "heading", attrs: { level: 2, id }, content: [{ type: "text", text }] };
}

describe("book2 internal routes", () => {
  it("keeps chapter anchors and practice inside book2 and leaves other urls alone", () => {
    assert.equal(book2Destination("/book/ch1#sec-1-3-13"), "/book2/ch1#sec-1-3-13");
    assert.equal(book2Destination("/book/ch3#intro"), "/book2/ch3#intro");
    assert.equal(book2Destination("/book/practice/1.lab"), "/book2/practice/1.lab");
    assert.equal(book2Destination("/book"), "/book2");
    assert.equal(book2Destination("/book2/ch1#intro"), null);
    assert.equal(book2Destination("/book/terms/html"), null);
    assert.equal(book2Destination("/slides"), null);
    assert.equal(book2Destination("javascript:alert(1)"), null);
    assert.equal(book2Destination("//evil.example/book/ch1"), null);
    assert.equal(book2Destination("https://example.com/book/ch1"), null);
    assert.deepEqual(book2View(["practice", "1.lab"], false), { kind: "practice-quiz", quizId: "1.lab" });
    assert.deepEqual(book2View(["ch1", "extra"], true), { kind: "missing" });
    assert.equal(book2FixtureEnabled({ NODE_ENV: "production", BOOK2_FIXTURE: "1" }), false);
    assert.equal(book2FixtureEnabled({ NODE_ENV: "development", BOOK2_FIXTURE: "1" }), true);
    assert.equal(book2FixtureEnabled({ NODE_ENV: "development" }), false);
  });

  it("renders practice quiz chapter links on book2", () => {
    const quiz = getPracticeQuiz("1.lab");
    assert.ok(quiz);
    const html = renderToStaticMarkup(createElement(PracticeQuizArticle, { quiz, linkBase: "/book2" }));
    assert.match(html, /href="\/book2\/ch1#sec-1-3-13"/);
    assert.match(html, /href="\/book2\/practice"/);
    assert.doesNotMatch(html, /href="\/book\/ch1/);
    const published = renderToStaticMarkup(createElement(PracticeQuizArticle, { quiz }));
    assert.match(published, /href="\/book\/ch1#sec-1-3-13"/);
  });
});

describe("book2 source blocks beside a draft", () => {
  const supplements: Supplement[] = [
    { id: "slides-intro", kind: "slides", sectionId: "intro" },
    { id: "videos-fields", kind: "videos", sectionId: "sec-1-3-6-1" },
    {
      id: "table-grades",
      kind: "table",
      sectionId: "sec-1-3-4",
      rows: [
        [{ text: "Quiz" }, { text: "Topic" }],
        [{ text: "Q1" }, { text: "HTML" }],
      ],
      lines: ["Quiz | Topic", "Q1 | HTML"],
    },
    { id: "practice-lab", kind: "practice", sectionId: "sec-1-3-13", quizId: "1.lab" },
    { id: "async-step", kind: "async-demo", sectionId: "sec-1-4-7", component: "AssignmentsStep" },
  ];

  it("replaces an unchanged flattened table and keeps an edited one", () => {
    const matched = {
      type: "doc",
      content: [
        heading("sec-1-3-4", "Tables"),
        paragraph("Quiz | Topic"),
        paragraph("Q1 | HTML"),
        paragraph("A sentence after the table."),
      ],
    };
    const before = JSON.stringify(matched);
    const pieces = composeDraft(matched, supplements);
    assert.equal(JSON.stringify(matched), before);
    assert.equal(pieces.some((piece) => piece.kind === "node" && paragraphText(piece) === "Quiz | Topic"), false);
    const table = pieces.find((piece) => piece.kind === "supplement" && piece.item.id === "table-grades");
    assert.ok(table && table.kind === "supplement" && table.placement === "matched");
    assert.equal(pieces.some((piece) => piece.kind === "node" && paragraphText(piece) === "A sentence after the table."), true);

    const edited = {
      type: "doc",
      content: [
        heading("sec-1-3-4", "Tables"),
        paragraph("Quiz | Topic"),
        paragraph("Q1 | HTML edited"),
      ],
    };
    const editedPieces = composeDraft(edited, supplements);
    assert.equal(
      editedPieces.some((piece) => piece.kind === "node" && paragraphText(piece) === "Q1 | HTML edited"),
      true,
    );
    const beside = editedPieces.find((piece) => piece.kind === "supplement" && piece.item.id === "table-grades");
    assert.ok(beside && beside.kind === "supplement" && beside.placement === "section");
    const headingAt = editedPieces.findIndex((piece) => piece.kind === "node" && piece.node.type === "heading");
    const tableAt = editedPieces.findIndex((piece) => piece.kind === "supplement" && piece.item.id === "table-grades");
    assert.equal(tableAt, headingAt + 1);
  });

  it("puts slide and video links on their headings and keeps removed sections in an appendix", () => {
    const pieces = composeDraft(
      {
        type: "doc",
        content: [heading("intro", "Introduction"), paragraph("Draft prose.")],
      },
      supplements,
    );
    const slidesAt = pieces.findIndex((piece) => piece.kind === "supplement" && piece.item.id === "slides-intro");
    assert.equal(slidesAt, 1);
    const appendix = pieces.filter((piece) => piece.kind === "supplement" && piece.placement === "appendix");
    assert.ok(appendix.some((piece) => piece.kind === "supplement" && piece.item.id === "videos-fields"));
    assert.equal(
      pieces.some((piece) => piece.kind === "node" && paragraphText(piece) === "Draft prose."),
      true,
    );
  });

  it("replaces practice and async placeholders with the published blocks", () => {
    const pieces = composeDraft(
      {
        type: "doc",
        content: [
          {
            type: "unsupported",
            attrs: { name: "PracticeCard", reason: "The practice quiz stays on the published chapter." },
          },
          {
            type: "unsupported",
            attrs: { name: "AssignmentsStep", reason: "async" },
          },
          {
            type: "unsupported",
            attrs: { name: "Mystery", reason: "keep this gap" },
          },
        ],
      },
      supplements,
    );
    assert.equal(pieces.some((piece) => piece.kind === "node" && piece.node.attrs?.name === "PracticeCard"), false);
    assert.equal(pieces.some((piece) => piece.kind === "node" && piece.node.attrs?.name === "AssignmentsStep"), false);
    assert.equal(pieces.some((piece) => piece.kind === "node" && piece.node.attrs?.name === "Mystery"), true);
    assert.ok(pieces.some((piece) => piece.kind === "supplement" && piece.item.kind === "practice" && piece.placement === "matched"));
    assert.ok(pieces.some((piece) => piece.kind === "supplement" && piece.item.kind === "async-demo" && piece.placement === "matched"));
  });

  it("renders the real slide link, practice card, and table cells", () => {
    const slides = renderToStaticMarkup(createElement(BookSectionSlidesLink, { sectionId: "intro" }));
    assert.match(slides, /Slides/);
    assert.match(slides, /href="\/slides/);
    const card = renderToStaticMarkup(createElement(PracticeCard, { quizId: "1.lab" }));
    assert.match(card, /Open practice quiz/);
    assert.match(card, /href="\/book\/practice\/1\.lab"/);
    const table = renderToStaticMarkup(
      createElement(PublishedTable, {
        rows: [
          [{ text: "Quiz" }, { text: "Topic" }],
          [{ text: "Q1" }, { text: "HTML" }],
        ],
      }),
    );
    assert.match(table, /<table/);
    assert.match(table, /<th[^>]*>Quiz/);
    assert.match(table, /<td[^>]*>HTML/);
  });
});

describe("chapter 1 source catalog", () => {
  it("finds slides, videos, tables, the practice card, and the async demos from the chapter files", () => {
    const items = chapter1Supplements(root);
    assert.ok(items.some((item) => item.kind === "slides" && item.sectionId === "intro"));
    assert.ok(items.some((item) => item.kind === "videos" && item.sectionId === "sec-1-3-6-1"));
    assert.ok(items.some((item) => item.kind === "practice" && item.quizId === "1.lab"));
    assert.ok(items.some((item) => item.kind === "async-demo" && item.component === "AssignmentsStep"));
    assert.ok(items.some((item) => item.kind === "async-demo" && item.component === "AssignmentsFinished"));
    const tables = items.filter((item) => item.kind === "table");
    assert.ok(tables.length >= 2);
    const doc = extractChapter1(root).doc;
    const paragraphs = new Set(paragraphLines(doc));
    const sample = tables.find((item) => item.kind === "table" && item.lines.every((line) => paragraphs.has(line)));
    assert.ok(sample, "a published table's flattened rows are present in the extracted draft");
  });
});

describe("book2 chapter editing", () => {
  it("starts read-only and blocks Done until a save", () => {
    const reading = { mode: "reading" as const, dirty: false };
    const editing = nextChapterEdit(reading, "edit");
    assert.equal(editing.blocked, false);
    assert.deepEqual(editing.state, { mode: "editing", dirty: false });
    const dirty = nextChapterEdit(editing.state, "change");
    assert.deepEqual(dirty.state, { mode: "editing", dirty: true });
    const blocked = nextChapterEdit(dirty.state, "done");
    assert.equal(blocked.blocked, true);
    assert.equal(blocked.state.mode, "editing");
    const navigate = nextChapterEdit(dirty.state, "navigate");
    assert.equal(navigate.blocked, true);
    const saved = nextChapterEdit(dirty.state, "save");
    assert.deepEqual(saved.state, { mode: "editing", dirty: false });
    const done = nextChapterEdit(saved.state, "done");
    assert.equal(done.blocked, false);
    assert.deepEqual(done.state, { mode: "reading", dirty: false });
    assert.match(UNSAVED_EDIT_MESSAGE, /Save the chapter before leaving/);
  });

  it("saves through the shared chapter API and the next read sees it", async () => {
    let record: Awaited<ReturnType<ChapterStore["get"]>> = null;
    let saves = 0;
    const store: ChapterStore = {
      kind: "local-file",
      async get() {
        return record;
      },
      async save(input) {
        saves += 1;
        if ((record?.revision ?? 0) !== input.expectedRevision) return { ok: false, conflict: record };
        record = {
          id: input.id,
          revision: input.expectedRevision + 1,
          doc: input.doc,
          updatedAt: "2026-11-08T21:00:00.000Z",
          updatedBy: input.email,
        };
        return { ok: true, record };
      },
      async revisions() {
        return [];
      },
      async revision() {
        return null;
      },
    };
    const plan = { available: true as const, kind: "local-file" as const, message: "memory fixture" };
    const doc = {
      type: "doc",
      content: [{ type: "codeBlock", content: [{ type: "text", text: "const visible = \"code\";" }] }],
    };
    const response = await handleChapterPut(
      new Request("http://fixture.local/api/book-editor/chapter-1", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ expectedRevision: 0, doc }),
      }),
      { staff: { email: "staff@example.edu" }, store, plan },
    );
    assert.equal(response.status, 200);
    const loaded = await loadSavedChapter1(store, plan);
    assert.equal(saves, 1);
    assert.equal(loaded?.doc.content?.[0]?.content?.[0]?.text, "const visible = \"code\";");
    const html = renderToStaticMarkup(createElement(DraftChapter, { doc: loaded!.doc }));
    assert.match(html, /book-plain-code/);
    assert.match(html, /const visible = &quot;code&quot;|const visible = "code"/);
    assert.doesNotMatch(html, /book-code-block-body/);
  });
});

describe("book2 boundaries", () => {
  it("keeps the staff gate, the read-only preview, and the fixture off production", () => {
    const page = readFileSync(join(root, "app/book2/[[...path]]/page.tsx"), "utf8");
    const body = page.slice(page.indexOf("export default async function"));
    assert.ok(body.indexOf("if (!allowed) return null") < body.indexOf("readChapter"));
    assert.match(page, /Book2Chapter1/);
    assert.match(page, /composeDraft/);
    const afterPublished = page.slice(page.indexOf("const Published"));
    assert.doesNotMatch(afterPublished, /Book2Chapter1/);
    const editor = readFileSync(join(root, "app/book-editor/chapter-1/editor.tsx"), "utf8");
    assert.match(editor, /if \(manualSaveRef\.current\) return/);
    assert.match(editor, /className="book-editor-save"/);
    const editBar = readFileSync(join(root, "app/book2/chapter1-edit.tsx"), "utf8");
    assert.match(editBar, /book2-edit-bar/);
    assert.match(editBar, /aria-label="Edit Chapter 1"/);
    assert.match(editBar, /ml-auto/);
    assert.doesNotMatch(page, /\.save\(/);
    const fixture = readFileSync(join(root, "app/book2-fixture/page.tsx"), "utf8");
    assert.match(fixture, /book2FixtureEnabled/);
    assert.match(fixture, /notFound/);
    assert.doesNotMatch(fixture, /loadSavedChapter1|openChapterStore/);
    const layout = readFileSync(join(root, "app/book2/layout.tsx"), "utf8");
    assert.match(layout, /Book2Links/);
    assert.match(layout, /force-dynamic/);
    const publicChapter = readFileSync(join(root, "app/book/ch1/page.tsx"), "utf8");
    assert.equal(publicChapter.includes("book2"), false);
  });
});

function paragraphText(piece: { kind: string; node?: JSONContent }): string | null {
  if (piece.kind !== "node" || piece.node?.type !== "paragraph") return null;
  return (piece.node.content ?? []).map((child) => child.text ?? "").join("");
}

function paragraphLines(node: JSONContent): string[] {
  const lines: string[] = [];
  if (node.type === "paragraph") {
    const text = (node.content ?? []).map((child) => (child.type === "text" ? child.text ?? "" : "")).join("");
    const normalized = text.replace(/\s+/g, " ").trim();
    if (normalized) lines.push(normalized);
  }
  for (const child of node.content ?? []) lines.push(...paragraphLines(child));
  return lines;
}
