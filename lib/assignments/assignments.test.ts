import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { A1_RUBRIC } from "./a1";
import {
  A1_MANUAL_CRITERION_IDS,
  a1CriterionCoverage,
  evaluateRubricSpec,
} from "./a1-rubric";
import { A2_RUBRIC } from "./a2";
import { listCanvasFollowupCopy } from "./canvas-copy";
import { supportsUrlSubmission } from "./access";
import {
  COURSE_SITE_ORIGIN,
  findCriterion,
  getAssignment,
  listAssignmentIds,
  listAssignments,
  listRubricCriteria,
  rubricPointTotal,
} from "./catalog";
import {
  applyCriterionToggle,
  loadCompletedCriterionIds,
  mergeCompletedIds,
  parseLocalProgress,
  resolveProgressSnapshot,
  serializeLocalProgress,
  summarizeProgress,
  upsertCriterionProgress,
  type ProgressStore,
} from "./progress-store";
import type { AssignmentProgressDoc } from "./types";

function memoryProgressStore(): ProgressStore {
  const docs: AssignmentProgressDoc[] = [];
  return {
    async list(clerkUserId, assignmentId) {
      return docs.filter(
        (doc) =>
          doc.clerkUserId === clerkUserId && doc.assignmentId === assignmentId,
      );
    },
    async upsert(input) {
      const index = docs.findIndex(
        (doc) =>
          doc.clerkUserId === input.clerkUserId &&
          doc.assignmentId === input.assignmentId &&
          doc.criterionId === input.criterionId,
      );
      const next: AssignmentProgressDoc = {
        ...input,
        updatedAt: new Date(),
      };
      if (index === -1) docs.push(next);
      else docs[index] = next;
    },
  };
}

