import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  agendaGroupsBySection,
  agendasBySection,
  buildAgenda,
  buildAgendaGroups,
} from "./agenda.ts";
import { formatWeekOf, mondayOfWeek } from "./dates.ts";
import { holidayMeetingNote } from "./holidays.ts";
import { findSection, sections } from "./sections.ts";
import {
  ORIENTATION_TOPIC,
  SHARED_CURRICULUM_START,
  bookChapterHeading,
  lectureTopics,
} from "./topics.ts";

const BY_ID = Object.fromEntries(sections.map((section) => [section.id, section]));

const WEEK_MAP = [
  { monday: "2026-09-14", topic: lectureTopics[0]!.topic, lectureNumber: 1 },
  { monday: "2026-09-21", topic: lectureTopics[1]!.topic, lectureNumber: 2 },
  { monday: "2026-09-28", topic: lectureTopics[2]!.topic, lectureNumber: 3 },
  { monday: "2026-10-05", topic: lectureTopics[3]!.topic, lectureNumber: 4 },
  { monday: "2026-10-12", topic: lectureTopics[4]!.topic, lectureNumber: 5 },
  { monday: "2026-10-19", topic: lectureTopics[5]!.topic, lectureNumber: 6 },
  { monday: "2026-10-26", topic: lectureTopics[6]!.topic, lectureNumber: 7 },
  { monday: "2026-11-02", topic: lectureTopics[7]!.topic, lectureNumber: 8 },
  { monday: "2026-11-09", topic: lectureTopics[8]!.topic, lectureNumber: 9 },
  { monday: "2026-11-16", topic: lectureTopics[9]!.topic, lectureNumber: 10 },
  { monday: "2026-11-23", topic: lectureTopics[10]!.topic, lectureNumber: 11 },
  { monday: "2026-11-30", topic: lectureTopics[11]!.topic, lectureNumber: 12 },
  { monday: "2026-12-07", topic: lectureTopics[12]!.topic, lectureNumber: 13 },
] as const;

describe("Fall 2026 lectureTopics", () => {
  it("is the 13-week book spine with X1 after Chapter 3 and X2 last", () => {
    assert.equal(lectureTopics.length, 13);
    assert.match(lectureTopics[0]!.topic, /Chapter 1 week 1/);
    assert.match(lectureTopics[1]!.topic, /Chapter 1 week 2/);
    assert.match(lectureTopics[2]!.topic, /Chapter 2 week 1/);
    assert.match(lectureTopics[3]!.topic, /Chapter 2 week 2/);
    assert.match(lectureTopics[4]!.topic, /Chapter 3/);
    assert.match(lectureTopics[4]!.topic, /chapter wrap/);
    assert.match(lectureTopics[5]!.topic, /^X1 midterm/);
    assert.match(lectureTopics[6]!.topic, /Chapter 4 week 1/);
    assert.match(lectureTopics[7]!.topic, /Chapter 4 week 2/);
    assert.match(lectureTopics[8]!.topic, /Chapter 5 week 1/);
    assert.match(lectureTopics[9]!.topic, /Chapter 5 week 2/);
    assert.match(lectureTopics[10]!.topic, /Chapter 6 week 1/);
    assert.match(lectureTopics[11]!.topic, /Chapter 6 week 2/);
    assert.match(lectureTopics[12]!.topic, /^X2 final/);
  });
});

