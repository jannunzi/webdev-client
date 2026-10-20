import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, it } from "node:test";
import AssignmentChecklist from "./AssignmentChecklist.tsx";
import { getAssignment } from "../../../lib/assignments/catalog.ts";
import type { AssignmentCheckResult } from "../../../lib/assignments/check-types.ts";
import { routeCaseWarning } from "../../../lib/assignments/student-copy.ts";
import { latestResultByCriterion } from "../../../lib/assignments/checks.ts";

const WARNING: AssignmentCheckResult = {
  id: "route-case-warning",
  label: "Lowercase routes",
  passed: false,
  skipped: true,
  warning: true,
  groupId: "delivery",
  message: routeCaseWarning("/labs/lab3", "/Labs/Lab3"),
};

describe("check warnings on the assignment page", () => {
  it("shows a warning row above the checklist even though no rubric item owns it", () => {
    const assignment = getAssignment("a3")!;
    const results: AssignmentCheckResult[] = [
      { id: "a3-lab-page", label: "Lab 3 page", passed: false, message: "Lab 3 404", criterionId: "a3-lab-page", groupId: "lab" },
      WARNING,
    ];
    assert.equal(latestResultByCriterion(results).size, 1); // the warning has no criterion
    const html = renderToStaticMarkup(
      createElement(AssignmentChecklist, { assignment, rows: [], scored: true, live: true, results, audience: "student" }),
    );
    const at = html.indexOf('data-check-status="warning"');
    assert.ok(at >= 0, "warning block rendered");
    assert.ok(html.includes("/Labs/Lab3 loads"));
    assert.ok(at < html.indexOf("Lab 3 page"), "warning comes before the checklist");
  });

  it("renders nothing when there are no warnings", () => {
    const html = renderToStaticMarkup(
      createElement(AssignmentChecklist, { assignment: getAssignment("a3")!, rows: [], scored: false, live: true, results: [], audience: "student" }),
    );
    assert.ok(!html.includes('data-check-status="warning"'));
  });
});
