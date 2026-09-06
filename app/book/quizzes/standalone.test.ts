import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PRACTICE_QUIZZES } from "./registry";

const FORBIDDEN: { pattern: RegExp; label: string }[] = [
  { pattern: /\bLab [0-9]/i, label: "Lab N" },
  { pattern: /\bLabs\b/, label: "Labs" },
  { pattern: /Kambaz/i, label: "Kambaz" },
  { pattern: /\bwd-/, label: "wd- id" },
  { pattern: /this chapter/i, label: "this chapter" },
  { pattern: /the chapter/i, label: "the chapter" },
  { pattern: /§\d/, label: "section mark" },
  { pattern: /\/labs\b/, label: "/labs path" },
  { pattern: /the book/i, label: "the book" },
  { pattern: /as in the chapter/i, label: "as in the chapter" },
];

function studentFacingText(): string {
  const parts: string[] = [];
  for (const quiz of PRACTICE_QUIZZES) {
    for (const question of quiz.bank) {
      parts.push(question.prompt, question.explanation, question.code ?? "");
      for (const choice of question.choices ?? []) {
        parts.push(choice.text);
      }
    }
  }
  return parts.join("\n");
}

describe("practice quiz banks", () => {
  it("keep prompts, choices, and explanations standalone", () => {
    const blob = studentFacingText();
    for (const { pattern, label } of FORBIDDEN) {
      const match = blob.match(pattern);
      assert.equal(match, null, `${label} still appears in practice quiz text: ${match?.[0]}`);
    }
  });
});
