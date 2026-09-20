import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  WEBSITE_CODING_BANKS,
  listWebsiteCodingBanks,
  validateCodingPool,
} from "./index";

const FORBIDDEN = /\bLab [0-9]|\bLabs\b|Kambaz|\bwd-|this chapter|the chapter|§\d|\/labs\b|the book/i;

describe("website coding pools", () => {
  it("has a valid FIB + implement pool for each of Q1–Q6", () => {
    const listed = listWebsiteCodingBanks();
    assert.deepEqual(
      listed.map((row) => row.quizId),
      ["q1", "q2", "q3", "q4", "q5", "q6"],
    );
    for (const { quizId, bank } of listed) {
      const issues = validateCodingPool(bank);
      assert.deepEqual(issues, [], `${quizId}: ${JSON.stringify(issues)}`);
      assert.equal(bank.groups.length, 2);
      const styles = bank.groups.flatMap((group) =>
        group.questions.map((question) =>
          question.type === "coding" ? question.style : "",
        ),
      );
      assert.equal(styles.includes("fib"), true, quizId);
      assert.equal(styles.includes("implement"), true, quizId);
    }
  });

  it("keeps student-facing coding stems standalone", () => {
    for (const bank of Object.values(WEBSITE_CODING_BANKS)) {
      for (const group of bank.groups) {
        for (const question of group.questions) {
          const blob = [
            question.prompt,
            question.explanation ?? "",
            question.code ?? "",
            question.type === "coding" ? (question.placeholder ?? "") : "",
          ].join("\n");
          assert.equal(FORBIDDEN.test(blob), false, question.id);
        }
      }
    }
  });

  it("authors Jose’s Q1 form attributes and bullet-list examples", () => {
    const q1 = WEBSITE_CODING_BANKS.q1;
    const form = q1.groups.find((group) => group.id === "q1-code-forms");
    const list = q1.groups.find((group) => group.id === "q1-code-lists");
    assert.ok(form && list);
    const firstForm = form.questions[0];
    assert.ok(firstForm && firstForm.type === "coding");
    assert.equal(firstForm.style, "fib");
    assert.deepEqual(firstForm.acceptedBlanks?.[0], [
      "for",
      "id",
      "title",
      "value",
      "placeholder",
    ]);
    assert.match(firstForm.prompt, /tooltip/i);
    assert.match(firstForm.prompt, /default value/i);
    assert.match(firstForm.prompt, /grayed example/i);
    assert.match(firstForm.prompt, /label/i);
    assert.match(firstForm.prompt, /1\. connects the label/);
    assert.match(firstForm.code ?? "", /____1____=/);
    assert.match(firstForm.code ?? "", /____5____=/);
    assert.doesNotMatch(firstForm.prompt, /Blank 1/);
    assert.doesNotMatch(firstForm.rubric ?? "", /Blank 1/);
    const firstList = list.questions[0];
    assert.ok(firstList && firstList.type === "coding");
    assert.equal(firstList.style, "implement");
    assert.match(firstList.referenceSolution, /<ul>/);
    assert.match(firstList.referenceSolution, /<li>Apple<\/li>/);
  });
});
