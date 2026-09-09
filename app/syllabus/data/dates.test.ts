import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatMeetingWeekdays,
  formatMonthDayYear,
  formatSectionMeetsSentence,
  formatWeekOf,
  mondayOfWeek,
  startOfWeekMonday,
  wholeWeeksBetween,
} from "./dates.ts";
import { sections } from "./sections.ts";

describe("formatMonthDayYear", () => {
  it("formats without a leading weekday", () => {
    assert.equal(formatMonthDayYear("2026-09-09"), "September 9, 2026");
    assert.equal(formatMonthDayYear("2026-09-14"), "September 14, 2026");
    assert.equal(formatMonthDayYear("2026-09-15"), "September 15, 2026");
  });
});

describe("formatWeekOf", () => {
  it("labels the shared Monday for Mon/Tue/Wed dates in the same week", () => {
    assert.equal(startOfWeekMonday("2026-09-14"), "2026-09-14");
    assert.equal(startOfWeekMonday("2026-09-15"), "2026-09-14");
    assert.equal(startOfWeekMonday("2026-09-16"), "2026-09-14");
    assert.equal(formatWeekOf("2026-09-14"), "Week of Sep 14");
    assert.equal(formatWeekOf("2026-09-15"), "Week of Sep 14");
    assert.equal(formatWeekOf("2026-09-16"), "Week of Sep 14");
    assert.equal(formatWeekOf("2026-12-07"), "Week of Dec 7");
  });
});

describe("formatMeetingWeekdays", () => {
  it("pluralizes weekdays", () => {
    assert.equal(formatMeetingWeekdays([1]), "Mondays");
    assert.equal(formatMeetingWeekdays([2]), "Tuesdays");
    assert.equal(formatMeetingWeekdays([3]), "Wednesdays");
  });
});

describe("formatSectionMeetsSentence", () => {
  it("uses meets + weekday + starting date for every official section", () => {
    const expected = {
      "cs4550-01":
        "This section meets Wednesdays, starting September 9, 2026.",
      "cs5610-02":
        "This section meets Mondays, starting September 14, 2026.",
      "cs5610-09":
        "This section meets Tuesdays, starting September 15, 2026.",
    };

    for (const section of sections) {
      assert.equal(
        formatSectionMeetsSentence(section.daysOfWeek, section.firstClass),
        expected[section.id as keyof typeof expected],
      );
    }
    assert.equal(sections.length, 3);
  });

  it("posts Shillman Hall 105 for both in-person sections and leaves the online Zoom TBA", () => {
    const byId = Object.fromEntries(
      sections.map((section) => [section.id, section]),
    );
    assert.equal(byId["cs4550-01"]?.location, "Shillman Hall 105");
    assert.equal(byId["cs5610-02"]?.location, "Shillman Hall 105");
    assert.match(byId["cs5610-09"]?.location ?? "", /TBA/);
  });

  it("does not use possessive grammar", () => {
    const sentence = formatSectionMeetsSentence([3], "2026-09-09");
    assert.match(sentence, /^This section meets /);
    assert.doesNotMatch(sentence, /section['’]s/);
    assert.doesNotMatch(sentence, /first class is/);
  });
});

describe("mondayOfWeek and wholeWeeksBetween", () => {
  it("maps midweek dates to the Monday of that week", () => {
    assert.equal(mondayOfWeek("2026-09-14"), "2026-09-14");
    assert.equal(mondayOfWeek("2026-09-15"), "2026-09-14");
    assert.equal(mondayOfWeek("2026-09-16"), "2026-09-14");
    assert.equal(mondayOfWeek("2026-09-20"), "2026-09-14");
    assert.equal(mondayOfWeek("2026-10-12"), "2026-10-12");
  });

  it("counts shared curriculum weeks from September 14", () => {
    assert.equal(wholeWeeksBetween("2026-09-14", "2026-09-14"), 0);
    assert.equal(wholeWeeksBetween("2026-09-14", "2026-10-12"), 4);
    assert.equal(wholeWeeksBetween("2026-09-14", "2026-11-23"), 10);
    assert.equal(wholeWeeksBetween("2026-09-14", "2026-12-07"), 12);
  });
});
