import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { bracketCommandAt, unescapeLiteralBrackets } from "./bracket-instruction.ts";

const CYCLE =
  "Introduce the software development cycle. list the various steps/levels, and prepare the chapter with the purpose of identifying opportunities where AI could help at each step.";

describe("bracket instructions", () => {
  it("reads only the bracket pair that contains the caret", () => {
    const text = `See [1] and the array stays. [${CYCLE}]`;
    const caret = text.lastIndexOf("software");
    const command = bracketCommandAt(text, caret);
    assert.ok(command);
    assert.equal(command.instruction, CYCLE);
    assert.equal(text.slice(command.start, command.end), `[${CYCLE}]`);
    assert.equal(bracketCommandAt(text, text.indexOf("and")), null);
  });

  it("keeps a backslash-escaped pair literal", () => {
    const text = `\\[${CYCLE}\\] and [Write one sentence.]`;
    assert.equal(bracketCommandAt(text, text.indexOf("software")), null);
    const command = bracketCommandAt(text, text.indexOf("Write"));
    assert.equal(command?.instruction, "Write one sentence.");
    assert.equal(unescapeLiteralBrackets(text).includes(`[${CYCLE}]`), true);
    assert.equal(unescapeLiteralBrackets("items[0]"), "items[0]");
  });

  it("picks the innermost pair", () => {
    const text = "[outer [inner instruction] tail]";
    const command = bracketCommandAt(text, text.indexOf("inner"));
    assert.equal(command?.instruction, "inner instruction");
  });
});
