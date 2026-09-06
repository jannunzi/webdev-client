import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getTerm } from "../terms/termRegistry.ts";
import { termPageHref, termSlug } from "../terms/termSlug.ts";
import { chapterEndToc, endMatterTermName } from "./types.ts";
import { AI, DESIGN_AI_TOOLS, TOOL } from "./catalog.ts";
import { ch1EndMatter } from "../ch1/end-matter.ts";
import { ch2EndMatter } from "../ch2/end-matter.ts";
import { ch3EndMatter } from "../ch3/end-matter.ts";
import { ch4EndMatter } from "../ch4/end-matter.ts";
import { ch5EndMatter } from "../ch5/end-matter.ts";
import { ch6EndMatter } from "../ch6/end-matter.ts";

const CHAPTERS = [
  ch1EndMatter,
  ch2EndMatter,
  ch3EndMatter,
  ch4EndMatter,
  ch5EndMatter,
  ch6EndMatter,
];

describe("chapter end matter", () => {
  it("covers chapters 1–6 with numbered References, Tools, and AI Tools", () => {
    assert.deepEqual(
      CHAPTERS.map((chapter) => chapter.chapter),
      [1, 2, 3, 4, 5, 6],
    );
    for (const chapter of CHAPTERS) {
      const toc = chapterEndToc(chapter);
      assert.equal(toc.length, 3);
      assert.match(chapter.references.title, /References$/);
      assert.match(chapter.tools.title, /Tools$/);
      assert.match(chapter.aiTools.title, /AI Tools$/);
      assert.equal(toc[0]?.id, chapter.references.id);
      assert.equal(toc[1]?.id, chapter.tools.id);
      assert.equal(toc[2]?.id, chapter.aiTools.id);
    }
    assert.equal(ch1EndMatter.references.id, "sec-1-8");
    assert.equal(ch2EndMatter.references.id, "sec-2-6");
    assert.equal(ch3EndMatter.references.id, "sec-3-11");
    assert.equal(ch4EndMatter.references.id, "sec-4-13");
    assert.equal(ch5EndMatter.references.id, "sec-5-8");
    assert.equal(ch6EndMatter.references.id, "sec-6-6");
  });

  it("resolves every reference slug in the term registry", () => {
    for (const chapter of CHAPTERS) {
      assert.ok(chapter.references.items.length > 0, `ch${chapter.chapter} terms`);
      for (const slug of chapter.references.items) {
        const entry = getTerm(slug);
        assert.ok(entry, `missing term for slug "${slug}" in ch${chapter.chapter}`);
        assert.equal(termSlug(entry.term), slug);
      }
    }
  });

  it("keeps chapter term lists distinct instead of dumping the glossary", () => {
    const fingerprints = CHAPTERS.map((chapter) =>
      chapter.references.items.slice().sort().join("|"),
    );
    assert.equal(new Set(fingerprints).size, fingerprints.length);
    assert.ok(ch1EndMatter.references.items.includes("html"));
    assert.ok(!ch1EndMatter.references.items.includes("usestate"));
    assert.ok(ch2EndMatter.references.items.includes("tailwind-css"));
    assert.ok(!ch2EndMatter.references.items.includes("mongoose"));
    assert.ok(ch3EndMatter.references.items.includes("javascript"));
    assert.ok(!ch3EndMatter.references.items.includes("express-js"));
    assert.ok(ch4EndMatter.references.items.includes("zustand"));
    assert.ok(!ch4EndMatter.references.items.includes("mongodb-atlas"));
    assert.ok(ch5EndMatter.references.items.includes("express-js"));
    assert.ok(!ch5EndMatter.references.items.includes("mongoose"));
    assert.ok(ch6EndMatter.references.items.includes("mongoose"));
    assert.ok(!ch6EndMatter.references.items.includes("usestate"));
  });

  it("uses https official URLs and one-sentence blurbs on Tools and AI Tools", () => {
    for (const chapter of CHAPTERS) {
      assert.ok(chapter.tools.items.length > 0);
      assert.ok(chapter.aiTools.items.length > 0);
      for (const item of [...chapter.tools.items, ...chapter.aiTools.items]) {
        assert.match(item.href, /^https:\/\//);
        assert.ok(item.description && item.description.length > 20);
        assert.ok(!item.description.includes("\n"));
      }
    }
    const designHrefs = DESIGN_AI_TOOLS.map((item) => item.href);
    for (const href of designHrefs) {
      assert.ok(ch1EndMatter.aiTools.items.some((item) => item.href === href));
      assert.ok(ch2EndMatter.aiTools.items.some((item) => item.href === href));
    }
    assert.ok(
      ch6EndMatter.aiTools.items.some((item) =>
        item.href.includes("mongodb.com/docs/compass"),
      ),
    );
  });

  it("resolves every Tools and AI Tools entry to a registered term page", () => {
    for (const chapter of CHAPTERS) {
      for (const item of [...chapter.tools.items, ...chapter.aiTools.items]) {
        const label = endMatterTermName(item);
        const slug = termSlug(label);
        const entry = getTerm(slug);
        assert.ok(
          entry,
          `missing term for "${item.name}" (slug "${slug}") in ch${chapter.chapter}`,
        );
        const href = termPageHref(item.href, label, entry, { term: item.term });
        assert.match(href, new RegExp(`^/book/terms/${slug}(?:\\?|$)`));
      }
    }
  });

  it("reuses existing term slugs instead of forking CSS, JS, or Route Handlers", () => {
    assert.equal(termSlug(endMatterTermName(TOOL.css)), "css");
    assert.equal(termSlug(endMatterTermName(TOOL.javascript)), "javascript");
    assert.equal(termSlug(endMatterTermName(TOOL.routeHandlers)), "route-handlers");
    assert.equal(termSlug(endMatterTermName(TOOL.react)), "react");
    assert.equal(termSlug(endMatterTermName(TOOL.next)), "next-js");
    assert.equal(termSlug(endMatterTermName(TOOL.node)), "node-js");
    assert.equal(termSlug(endMatterTermName(TOOL.mongodb)), "mongodb");
    assert.equal(termSlug(endMatterTermName(AI.cursor)), "cursor");
    assert.equal(termSlug(endMatterTermName(AI.claude)), "claude");
    assert.equal(endMatterTermName(TOOL.css), "CSS");
    assert.equal(endMatterTermName(TOOL.javascript), "JavaScript");
    assert.equal(endMatterTermName(TOOL.routeHandlers), "Route Handlers");
  });
});
