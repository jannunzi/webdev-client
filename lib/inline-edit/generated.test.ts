import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  blocksFromModelText,
  insertionObjectToHtml,
  instructionRequestsList,
} from "./generated.ts";

describe("instruction blocks", () => {
  it("does not treat ordinary prose as a list instruction", () => {
    assert.equal(instructionRequestsList("The Internet began as a research network."), false);
    assert.equal(
      instructionRequestsList("Create a list of terms introduced in this section"),
      true,
    );
  });

  it("turns markdown terms into a semantic list and drops scripts", () => {
    const blocks = blocksFromModelText(`- **Internet** — a global network
- **HTML** — the markup language
<script>alert(1)</script>`);
    assert.equal(blocks.length, 1);
    assert.equal(blocks[0]?.kind, "ul");
    if (blocks[0]?.kind !== "ul") return;
    assert.equal(blocks[0].items.length, 2);
    assert.match(blocks[0].items[0] ?? "", /^<strong>Internet<\/strong>/);
    assert.match(blocks[0].items[1] ?? "", /<strong>HTML<\/strong>/);
    assert.doesNotMatch(blocks[0].items.join("\n"), /script|alert/);
  });

  it("keeps an HTML list and restores a glossary link from context", () => {
    const blocks = blocksFromModelText(
      "<ul><li><strong>Internet</strong> — see ⟦0⟧.</li></ul>",
      ['<a href="/book/terms/internet">Internet</a>'],
    );
    assert.equal(blocks[0]?.kind, "ul");
    if (blocks[0]?.kind !== "ul") return;
    assert.match(blocks[0].items[0] ?? "", /href="\/book\/terms\/internet"/);
  });

  it("serializes a structured insertion as a list", () => {
    const html = insertionObjectToHtml({
      blocks: [
        {
          type: "list",
          ordered: false,
          items: ["<strong>HTML</strong> — markup.", "<script>alert(1)</script><em>CSS</em> — style."],
        },
      ],
    });
    const blocks = blocksFromModelText(html);
    assert.equal(blocks[0]?.kind, "ul");
    if (blocks[0]?.kind !== "ul") return;
    assert.match(blocks[0].items[0] ?? "", /<strong>HTML<\/strong>/);
    assert.match(blocks[0].items[1] ?? "", /<em>CSS<\/em>/);
    assert.doesNotMatch(blocks[0].items.join(""), /<script|alert\(1\)/);
  });
});
