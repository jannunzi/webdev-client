import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const read = (path: string) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

const unescape = (s: string) => s.replace(/\\(\\|`|\$)/g, "$1");

const D = "app/labs/lab3/types";
const DEMOS = [
  "TypeAnnotations",
  "ObjectTypes",
  "Interfaces",
  "UnionTypes",
  "Enums",
  "FunctionTypes",
  "TypedProps",
  "Narrowing",
  "AnyVsUnknown",
  "UtilityTypes",
];
const LISTINGS: [string, string][] = [
  ["TypesPage", `${D}/page.tsx`],
  ["CourseBadge", `${D}/CourseBadge.tsx`],
  ...DEMOS.map((name): [string, string] => [name, `${D}/${name}.tsx`]),
];

const src = read("app/book/ch3/sections/TypeScriptTypes.tsx");

describe("§3.5 TypeScript Types", () => {
  it("every listing is byte-identical to its file", () => {
    for (const [name, file] of LISTINGS) {
      const re = new RegExp(`name="${name}"\\n\\s*file="${file}"\\n\\s*>\\{\`([\\s\\S]*?)\`\\}</CodeBlock>`);
      const m = src.match(re);
      assert.ok(m, `no listing for ${file}`);
      assert.equal(unescape(m[1]), read(file).replace(/\n$/, ""), file);
    }
  });
  it("every demo has a live demo after its listing and renders on the page", () => {
    const page = read(`${D}/page.tsx`);
    for (const [i, name] of DEMOS.entries()) {
      const step = src.slice(src.indexOf(`id="sec-3-5-${i + 1}"`));
      assert.ok(step.indexOf(`name="${name}"\n          file=`) < step.indexOf(`<LiveDemo name="${name}"`), name);
      assert.ok(src.includes(`import ${name} from "@/${D}/${name}";`), `${name} import`);
      assert.ok(page.includes(`<${name} />`), `${name} on page`);
    }
  });
  it("sits between §3.4 and §3.6 in the chapter and the TOC", () => {
    const ch = read("app/book/ch3/Chapter3.tsx");
    assert.ok(ch.indexOf("<DataStructures />") < ch.indexOf("<TypeScriptTypes />"));
    assert.ok(ch.indexOf("<TypeScriptTypes />") < ch.indexOf("<StylingAndComponents />"));
    const toc = read("app/book/TOC.tsx");
    const a = toc.indexOf('"sec-3-4-17"');
    const b = toc.indexOf('"sec-3-5"');
    const c = toc.indexOf('"sec-3-5-10"');
    const d = toc.indexOf('"sec-3-6"');
    assert.ok(a < b && b < c && c < d);
  });
});

describe("TypeScript types stay out of grading and the exercise lists", () => {
  it("the Lab 3 page, catalogs and A3 checker do not mention them", () => {
    const ungraded = [
      read("app/labs/lab3/page.tsx"),
      read("app/book/exercise-lists/catalogs.ts"),
      read("lib/assignments/a3.ts"),
      read("lib/assignments/a3-structure.ts"),
    ].join("\n");
    for (const id of ["sec-3-5\"", "sec-3-5-", "lab3/types", "wd-lab3-types", "TypeAnnotations", "UtilityTypes"]) {
      assert.ok(!ungraded.includes(id), id);
    }
  });
  it("has no On Your Own or With AI blocks and is not called optional", () => {
    assert.ok(!src.includes("<OnYourOwn") && !src.includes("<WithAI"));
    assert.ok(!/optional or|ungraded|not graded|\(optional\)/i.test(src));
  });
});
