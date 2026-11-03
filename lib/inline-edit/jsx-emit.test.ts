import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { sanitizedToJsx, sanitizedToSlideText, toJsStringLiteral } from "./jsx-emit.ts";
import { sanitizeEditedHtml } from "./sanitize.ts";

describe("HTML to JSX", () => {
  it("emits string expressions so markup and braces cannot break out", () => {
    const nodes = sanitizeEditedHtml('1 < 2 {ok} & "hi"', "jsx");
    const jsx = sanitizedToJsx(nodes, []);
    assert.equal(jsx.ok, true);
    if (jsx.ok) {
      assert.match(jsx.value, /\{"1 < 2 \{ok\} & \\"hi\\""\}/);
      assert.doesNotMatch(jsx.value, /<script/);
    }
  });

  it("nests strong and em and splices slot source in order", () => {
    const nodes = sanitizeEditedHtml(
      'Hello <strong>CSS <em>and</em></strong> <slot data-i="0"></slot> tail',
      "jsx",
    );
    const jsx = sanitizedToJsx(nodes, ['<ChapterLink to={1} />']);
    assert.equal(jsx.ok, true);
    if (jsx.ok) {
      assert.match(jsx.value, /<strong>\{"CSS "\}<em>\{"and"\}<\/em><\/strong>/);
      assert.match(jsx.value, /<ChapterLink to=\{1\} \/>/);
      assert.match(jsx.value, /\{" tail"\}/);
    }
  });

  it("refuses a dropped or repeated slot", () => {
    const missing = sanitizedToJsx(sanitizeEditedHtml("Hello", "jsx"), ["<code>x</code>"]);
    assert.equal(missing.ok, false);
    const repeated = sanitizedToJsx(
      sanitizeEditedHtml('<slot data-i="0"></slot><slot data-i="0"></slot>', "jsx"),
      ["<code>x</code>"],
    );
    assert.equal(repeated.ok, false);
  });

  it("turns slide HTML back into the deck markup dialect", () => {
    const nodes = sanitizeEditedHtml(
      'Use <strong>titles</strong> and <em>italics</em> with <code>h1</code> <a href="https://example.com">docs</a>',
      "text",
    );
    assert.equal(
      sanitizedToSlideText(nodes),
      "Use **titles** and <em>italics</em> with `h1` [docs](https://example.com)",
    );
  });

  it("quotes slide literals that contain quotes or newlines", () => {
    assert.equal(toJsStringLiteral("plain", '"'), '"plain"');
    assert.equal(toJsStringLiteral('say "hi"', '"'), '"say \\"hi\\""');
    assert.equal(toJsStringLiteral("a\nb", "`"), '"a\\nb"');
  });
});
