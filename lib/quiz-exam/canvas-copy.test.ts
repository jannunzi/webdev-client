import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CANVAS_FALLBACK_PERMISSION_BLURB,
  CANVAS_FALLBACK_QUIZZES,
  canvasFallbackIdent,
  canvasQuizDescriptionHtml,
  canvasQuizTakeUrl,
  listCanvasQuizFollowupCopy,
} from "./canvas-copy";

describe("Canvas quiz fallback copy", () => {
  it("keeps the website take URL first and a staff-permission blurb", () => {
    for (const quiz of CANVAS_FALLBACK_QUIZZES) {
      const html = canvasQuizDescriptionHtml(quiz);
      const url = canvasQuizTakeUrl(quiz.quizId);
      assert.match(html, new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
      assert.match(html, /webdev-client\.vercel\.app\/quizzes\/take\//);
      assert.match(html, /ask your instructor or TA for permission/i);
      assert.doesNotMatch(html, /use this Canvas quiz instead of the website/i);
      assert.doesNotMatch(html, /take this Canvas quiz by default/i);
      assert.doesNotMatch(html, /Clerk|Kambaz|Lab [0-9]|wd-/i);
      assert.ok(html.indexOf(url) < html.indexOf(CANVAS_FALLBACK_PERMISSION_BLURB));
    }
  });

  it("lists Q1–Q6 and X1/X2 with stable fallback identifiers", () => {
    const copy = listCanvasQuizFollowupCopy();
    assert.deepEqual(
      copy.map((row) => row.quizId),
      ["q1", "q2", "q3", "q4", "q5", "q6", "x1", "x2"],
    );
    assert.equal(canvasFallbackIdent("q1"), "gwebdev_q1_fallback");
    assert.equal(copy[0]?.ident, "gwebdev_q1_fallback");
  });
});