describe("assignment catalog", () => {
  it("lists A1–A6 from the syllabus and marks A1/A2 ready", () => {
    const ids = listAssignmentIds();
    assert.deepEqual(ids, ["a1", "a2", "a3", "a4", "a5", "a6"]);
    const items = listAssignments();
    assert.equal(items.length, 6);
    assert.equal(getAssignment("A1")?.status, "ready");
    assert.equal(getAssignment("a2")?.status, "ready");
    assert.equal(getAssignment("a3")?.status, "coming_soon");
    assert.equal(getAssignment("a1")?.dueDate, "2026-10-01");
    assert.equal(getAssignment("a2")?.dueDate, "2026-10-13");
    assert.equal(getAssignment("a6")?.dueDate, "2026-12-03");
    assert.equal(getAssignment("a1")?.chapterHref, "/book/ch1");
    for (const item of items) {
      const chapterNumber = item.id.slice(1);
      assert.equal(item.chapterHref, `/book/ch${chapterNumber}`);
      assert.ok(item.chapterTitle.length > 0);
      assert.equal(
        item.publicUrl,
        `${COURSE_SITE_ORIGIN}/assignments/${item.id}`,
      );
    }
  });

  it("lists Canvas follow-up URLs without dumping the rubric", () => {
    const copy = listCanvasFollowupCopy();
    assert.equal(copy.length, 6);
    assert.deepEqual(
      copy.map((row) => row.publicUrl),
      [
        "https://webdev-client.vercel.app/assignments/a1",
        "https://webdev-client.vercel.app/assignments/a2",
        "https://webdev-client.vercel.app/assignments/a3",
        "https://webdev-client.vercel.app/assignments/a4",
        "https://webdev-client.vercel.app/assignments/a5",
        "https://webdev-client.vercel.app/assignments/a6",
      ],
    );
    for (const row of copy) {
      assert.match(row.html, /school email/);
      assert.doesNotMatch(row.html, /Clerk|rubric|Best \/ Better/i);
    }
  });

  it("keeps unique criterion ids and book deep links on A1 and A2", () => {
    for (const rubric of [A1_RUBRIC, A2_RUBRIC]) {
      const criteria = listRubricCriteria(rubric);
      const ids = criteria.map((row) => row.id);
      assert.equal(new Set(ids).size, ids.length);
      assert.ok(criteria.length > 0);
      assert.ok(rubricPointTotal(rubric) > 0);
      for (const row of criteria) {
        assert.ok(row.points > 0);
        assert.ok(row.bookHref, `${row.id} is missing bookHref`);
        assert.match(row.bookHref ?? "", /^\/book\/ch[1-6]#sec-/);
      }
      assert.ok(findCriterion(rubric, criteria[0].id));
    }
    assert.equal(
      A1_RUBRIC.groups.map((group) => group.id).join(","),
      "delivery,lab,kambaz",
    );
    assert.ok(findCriterion(A1_RUBRIC, "a1-lab-heading-tags"));
    assert.ok(findCriterion(A1_RUBRIC, "a1-kambaz-assignments")?.onYourOwn);
    assert.equal(supportsUrlSubmission("a1"), true);

    const autoIds = listRubricCriteria(A1_RUBRIC)
      .filter((row) => a1CriterionCoverage(row.id) === "auto")
      .map((row) => row.id);
    const manualIds = listRubricCriteria(A1_RUBRIC)
      .filter((row) => a1CriterionCoverage(row.id) === "manual")
      .map((row) => row.id);
    assert.ok(autoIds.includes("a1-delivery-vercel"));
    assert.ok(autoIds.includes("a1-lab-forms"));
    assert.ok(autoIds.includes("a1-kambaz-account"));
    assert.deepEqual(manualIds, [...A1_MANUAL_CRITERION_IDS]);

    const heading = evaluateRubricSpec(
      {
        criterionId: "a1-lab-heading-tags",
        groupId: "lab",
        label: "HeadingTags",
        kind: "headings",
        requireAllIds: ["wd-h-tag"],
        headingLevels: [1, 2, 3, 4, 5, 6],
        passMessage: "ok",
        failMessage: "missing",
      },
      "<div id=\"wd-h-tag\"><h1></h1><h2></h2><h3></h3><h4></h4><h5></h5><h6></h6></div>",
    );
    assert.equal(heading.passed, true);
    const headingFail = evaluateRubricSpec(
      {
        criterionId: "a1-lab-heading-tags",
        groupId: "lab",
        label: "HeadingTags",
        kind: "headings",
        requireAllIds: ["wd-h-tag"],
        headingLevels: [1, 2, 3, 4, 5, 6],
        passMessage: "ok",
        failMessage: "missing",
      },
      "<div id=\"wd-h-tag\"><h4>Heading Tags</h4></div>",
    );
    assert.equal(headingFail.passed, false);
    assert.equal(supportsUrlSubmission("a2"), false);
  });
});

describe("assignment progress helpers", () => {
  it("toggles, merges, and summarizes checklist progress", () => {
    const assignment = getAssignment("a1");
    assert.ok(assignment?.rubric);
    let completed = applyCriterionToggle([], "a1-delivery-vercel", true);
    completed = applyCriterionToggle(completed, "a1-delivery-github", true);
    completed = applyCriterionToggle(completed, "a1-delivery-github", false);
    assert.deepEqual(completed, ["a1-delivery-vercel"]);
    assert.deepEqual(
      mergeCompletedIds(completed, ["a1-delivery-github", "a1-delivery-vercel"]),
      ["a1-delivery-github", "a1-delivery-vercel"],
    );
    const summary = summarizeProgress(assignment, completed);
    assert.equal(summary.completedCount, 1);
    assert.equal(summary.earnedPoints, 3);
    assert.equal(summary.totalCount, listRubricCriteria(assignment.rubric).length);
    assert.equal(summary.totalPoints, rubricPointTotal(assignment.rubric));
  });

  it("round-trips localStorage JSON", () => {
    const raw = serializeLocalProgress(["a1-lab-tables", "a1-lab-images"]);
    assert.deepEqual(parseLocalProgress(raw).sort(), [
      "a1-lab-images",
      "a1-lab-tables",
    ]);
    assert.deepEqual(parseLocalProgress('["a1-lab-forms"]'), ["a1-lab-forms"]);
    assert.deepEqual(parseLocalProgress("not-json"), []);
    assert.deepEqual(
      resolveProgressSnapshot(["a1-delivery-vercel"], null),
      ["a1-delivery-vercel"],
    );
    assert.deepEqual(
      resolveProgressSnapshot(
        ["a1-delivery-vercel"],
        serializeLocalProgress([]),
      ),
      [],
    );
  });

  it("upserts per clerk user + assignment + criterion", async () => {
    const store = memoryProgressStore();
    await upsertCriterionProgress(store, {
      clerkUserId: "user_1",
      assignmentId: "a1",
      criterionId: "a1-delivery-vercel",
      completed: true,
    });
    await upsertCriterionProgress(store, {
      clerkUserId: "user_1",
      assignmentId: "a1",
      criterionId: "a1-delivery-github",
      completed: true,
    });
    await upsertCriterionProgress(store, {
      clerkUserId: "user_2",
      assignmentId: "a1",
      criterionId: "a1-delivery-vercel",
      completed: true,
    });
    await upsertCriterionProgress(store, {
      clerkUserId: "user_1",
      assignmentId: "a1",
      criterionId: "a1-delivery-github",
      completed: false,
    });
    assert.deepEqual(
      await loadCompletedCriterionIds(store, "user_1", "a1"),
      ["a1-delivery-vercel"],
    );
    assert.deepEqual(await loadCompletedCriterionIds(store, "user_2", "a1"), [
      "a1-delivery-vercel",
    ]);
    assert.equal(applyCriterionToggle([], "x", true).includes("x"), true);
  });
});
