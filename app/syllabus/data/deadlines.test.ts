import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  deadlines,
  deadlinesNote,
  formatQuizDeadlineLabel,
  quizLectureMeetingDayNote,
} from "./deadlines.ts";

const deadlinesTable = readFileSync(
  new URL("../components/DeadlinesTable.tsx", import.meta.url),
  "utf8",
);
const agendaTable = readFileSync(
  new URL("../components/AgendaTable.tsx", import.meta.url),
  "utf8",
);

describe("quiz lecture meeting-day copy", () => {
  it("spells out that Week-of quiz dates are each section’s own meeting day", () => {
    assert.match(
      quizLectureMeetingDayNote,
      /your section’s own meeting that week/,
    );
    assert.match(
      quizLectureMeetingDayNote,
      /CS 5610-02 Mondays 6:00–9:00pm ET/,
    );
    assert.match(
      quizLectureMeetingDayNote,
      /CS 5610-09 Tuesdays 6:00–9:00pm ET \(online\)/,
    );
    assert.match(
      quizLectureMeetingDayNote,
      /CS 4550-01 Wednesdays 6:00–9:00pm ET/,
    );
    assert.match(
      quizLectureMeetingDayNote,
      /not a calendar day labeled “today,”/,
    );
    assert.match(quizLectureMeetingDayNote, /not any weekday that week/);
    assert.match(
      quizLectureMeetingDayNote,
      /Q1 in the week of Sep 21 is Mon Sep 21 for CS 5610-02, Tue Sep 22 for CS 5610-09, and Wed Sep 23 for CS 4550/,
    );
    assert.equal(deadlinesNote.includes(quizLectureMeetingDayNote), true);
    assert.doesNotMatch(quizLectureMeetingDayNote, /less runway/i);
    assert.doesNotMatch(quizLectureMeetingDayNote, /do not slide/i);
    assert.doesNotMatch(quizLectureMeetingDayNote, /section starts later/i);
  });

  it("labels Q1–Q6 as Week of · end of lecture on that section’s meeting day", () => {
    assert.equal(
      formatQuizDeadlineLabel("2026-09-21"),
      "Week of Sep 21 · end of lecture (your section’s meeting day)",
    );
    assert.equal(
      formatQuizDeadlineLabel("2026-10-05"),
      "Week of Oct 5 · end of lecture (your section’s meeting day)",
    );
    const quizDates = deadlines
      .filter((deadline) => deadline.kind === "quiz")
      .map((deadline) => deadline.date);
    assert.deepEqual(quizDates, [
      "2026-09-21",
      "2026-10-05",
      "2026-10-19",
      "2026-11-02",
      "2026-11-16",
      "2026-11-30",
    ]);
  });

  it("uses the shared meeting-day label on Shared deadlines and agenda quiz rows", () => {
    assert.match(deadlinesTable, /formatQuizDeadlineLabel/);
    assert.match(agendaTable, /formatQuizDeadlineLabel/);
    assert.match(agendaTable, /quizLectureMeetingDayNote/);
    assert.match(agendaTable, /deadline\.kind === "quiz"/);
  });
});
