import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { plainText, sanitizeEditedHtml } from "./sanitize.ts";

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
});
