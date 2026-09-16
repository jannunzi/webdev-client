import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { A1_RUBRIC } from "./a1";
import {
  A1_LAB_EXERCISES,
  a1LabCriteria,
  a1LabManualIds,
} from "./a1-lab-exercises";
import { A1_MANUAL_CRITERION_IDS, evaluateRubricSpec } from "./a1-rubric";

describe("A1 Lab catalog / §1.3.12 parity", () => {
  it("walks 1.3.1–1.3.11 as create, On your own, With AI per section", () => {
    const sections = [...new Set(A1_LAB_EXERCISES.map((row) => row.section))];
    assert.deepEqual(sections, [
      "1.3.1",
      "1.3.2",
      "1.3.3",
      "1.3.4",
      "1.3.5",
      "1.3.6",
      "1.3.7",
      "1.3.8",
      "1.3.9",
      "1.3.10",
      "1.3.11",
    ]);
    for (const section of sections) {
      const kinds = A1_LAB_EXERCISES.filter((row) => row.section === section).map(
        (row) => row.kind,
      );
      assert.deepEqual(
        kinds,
        ["core", "oyo", "ai"],
        `${section} should be create, On your own, With AI`,
      );
    }
  });

  it("keeps A1 Lab checklist labels and ids identical to the catalog, in order", () => {
    const labGroup = A1_RUBRIC.groups.find((group) => group.id === "lab");
    assert.ok(labGroup);
    assert.deepEqual(
      labGroup.criteria.map((row) => row.id),
      A1_LAB_EXERCISES.map((row) => row.id),
    );
    assert.deepEqual(
      labGroup.criteria.map((row) => row.label),
      A1_LAB_EXERCISES.map((row) => row.label),
    );
    assert.deepEqual(
      labGroup.criteria.map((row) => row.description),
      A1_LAB_EXERCISES.map((row) => row.description),
    );
    assert.deepEqual(labGroup.criteria, a1LabCriteria());
  });

  it("includes every book With AI extra as an A1 check item", () => {
    const ai = A1_LAB_EXERCISES.filter((row) => row.kind === "ai");
    assert.equal(ai.length, 11);
    assert.ok(ai.every((row) => row.label.endsWith("— With AI")));
    assert.ok(
      ai.every((row) => labGroupHas(row.id) && labGroupHasLabel(row.label)),
    );
    assert.deepEqual(
      ai.map((row) => row.id),
      [
        "a1-lab-heading-tags-ai",
        "a1-lab-paragraph-ai",
        "a1-lab-lists-ai",
        "a1-lab-tables-ai",
        "a1-lab-images-ai",
        "a1-lab-forms-ai",
        "a1-lab-highlighted-paragraph-ai",
        "a1-lab-highlighted-box-ai",
        "a1-lab-anchor-ai",
        "a1-lab-labs-nav-ai",
        "a1-lab-toc-ai",
      ],
    );
  });

  it("marks catalog manual rows as A1 manual criteria", () => {
    assert.deepEqual(A1_MANUAL_CRITERION_IDS, a1LabManualIds());
    assert.ok(A1_MANUAL_CRITERION_IDS.includes("a1-lab-forms-ai"));
    assert.ok(
      A1_MANUAL_CRITERION_IDS.includes("a1-lab-highlighted-paragraph-oyo"),
    );
    assert.ok(A1_MANUAL_CRITERION_IDS.includes("a1-lab-toc-oyo"));
    assert.equal(
      A1_MANUAL_CRITERION_IDS.includes("a1-delivery-labs-nav"),
      false,
    );
  });

  it("auto-checks With AI extras that have a stable id or snippet", () => {
    const headings = evaluateRubricSpec(
      {
        criterionId: "a1-lab-heading-tags-ai",
        groupId: "lab",
        label: "HeadingTags — With AI",
        kind: "ids",
        requireAllIds: ["wd-ai-headings"],
        passMessage: "ok",
        failMessage: "missing",
      },
      '<div id="wd-ai-headings"></div>',
    );
    assert.equal(headings.passed, true);
    const quizRows = evaluateRubricSpec(
      {
        criterionId: "a1-lab-tables-ai",
        groupId: "lab",
        label: "Tables — With AI",
        kind: "ids",
        requireHtmlIncludes: ["Q4", "Q10"],
        passMessage: "ok",
        failMessage: "missing",
      },
      "<table><tr><td>Q4</td></tr><tr><td>Q10</td></tr></table>",
    );
    assert.equal(quizRows.passed, true);
    const quizFail = evaluateRubricSpec(
      {
        criterionId: "a1-lab-tables-ai",
        groupId: "lab",
        label: "Tables — With AI",
        kind: "ids",
        requireHtmlIncludes: ["Q4", "Q10"],
        passMessage: "ok",
        failMessage: "missing",
      },
      "<table><tr><td>Q1</td></tr><tr><td>Q3</td></tr></table>",
    );
    assert.equal(quizFail.passed, false);
  });
});

function labGroupHas(id: string): boolean {
  return (
    A1_RUBRIC.groups
      .find((group) => group.id === "lab")
      ?.criteria.some((row) => row.id === id) ?? false
  );
}

function labGroupHasLabel(label: string): boolean {
  return (
    A1_RUBRIC.groups
      .find((group) => group.id === "lab")
      ?.criteria.some((row) => row.label === label) ?? false
  );
}
