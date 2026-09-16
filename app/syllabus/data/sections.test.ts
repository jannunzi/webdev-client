import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  CS5610_02_BANNER_MEETING_NOTE,
  CS5610_09_ZOOM_URL,
  findSection,
  isBannerMeetingLabelNote,
  sections,
} from "./sections.ts";

const meetingInfo = readFileSync(
  new URL("../components/MeetingInfo.tsx", import.meta.url),
  "utf8",
);

const BY_ID = Object.fromEntries(sections.map((section) => [section.id, section]));

describe("Fall 2026 section meeting days", () => {
  it("keeps each official section on its locked weekday", () => {
    assert.deepEqual(BY_ID["cs4550-01"]?.daysOfWeek, [3]);
    assert.deepEqual(BY_ID["cs5610-02"]?.daysOfWeek, [1]);
    assert.deepEqual(BY_ID["cs5610-09"]?.daysOfWeek, [2]);
    assert.equal(sections.length, 3);
  });

  it("keeps CS 5610-02 Monday 6–9pm ET in Shillman Hall 105", () => {
    const section = findSection("cs5610-02");
    assert.equal(section.time, "6:00–9:00pm ET");
    assert.equal(section.location, "Shillman Hall 105");
    assert.equal(section.firstClass, "2026-09-14");
    assert.match(
      section.notes[0] ?? "",
      /Meets once a week on Mondays, 6:00–9:00pm ET, starting September 14, 2026/,
    );
  });
});

describe("CS 5610-02 Banner/Canvas meeting label note", () => {
  it("adds a student-facing Banner/Canvas TR correction only on CS 5610-02", () => {
    const section = findSection("cs5610-02");
    assert.ok(section.notes.includes(CS5610_02_BANNER_MEETING_NOTE));
    assert.match(CS5610_02_BANNER_MEETING_NOTE, /BOS-1-TR/);
    assert.match(CS5610_02_BANNER_MEETING_NOTE, /multi-day pattern/);
    assert.match(CS5610_02_BANNER_MEETING_NOTE, /Mondays only/);
    assert.match(CS5610_02_BANNER_MEETING_NOTE, /6:00–9:00pm ET/);
    assert.match(CS5610_02_BANNER_MEETING_NOTE, /Shillman Hall 105/);
    assert.match(CS5610_02_BANNER_MEETING_NOTE, /September 14, 2026/);

    for (const other of sections.filter((section) => section.id !== "cs5610-02")) {
      assert.ok(!other.notes.some(isBannerMeetingLabelNote));
      assert.doesNotMatch(other.notes.join(" "), /BOS-1-TR/);
    }
  });

  it("renders section notes in Meeting information and highlights Banner/Canvas copy", () => {
    assert.match(meetingInfo, /section\.notes\.map/);
    assert.match(meetingInfo, /isBannerMeetingLabelNote/);
    assert.match(meetingInfo, /bg-amber-50/);
  });
});

describe("CS 5610-09 standing Zoom link", () => {
  it("posts the standing Zoom URL only on CS 5610-09", () => {
    const section = findSection("cs5610-09");
    assert.equal(section.zoomUrl, CS5610_09_ZOOM_URL);
    assert.equal(section.zoomUrl, "https://northeastern.zoom.us/j/95309089469");
    assert.equal(section.time, "6:00–9:00pm ET");
    assert.match(section.location, /Tuesdays, 6:00–9:00pm ET/);
    assert.match(
      section.notes[0] ?? "",
      /Meets once a week on Tuesdays, 6:00–9:00pm ET, starting September 15, 2026/,
    );

    for (const other of sections.filter((section) => section.id !== "cs5610-09")) {
      assert.equal(other.zoomUrl, undefined);
    }
  });

  it("renders a labeled external Zoom link from section.zoomUrl", () => {
    assert.match(meetingInfo, /section\.zoomUrl/);
    assert.match(meetingInfo, /Join class \(Zoom\)/);
    assert.match(meetingInfo, /target="_blank"/);
    assert.match(meetingInfo, /rel="noopener noreferrer"/);
  });
});

describe("shared lecture recording policy", () => {
  it("renders the shared recording note in Meeting information", () => {
    assert.match(meetingInfo, /lectureRecordingNote/);
    assert.match(meetingInfo, /holidayMeetingNote/);
    assert.doesNotMatch(meetingInfo, /section\.lectureRecording/);
  });
});
