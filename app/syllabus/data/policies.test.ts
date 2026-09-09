import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { academicIntegrity, aiPolicy } from "./policies.ts";

describe("AI policy", () => {
  it("uses the uncle standard and the book/exercise rules", () => {
    const text = [...aiPolicy.paragraphs, ...(aiPolicy.bullets ?? [])].join(" ");
    assert.match(text, /expert professional uncle/i);
    assert.match(
      text,
      /If that would not be allowed with a person, it is not allowed with AI/i,
    );
    assert.match(text, /explain something/i);
    assert.match(text, /help you work things out/i);
    assert.match(text, /full responsibility/i);
    assert.match(text, /explicitly mentions/i);
    assert.match(text, /copy code wholesale/i);
    assert.match(text, /explicitly allows/i);
    assert.doesNotMatch(text, /are (not )?allowed as learning aids/i);
    assert.doesNotMatch(text, /when in doubt, disclose/i);
    assert.doesNotMatch(text, /prior (written )?approval/i);
    assert.doesNotMatch(text, /permission/i);
    assert.doesNotMatch(text, /prohibited/i);
    assert.doesNotMatch(text, /always OK/i);
  });

  it("aligns academic integrity with the wholesale-copy rule", () => {
    const text = academicIntegrity.paragraphs.join(" ");
    assert.match(text, /copying AI-generated code wholesale/i);
    assert.match(text, /explicitly allows/i);
    assert.doesNotMatch(text, /submitting AI-generated work you cannot explain/);
  });
});
