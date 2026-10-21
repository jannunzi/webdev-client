import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const read = (path: string) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

const unescape = (s: string) => s.replace(/\\(\\|`|\$)/g, "$1");

const D = "app/labs/lab4/hooks";
const LISTINGS: [string, string][] = [
  ["useWindowSize", `${D}/useWindowSize.ts`],
  ["WindowSizeDemo", `${D}/WindowSizeDemo.tsx`],
  ["useToggle", `${D}/useToggle.ts`],
  ["ToggleDemo", `${D}/ToggleDemo.tsx`],
  ["useLocalStorage", `${D}/useLocalStorage.ts`],
  ["LocalStorageDemo", `${D}/LocalStorageDemo.tsx`],
  ["IndependentToggles", `${D}/IndependentToggles.tsx`],
  ["useProfileForm", `${D}/useProfileForm.ts`],
  ["HookProfileForm", `${D}/HookProfileForm.tsx`],
  ["HooksPage", `${D}/page.tsx`],
];
const DEMOS = ["WindowSizeDemo", "ToggleDemo", "LocalStorageDemo", "IndependentToggles", "HookProfileForm"];

const effects = read("app/book/ch4/sections/EffectsAndExercises.tsx");
const s471 = effects.slice(effects.indexOf('id="sec-4-7-1"'), effects.indexOf('id="sec-4-8"'));

describe("§4.7.1 Writing Your Own Hooks", () => {
  it("every listing is byte-identical to its file", () => {
    for (const [name, file] of LISTINGS) {
      const re = new RegExp(`name="${name}"\\n\\s*file="${file}"\\n\\s*>\\{\`([\\s\\S]*?)\`\\}</CodeBlock>`);
      const m = s471.match(re);
      assert.ok(m, `no listing for ${file}`);
      assert.equal(unescape(m[1]), read(file).replace(/\n$/, ""), file);
    }
  });
  it("every demo component has a live demo after its listing", () => {
    for (const name of DEMOS) {
      const at = s471.indexOf(`name="${name}"\n            file="${D}/${name}.tsx"\n          >{\``);
      const demo = s471.indexOf(`<LiveDemo\n            name="${name}"`);
      assert.ok(at >= 0 && demo > at, name);
      assert.ok(effects.includes(`import ${name} from "@/${D}/${name}";`), `${name} import`);
    }
  });
  it("the page renders every demo", () => {
    const page = read(`${D}/page.tsx`);
    for (const name of DEMOS) assert.ok(page.includes(`<${name} />`), name);
  });
});

describe("hooks stay out of grading and the exercise lists", () => {
  const ungraded = [
    read("app/labs/lab4/page.tsx"),
    read("app/book/exercise-lists/catalogs.ts"),
    read("lib/assignments/a4.ts"),
    read("lib/assignments/a4-structure.ts"),
    read("lib/assignments/a4-checker.ts"),
  ].join("\n");
  it("the Lab 4 page, catalogs and A4 checker do not mention the hooks demos", () => {
    for (const id of ["sec-4-2-4-1", "sec-4-7-1", "lab4/hooks", "wd-lab4-hooks", "useWindowSize", "useLocalStorage", "useProfileForm"]) {
      assert.ok(!ungraded.includes(id), id);
    }
  });
  it("the new sections have no On Your Own or With AI blocks", () => {
    const events = read("app/book/ch4/sections/EventsAndState.tsx");
    const s4241 = events.slice(events.indexOf('id="sec-4-2-4-1"'), events.indexOf('id="sec-4-2-5"'));
    for (const src of [s4241, s471]) {
      assert.ok(!src.includes("<OnYourOwn") && !src.includes("<WithAI"));
      assert.ok(!/optional|ungraded/i.test(src));
    }
  });
  it("§2.4.3 defines a hook at the first usePathname listing", () => {
    const ch2 = read("app/book/ch2/sections/KambazStyling.tsx");
    const note = ch2.indexOf('id="wd-whats-a-hook"');
    assert.ok(note > 0 && note < ch2.indexOf('import { usePathname } from "next/navigation";'));
  });
});
