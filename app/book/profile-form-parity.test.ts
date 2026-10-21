import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function read(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
}

/** Undo template-literal escaping so a listing compares to the raw file. */
function unescape(s: string): string {
  return s.replace(/\\(\\|`|\$)/g, "$1");
}

const L = "app/labs/lab4";
const SECTIONS = [
  {
    id: "sec-4-2-10",
    end: "    </>",
    book: "app/book/ch4/sections/EventsAndState.tsx",
    listings: [
      ["profile", `${L}/profile/profile.ts`],
      ["ProfileFields", `${L}/profile/ProfileFields.tsx`],
      ["ProfileAlert", `${L}/profile/ProfileAlert.tsx`],
      ["ProfileForm", `${L}/profile/ProfileForm.tsx`],
    ],
    demo: ["ProfileForm", `${L}/profile/ProfileForm.tsx`, "@/app/labs/lab4/profile/ProfileForm"],
  },
  {
    id: "sec-4-4-3",
    end: 'id="sec-4-5"',
    book: "app/book/ch4/sections/Stores.tsx",
    listings: [
      ["ProfileContext", `${L}/context/ProfileContext.tsx`],
      ["ContextProfileForm", `${L}/context/ContextProfileForm.tsx`],
    ],
    demo: ["ContextProfileForm", `${L}/context/ContextProfileForm.tsx`, "@/app/labs/lab4/context/ContextProfileForm"],
  },
  {
    id: "sec-4-5-3",
    end: 'id="sec-4-6"',
    book: "app/book/ch4/sections/Stores.tsx",
    listings: [
      ["profileStore", `${L}/zustand/profileStore.ts`],
      ["ZustandProfileForm", `${L}/zustand/ZustandProfileForm.tsx`],
    ],
    demo: ["ZustandProfileForm", `${L}/zustand/ZustandProfileForm.tsx`, "@/app/labs/lab4/zustand/ZustandProfileForm"],
  },
] as const;

for (const s of SECTIONS) {
  describe(`§${s.id} profile form listings`, () => {
    const src = read(s.book);
    const start = src.indexOf(`id="${s.id}"`);
    const end = src.indexOf(s.end, start);
    const body = src.slice(start, end);
    const blocks = [
      ...body.matchAll(/<CodeBlock\b[^>]*name="(\w+)"[^>]*file="([^"]+)"[^>]*>\{`([\s\S]*?)`\}<\/CodeBlock>/g),
    ];

    it("sits in its parent section", () => {
      assert.ok(start > 0 && end > start);
    });

    it("lists every file in build-up order", () => {
      assert.deepEqual(blocks.map((b) => [b[1], b[2]]), s.listings.map((l) => [...l]));
    });

    for (const b of blocks) {
      it(`${b[1]} listing is byte-identical to ${b[2]}`, () => {
        assert.equal(unescape(b[3]), read(b[2]).replace(/\n$/, ""));
      });
    }

    it("live demo renders the listed component after its listing", () => {
      const [name, file, mod] = s.demo;
      const listingAt = body.indexOf(`file="${file}"\n`);
      const demoAt = body.search(new RegExp(`<LiveDemo\\s+name="${name}"\\s+file="${file}"\\s+mode="styled"\\s*>\\s*<${name} />\\s*</LiveDemo>`));
      assert.ok(listingAt > 0 && demoAt > listingAt, "demo follows its listing");
      assert.ok(!body.slice(demoAt).includes("<CodeBlock"), "demo is last");
      assert.match(src, new RegExp(`import ${name} from "${mod}";`));
    });

    it("is presentation prose, not an exercise", () => {
      assert.doesNotMatch(body, /OnYourOwn|WithAI|On Your Own|\(Optional\)|is optional/);
    });

    it("is in the table of contents", () => {
      assert.ok(read("app/book/TOC.tsx").includes(`"${s.id}"`));
    });
  });
}

describe("profile demos stay off the A4-checked Lab 4 page", () => {
  it("/labs/lab4 does not render the profile forms", () => {
    assert.doesNotMatch(read(`${L}/page.tsx`), /Profile/);
  });
  it("the three versions share one set of fields and rules", () => {
    for (const f of ["context/ContextProfileForm.tsx", "zustand/ZustandProfileForm.tsx", "profile/ProfileForm.tsx"]) {
      assert.match(read(`${L}/${f}`), /import ProfileFields from/);
    }
  });
  it("zustand is a dependency", () => {
    assert.ok(JSON.parse(read("package.json")).dependencies.zustand);
  });
});
