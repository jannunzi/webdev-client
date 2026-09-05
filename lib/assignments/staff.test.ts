import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  adjacentStaffStudentKeys,
  buildStaffStudentQueue,
  canPersistStaffGrade,
  canViewStaffGrader,
  findStaffStudent,
  parseStaffStudentKey,
  staffGraderAccess,
} from "./staff";
import type { AssignmentSubmissionDoc } from "./submissions-store";

function submission(
  partial: Partial<AssignmentSubmissionDoc> & { clerkUserId: string },
): AssignmentSubmissionDoc {
  return {
    assignmentId: "a1",
    githubUrl: "https://github.com/jane-doe/webdev-client",
    vercelUrl: "https://jane-a1.vercel.app",
    createdAt: new Date("2026-09-05T12:00:00.000Z"),
    updatedAt: new Date("2026-09-05T12:00:00.000Z"),
    ...partial,
  };
}

describe("staff grader access helpers", () => {
  it("is staff-only and hidden while impersonating", () => {
    assert.deepEqual(
      staffGraderAccess({ isActualStaff: false, impersonating: false }),
      { canView: false, canPersist: false },
    );
    assert.equal(canViewStaffGrader(false, false), false);
    assert.equal(canViewStaffGrader(false, true), false);
    assert.equal(canViewStaffGrader(true, true), false);
    assert.equal(canViewStaffGrader(true, false), true);
  });

  it("does not persist staff grades while impersonating", () => {
    assert.equal(canPersistStaffGrade(true, true), false);
    assert.equal(canPersistStaffGrade(true, false), true);
    assert.equal(canPersistStaffGrade(false, false), false);
  });
});

describe("staff student queue", () => {
  it("joins roster entries to submissions and keeps students without a URL", () => {
    const queue = buildStaffStudentQueue(
      [
        {
          email: "jane.doe@northeastern.edu",
          name: "Doe, Jane",
          section: "CS4550-01",
          canvasUserId: "c1",
        },
        {
          email: "pat@northeastern.edu",
          name: "Pat Lee",
          section: "CS4550-01",
        },
      ],
      [
        submission({
          clerkUserId: "user_jane",
          rosterEmail: "Jane.Doe@northeastern.edu",
          email: "jane.doe@northeastern.edu",
          name: "Jane Doe",
          vercelUrl: "https://jane-a1.vercel.app",
        }),
      ],
    );
    assert.equal(queue.length, 2);
    assert.equal(queue[0].email, "jane.doe@northeastern.edu");
    assert.equal(queue[0].hasSubmission, true);
    assert.equal(queue[0].clerkUserId, "user_jane");
    assert.equal(queue[0].vercelUrl, "https://jane-a1.vercel.app");
    assert.equal(queue[1].email, "pat@northeastern.edu");
    assert.equal(queue[1].hasSubmission, false);
  });

  it("appends unmatched submissions after the roster", () => {
    const queue = buildStaffStudentQueue(
      [{ email: "on-roster@northeastern.edu", name: "On Roster" }],
      [
        submission({
          clerkUserId: "user_orphan",
          email: "orphan@northeastern.edu",
          name: "Orphan",
        }),
      ],
    );
    assert.equal(queue.length, 2);
    assert.equal(queue[0].email, "on-roster@northeastern.edu");
    assert.equal(queue[1].key, "orphan@northeastern.edu");
    assert.equal(queue[1].hasSubmission, true);
  });

  it("walks previous/next keys for the navigator", () => {
    const queue = buildStaffStudentQueue(
      [
        { email: "a@northeastern.edu", name: "Ada" },
        { email: "b@northeastern.edu", name: "Bea" },
        { email: "c@northeastern.edu", name: "Cyd" },
      ],
      [],
    );
    const mid = adjacentStaffStudentKeys(queue, "b@northeastern.edu");
    assert.equal(mid.previous, "a@northeastern.edu");
    assert.equal(mid.next, "c@northeastern.edu");
    assert.equal(findStaffStudent(queue, "B@northeastern.edu")?.name, "Bea");
    assert.equal(adjacentStaffStudentKeys(queue, "a@northeastern.edu").previous, null);
    assert.deepEqual(parseStaffStudentKey("Pat@Northeastern.edu"), {
      email: "pat@northeastern.edu",
    });
    assert.deepEqual(parseStaffStudentKey("clerk:user_1"), {
      clerkUserId: "user_1",
    });
  });
});
