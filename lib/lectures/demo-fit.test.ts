import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DEMO_FIT_MAX, DEMO_FIT_MIN, fitDemoScale } from "./demo-fit";

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
