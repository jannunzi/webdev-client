import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  COURSE_SECTION_IDS,
  UNSECTIONED_LABEL,
  courseSectionIdFromRoster,
  groupRosterBySection,
  isCourseSectionId,
  studentDisplayName,
} from "./sections";

describe("roster sections", () => {
  it("groups by section, sorts names, and buckets missing sections", () => {
    const groups = groupRosterBySection([
      {
        email: "zara@northeastern.edu",
        name: "Zara Nguyen",
        section: "CS5610-02 CRN 17395",
      },
      {
        email: "alex@northeastern.edu",
        name: "alex rivera",
        section: "CS4550 CRN 11464",
      },
      {
        email: "bailey@northeastern.edu",
        name: "Bailey Chen",
        section: "CS4550 CRN 11464",
      },
      { email: "no-section@northeastern.edu", name: "Pat Lee" },
    ]);

    assert.deepEqual(
      groups.map((group) => group.section),
      ["CS4550 CRN 11464", "CS5610-02 CRN 17395", UNSECTIONED_LABEL],
    );
    assert.deepEqual(
      groups[0]?.students.map((student) => studentDisplayName(student)),
      ["alex rivera", "Bailey Chen"],
    );
    assert.equal(groups[1]?.students[0]?.email, "zara@northeastern.edu");
    assert.equal(groups[2]?.students[0]?.name, "Pat Lee");
  });

  it("normalizes Canvas section labels to CS4550 / CS5610-02 / CS5610-09", () => {
    assert.equal(isCourseSectionId("CS4550"), true);
    assert.equal(isCourseSectionId("CS4550 CRN 11464"), false);
    assert.equal(courseSectionIdFromRoster("CS4550 CRN 11464"), "CS4550");
    assert.equal(courseSectionIdFromRoster("CS5610-02 CRN 17395"), "CS5610-02");
    assert.equal(courseSectionIdFromRoster("CS5610-09"), "CS5610-09");
    assert.equal(courseSectionIdFromRoster(UNSECTIONED_LABEL), undefined);
    assert.ok(COURSE_SECTION_IDS.includes("CS4550"));
  });
});
