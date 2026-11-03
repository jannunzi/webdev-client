import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { describe, it } from "node:test";
import ts from "typescript";
import { transformForBuild } from "./transform.ts";

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = `${dir}/${name}`;
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function diagnostics(source: string, file: string): number {
  const kind = file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const parsed = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, kind);
  const diagnostics = (
    parsed as ts.SourceFile & { parseDiagnostics?: readonly ts.Diagnostic[] }
  ).parseDiagnostics;
  return diagnostics?.length ?? 0;
}

describe("build-time source locators", () => {
  it("stamps a static paragraph and skips variables and duplicate slices", () => {
    const source = `export function Page({ name }: { name: string }) {
  return (
    <>
      <p className="lead">Hello <ChapterLink to={1} /> world</p>
      <p>Hello {name}</p>
      <p>Same</p>
      <p>Same</p>
    </>
  );
}
`;
    const next = transformForBuild(source, "app/book/ch2/sections/Intro.tsx");
    assert.match(next, /data-src-file="app\/book\/ch2\/sections\/Intro\.tsx"/);
    assert.match(next, /data-src-hash="[a-f0-9]{24}"/);
    assert.match(next, /data-edit-kind="jsx"/);
    assert.match(
      next,
      /<span data-edit-slot="0" style=\{\{ display: "contents" \}\}><ChapterLink to=\{1\} \/><\/span>/,
    );
    assert.match(next, /<p>Hello \{name\}<\/p>/);
    assert.equal(next.match(/data-src-hash/g)?.length, 1);
    assert.equal(diagnostics(next, "app/book/ch2/sections/Intro.tsx"), 0);
    assert.equal(transformForBuild(next, "app/book/ch2/sections/Intro.tsx"), next);
  });

  it("marks a unique slide literal and not a repeated bullet or a code string", () => {
    const source = `export const SLIDES = [
  {
    title: "Headings",
    bullets: ["One", "One"],
    code: "title: \\"Headings\\"",
  },
];
`;
    const next = transformForBuild(source, "lib/lectures/decks/headings-and-paragraphs.ts");
    assert.match(next, /import \{ inlineEditMark \} from "@\/lib\/inline-edit\/mark";/);
    assert.match(next, /title: inlineEditMark\("Headings", "lib\/lectures\/decks\/headings-and-paragraphs\.ts", "[a-f0-9]{24}"\)/);
    assert.match(next, /bullets: \["One", "One"\]/);
    assert.match(next, /code: "title: \\"Headings\\""/);
    assert.equal(diagnostics(next, "lib/lectures/decks/headings-and-paragraphs.ts"), 0);
  });

  it("keeps every book page and lecture deck parsable", () => {
    const files = [
      ...walk("app/book").filter((file) => file.endsWith(".tsx")),
      ...walk("lib/lectures/decks").filter((file) => file.endsWith(".ts")),
    ];
    assert.ok(files.length > 100);
    for (const file of files) {
      const source = readFileSync(file, "utf8");
      const before = diagnostics(source, file);
      const next = transformForBuild(source, file);
      const after = diagnostics(next, file);
      assert.equal(after, before, file);
    }
  });
});
