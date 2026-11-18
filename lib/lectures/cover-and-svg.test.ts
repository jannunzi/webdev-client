import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { StackDiagram } from "../../app/slides/_components/diagrams/StackDiagrams.tsx";
import {
  COVER_ASYNC,
  COVER_DEPLOY,
  COVER_KAMBAZ,
  COVER_MONGO,
  COVER_NEUTRAL,
  COVER_NODE,
  COVER_YOUTUBE,
} from "./cover-colors.ts";
import { svgIndentedLine } from "./svg-indent.ts";

function contrastAgainstWhite(hex: string): number {
  const n = Number.parseInt(hex.slice(1), 16);
  const channels = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const linear = channels.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * linear[0]! + 0.7152 * linear[1]! + 0.0722 * linear[2]!;
  return 1.05 / (luminance + 0.05);
}

describe("cover colors", () => {
  it("keeps white title text at 4.5:1 or better", () => {
    for (const hex of [
      COVER_MONGO,
      COVER_NODE,
      COVER_YOUTUBE,
      COVER_ASYNC,
      COVER_KAMBAZ,
      COVER_DEPLOY,
      COVER_NEUTRAL,
    ]) {
      assert.ok(contrastAgainstWhite(hex) >= 4.5, `${hex} contrast ${contrastAgainstWhite(hex)}`);
    }
  });

  it("does not leave a bright hex on a deck cover", () => {
    const dir = join(process.cwd(), "lib/lectures/decks");
    for (const file of readdirSync(dir)) {
      if (!file.endsWith(".ts")) continue;
      const text = readFileSync(join(dir, file), "utf8");
      assert.doesNotMatch(text, /color:\s*"#[0-9A-Fa-f]{6}"/, file);
    }
  });
});

describe("SQL versus document JSON indent", () => {
  it("offsets each nesting level by two spaces", () => {
    assert.equal(svgIndentedLine("{").xOffset, 0);
    assert.equal(svgIndentedLine('  "_id": "RS101"').xOffset, 22);
    assert.equal(svgIndentedLine("    {").xOffset, 44);
    assert.equal(svgIndentedLine('      "_id": "M101"').text, '"_id": "M101"');
    assert.equal(svgIndentedLine('      "_id": "M101"').xOffset, 66);
  });

  it("renders nested keys further right than the root brace", () => {
    const html = renderToStaticMarkup(StackDiagram({ id: "sql-vs-document" }));
    const lines = [...html.matchAll(/<text[^>]*x="(\d+)"[^>]*>([^<]*)<\/text>/g)].map((match) => ({
      x: Number(match[1]),
      text: match[2] ?? "",
    }));
    const root = lines.find((line) => line.text === "{");
    const nested = lines.find((line) => line.text.includes("_id") && line.text.includes("M101"));
    assert.ok(root);
    assert.ok(nested, lines.map((line) => line.text).join("\n"));
    assert.ok(nested.x >= root.x + 44, `nested x ${nested.x} root x ${root.x}`);
  });
});
