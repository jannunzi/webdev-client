import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { academicIntegrity, aiPolicy } from "./policies.ts";

describe("AI policy", () => {
  const text = [...aiPolicy.paragraphs, ...(aiPolicy.bullets ?? [])].join(" ");

  it("uses the uncle-or-team standard and the book/exercise rules", () => {
    assert.match(text, /expert professional uncle or team at Google/i);
    assert.match(
      text,
      /If that would not be allowed with a person or a team, it is not allowed with AI/i,
    );
    assert.match(text, /that uncle or team/i);
    assert.match(text, /explain something/i);
    assert.match(text, /help you work things out/i);
    assert.match(text, /full responsibility/i);
    assert.match(text, /explicitly mentions/i);
    assert.match(text, /copy code wholesale/i);
    assert.match(text, /explicitly allows/i);
    assert.doesNotMatch(text, /\bask him\b/i);
    assert.doesNotMatch(text, /are (not )?allowed as learning aids/i);
    assert.doesNotMatch(text, /when in doubt, disclose/i);
    assert.doesNotMatch(text, /prior (written )?approval/i);
    assert.doesNotMatch(text, /permission/i);
    assert.doesNotMatch(text, /prohibited/i);
    assert.doesNotMatch(text, /always OK/i);
  });

  it("covers TA audits, a zero for suspected non-original code, and the learning intent", () => {
    assert.match(text, /regularly random audits/i);
    assert.match(text, /explain a random piece of code/i);
    assert.match(text, /slightest suspicion/i);
    assert.match(text, /zero for that assignment/i);
    assert.match(
      text,
      /unless the instructor or the book explicitly allowed AI for that particular purpose/i,
    );
    assert.match(
      text,
      /acquire the experience and the criteria to create and evaluate quality code/i,
    );
    assert.match(text, /become that expert uncle/i);
    assert.match(text, /join amazing teams/i);
  });

  it("aligns academic integrity with the wholesale-copy rule", () => {
    const integrity = academicIntegrity.paragraphs.join(" ");
    assert.match(integrity, /copying AI-generated code wholesale/i);
    assert.match(integrity, /explicitly allows/i);
    assert.doesNotMatch(
      integrity,
      /submitting AI-generated work you cannot explain/,
    );
  });
});
