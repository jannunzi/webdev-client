import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import {
  PIAZZA_PRIMARY_HREF,
  cs561009TaNote,
  officeHourRowsForSection,
  officeHoursIntro,
  piazzaBoardForSection,
  piazzaBoards,
  staffGroupsForSection,
  staffMembers,
  staffMembersForSection,
} from "./officeHours.ts";

const officeHoursView = readFileSync(
  new URL("../components/OfficeHours.tsx", import.meta.url),
  "utf8",
);
const syllabusNav = readFileSync(
  new URL("../components/SyllabusNav.tsx", import.meta.url),
  "utf8",
);
const syllabusView = readFileSync(
  new URL("../components/SyllabusView.tsx", import.meta.url),
  "utf8",
);

const BY_ID = Object.fromEntries(
  staffMembers.map((member) => [member.id, member]),
);

function namesFor(sectionId: string): string[] {
  return staffMembersForSection(sectionId).map((member) => member.name);
}

describe("Fall 2026 staff office hours (per section)", () => {
  it("assigns each person to official section ids and keeps shared staff on all three", () => {
    assert.deepEqual(BY_ID["jose-annunziato"]?.sectionIds, [
      "cs4550-01",
      "cs5610-02",
      "cs5610-09",
    ]);
    assert.deepEqual(BY_ID["giuseppe-marotta"]?.sectionIds, [
      "cs4550-01",
      "cs5610-02",
      "cs5610-09",
    ]);
    assert.deepEqual(BY_ID["anurag-bheemappa"]?.sectionIds, ["cs4550-01"]);
    assert.deepEqual(BY_ID["shloka-trivedi"]?.sectionIds, ["cs4550-01"]);
    assert.deepEqual(BY_ID["tisha-kotadia"]?.sectionIds, ["cs5610-02"]);
    assert.deepEqual(BY_ID["aryan-mehta"]?.sectionIds, ["cs5610-02"]);
  });

  it("does not mix sections: each view is Jose + Giuseppe + that section’s TAs", () => {
    assert.deepEqual(namesFor("cs4550-01"), [
      "Jose Annunziato",
      "Giuseppe Marotta",
      "Anurag Bheemappa Gnanamurthy",
      "Shloka Shreyans Trivedi",
    ]);
    assert.deepEqual(namesFor("cs5610-02"), [
      "Jose Annunziato",
      "Giuseppe Marotta",
      "Tisha Sujal Kotadia",
      "Aryan Alpesh Mehta",
    ]);
    assert.deepEqual(namesFor("cs5610-09"), [
      "Jose Annunziato",
      "Giuseppe Marotta",
    ]);

    assert.ok(!namesFor("cs4550-01").includes("Tisha Sujal Kotadia"));
    assert.ok(!namesFor("cs4550-01").includes("Aryan Alpesh Mehta"));
    assert.ok(
      !namesFor("cs5610-02").includes("Anurag Bheemappa Gnanamurthy"),
    );
    assert.ok(!namesFor("cs5610-02").includes("Shloka Shreyans Trivedi"));
    assert.equal(namesFor("cs5610-09").length, 2);
  });

  it("builds per-section groups and marks CS 5610-09 section TAs TBD", () => {
    const cs4550 = staffGroupsForSection("cs4550-01");
    assert.deepEqual(
      cs4550.map((group) => group.id),
      ["instructor", "course-wide-ta", "section-tas"],
    );
    assert.deepEqual(
      cs4550.find((group) => group.id === "section-tas")?.members.map(
        (member) => member.name,
      ),
      ["Anurag Bheemappa Gnanamurthy", "Shloka Shreyans Trivedi"],
    );
    assert.equal(cs4550.find((group) => group.id === "section-tas")?.note, undefined);

    const cs561002 = staffGroupsForSection("cs5610-02");
    assert.deepEqual(
      cs561002.find((group) => group.id === "section-tas")?.members.map(
        (member) => member.name,
      ),
      ["Tisha Sujal Kotadia", "Aryan Alpesh Mehta"],
    );

    const cs561009 = staffGroupsForSection("cs5610-09");
    assert.equal(
      cs561009.find((group) => group.id === "section-tas")?.members.length,
      0,
    );
    assert.equal(
      cs561009.find((group) => group.id === "section-tas")?.note,
      cs561009TaNote,
    );
    assert.match(cs561009TaNote, /TBD/);
  });

  it("uses Northeastern school email as primary when one was posted", () => {
    assert.equal(
      BY_ID["jose-annunziato"]?.email,
      "j.annunziato@northeastern.edu",
    );
    assert.equal(
      BY_ID["anurag-bheemappa"]?.email,
      "bheemappagnanamurt.a@northeastern.edu",
    );
    assert.equal(
      BY_ID["shloka-trivedi"]?.email,
      "trivedi.shl@northeastern.edu",
    );
    assert.equal(BY_ID["tisha-kotadia"]?.email, "kotadia.t@northeastern.edu");
    assert.equal(BY_ID["aryan-mehta"]?.email, "mehta.arya@northeastern.edu");
    assert.equal(
      BY_ID["giuseppe-marotta"]?.email,
      "marottagiusi123@gmail.com",
    );
  });

  it("marks missing hours TBD and does not invent Zoom or phone", () => {
    const json = JSON.stringify(staffMembers);
    assert.doesNotMatch(json, /zoom/i);
    assert.doesNotMatch(json, /\bphone\b/i);
    assert.doesNotMatch(json, /\+\d/);

    for (const id of [
      "jose-annunziato",
      "giuseppe-marotta",
      "anurag-bheemappa",
      "shloka-trivedi",
    ]) {
      const member = BY_ID[id];
      assert.equal(member?.hoursStatus, "tbd");
      assert.deepEqual(member?.hours, []);
      assert.match(member?.hoursSummary ?? "", /TBD/i);
    }
  });

  it("keeps Tisha and Aryan Khoury hours on CS 5610-02 only", () => {
    const tisha = BY_ID["tisha-kotadia"];
    assert.equal(tisha?.hoursStatus, "posted");
    assert.deepEqual(tisha?.hours, [
      { days: "Thursday", time: "7–9am and 12:30–2:30pm" },
      { days: "Friday", time: "7–9am and 12:30–2:30pm" },
      { days: "Saturday", time: "7–9am" },
    ]);
    assert.ok(
      officeHourRowsForSection("cs5610-02").some(
        (row) => row.name === "Tisha Sujal Kotadia",
      ),
    );
    assert.ok(
      !officeHourRowsForSection("cs4550-01").some(
        (row) => row.name === "Tisha Sujal Kotadia",
      ),
    );
  });

  it("points each section at its own Piazza board and does not invent CS 5610-09", () => {
    assert.match(officeHoursIntro, /Piazza is the primary place/);
    assert.match(officeHoursIntro, /Do not email staff/);
    assert.equal(
      piazzaBoardForSection("cs4550-01").href,
      PIAZZA_PRIMARY_HREF,
    );
    assert.equal(
      piazzaBoardForSection("cs5610-02").href,
      "https://piazza.com/class/mtugls6qxs5iz/",
    );
    assert.equal(piazzaBoardForSection("cs5610-09").href, undefined);
    assert.ok(
      piazzaBoards.every(
        (board) => board.id !== "cs5610-09" || board.href === undefined,
      ),
    );
  });

  it("filters the syllabus staff section with the shared section tabs", () => {
    assert.match(syllabusView, /<OfficeHours sectionId=\{section\.id\} \/>/);
    assert.match(syllabusView, /useCourseSection/);
    assert.match(syllabusNav, /href: "#office-hours"/);
    assert.match(officeHoursView, /staffGroupsForSection\(sectionId\)/);
    assert.match(officeHoursView, /piazzaBoardForSection/);
    assert.doesNotMatch(officeHoursView, /tel:/);
    assert.doesNotMatch(officeHoursView, /zoom\.us/i);
  });
});
