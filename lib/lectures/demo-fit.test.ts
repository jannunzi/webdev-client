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
  it("lets the too-tall Kambaz dashboard demo shrink to fit instead of running past the slide", async () => {
    const { DEMO_FIT_FLOORS } = await import("./demo-fit");
    const floor = DEMO_FIT_FLOORS["kambaz-dashboard-data#page-live"];
    assert.ok(floor !== undefined && floor < DEMO_FIT_MIN);
    const scale = fitDemoScale((s) => s > 0.95, floor);
    assert.ok(scale >= 0.9 && scale <= 0.95, String(scale));
  });
});
