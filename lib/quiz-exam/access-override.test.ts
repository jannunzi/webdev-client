import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  COURSE_SECTION_IDS,
  courseSectionIdFromRoster,
} from "../roster/sections";
import {
  activeTakeOverride,
  describeTakeAccess,
  isOverridableQuizId,
  listOverridableQuizIds,
  lookupOverrideMode,
  takeOverrideForRosterSection,
  toOverrideView,
} from "./access-override";
import { CHAPTER1_BANK } from "../question-bank";
import { drawOnePerGroup } from "./sample";
import {
  answerWindowCopy,
  etWallTimeToUtc,
  getAnswerRevealPhase,
  getQuizSchedule,
  isTakeWindowOpen,
} from "./schedule";
import { runExamSubmit } from "./submit";
import type { QuizAttemptDoc } from "./types";

function et(year: number, month: number, day: number, hour = 0, minute = 0) {
  return etWallTimeToUtc(year, month, day, hour, minute);
}

const q1 = getQuizSchedule("q1");
assert.ok(q1);

describe("course section ids for quiz overrides", () => {
  it("maps roster labels and short ids to CS4550 / CS5610-02 / CS5610-09", () => {
    assert.deepEqual([...COURSE_SECTION_IDS], [
      "CS4550",
      "CS5610-02",
      "CS5610-09",
    ]);
    assert.equal(courseSectionIdFromRoster("CS4550"), "CS4550");
    assert.equal(courseSectionIdFromRoster("CS4550 CRN 11464"), "CS4550");
    assert.equal(courseSectionIdFromRoster("  CS5610-02 CRN 17395 "), "CS5610-02");
    assert.equal(courseSectionIdFromRoster("CS5610-09 CRN 17396"), "CS5610-09");
    assert.equal(courseSectionIdFromRoster("Impersonation"), undefined);
    assert.equal(courseSectionIdFromRoster(""), undefined);
    assert.equal(courseSectionIdFromRoster("CS5610"), undefined);
  });
});

