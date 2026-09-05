import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CHAPTER1_BANK } from "../question-bank";
import { getExamBank } from "./banks";
import { isAnswerCorrect } from "./grade";
import { drawOnePerGroup, findBankQuestion } from "./sample";
import { buildAttemptReview } from "./review";
import { assertNoAnswerLeak, stripCorrectReveals, toStudentQuestion } from "./sanitize";
import { runExamSubmit } from "./submit";
import type { QuizAttemptDoc, StudentAnswer } from "./types";

describe("student exam sampling and grading", () => {
  it("maps q1 to the Chapter 1 bank and draws one question per group", () => {
    const bank = getExamBank("q1");
    assert.equal(bank?.id, CHAPTER1_BANK.id);
    const first = drawOnePerGroup(CHAPTER1_BANK, "user_a:q1-html");
    const again = drawOnePerGroup(CHAPTER1_BANK, "user_a:q1-html");
    const other = drawOnePerGroup(CHAPTER1_BANK, "user_b:q1-html");
    assert.equal(first.length, CHAPTER1_BANK.groups.length);
    assert.deepEqual(
      first.map((item) => item.question.id),
      again.map((item) => item.question.id),
    );
    const groupIds = new Set(first.map((item) => item.group.id));
    assert.equal(groupIds.size, CHAPTER1_BANK.groups.length);
    assert.notDeepEqual(
      first.map((item) => item.question.id),
      other.map((item) => item.question.id),
    );
  });

  it("strips answers from the student payload", () => {
    const drawn = drawOnePerGroup(CHAPTER1_BANK, "sanitize");
    for (const item of drawn) {
      const student = toStudentQuestion(item);
      assertNoAnswerLeak(student);
      assert.equal("correctChoiceId" in student, false);
      assert.equal("acceptedCombinations" in student, false);
    }
  });

  it("grades MC, TF, and FIB including the JSX combination", () => {
    const jsx = findBankQuestion(CHAPTER1_BANK, "q1-g01-03");
    assert.ok(jsx && jsx.question.type === "fill_in_blank");
    assert.equal(
      isAnswerCorrect(jsx.question, {
        type: "fill_in_blank",
        blanks: ["JavaScript", "XML", ""],
      }),
      true,
    );

    const mc = CHAPTER1_BANK.groups
      .flatMap((group) => group.questions)
      .find((question) => question.type === "multiple_choice");
    assert.ok(mc && mc.type === "multiple_choice");
    assert.equal(
      isAnswerCorrect(mc, { type: "multiple_choice", choiceId: mc.correctChoiceId }),
      true,
    );
    assert.equal(
      isAnswerCorrect(mc, { type: "multiple_choice", choiceId: "zzz" }),
      false,
    );

    const tf = CHAPTER1_BANK.groups
      .flatMap((group) => group.questions)
      .find((question) => question.type === "true_false");
    assert.ok(tf && tf.type === "true_false");
    assert.equal(
      isAnswerCorrect(tf, { type: "true_false", value: tf.answer }),
      true,
    );
  });

  it("does not persist when the Clerk user is off the roster", async () => {
    const stored: QuizAttemptDoc[] = [];
    const drawn = drawOnePerGroup(CHAPTER1_BANK, "off-roster");
    const result = await runExamSubmit({
      quizId: "q1",
      drawnQuestionIds: drawn.map((item) => item.question.id),
      answers: {},
      startedAt: new Date().toISOString(),
      actor: { clerkUserId: "user_x", email: "visitor@example.com" },
      roster: { status: "not_on_roster" },
      persist: async (doc) => {
        stored.push(doc);
        return { insertedId: "should-not-run" };
      },
    });
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.code, "not_on_roster");
      assert.match(result.message, /Canvas roster/);
    }
    assert.equal(stored.length, 0);
  });

  it("grades server-side and writes a quiz_attempts document", async () => {
    const stored: QuizAttemptDoc[] = [];
    const drawn = drawOnePerGroup(CHAPTER1_BANK, "on-roster");
    const answers: Record<string, StudentAnswer> = {};
    for (const { question } of drawn) {
      if (question.type === "multiple_choice") {
        answers[question.id] = {
          type: "multiple_choice",
          choiceId: question.correctChoiceId,
        };
      } else if (question.type === "true_false") {
        answers[question.id] = { type: "true_false", value: question.answer };
      } else {
        answers[question.id] = {
          type: "fill_in_blank",
          blanks: question.acceptedCombinations[0] ?? [],
        };
      }
    }

    const result = await runExamSubmit({
      quizId: "q1",
      drawnQuestionIds: drawn.map((item) => item.question.id),
      answers,
      startedAt: "2026-09-29T12:00:00.000Z",
      now: new Date("2026-09-29T12:10:00.000Z"),
      actor: {
        clerkUserId: "user_jane",
        email: "jane.doe@northeastern.edu",
        canvasUserId: "12345",
      },
      roster: {
        status: "matched",
        entry: { email: "jane.doe@northeastern.edu", canvasUserId: "12345" },
      },
      persist: async (doc) => {
        stored.push(doc);
        return { insertedId: "attempt_1" };
      },
    });

    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.persisted, true);
      assert.equal(result.attemptId, "attempt_1");
      assert.equal(result.score, result.maxScore);
      assert.equal(result.maxScore, CHAPTER1_BANK.groups.length);
    }
    assert.equal(stored.length, 1);
    assert.equal(stored[0]?.clerkUserId, "user_jane");
    assert.equal(stored[0]?.quizId, "q1");
    assert.equal(stored[0]?.score, CHAPTER1_BANK.groups.length);
    assert.equal(stored[0]?.meta.source, "student-exam");
    assert.equal(stored[0]?.answers.length, CHAPTER1_BANK.groups.length);
    if (result.ok) {
      assert.equal(result.window?.phase, "submitted_waiting");
      assert.equal(result.window?.revealAnswers, false);
      for (const item of result.graded) {
        assert.equal("correctReveal" in item, false);
      }
    }
  });

  it("rejects a persisted submit after the class-wide take lock", async () => {
    const stored: QuizAttemptDoc[] = [];
    const drawn = drawOnePerGroup(CHAPTER1_BANK, "late");
    const result = await runExamSubmit({
      quizId: "q1",
      drawnQuestionIds: drawn.map((item) => item.question.id),
      answers: {},
      startedAt: "2026-10-04T12:00:00.000Z",
      now: new Date("2026-10-05T04:00:00.000Z"),
      actor: {
        clerkUserId: "user_late",
        email: "late@northeastern.edu",
      },
      roster: {
        status: "matched",
        entry: { email: "late@northeastern.edu", canvasUserId: "9" },
      },
      persist: async (doc) => {
        stored.push(doc);
        return { insertedId: "nope" };
      },
    });
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.code, "take_closed");
    }
    assert.equal(stored.length, 0);
  });

  it("includes correctReveal only when the class answer window is open", async () => {
    const drawn = drawOnePerGroup(CHAPTER1_BANK, "review-open");
    const result = await runExamSubmit({
      quizId: "q1",
      drawnQuestionIds: drawn.map((item) => item.question.id),
      answers: {},
      startedAt: "2026-10-06T12:00:00.000Z",
      now: new Date("2026-10-06T12:00:00.000Z"),
      actor: { clerkUserId: "user_review", email: "jane.doe@northeastern.edu" },
      roster: {
        status: "matched",
        entry: { email: "jane.doe@northeastern.edu", canvasUserId: "12345" },
      },
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.window?.phase, "answers_open");
      assert.equal(result.window?.revealAnswers, true);
      assert.ok(result.graded.every((item) => typeof item.correctReveal === "string"));
    }
  });

  it("grades in-memory and skips persist for an impersonation dummy roster", async () => {
    const drawn = drawOnePerGroup(CHAPTER1_BANK, "impersonation");
    const preview = await runExamSubmit({
      quizId: "q1",
      drawnQuestionIds: drawn.map((item) => item.question.id),
      answers: {},
      startedAt: new Date().toISOString(),
      actor: { clerkUserId: "user_jose", email: "demo.student@webdev.local" },
      roster: {
        status: "matched",
        entry: {
          email: "demo.student@webdev.local",
          name: "Demo Student",
          source: "impersonation",
        },
      },
    });
    assert.equal(preview.ok, true);
    if (preview.ok) {
      assert.equal(preview.persisted, false);
      assert.equal({ ...preview, impersonation: true }.impersonation, true);
    }
  });

  it("rebuilds an attempt review without leaking answers when closed", () => {
    const drawn = drawOnePerGroup(CHAPTER1_BANK, "review-rebuild");
    const attempt: QuizAttemptDoc = {
      clerkUserId: "user_jane",
      quizId: "q1",
      startedAt: new Date("2026-09-29T12:00:00.000Z"),
      submittedAt: new Date("2026-09-29T12:10:00.000Z"),
      score: 0,
      maxScore: drawn.length,
      answers: drawn.map(({ group, question }) => ({
        questionId: question.id,
        groupId: group.id,
        type: question.type,
        response: null,
        correct: false,
        points: 0,
      })),
      meta: {
        drawnQuestionIds: drawn.map((item) => item.question.id),
        source: "student-exam",
      },
    };

    const hidden = buildAttemptReview(attempt, false);
    assert.ok(hidden);
    assert.equal(hidden.questions.length, drawn.length);
    for (const question of hidden.questions) {
      assertNoAnswerLeak(question);
    }
    for (const item of hidden.graded) {
      assert.equal("correctReveal" in item, false);
    }

    const shown = buildAttemptReview(attempt, true);
    assert.ok(shown);
    assert.ok(shown.graded.every((item) => typeof item.correctReveal === "string"));
    assert.equal(stripCorrectReveals(shown.graded).every((item) => !("correctReveal" in item)), true);
  });
});
