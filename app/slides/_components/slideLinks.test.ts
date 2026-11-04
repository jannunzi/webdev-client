import { test } from "node:test";
import assert from "node:assert/strict";
import { slideLinkHrefToOpen } from "./slideLinks";

const a = (href: string | null, nav = false) => ({
  getAttribute: () => href,
  closest: () => (nav ? {} : null),
});

test("slide links open in a new tab except slide navigation", () => {
  assert.equal(slideLinkHrefToOpen(a("http://localhost:4000/lab5/add/6/4")), "http://localhost:4000/lab5/add/6/4");
  assert.equal(slideLinkHrefToOpen(a("#slide-3")), null);
  assert.equal(slideLinkHrefToOpen(a("/slides/next", true)), null);
  assert.equal(slideLinkHrefToOpen(a(null)), null);
});
