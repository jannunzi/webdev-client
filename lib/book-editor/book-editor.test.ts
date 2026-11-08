import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import type { JSONContent } from "@tiptap/core";
import { blocksToNodes, parseInline } from "./ai-insert.ts";
import { bracketInstruction, bracketSpot } from "./brackets.ts";
import { extractChapter1 } from "./extract.ts";
import { handleChapterGet, handleChapterPut, handleChapterReset, handleRevisionRestore, readChapter } from "./handle.ts";
import { chapter1Seed } from "./seed.ts";
import { validateChapterDoc } from "./schema.ts";
import { createFileStore, storagePlan } from "./store.ts";

const staff = { email: "jannunzi@gmail.com" };
const outsider = { error: "Staff only.", status: 403 as const };
const plan = storagePlan({ NODE_ENV: "test", MONGODB_URI: "" });

function paragraph(text: string): JSONContent {
  return { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text }] }] };
}

describe("chapter editor storage", () => {
  it("uses Mongo in production only when configured, and a file store in development", () => {
    assert.equal(storagePlan({ NODE_ENV: "production" }).kind, "unavailable");
    assert.match(storagePlan({ NODE_ENV: "production" }).message, /MONGODB_URI/);
    assert.equal(storagePlan({ NODE_ENV: "production", MONGODB_URI: "mongodb://example/web-dev" }).kind, "mongo");
    assert.equal(storagePlan({ NODE_ENV: "development" }).kind, "local-file");
    assert.match(storagePlan({ NODE_ENV: "development" }).message, /Development file store/);
  });

  it("saves, reloads, rejects a stale revision, and restores", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "book-editor-"));
    const store = createFileStore(dir);
    const embeds = new Set(chapter1Seed().embeds.map((item) => item.component));
    assert.equal(await store.get("chapter-1"), null);
    const first = await store.save({
      id: "chapter-1",
      doc: paragraph("Visible chapter text"),
      expectedRevision: 0,
      email: staff.email,
    });
    assert.equal(first.ok && first.record.revision, 1);
    const reloaded = createFileStore(dir);
    assert.equal((await reloaded.get("chapter-1"))?.doc.content?.[0]?.content?.[0]?.text, "Visible chapter text");
    const stale = await reloaded.save({
      id: "chapter-1",
      doc: paragraph("Lost"),
      expectedRevision: 0,
      email: staff.email,
    });
    assert.equal(stale.ok, false);
    const second = await reloaded.save({
      id: "chapter-1",
      doc: paragraph("Edited paragraph"),
      expectedRevision: 1,
      email: staff.email,
    });
    assert.equal(second.ok && second.record.revision, 2);
    const snapshot = await reloaded.revision("chapter-1", 1);
    assert.equal(snapshot?.doc.content?.[0]?.content?.[0]?.text, "Visible chapter text");
    const request = new Request("http://local/revisions", {
      method: "POST",
      body: JSON.stringify({ expectedRevision: 2, revision: 1 }),
    });
    const response = await handleRevisionRestore(request, { staff, store: reloaded, plan });
    assert.equal(response.status, 200);
    const body = (await response.json()) as { revision: number; doc: JSONContent };
    assert.equal(body.revision, 3);
    assert.equal(body.doc.content?.[0]?.content?.[0]?.text, "Visible chapter text");
    assert.equal(validateChapterDoc(body.doc, embeds).ok, true);
  });

  it("does not write the seed on read and rejects anonymous, script, and unknown demo saves", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "book-editor-"));
    const store = createFileStore(dir);
    const loaded = await readChapter(store, plan);
    assert.equal(loaded.persisted, false);
    assert.equal(loaded.revision, 0);
    assert.equal(fs.readdirSync(dir).length, 0);
    const denied = await handleChapterPut(
      new Request("http://local", { method: "PUT", body: JSON.stringify({ expectedRevision: 0, doc: paragraph("x") }) }),
      { staff: outsider, store, plan },
    );
    assert.equal(denied.status, 403);
    const anonymous = await handleChapterGet({ staff: { error: "Staff only.", status: 401 }, store, plan });
    assert.equal(anonymous.status, 401);
    const script = await handleChapterPut(
      new Request("http://local", {
        method: "PUT",
        body: JSON.stringify({
          expectedRevision: 0,
          doc: { type: "doc", content: [{ type: "script", content: [{ type: "text", text: "alert(1)" }] }] },
        }),
      }),
      { staff, store, plan },
    );
    assert.equal(script.status, 400);
    const embed = await handleChapterPut(
      new Request("http://local", {
        method: "PUT",
        body: JSON.stringify({
          expectedRevision: 0,
          doc: { type: "doc", content: [{ type: "bookEmbed", attrs: { component: "NotADemo", name: "", file: "" } }] },
        }),
      }),
      { staff, store, plan },
    );
    assert.equal(embed.status, 400);
    const link = await handleChapterPut(
      new Request("http://local", {
        method: "PUT",
        body: JSON.stringify({
          expectedRevision: 0,
          doc: {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "x", marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }] }],
              },
            ],
          },
        }),
      }),
      { staff, store, plan },
    );
    assert.equal(link.status, 400);
    assert.equal(fs.existsSync(path.join(dir, "chapter-1.json")), false);
    const unavailable = await handleChapterPut(
      new Request("http://local", { method: "PUT", body: JSON.stringify({ expectedRevision: 0, doc: paragraph("x") }) }),
      { staff, store: null, plan: storagePlan({ NODE_ENV: "production" }) },
    );
    assert.equal(unavailable.status, 503);
    const saved = await handleChapterPut(
      new Request("http://local", { method: "PUT", body: JSON.stringify({ expectedRevision: 0, doc: paragraph("Kept") }) }),
      { staff, store, plan },
    );
    assert.equal(saved.status, 200);
    const again = await readChapter(createFileStore(dir), plan);
    assert.equal(again.persisted, true);
    assert.equal(again.doc.content?.[0]?.content?.[0]?.text, "Kept");
  });

  it("saves bold, italic, and underline together and reloads headings and code", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "book-editor-"));
    const store = createFileStore(dir);
    const embeds = new Set<string>();
    const doc: JSONContent = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Styled",
              marks: [{ type: "bold" }, { type: "italic" }, { type: "underline" }],
            },
            {
              type: "text",
              text: " link",
              marks: [{ type: "link", attrs: { href: "/book/ch1" } }, { type: "italic" }],
            },
            { type: "text", text: " code", marks: [{ type: "code" }] },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2, id: "sec-keep" },
          content: [{ type: "text", text: "Kept anchor" }],
        },
        {
          type: "codeBlock",
          attrs: { language: "text" },
          content: [{ type: "text", text: "array[0] = 1" }],
        },
      ],
    };
    assert.equal(validateChapterDoc(doc, embeds).ok, true);
    const strike = validateChapterDoc(
      {
        type: "doc",
        content: [{ type: "paragraph", content: [{ type: "text", text: "no", marks: [{ type: "strike" }] }] }],
      },
      embeds,
    );
    assert.equal(strike.ok, false);
    if (!strike.ok) assert.match(strike.error, /unsupported mark/);
    const response = await handleChapterPut(
      new Request("http://local", { method: "PUT", body: JSON.stringify({ expectedRevision: 0, doc }) }),
      { staff, store, plan },
    );
    assert.equal(response.status, 200);
    const reloaded = await readChapter(createFileStore(dir), plan);
    const saved = JSON.stringify(reloaded.doc);
    assert.match(saved, /underline/);
    assert.match(saved, /bold/);
    assert.match(saved, /italic/);
    assert.match(saved, /sec-keep/);
    assert.match(saved, /codeBlock/);
    assert.match(saved, /array\[0\]/);
    const failed = await handleChapterPut(
      new Request("http://local", {
        method: "PUT",
        body: JSON.stringify({
          expectedRevision: 1,
          doc: {
            type: "doc",
            content: [{ type: "paragraph", content: [{ type: "text", text: "wipe", marks: [{ type: "strike" }] }] }],
          },
        }),
      }),
      { staff, store: createFileStore(dir), plan },
    );
    assert.equal(failed.status, 400);
    const kept = await readChapter(createFileStore(dir), plan);
    assert.match(JSON.stringify(kept.doc), /Styled/);
    assert.doesNotMatch(JSON.stringify(kept.doc), /wipe/);
  });
});

