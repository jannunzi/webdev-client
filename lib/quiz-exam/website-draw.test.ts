import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { WEBSITE_CODING_BANKS } from "../question-bank";
import {
  QUIZ_DRAW_COUNTS,
  WEBSITE_CODING_DRAW_COUNT,
  WEBSITE_TRADITIONAL_DRAW_COUNT,
} from "./draw-counts";
import {
  drawWebsiteAttempt,
  invalidWebsiteDrawReason,
} from "./website-draw";

describe("website Q1–Q6 coding draw", () => {
  for (const quizId of ["q1", "q2", "q3", "q4", "q5", "q6"] as const) {
    it(`draws 8 traditional + 2 coding for ${quizId}`, () => {
      const first = drawWebsiteAttempt(quizId, `user_a:${quizId}`);
      const again = drawWebsiteAttempt(quizId, `user_a:${quizId}`);
      const other = drawWebsiteAttempt(quizId, `user_b:${quizId}`);
      assert.equal(first.length, QUIZ_DRAW_COUNTS[quizId]);
      assert.deepEqual(
        first.map((item) => item.question.id),
        again.map((item) => item.question.id),
      );
      const coding = first.filter((item) => item.question.type === "coding");
      const traditional = first.filter((item) => item.question.type !== "coding");
      assert.equal(traditional.length, WEBSITE_TRADITIONAL_DRAW_COUNT);
      assert.equal(coding.length, WEBSITE_CODING_DRAW_COUNT);
      const styles = new Set(
        coding.map((item) =>
          item.question.type === "coding" ? item.question.style : "",
        ),
      );
      assert.equal(styles.has("fib"), true);
      assert.equal(styles.has("implement"), true);
      assert.equal(invalidWebsiteDrawReason(quizId, first), null);
      assert.notDeepEqual(
        first.map((item) => item.question.id),
        other.map((item) => item.question.id),
      );
    });
  }

  it("requires Q1 to include the form-attribute FIB and the bullet-list implement item", () => {
    const drawn = drawWebsiteAttempt("q1", "jose-styles");
    const coding = drawn.filter((item) => item.question.type === "coding");
    const groupIds = new Set(coding.map((item) => item.group.id));
    assert.equal(groupIds.has("q1-code-forms"), true);
    assert.equal(groupIds.has("q1-code-lists"), true);
    const form = coding.find((item) => item.group.id === "q1-code-forms");
    const list = coding.find((item) => item.group.id === "q1-code-lists");
    assert.ok(form && form.question.type === "coding");
    assert.ok(list && list.question.type === "coding");
    assert.equal(form.question.style, "fib");
    assert.equal(list.question.style, "implement");
    assert.equal(form.question.preview?.kind, "form-input");
    assert.equal(list.question.preview?.kind, "bullet-list");
  });

  it("never draws Jose 2026-09-20 traditional stems on website Q1", () => {
    const forbidden = [
      /XML stands for/,
      /Wrap each block of ordinary body text/,
      /Office hours policy/,
      /A div heading/,
      /For an uncontrolled /,
      /the list of choices/,
      /Which type should a Save control use/,
      /arrives as the _____ prop/,
    ];
    const forbiddenIds = new Set(["q1-g01-02", "q1-g13-02"]);
    for (const seed of ["jose-review", "user_a:q1", "user_b:q1", "staff-impersonate"]) {
      const drawn = drawWebsiteAttempt("q1", seed);
      for (const item of drawn) {
        assert.equal(forbiddenIds.has(item.question.id), false, item.question.id);
        for (const pattern of forbidden) {
          assert.doesNotMatch(item.question.prompt, pattern, item.question.id);
        }
      }
    }
  });

  it("rejects a traditional-only Q1 canvas draw on the website", () => {
    const coding = WEBSITE_CODING_BANKS.q1.groups.flatMap((group) =>
      group.questions.map((question) => ({ group, question })),
    );
    assert.ok(coding.length >= 2);
    const reason = invalidWebsiteDrawReason("q1", coding.slice(0, 10));
    assert.ok(reason);
  });
});
