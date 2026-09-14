import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import {
  PIAZZA_PRIMARY_HREF,
  cs561009TaNote,
  officeHourRowsForSection,
  officeHoursIntro,
  officeHoursQueueHref,
  piazzaBoardForSection,
  piazzaBoards,
  queueEnabledForMember,
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
const piazzaHoursView = readFileSync(
  new URL("../../piazza-hours/PiazzaHoursView.tsx", import.meta.url),
  "utf8",
);
const officeHoursPage = readFileSync(
  new URL("../../office-hours/page.tsx", import.meta.url),
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
    assert.match(cs561009TaNote, /TBA/);
    assert.match(cs561009TaNote, /Piazza-only/i);
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

  it("keeps Jose and Anurag TBD, Giuseppe Piazza-only, and does not invent Zoom", () => {
    const json = JSON.stringify(staffMembers);
    assert.doesNotMatch(json, /zoom\.us/i);
    assert.doesNotMatch(json, /zoom\.com/i);

    assert.equal(BY_ID["jose-annunziato"]?.hoursStatus, "tbd");
    assert.deepEqual(BY_ID["jose-annunziato"]?.hours, []);
    assert.match(BY_ID["jose-annunziato"]?.hoursSummary ?? "", /TBD/i);

    assert.equal(BY_ID["anurag-bheemappa"]?.hoursStatus, "tbd");
    assert.deepEqual(BY_ID["anurag-bheemappa"]?.hours, []);
    assert.match(BY_ID["anurag-bheemappa"]?.hoursSummary ?? "", /TBD/i);

    assert.equal(BY_ID["giuseppe-marotta"]?.piazzaOnly, true);
    assert.equal(queueEnabledForMember(BY_ID["giuseppe-marotta"]!), false);
    assert.match(BY_ID["giuseppe-marotta"]?.hoursSummary ?? "", /Piazza only/i);
  });

  it("publishes confirmed 2026-09-14 hours, phones, and Teams names", () => {
    const shloka = BY_ID["shloka-trivedi"];
    assert.equal(shloka?.hoursStatus, "posted");
    assert.equal(shloka?.email, "trivedi.shl@northeastern.edu");
    assert.equal(shloka?.phone, "+1 857-427-7547");
    assert.equal(shloka?.teams, "trivedi.shl@northeastern.edu");
    assert.deepEqual(shloka?.hours, [
      { days: "Tuesday", time: "11am–12pm" },
      { days: "Wednesday", time: "11am–12pm" },
      { days: "Thursday", time: "11am–1pm" },
    ]);
    assert.deepEqual(shloka?.piazzaHours, [
      { days: "Tuesday", time: "9–11am" },
      { days: "Wednesday", time: "9–11am" },
    ]);

    const tisha = BY_ID["tisha-kotadia"];
    assert.equal(tisha?.hoursStatus, "posted");
    assert.equal(tisha?.phone, "+1 857-605-9277");
    assert.equal(tisha?.teams, "@Tisha Sujal Kotadia");
    assert.deepEqual(tisha?.hours, [
      { days: "Monday", time: "8–10am" },
      { days: "Thursday", time: "8–10am" },
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

    const aryan = BY_ID["aryan-mehta"];
    assert.equal(aryan?.phone, "857-507-0827");
    assert.equal(aryan?.teams, "@Aryan Mehta");
    assert.deepEqual(aryan?.hours, [
      { days: "Friday", time: "9–11am" },
      { days: "Saturday", time: "9–11am" },
    ]);
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
    assert.match(officeHoursView, /Join line/);
    assert.match(officeHoursView, /View line/);
    assert.match(officeHoursView, /officeHoursQueueHref/);
    assert.doesNotMatch(officeHoursView, /zoom\.us/i);
    assert.equal(
      officeHoursQueueHref("shloka-trivedi", "cs4550-01"),
      "/office-hours/queue/shloka-trivedi?section=cs4550-01",
    );
    assert.match(piazzaHoursView, /staffMembersForSection/);
    assert.match(piazzaHoursView, /piazzaHoursSummary/);
    assert.match(piazzaHoursView, /Piazza-only/);
    assert.match(officeHoursPage, /OfficeHoursView/);
    assert.match(officeHoursPage, /Giuseppe is Piazza-only/);
  });
});
