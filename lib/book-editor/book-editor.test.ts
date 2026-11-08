import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import type { JSONContent } from "@tiptap/core";
import { blocksToNodes, parseInline } from "./ai-insert.ts";
import { bracketInstruction } from "./brackets.ts";
import { extractChapter1 } from "./extract.ts";
import { handleChapterGet, handleChapterPut, handleRevisionRestore, readChapter } from "./handle.ts";
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
    assert.ok(seed.inventory.unsupported.some((item) => item.name === "PracticeCard"));
  });

  it("keeps literal brackets and turns generated html into paragraphs and lists", () => {
    const text = "See [1] and \\[kept\\] [Name the steps.]";
    const caret = text.indexOf("Name");
    assert.equal(bracketInstruction(text, caret), "Name the steps.");
    assert.equal(bracketInstruction("array[0] = 1", 7), null);
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