describe("per-section take overrides", () => {
  const beforeUnlock = et(2026, 9, 27, 12);
  const duringWindow = et(2026, 9, 29, 12);
  const afterLock = et(2026, 10, 6, 12);

  it("follows the date window when mode is schedule or unset", () => {
    assert.equal(isTakeWindowOpen(q1, beforeUnlock), false);
    assert.equal(isTakeWindowOpen(q1, beforeUnlock, "schedule"), false);
    assert.equal(isTakeWindowOpen(q1, beforeUnlock, undefined), false);
    assert.equal(isTakeWindowOpen(q1, duringWindow), true);
    assert.equal(isTakeWindowOpen(q1, duringWindow, "schedule"), true);
    assert.equal(isTakeWindowOpen(q1, afterLock, "schedule"), false);
    assert.equal(getAnswerRevealPhase(q1, beforeUnlock, false), "take_closed");
    assert.equal(
      getAnswerRevealPhase(q1, duringWindow, false, "schedule"),
      "take_open",
    );
    assert.equal(activeTakeOverride("schedule"), undefined);
    assert.equal(activeTakeOverride(undefined), undefined);
    assert.deepEqual(describeTakeAccess(q1, "schedule", duringWindow), {
      open: true,
      mode: "schedule",
      scheduledOpen: true,
    });
  });

  it("force-opens a quiz before the scheduled unlock", () => {
    assert.equal(isTakeWindowOpen(q1, beforeUnlock, "open"), true);
    assert.equal(
      getAnswerRevealPhase(q1, beforeUnlock, false, "open"),
      "take_open",
    );
    assert.deepEqual(describeTakeAccess(q1, "open", beforeUnlock), {
      open: true,
      mode: "open",
      scheduledOpen: false,
    });
  });

  it("force-closes a quiz during the scheduled window", () => {
    assert.equal(isTakeWindowOpen(q1, duringWindow, "closed"), false);
    assert.equal(
      getAnswerRevealPhase(q1, duringWindow, false, "closed"),
      "take_closed",
    );
    assert.deepEqual(describeTakeAccess(q1, "closed", duringWindow), {
      open: false,
      mode: "closed",
      scheduledOpen: true,
    });
  });

  it("does not apply section A’s override to section B", () => {
    const overrides = [
      {
        quizId: "q1",
        sectionId: "CS4550",
        mode: "open" as const,
        updatedAt: beforeUnlock,
      },
      {
        quizId: "q1",
        sectionId: "CS5610-02",
        mode: "closed" as const,
        updatedAt: duringWindow,
      },
    ];
    const a = takeOverrideForRosterSection(
      overrides,
      "q1",
      "CS4550 CRN 11464",
    );
    const b = takeOverrideForRosterSection(
      overrides,
      "q1",
      "CS5610-09 CRN 17396",
    );
    const c = takeOverrideForRosterSection(
      overrides,
      "q1",
      "CS5610-02 CRN 17395",
    );
    assert.equal(a, "open");
    assert.equal(b, undefined);
    assert.equal(c, "closed");
    assert.equal(isTakeWindowOpen(q1, beforeUnlock, a), true);
    assert.equal(isTakeWindowOpen(q1, beforeUnlock, b), false);
    assert.equal(isTakeWindowOpen(q1, duringWindow, c), false);
    assert.equal(
      lookupOverrideMode(overrides, "q2", "CS4550"),
      undefined,
    );
  });

  it("clear / schedule restores the date window", () => {
    assert.equal(isTakeWindowOpen(q1, beforeUnlock, "open"), true);
    assert.equal(isTakeWindowOpen(q1, beforeUnlock, "schedule"), false);
    assert.equal(isTakeWindowOpen(q1, duringWindow, "closed"), false);
    assert.equal(isTakeWindowOpen(q1, duringWindow, "schedule"), true);
    assert.equal(
      getAnswerRevealPhase(q1, beforeUnlock, false, "schedule"),
      "take_closed",
    );
    assert.equal(
      getAnswerRevealPhase(q1, duringWindow, false, "schedule"),
      "take_open",
    );
  });

  it("leaves answer-reveal phases on the date windows even with a take override", () => {
    assert.equal(
      getAnswerRevealPhase(q1, duringWindow, true, "open"),
      "submitted_waiting",
    );
    assert.equal(
      getAnswerRevealPhase(q1, afterLock, true, "closed"),
      "answers_open",
    );
    assert.equal(
      getAnswerRevealPhase(q1, afterLock, false, "open"),
      "take_open",
    );
  });

  it("covers Q1–Q6 take windows and not the X1/X2 stubs", () => {
    assert.deepEqual(listOverridableQuizIds(), [
      "q1",
      "q2",
      "q3",
      "q4",
      "q5",
      "q6",
    ]);
    assert.equal(isOverridableQuizId("q1"), true);
    assert.equal(isOverridableQuizId("x1"), false);
    assert.equal(isOverridableQuizId("x2"), false);
  });

  it("uses section-closed copy instead of the date-window message", () => {
    const copy = answerWindowCopy(q1, "take_closed", duringWindow, "closed");
    assert.match(copy.title, /closed for your section/i);
    assert.match(copy.paragraphs.join(" "), /your section/);
  });

  it("serializes override audit fields for the staff panel", () => {
    const view = toOverrideView({
      quizId: "q1",
      sectionId: "CS4550",
      mode: "open",
      updatedAt: new Date("2026-09-28T16:00:00.000Z"),
      updatedBy: "jannunzi@gmail.com",
    });
    assert.equal(view.updatedAt, "2026-09-28T16:00:00.000Z");
    assert.equal(view.updatedBy, "jannunzi@gmail.com");
    assert.equal(view.mode, "open");
  });
});

describe("submit honors the same per-section take override", () => {
  const drawn = drawOnePerGroup(CHAPTER1_BANK, "override-submit");

  it("accepts a persisted submit when force-open before unlock", async () => {
    const stored: QuizAttemptDoc[] = [];
    const result = await runExamSubmit({
      quizId: "q1",
      drawnQuestionIds: drawn.map((item) => item.question.id),
      answers: {},
      startedAt: "2026-09-27T12:00:00.000Z",
      now: et(2026, 9, 27, 12),
      takeOverride: "open",
      actor: { clerkUserId: "user_early", email: "early@northeastern.edu" },
      roster: {
        status: "matched",
        entry: {
          email: "early@northeastern.edu",
          section: "CS4550 CRN 11464",
        },
      },
      persist: async (doc) => {
        stored.push(doc);
        return { insertedId: "early_1" };
      },
    });
    assert.equal(result.ok, true);
    assert.equal(stored.length, 1);
  });

  it("rejects a persisted submit when force-closed during the window", async () => {
    const stored: QuizAttemptDoc[] = [];
    const result = await runExamSubmit({
      quizId: "q1",
      drawnQuestionIds: drawn.map((item) => item.question.id),
      answers: {},
      startedAt: "2026-09-29T12:00:00.000Z",
      now: et(2026, 9, 29, 12),
      takeOverride: "closed",
      actor: { clerkUserId: "user_closed", email: "closed@northeastern.edu" },
      roster: {
        status: "matched",
        entry: {
          email: "closed@northeastern.edu",
          section: "CS5610-02 CRN 17395",
        },
      },
      persist: async (doc) => {
        stored.push(doc);
        return { insertedId: "nope" };
      },
    });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.code, "take_closed");
    assert.equal(stored.length, 0);
  });
});
