import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { highlightCodeToHtml } from "./highlight";
import { expandLineMarks } from "./lines";
import { lectureSlideCodeBlocks } from "@/lib/lectures/types";
import { getLectureDeck } from "@/lib/lectures/catalog";

describe("expandLineMarks", () => {
  it("expands single lines and inclusive ranges", () => {
    assert.deepEqual(
      [...expandLineMarks([1, [3, 5], 8])].sort((a, b) => a - b),
      [1, 3, 4, 5, 8],
    );
  });

  it("ignores empty and non-positive marks", () => {
    assert.equal(expandLineMarks().size, 0);
    assert.deepEqual([...expandLineMarks([0, -2, [0, 0]])], []);
  });
});

describe("highlightCodeToHtml", () => {
  it("emits syntax spans, line numbers, and added-line marks", async () => {
    const html = await highlightCodeToHtml({
      code: `export default function Home() {
  return <h1>Welcome to Web Dev</h1>;
}`,
      language: "tsx",
      lineNumbers: true,
      addedLines: [2],
    });
    assert.match(html, /<pre class="shiki/);
    assert.match(html, /data-line="1"/);
    assert.match(html, /data-line="2"/);
    assert.match(html, /class="[^"]*line-added/);
    assert.match(html, /Welcome to Web Dev/);
    assert.match(html, /<span[^>]*>export<\/span>|<span[^>]*export/);
  });

  it("falls back for unknown languages", async () => {
    const html = await highlightCodeToHtml({
      code: "hello",
      language: "not-a-real-lang",
      lineNumbers: true,
    });
    assert.match(html, /data-line="1"/);
    assert.match(html, /hello/);
  });
});

describe("lecture line marks", () => {
  it("copies slide-level added/highlight marks onto the primary block", () => {
    const slide = getLectureDeck("creating-a-nextjs-react-application")
      ?.slides.find((row) => row.id === "link-to-lab1");
    assert.ok(slide);
    const [block] = lectureSlideCodeBlocks(slide);
    assert.deepEqual(block.addedLines, [1, 5, [7, 8]]);
  });
});