describe("chapter reset", () => {
  it("archives the current draft and replaces only that document with the published chapter", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "book-editor-reset-"));
    const store = createFileStore(dir);
    const oldDoc = paragraph("Keep this backup");
    await store.save({ id: "chapter-1", doc: oldDoc, expectedRevision: 0, email: staff.email });
    const response = await handleChapterReset({ staff, store, plan });
    assert.equal(response.status, 200);
    const body = await response.json() as { backupRevision: number | null; revision: number; doc: JSONContent };
    assert.equal(body.backupRevision, 1);
    assert.equal(body.revision, 2);
    const backup = await store.revision("chapter-1", 1);
    assert.equal(backup?.doc.content?.[0]?.content?.[0]?.text, "Keep this backup");
    const current = await store.get("chapter-1");
    const json = JSON.stringify(current?.doc);
    assert.match(json, /"type":"bookSlides"/);
    assert.match(json, /"type":"bookTable"/);
    assert.match(json, /"type":"bookPractice"/);
    assert.match(json, /"id":"intro"/);
    const code = current?.doc.content?.find((node) => node.type === "codeBlock" && typeof node.content?.[0]?.text === "string" && node.content[0].text.includes("\n"));
    assert.ok(code);
    assert.equal(typeof code?.attrs?.language, "string");
    assert.equal(code?.content?.[0]?.text, code?.content?.[0]?.text?.replace(/^\d+\s/, ""));
    assert.doesNotMatch(json, /Keep this backup/);
    assert.equal(fs.existsSync(path.join(process.cwd(), "app/book/ch1/Chapter1.tsx")), true);
  });
});

