import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatMeetingWeekdays,
  formatMonthDayYear,
  formatSectionMeetsSentence,
} from "./dates.ts";
import { sections } from "./sections.ts";

describe("formatMonthDayYear", () => {
  it("formats without a leading weekday", () => {
    assert.equal(formatMonthDayYear("2026-09-09"), "September 9, 2026");
    assert.equal(formatMonthDayYear("2026-09-14"), "September 14, 2026");
    assert.equal(formatMonthDayYear("2026-09-15"), "September 15, 2026");
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

  it("does not use possessive grammar", () => {
    const sentence = formatSectionMeetsSentence([3], "2026-09-09");
    assert.match(sentence, /^This section meets /);
    assert.doesNotMatch(sentence, /section['’]s/);
    assert.doesNotMatch(sentence, /first class is/);
  });
});
