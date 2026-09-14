import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import {
  PIAZZA_PRIMARY_HREF,
  cs561009TaNote,
  officeHourRows,
  officeHoursIntro,
  piazzaBoards,
  staffGroups,
  staffMembers,
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

describe("Fall 2026 staff office hours (Piazza scrape)", () => {
  it("publishes the instructor and TAs from the scrape, and no one else", () => {
    assert.deepEqual(
      staffMembers.map((member) => member.name),
      [
        "Jose Annunziato",
        "Giuseppe Marotta",
        "Anurag Bheemappa Gnanamurthy",
        "Shloka Shreyans Trivedi",
        "Tisha Sujal Kotadia",
        "Aryan Alpesh Mehta",
      ],
    );
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
    assert.equal(
      BY_ID["tisha-kotadia"]?.email,
      "kotadia.t@northeastern.edu",
    );
    assert.equal(BY_ID["aryan-mehta"]?.email, "mehta.arya@northeastern.edu");
    assert.equal(
      BY_ID["giuseppe-marotta"]?.email,
      "marottagiusi123@gmail.com",
    );
  });

  it("keeps posted alternate and additional school emails, and no extras", () => {
    assert.deepEqual(BY_ID["jose-annunziato"]?.alsoEmails, [
      "jga@ccs.neu.edu",
      "jga@ccis.neu.edu",
    ]);
    assert.deepEqual(BY_ID["jose-annunziato"]?.altEmails, [
      "jannunzi@gmail.com",
    ]);
    assert.deepEqual(BY_ID["anurag-bheemappa"]?.altEmails, [
      "anurag9596eng@gmail.com",
    ]);
    assert.deepEqual(BY_ID["shloka-trivedi"]?.altEmails, [
      "shloka.trivedi02@gmail.com",
    ]);
    assert.deepEqual(BY_ID["tisha-kotadia"]?.altEmails, [
      "tisha.kotadia@hotmail.com",
    ]);
    assert.deepEqual(BY_ID["aryan-mehta"]?.altEmails, [
      "aryanmehta5902@gmail.com",
    ]);
    assert.equal(BY_ID["giuseppe-marotta"]?.altEmails, undefined);
    assert.equal(BY_ID["giuseppe-marotta"]?.alsoEmails, undefined);
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
      assert.match(member?.hoursSummary ?? "", /TBD|coming soon/i);
    }
  });

  it("publishes Tisha and Aryan Khoury hours exactly as listed", () => {
    const tisha = BY_ID["tisha-kotadia"];
    assert.equal(tisha?.hoursStatus, "posted");
    assert.equal(tisha?.location, "Khoury");
    assert.equal(tisha?.teams, "@Tisha Sujal Kotadia");
    assert.deepEqual(tisha?.hours, [
      { days: "Thursday", time: "7–9am and 12:30–2:30pm" },
      { days: "Friday", time: "7–9am and 12:30–2:30pm" },
      { days: "Saturday", time: "7–9am" },
    ]);
    assert.match(tisha?.hoursNote ?? "", /10 hours/);
    assert.match(tisha?.hoursNote ?? "", /4 hours\/week/);

    const aryan = BY_ID["aryan-mehta"];
    assert.equal(aryan?.hoursStatus, "posted");
    assert.equal(aryan?.location, "Khoury");
    assert.equal(aryan?.teams, "@Aryan Mehta");
    assert.deepEqual(aryan?.hours, [
      { days: "Thursday", time: "6–9pm" },
      { days: "Friday", time: "6–9pm" },
      { days: "Saturday", time: "12–2pm and 5–7pm" },
    ]);
  });

  it("groups by role and section and notes CS 5610-09 TBA", () => {
    assert.deepEqual(
      staffGroups.map((group) => group.id),
      [
        "instructor",
        "course-wide-ta",
        "cs4550-tas",
        "cs5610-02-tas",
        "cs5610-09-tas",
      ],
    );
    assert.equal(staffGroups[4]?.members.length, 0);
    assert.match(cs561009TaNote, /CS 5610-09/);
    assert.match(cs561009TaNote, /TBA/);
    assert.equal(staffGroups[4]?.note, cs561009TaNote);
  });

  it("points students to Piazza as primary Q&A and known section boards", () => {
    assert.match(officeHoursIntro, /Piazza is the primary place/);
    assert.match(officeHoursIntro, /Do not email staff/);
    assert.equal(PIAZZA_PRIMARY_HREF, "https://piazza.com/class/mtkw93ft8hw8w/");
    assert.deepEqual(
      piazzaBoards.map((board) => board.href),
      [
        "https://piazza.com/class/mtkw93ft8hw8w/",
        "https://piazza.com/class/mtugls6qxs5iz/",
      ],
    );
    assert.ok(
      !piazzaBoards.some((board) => /5610-09/.test(board.label)),
      "do not invent a CS 5610-09 Piazza URL",
    );
  });

  it("keeps a summary table row per staff member", () => {
    assert.equal(officeHourRows.length, staffMembers.length);
    assert.ok(officeHourRows.every((row) => row.contact.includes("@")));
    assert.equal(
      officeHourRows.find((row) => row.name === "Tisha Sujal Kotadia")
        ?.location,
      "Khoury",
    );
    assert.equal(
      officeHourRows.find((row) => row.name === "Jose Annunziato")?.location,
      "—",
    );
  });

  it("renders the staff section on the syllabus and groups by role/section", () => {
    assert.match(syllabusView, /<OfficeHours \/>/);
    assert.match(syllabusNav, /href: "#office-hours"/);
    assert.match(syllabusNav, /Staff \/ OH/);
    assert.match(officeHoursView, /Staff and office hours/);
    assert.match(officeHoursView, /staffGroups\.map/);
    assert.match(officeHoursView, /hoursStatus === "tbd"/);
    assert.match(officeHoursView, /piazzaBoards\.map/);
    assert.doesNotMatch(officeHoursView, /tel:/);
    assert.doesNotMatch(officeHoursView, /zoom\.us/i);
  });

  it("keeps Piazza source posts for TAs who posted hours or intros", () => {
    assert.deepEqual(
      BY_ID["anurag-bheemappa"]?.sources?.map((source) => source.href),
      ["https://piazza.com/class/mtkw93ft8hw8w/post/13"],
    );
    assert.deepEqual(
      BY_ID["shloka-trivedi"]?.sources?.map((source) => source.href),
      ["https://piazza.com/class/mtkw93ft8hw8w/post/11"],
    );
    assert.deepEqual(
      BY_ID["tisha-kotadia"]?.sources?.map((source) => source.href),
      ["https://piazza.com/class/mtugls6qxs5iz/post/11"],
    );
    assert.deepEqual(
      BY_ID["aryan-mehta"]?.sources?.map((source) => source.href),
      [
        "https://piazza.com/class/mtugls6qxs5iz/post/13",
        "https://piazza.com/class/mtugls6qxs5iz/post/14",
      ],
    );
  });
});
