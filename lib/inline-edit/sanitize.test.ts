import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  inlineToHtml,
  isSemanticallyEmptyParagraph,
  plainText,
  sanitizeEditedHtml,
  sanitizeFreshInline,
  sanitizeGeneratedMarkup,
} from "./sanitize.ts";

describe("edited HTML sanitizer", () => {
  it("keeps text and converts b/i to strong/em", () => {
    const nodes = sanitizeEditedHtml("<b>Bold</b> and <i>italic</i>", "jsx");
    assert.deepEqual(nodes, [
      { type: "strong", children: [{ type: "text", text: "Bold" }] },
      { type: "text", text: " and " },
      { type: "em", children: [{ type: "text", text: "italic" }] },
    ]);
  });

  it("drops scripts and event handlers, and keeps slot placeholders", () => {
    const nodes = sanitizeEditedHtml(
      `<script>alert(1)</script><strong onclick="x">OK</strong><slot data-i="1"></slot><img src=x onerror="alert(1)">`,
      "jsx",
    );
    assert.deepEqual(nodes, [
      { type: "strong", children: [{ type: "text", text: "OK" }] },
      { type: "slot", index: 1 },
    ]);
    assert.equal(plainText(nodes), "OK");
  });

  it("unwraps unknown tags and decodes entities", () => {
    const nodes = sanitizeEditedHtml("<span>A &amp; B &lt;tag&gt;</span>", "jsx");
    assert.deepEqual(nodes, [{ type: "text", text: "A & B <tag>" }]);
  });

  it("maps bold and italic spans from execCommand", () => {
    const nodes = sanitizeEditedHtml(
      '<span style="font-weight: bold">Hot</span> <span style="font-style: italic">tip</span>',
      "jsx",
    );
    assert.equal(nodes[0]?.type, "strong");
    assert.equal(nodes[2]?.type, "em");
  });

  it("keeps slide code and safe links, and rejects javascript hrefs", () => {
    const nodes = sanitizeEditedHtml(
      'See <code>h1</code> and <a href="https://example.com/docs">docs</a> <a href="javascript:alert(1)">nope</a>',
      "text",
    );
    assert.equal(nodes[1]?.type, "code");
    assert.equal(nodes[3]?.type, "link");
    if (nodes[3]?.type === "link") assert.equal(nodes[3].href, "https://example.com/docs");
    assert.equal(plainText(nodes), "See h1 and docs nope");
    assert.equal(
      sanitizeEditedHtml('<a href="javascript:alert(1)">x</a>', "text").some((node) => node.type === "link"),
      false,
    );
  });

  it("drops an AI instruction and keeps the prose around it", () => {
    const nodes = sanitizeEditedHtml(
      'Before <div data-ai-instruction="1">Create a list of terms introduced in this section</div> after',
      "jsx",
    );
    assert.equal(plainText(nodes), "Before  after");
    assert.equal(inlineToHtml(nodes).includes("Create a list"), false);
  });

  it("turns a terms list into semantic items and drops scripts", () => {
    const blocks = sanitizeGeneratedMarkup(
      `<ul><li><script>alert(1)</script><strong>Internet</strong> — a network of networks.</li><li><em>HTML</em> — <code>markup</code> <a href="javascript:alert(1)">x</a></li></ul>`,
    );
    assert.equal(blocks.length, 1);
    assert.equal(blocks[0]?.kind, "ul");
    if (blocks[0]?.kind !== "ul") return;
    assert.match(blocks[0].items[0] ?? "", /<strong>Internet<\/strong>/);
    assert.doesNotMatch(blocks[0].items.join(""), /script|alert/);
    assert.match(blocks[0].items[1] ?? "", /<code>markup<\/code>/);
    assert.doesNotMatch(blocks[0].items[1] ?? "", /<a /);
  });

  it("treats spaces, breaks, and nbsp as empty, and keeps links and code", () => {
    assert.equal(isSemanticallyEmptyParagraph(""), true);
    assert.equal(isSemanticallyEmptyParagraph("   "), true);
    assert.equal(isSemanticallyEmptyParagraph("<br>"), true);
    assert.equal(isSemanticallyEmptyParagraph("&nbsp;"), true);
    assert.equal(isSemanticallyEmptyParagraph("<em> &nbsp; </em>"), true);
    assert.equal(isSemanticallyEmptyParagraph("<strong>Term</strong>"), false);
    assert.equal(isSemanticallyEmptyParagraph('<code></code>'), false);
    assert.equal(isSemanticallyEmptyParagraph('<a href="/book/terms/internet"></a>'), false);
    assert.equal(isSemanticallyEmptyParagraph('<slot data-i="0"></slot>'), false);
    assert.equal(
      isSemanticallyEmptyParagraph(
        '<div data-ai-instruction="1">Create a list of terms</div>',
      ),
      true,
    );
  });

  it("refuses a nested block inside a new paragraph", () => {
    const nested = sanitizeFreshInline("<ul><li>Term</li></ul>");
    assert.equal(nested.ok, false);
    const prose = sanitizeFreshInline("Create a list of terms introduced in this section");
    assert.equal(prose.ok, true);
    if (prose.ok) assert.match(prose.html, /Create a list of terms/);
  });
});
