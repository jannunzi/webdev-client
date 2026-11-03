import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createHistory,
  discardUntil,
  pushHistory,
  redoHistory,
  undoHistory,
} from "./edit-history.ts";

describe("inline edit history", () => {
  it("steps through typing snapshots and accepted hunks", () => {
    let history = createHistory("<p>Hello</p>");
    history = pushHistory(history, "<p>Hello </p>");
    history = pushHistory(history, "<p>Hello world</p>");
    history = pushHistory(history, "<p>Hello <strong>world</strong></p>");
    assert.equal(history.present, "<p>Hello <strong>world</strong></p>");
    history = undoHistory(history);
    assert.equal(history.present, "<p>Hello world</p>");
    history = undoHistory(history);
    assert.equal(history.present, "<p>Hello </p>");
    history = redoHistory(history);
    assert.equal(history.present, "<p>Hello world</p>");
    history = pushHistory(history, "<p>Hello there</p>");
    assert.deepEqual(history.future, []);
    assert.equal(undoHistory(createHistory("only")).present, "only");
  });

  it("does not record an identical snapshot and can discard a suggestion", () => {
    const history = pushHistory(createHistory("base"), "base");
    assert.deepEqual(history.past, []);
    const suggested = pushHistory(pushHistory(createHistory("base"), "diff"), "accepted");
    const discarded = discardUntil(suggested, "base");
    assert.equal(discarded.present, "base");
    assert.deepEqual(discarded.past, []);
    assert.deepEqual(discarded.future, []);
  });
});