describe("chapter editor content", () => {
  it("imports Chapter 1 prose, a glossary link, and a live demo", () => {
    const seed = chapter1Seed();
    const fresh = extractChapter1();
    assert.equal(JSON.stringify(seed.inventory), JSON.stringify(fresh.inventory));
    assert.ok(seed.inventory.headings >= 60);
    assert.ok(seed.inventory.embeds >= 40);
    assert.ok(seed.embeds.some((item) => item.component === "HeadingTags"));
    assert.ok(seed.embeds.some((item) => item.component === "AiCourseBuilderDemo"));
    const json = JSON.stringify(seed.doc);
    assert.match(json, /\/book\/terms\/internet/);
    assert.match(json, /"id":"intro"/);
    assert.doesNotMatch(json, /<script|data-inline-ghost|data-ai-pending/);
    assert.ok(json.includes("\"type\":\"bookPractice\""));
    assert.ok(json.includes("\"type\":\"bookSlides\""));
    assert.ok(json.includes("\"type\":\"bookTable\""));
  });

  it("keeps literal brackets and turns generated html into paragraphs and lists", () => {
    const text = "See [1] and \\[kept\\] [Name the steps.]";
    const caret = text.indexOf("Name");
    assert.equal(bracketInstruction(text, caret), "Name the steps.");
    assert.equal(bracketInstruction("array[0] = 1", 7), null);
    const pancakes = "[make a list of how to make pancakes]";
    assert.equal(bracketInstruction(pancakes, pancakes.length), "make a list of how to make pancakes");
    assert.equal(bracketInstruction("See [1] later", 6), null);
    const ready = bracketSpot(pancakes, pancakes.length);
    assert.equal(ready?.state, "ready");
    if (ready?.state === "ready") assert.equal(ready.prompt, "make a list of how to make pancakes");
    const unfinished = "Before [make a list of how";
    assert.equal(bracketSpot(unfinished, unfinished.length)?.state, "composing");
    assert.equal(bracketInstruction(unfinished, unfinished.length), null);
    assert.equal(bracketSpot("See [1] later", 6), null);
    assert.equal(bracketSpot("See [1]", 5), null);
    assert.equal(bracketSpot("array[0] = 1", 7), null);
    const escaped = "Keep \\[make a list of how to make pancakes\\]";
    assert.equal(bracketSpot(escaped, escaped.indexOf("list")), null);
    assert.equal(bracketSpot(pancakes, pancakes.length, true), null);
    const wrapped = `Keep ${pancakes} after`;
    assert.equal(bracketSpot(wrapped, wrapped.indexOf("after")), null);
    assert.equal(bracketSpot(wrapped, `Keep ${pancakes}`.length)?.state, "ready");
    const nodes = blocksToNodes([
      { kind: "p", html: "<p>Hello <strong>world</strong></p>" },
      { kind: "ol", items: ["<strong>Requirements</strong> — name the work.", "<script>alert(1)</script>Design"] },
    ]);
    const json = JSON.stringify(nodes);
    assert.match(json, /orderedList/);
    assert.match(json, /Requirements/);
    assert.doesNotMatch(json, /script|alert/);
    const link = parseInline('<a href="javascript:alert(1)">x</a>');
    assert.equal(JSON.stringify(link).includes("javascript"), false);
  });
});
