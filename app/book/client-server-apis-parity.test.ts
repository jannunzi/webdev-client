import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const read = (path: string) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

const unescape = (s: string) =>
  s.replace(/\\\$\{/g, "${").replace(/\\`/g, "`").replace(/\\\\/g, "\\");

const book = read("app/book/ch3/sections/StylingAndComponents.tsx");

function section(id: string, nextId: string): string {
  const start = book.indexOf(`id="${id}"`);
  const end = book.indexOf(`id="${nextId}"`);
  assert.ok(start > 0 && end > start, `${id} not found`);
  return book.slice(start, end);
}

type Block = { name: string; file: string; body: string };
function blocks(src: string): Block[] {
  const re = /<CodeBlock\b([^>]*)>\{`([\s\S]*?)`\}<\/CodeBlock>/g;
  const out: Block[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    out.push({
      name: m[1].match(/name="([^"]+)"/)?.[1] ?? "",
      file: m[1].match(/file="([^"]+)"/)?.[1] ?? "",
      body: unescape(m[2]),
    });
  }
  return out;
}

const CASES = [
  {
    id: "sec-3-6-3",
    next: "sec-3-6-4",
    dir: "app/labs/lab3/client-apis",
    page: "ClientApis",
    components: ["PathnameDemo", "SearchParamsDemo", "WindowDemo", "GeolocationDemo", "MapEmbed", "ClientIpDemo"],
    helpers: [] as string[],
  },
  {
    id: "sec-3-6-4",
    next: "sec-3-7",
    dir: "app/labs/lab3/server-apis",
    page: "ServerApis",
    components: ["ServerTimeDemo", "OsDemo", "EnvDemo", "RequestHeadersDemo", "WeatherDemo", "VisitCounterDemo", "ChildProcessDemo"],
    helpers: ["ClientTime", "EnvClientCheck"],
  },
];

for (const c of CASES) {
  describe(`§${c.id} listings match the demo files`, () => {
    const src = section(c.id, c.next);
    const all = blocks(src);

    it("every component listing is byte-identical to its file", () => {
      for (const name of [...c.components, ...c.helpers]) {
        const file = `${c.dir}/${name}.tsx`;
        const block = all.find((b) => b.file === file && b.name === name);
        assert.ok(block, `no listing for ${file}`);
        assert.equal(block.body, read(file).replace(/\n$/, ""), file);
      }
    });

    it("every component has a live demo captioned with its file, right after its listing", () => {
      for (const name of c.components) {
        const file = `${c.dir}/${name}.tsx`;
        const listingAt = src.indexOf(`name="${name}"\n            file="${file}"\n          >{\``);
        const demoAt = src.indexOf(`<LiveDemo\n            name="${name}"\n            file="${file}"`);
        assert.ok(listingAt >= 0 && demoAt > listingAt, `${name} demo missing or before listing`);
        const nextListing = src.indexOf("<CodeBlock", listingAt + 1);
        assert.ok(demoAt < nextListing || nextListing < 0, `${name} demo is not right after its listing`);
      }
    });

    it("the page grows one component per step and the last step equals page.tsx", () => {
      const steps = all.filter((b) => b.file === `${c.dir}/page.tsx`);
      assert.deepEqual(
        steps.map((b) => b.name),
        c.components.map((_, i) => `${c.page} (after step ${i + 1})`),
      );
      steps.forEach((b, i) => {
        for (const name of c.components.slice(0, i + 1)) assert.match(b.body, new RegExp(`<${name} />`));
        for (const name of c.components.slice(i + 1)) assert.doesNotMatch(b.body, new RegExp(`<${name} />`));
      });
      assert.equal(steps.at(-1)!.body, read(`${c.dir}/page.tsx`).replace(/\n$/, ""));
    });

    it("is demo prose, not an On Your Own exercise", () => {
      assert.doesNotMatch(src, /<OnYourOwn|<WithAI/);
    });
  });
}

describe("client-only rules", () => {
  const src = section("sec-3-6-3", "sec-3-6-4");
  it("useSearchParams demos are wrapped in Suspense in the book and on the page", () => {
    for (const name of ["SearchParamsDemo", "MapEmbed"]) {
      assert.match(src, new RegExp(`<Suspense fallback=\\{[^}]*\\}>\\s*<${name} />\\s*</Suspense>`));
      assert.match(read("app/labs/lab3/client-apis/page.tsx"), new RegExp(`<Suspense fallback=\\{<p>[^<]*</p>\\}>\\s*<${name} />`));
    }
  });
  it("browser globals are only read inside effects or event handlers", () => {
    for (const name of ["WindowDemo", "ClientIpDemo"]) {
      assert.match(read(`app/labs/lab3/client-apis/${name}.tsx`), /useEffect\(/);
    }
  });
  it("uses only keyless endpoints", () => {
    const code = ["MapEmbed", "ClientIpDemo"].map((n) => read(`app/labs/lab3/client-apis/${n}.tsx`)).join("\n");
    assert.match(code, /openstreetmap\.org\/export\/embed\.html/);
    assert.match(code, /api\.ipify\.org/);
    assert.doesNotMatch(code, /key=|apikey|token/i);
  });
});

describe("server-only rules", () => {
  it("dynamic demos opt out of prerendering and are framed, not embedded", () => {
    assert.match(read("app/labs/lab3/server-apis/RequestHeadersDemo.tsx"), /await headers\(\)/);
    assert.match(read("app/labs/lab3/server-apis/VisitCounterDemo.tsx"), /await connection\(\)/);
    assert.doesNotMatch(book, /^import (RequestHeadersDemo|VisitCounterDemo|WeatherDemo) from "@\/app/m);
  });
  it("child_process runs only a fixed command", () => {
    assert.match(read("app/labs/lab3/server-apis/ChildProcessDemo.tsx"), /execFileAsync\("node", \["--version"\]\)/);
  });
  it("the counter writes under os.tmpdir()", () => {
    assert.match(read("app/labs/lab3/server-apis/VisitCounterDemo.tsx"), /path\.join\(os\.tmpdir\(\)/);
  });
  it("the weather fetch revalidates", () => {
    assert.match(read("app/labs/lab3/server-apis/WeatherDemo.tsx"), /revalidate: 1800/);
  });
});
