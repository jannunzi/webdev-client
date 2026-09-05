import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parsePromptMarkup } from "./prompt-markup";

describe("parsePromptMarkup", () => {
  it("returns plain text when there are no backticks", () => {
    assert.deepEqual(parsePromptMarkup("HTML stands for _____."), [
      { type: "text", value: "HTML stands for _____." },
    ]);
  });

  it("splits backtick spans into code parts", () => {
    const parts = parsePromptMarkup(
      "In JSX, which attribute on a `<label>` links it to an input’s `id`?",
    );
    assert.deepEqual(parts, [
      { type: "text", value: "In JSX, which attribute on a " },
      { type: "code", value: "<label>" },
      { type: "text", value: " links it to an input’s " },
      { type: "code", value: "id" },
      { type: "text", value: "?" },
    ]);
  });

  it("keeps an unmatched backtick as text", () => {
    assert.deepEqual(parsePromptMarkup("use `htmlFor without a close"), [
      { type: "text", value: "use `htmlFor without a close" },
    ]);
  });
});
