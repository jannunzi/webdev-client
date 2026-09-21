import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  adjacentQuizStaffKeys,
  buildQuizStaffQueue,
  canPersistQuizGradeOverride,
  canViewQuizStaffAttempts,
  filterQuizStaffQueueBySection,
  findQuizStaffStudent,
  firstAttemptKey,
  parseQuizStaffStudentKey,
  quizStaffAccess,
  staffAttemptsHref,
} from "./staff";
import type { QuizAttemptDoc } from "./types";

function attempt(
  partial: Partial<QuizAttemptDoc> & { clerkUserId: string },
): QuizAttemptDoc {
  return {
    quizId: "q1",
    startedAt: new Date("2026-09-22T12:00:00.000Z"),
    submittedAt: new Date("2026-09-22T12:10:00.000Z"),
    score: 80,
    maxScore: 100,
    answers: [],
    meta: { drawnQuestionIds: ["q1-g01-01"], source: "student-exam" },
    ...partial,
  };
}

describe("quiz attempt documents stay in Atlas", () => {
  it("never deletes quiz_attempts (including asd@asd.com Q1)", () => {
    const root = process.cwd();
    const files = [
      "lib/quiz-exam/attempts.ts",
      "lib/quiz-exam/grade-overrides.ts",
      "app/quizzes/staff/actions.ts",
    ];
    for (const file of files) {
      const src = readFileSync(join(root, file), "utf8");
      if (file.endsWith("attempts.ts")) {
        assert.doesNotMatch(src, /deleteOne|deleteMany|findOneAndDelete/, file);
      } else {
        assert.doesNotMatch(
          src,
          /quiz_attempts[\s\S]{0,80}delete|delete[\s\S]{0,80}quiz_attempts/,
          file,
        );
      }
    }
  });
});

describe("quiz staff attempt access", () => {
  it("is staff-only and hidden while impersonating", () => {
    assert.deepEqual(
      quizStaffAccess({ isActualStaff: false, impersonating: false }),
      { canView: false, canPersist: false },
    );
    assert.equal(canViewQuizStaffAttempts(true, true), false);
    assert.equal(canViewQuizStaffAttempts(true, false), true);
    assert.equal(canPersistQuizGradeOverride(true, true), false);
  });
});

describe("quiz staff student queue", () => {
  it("joins roster entries to attempts and keeps leftover asd@asd.com", () => {
    const queue = buildQuizStaffQueue(
      [
        {
          email: "jane.doe@northeastern.edu",
          name: "Doe, Jane",
          section: "CS4550 CRN 11464",
          canvasUserId: "c1",
        },
        {
          email: "pat@northeastern.edu",
          name: "Pat Lee",
          section: "CS4550 CRN 11464",
        },
      ],
      [
        attempt({
          clerkUserId: "user_jane",
          email: "Jane.Doe@northeastern.edu",
          meta: {
            drawnQuestionIds: ["q1-g01-01"],
            rosterEmail: "jane.doe@northeastern.edu",
            source: "student-exam",
          },
        }),
        attempt({
          clerkUserId: "user_asd",
          email: "asd@asd.com",
          score: 40,
          meta: {
            drawnQuestionIds: ["q1-g01-01"],
            rosterEmail: "asd@asd.com",
            source: "student-exam",
          },
        }),
      ],
    );
    assert.equal(queue.length, 3);
    assert.equal(queue[0]?.email, "jane.doe@northeastern.edu");
    assert.equal(queue[0]?.hasAttempt, true);
    assert.equal(queue[1]?.email, "pat@northeastern.edu");
    assert.equal(queue[1]?.hasAttempt, false);
    const asd = findQuizStaffStudent(queue, "asd@asd.com");
    assert.ok(asd);
    assert.equal(asd.hasAttempt, true);
    assert.equal(asd.score, 40);
    assert.equal(firstAttemptKey(queue), "jane.doe@northeastern.edu");
  });

  it("navigates prev/next and builds the staff attempts href", () => {
    const queue = buildQuizStaffQueue(
      [],
      [
        attempt({ clerkUserId: "user_a", email: "ada@ada.com" }),
        attempt({ clerkUserId: "user_b", email: "bob@bob.com" }),
      ],
    );
    const { previous, next, index } = adjacentQuizStaffKeys(queue, "bob@bob.com");
    assert.equal(index, 1);
    assert.equal(previous, "ada@ada.com");
    assert.equal(next, null);
    assert.equal(
      staffAttemptsHref("q1", { student: "asd@asd.com", section: "CS4550 CRN 11464" }),
      "/quizzes/staff/q1/attempts?section=CS4550+CRN+11464&student=asd%40asd.com",
    );
    assert.deepEqual(parseQuizStaffStudentKey("clerk:user_x"), {
      clerkUserId: "user_x",
    });
    assert.equal(filterQuizStaffQueueBySection(queue, "").length, 2);
  });
});

describe("staff attempt review always shows answers", () => {
  it("rebuilds staff review with the key even when students would be hidden", () => {
    const page = readFileSync(
      join(process.cwd(), "app/quizzes/staff/[quizId]/attempts/page.tsx"),
      "utf8",
    );
    assert.match(page, /buildAttemptReview\(attempt, true/);
    assert.match(page, /student-facing/);
    assert.match(
      readFileSync(
        join(process.cwd(), "app/quizzes/staff/components/StaffAttemptBrowser.tsx"),
        "utf8",
      ),
      /revealAnswers/,
    );
  });
});
