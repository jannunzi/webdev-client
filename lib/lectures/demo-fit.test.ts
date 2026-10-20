import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEMO_FIT_MAX,
  DEMO_FIT_MIN,
  demoElementOverflows,
  fitDemoScale,
  type DemoElementBox,
} from "./demo-fit";

describe("fitDemoScale", () => {
  it("grows a short demo to the largest scale that fits", () => {
    const scale = fitDemoScale((s) => s > 2.12);
    assert.ok(scale <= 2.12 && scale > 2.05, String(scale));
  });
  it("caps at the max when everything fits", () => {
    assert.equal(fitDemoScale(() => false), DEMO_FIT_MAX);
  });
  it("never shrinks below the old demo-stage size, even when a tall demo overflows", () => {
    assert.equal(fitDemoScale(() => true), DEMO_FIT_MIN);
  });
});

describe("demoElementOverflows", () => {
  const stage = { top: 0, left: 0, right: 1280, bottom: 800 };
  const base: DemoElementBox = {
    scrollWidth: 100,
    scrollHeight: 50,
    clientWidth: 100,
    clientHeight: 50,
    overflowX: "visible",
    overflowY: "visible",
    position: "static",
    rect: { top: 100, left: 100, right: 200, bottom: 150 },
  };
  it("passes a box whose content fits", () => {
    assert.equal(demoElementOverflows(base, stage), false);
  });
  it("flags a hidden-overflow box whose content is wider (Column 1 → Colun)", () => {
    assert.equal(
      demoElementOverflows({ ...base, overflowX: "hidden", scrollWidth: 160 }, stage),
      true,
    );
  });
  it("ignores scroll size on overflow: visible boxes", () => {
    assert.equal(demoElementOverflows({ ...base, scrollWidth: 160 }, stage), false);
  });
  it("flags text that spills past a fixed-size box (Portrait / Landscape)", () => {
    assert.equal(
      demoElementOverflows(
        { ...base, textRect: { top: 110, left: 105, right: 260, bottom: 140 } },
        stage,
      ),
      true,
    );
  });
  it("flags a fixed or absolute element outside the stage (Fixed position square)", () => {
    const out = { ...base, rect: { top: 700, left: 1200, right: 1330, bottom: 830 } };
    assert.equal(demoElementOverflows({ ...out, position: "fixed" }, stage), true);
    assert.equal(demoElementOverflows({ ...out, position: "absolute" }, stage), true);
    assert.equal(demoElementOverflows({ ...base, position: "fixed" }, stage), false);
  });
});

describe("DEMO_FIT_FLOORS", () => {
  it("never shrinks a demo below the default size; tall demos scroll at 1.3x", async () => {
    const { DEMO_FIT_FLOORS } = await import("./demo-fit");
    assert.deepEqual(DEMO_FIT_FLOORS, {});
    assert.equal(fitDemoScale((s) => s > 0.95), DEMO_FIT_MIN);
  });
});

describe("demo-stage form control font", () => {
  it("scopes the input font fix to slide demo stages, not book form controls", async () => {
    const { readFileSync } = await import("node:fs");
    const css = readFileSync("app/book/book.css", "utf8");
    for (const m of css.matchAll(/([^{}]+)\{[^{}]*font-size:\s*1em;[^{}]*min-height:\s*2\.35em/g)) {
      for (const sel of m[1].split(",").map((x) => x.replace(/\/\*[\s\S]*?\*\//g, "").trim())) {
        assert.match(sel, /^\.lecture-slide\[data-demo-stage="true"\] /);
      }
    }
  });
});