describe("buildAgenda shared week index", () => {
  it("uses September 9 as orientation for CS 4550 only", () => {
    const wed = buildAgenda(BY_ID["cs4550-01"]!);
    assert.equal(wed[0]?.date, "2026-09-09");
    assert.equal(wed[0]?.kind, "orientation");
    assert.equal(wed[0]?.topic, ORIENTATION_TOPIC);
    assert.equal(wed[0]?.lectureNumber, undefined);

    const mon = buildAgenda(BY_ID["cs5610-02"]!);
    const tue = buildAgenda(BY_ID["cs5610-09"]!);
    assert.equal(mon[0]?.date, SHARED_CURRICULUM_START);
    assert.equal(mon[0]?.kind, "lecture");
    assert.equal(tue[0]?.kind, "lecture");
  });

  it("gives Mon/Tue/Wed sections the same topic and lecture number each week", () => {
    const agendas = {
      mon: buildAgenda(BY_ID["cs5610-02"]!),
      tue: buildAgenda(BY_ID["cs5610-09"]!),
      wed: buildAgenda(BY_ID["cs4550-01"]!),
    };

    for (const week of WEEK_MAP) {
      const rows = Object.values(agendas).map((agenda) =>
        agenda.find((row) => mondayOfWeek(row.date) === week.monday),
      );
      assert.equal(rows.length, 3);
      for (const row of rows) {
        assert.ok(row, `missing row for week of ${week.monday}`);
        assert.equal(row.kind, "lecture");
        assert.equal(row.lectureNumber, week.lectureNumber);
        assert.equal(row.topic, week.topic);
      }
    }
  });

  it("does not skip a lecture week for holidays", () => {
    const mon = buildAgenda(BY_ID["cs5610-02"]!);
    const ipd = mon.find((row) => row.date === "2026-10-12");
    assert.equal(ipd?.kind, "lecture");
    assert.equal(ipd?.lectureNumber, 5);
    assert.match(ipd?.topic ?? "", /Chapter 3/);
    assert.match(ipd?.onlineNote ?? "", /Indigenous Peoples/);
    assert.match(ipd?.onlineNote ?? "", /meets online/);

    const wed = buildAgenda(BY_ID["cs4550-01"]!);
    const veterans = wed.find((row) => row.date === "2026-11-11");
    assert.equal(veterans?.kind, "lecture");
    assert.equal(veterans?.lectureNumber, 9);
    assert.match(veterans?.topic ?? "", /Chapter 5 week 1/);
    assert.match(veterans?.onlineNote ?? "", /Veterans Day/);

    const thanksgiving = mon.find((row) => row.date === "2026-11-23");
    assert.equal(thanksgiving?.kind, "lecture");
    assert.equal(thanksgiving?.lectureNumber, 11);
    assert.match(thanksgiving?.topic ?? "", /Chapter 6 week 1/);
    assert.match(thanksgiving?.onlineNote ?? "", /Thanksgiving/);
  });

  it("places X2 in the last week of classes", () => {
    for (const section of sections) {
      const rows = buildAgenda(section);
      const lastLecture = [...rows].reverse().find((row) => row.kind === "lecture");
      assert.equal(lastLecture?.lectureNumber, 13);
      assert.match(lastLecture?.topic ?? "", /^X2 final/);
      assert.equal(mondayOfWeek(lastLecture!.date), "2026-12-07");
    }
  });

  it("never emits a holiday-only row that drops the chapter topic", () => {
    for (const section of sections) {
      const rows = buildAgenda(section);
      assert.equal(
        rows.some((row) => (row as { kind: string }).kind === "holiday"),
        false,
      );
      for (const row of rows.filter((item) => item.onlineNote)) {
        assert.equal(row.kind, "lecture");
        assert.match(row.topic, /Chapter|X1|X2/);
      }
    }
  });

  it("precomputes one agenda per official section", () => {
    assert.deepEqual(Object.keys(agendasBySection).sort(), [
      "cs4550-01",
      "cs5610-02",
      "cs5610-09",
    ]);
  });
});

describe("holiday meeting copy", () => {
  it("tells students holidays do not skip the sequence", () => {
    assert.match(holidayMeetingNote, /Thanksgiving week/);
    assert.match(holidayMeetingNote, /do not skip a lecture week/);
    assert.match(holidayMeetingNote, /meets online/);
    assert.doesNotMatch(holidayMeetingNote, /blackout/);
    assert.doesNotMatch(holidayMeetingNote, /no class/);
  });
});

describe("agenda Week of labels and chapter groups", () => {
  it("uses the same Week of Monday for Mon/Tue/Wed dates", () => {
    assert.equal(formatWeekOf("2026-09-14"), "Week of Sep 14");
    assert.equal(formatWeekOf("2026-09-15"), "Week of Sep 14");
    assert.equal(formatWeekOf("2026-09-16"), "Week of Sep 14");
    assert.equal(SHARED_CURRICULUM_START, "2026-09-14");
  });

  it("groups weeks under real book titles, X1 after Chapter 3, and X2 last", () => {
    const groups = buildAgendaGroups(findSection("cs5610-02"));
    assert.deepEqual(
      groups.map((group) => group.kind),
      ["chapter", "chapter", "chapter", "exam", "chapter", "chapter", "chapter", "exam"],
    );
    assert.equal(groups[0]?.heading, bookChapterHeading(1));
    assert.match(groups[0]?.heading ?? "", /^Chapter 1: /);
    assert.match(groups[0]?.heading ?? "", /HTML/);
    assert.equal(groups[1]?.heading, bookChapterHeading(2));
    assert.equal(groups[2]?.heading, bookChapterHeading(3));
    assert.equal(groups[3]?.heading, "X1");
    assert.equal(groups[4]?.heading, bookChapterHeading(4));
    assert.equal(groups[5]?.heading, bookChapterHeading(5));
    assert.equal(groups[6]?.heading, bookChapterHeading(6));
    assert.equal(groups[7]?.heading, "X2");

    assert.equal(groups[0]?.rows.length, 2);
    assert.equal(mondayOfWeek(groups[0]!.rows[0]!.date), "2026-09-14");
    assert.equal(groups[2]?.rows.length, 1);
    assert.match(groups[3]?.rows[0]?.topic ?? "", /^X1/);
    assert.equal(mondayOfWeek(groups[7]!.rows[0]!.date), "2026-12-07");
  });

  it("keeps CS 4550 Sep 9 as an orientation group before Chapter 1", () => {
    const groups = buildAgendaGroups(findSection("cs4550-01"));
    assert.equal(groups[0]?.kind, "orientation");
    assert.equal(groups[0]?.rows[0]?.date, "2026-09-09");
    assert.equal(groups[1]?.kind, "chapter");
    assert.equal(groups[1]?.chapter, 1);
    assert.equal(mondayOfWeek(groups[1]!.rows[0]!.date), "2026-09-14");
    assert.equal(Object.keys(agendaGroupsBySection).length, sections.length);
  });
});
