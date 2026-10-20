import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function read(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
}

const BOOK = "app/book/ch3/sections/StylingAndComponents.tsx";
const DIR = "app/labs/lab3/children";
const LISTINGS = [
  "Box",
  "BoxDemo",
  "Margin",
  "Border",
  "Padding",
  "Content",
  "BoxModelDemo",
  "NestingOrderDemo",
  "Card",
  "CardHeader",
  "CardBody",
  "CardDemo",
];
const DEMOS = ["BoxDemo", "BoxModelDemo", "NestingOrderDemo", "CardDemo"];

function section(): string {
  const src = read(BOOK);
  const start = src.indexOf('id="sec-3-7-1-1"');
  const end = src.indexOf('id="sec-3-7-2"');
  assert.ok(start > 0 && end > start, "§3.7.1.1 sits between §3.7.1 and §3.7.2");
  return src.slice(start, end);
}

describe("§3.7.1.1 children demo listings", () => {
  const body = section();
  const blocks = [
    ...body.matchAll(/<CodeBlock\b[^>]*name="(\w+)"[^>]*file="([^"]+)"[^>]*>\{`([\s\S]*?)`\}<\/CodeBlock>/g),
  ];

  it("lists every file in build-up order", () => {
    assert.deepEqual(
      blocks.map((b) => b[1]),
      LISTINGS,
    );
  });

  for (const b of blocks) {
    it(`${b[1]} listing is byte-identical to ${b[2]}`, () => {
      assert.equal(b[2], `${DIR}/${b[1]}.tsx`);
      assert.equal(b[3], read(b[2]).replace(/\n$/, ""));
    });
  }

  for (const name of DEMOS) {
    it(`${name} live demo renders the listed component right after its listing`, () => {
      const file = `${DIR}/${name}.tsx`;
      const demo = `<LiveDemo mode="styled" name="${name}" file="${file}">\n            <${name} />\n          </LiveDemo>`;
      const listingEnd = body.indexOf(`file="${file}"`);
      const demoAt = body.indexOf(demo);
      assert.ok(listingEnd > 0 && demoAt > listingEnd, `${name} demo follows its listing`);
      assert.ok(!body.slice(listingEnd, demoAt).includes("<CodeBlock"), "no listing in between");
      assert.match(read(BOOK), new RegExp(`import ${name} from "@/app/labs/lab3/children/${name}";`));
    });
  }

  it("is demo prose, not an assignment step", () => {
    assert.doesNotMatch(body, /OnYourOwn|WithAI|On Your Own/);
  });

  it("nesting-order demo swaps only Padding and Border", () => {
    const a = read(`${DIR}/BoxModelDemo.tsx`);
    const b = read(`${DIR}/NestingOrderDemo.tsx`);
    const order = (s: string) => [...s.matchAll(/^\s*<(Margin|Border|Padding|Content)\b/gm)].map((m) => m[1]);
    assert.deepEqual(order(a), ["Margin", "Border", "Padding", "Content"]);
    assert.deepEqual(order(b), ["Margin", "Padding", "Border", "Content"]);
  });

  it("is in the table of contents after §3.7.1", () => {
    const toc = read("app/book/TOC.tsx");
    assert.ok(toc.indexOf('"sec-3-7-1-1"') > toc.indexOf('"sec-3-7-1"'));
    assert.ok(toc.indexOf('"sec-3-7-1-1"') < toc.indexOf('"sec-3-7-2"'));
  });
});
