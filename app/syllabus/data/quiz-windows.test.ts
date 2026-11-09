import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { deadlines, deadlinesNote } from "./deadlines.ts";
import {
  CANVAS_QUIZ_WINDOWS_NOTE,
  formatSectionQuizWindow,
  sectionQuizWindows,
  sectionQuizWindowsForLabel,
} from "./quiz-windows.ts";

const deadlinesTable = readFileSync(
  new URL("../components/DeadlinesTable.tsx", import.meta.url),
  "utf8",
);
const agendaTable = readFileSync(
  new URL("../components/AgendaTable.tsx", import.meta.url),
  "utf8",
);
const takePage = readFileSync(
  new URL("../../quizzes/take/page.tsx", import.meta.url),
  "utf8",
);
const quizWindowsSource = readFileSync(
  new URL("./quiz-windows.ts", import.meta.url),
  "utf8",
);

describe("Canvas section quiz windows", () => {
  it("lists only the confirmed Q4 and Q5 Canvas windows", () => {
    assert.deepEqual(
      sectionQuizWindows("q4").map(formatSectionQuizWindow),
      [
        "CS 5610-02: Mon Nov 9 8:30–10:00 PM",
        "CS 5610-09: Tue Nov 10 8:00 AM – Sun Nov 15 11:59 PM",
        "CS 4550-01: Wed Nov 18, 7:30–9:00 PM ET, in class at the end of lecture",
      ],
    );
    assert.deepEqual(sectionQuizWindows("Q5").map(formatSectionQuizWindow), [
      "CS 5610-02: Mon Nov 23 8:30–10:00 PM",
    ]);
    for (const id of ["q1", "q2", "q3", "q6", "x1", "x2"]) {
      assert.deepEqual(sectionQuizWindows(id), [], id);
    }
  });

  it("does not use the website Q4 lock or answer week as a take date", () => {
    const q4 = sectionQuizWindows("q4").map(formatSectionQuizWindow).join("\n");
    assert.match(q4, /CS 5610-09: Tue Nov 10 8:00 AM – Sun Nov 15 11:59 PM/);
    assert.doesNotMatch(q4, /Nov 11|November 11|11\/11/);
    assert.doesNotMatch(q4, /Nov 16|November 16|11\/16/);
    assert.doesNotMatch(q4, /Nov 23|November 23|11\/23/);
    assert.doesNotMatch(q4, /Veterans Day/);
    assert.equal(
      sectionQuizWindowsForLabel("Q4 — Client state · week of Nov 9")
        .find((row) => row.section === "CS 4550-01")?.window,
      "Wed Nov 18, 7:30–9:00 PM ET, in class at the end of lecture",
    );
  });

  it("keeps week-of quiz labels and shows windows beside them", () => {
    const q4 = deadlines.find((deadline) => deadline.label.startsWith("Q4 "));
    const q5 = deadlines.find((deadline) => deadline.label.startsWith("Q5 "));
    assert.equal(q4?.label, "Q4 — Client state · week of Nov 9");
    assert.equal(q5?.label, "Q5 — REST APIs · week of Nov 23");
    assert.equal(sectionQuizWindowsForLabel(q4?.label ?? "").length, 3);
    assert.equal(sectionQuizWindowsForLabel(q5?.label ?? "").length, 1);
    assert.match(deadlinesTable, /QuizSectionWindows/);
    assert.match(agendaTable, /QuizSectionWindows/);
    assert.match(takePage, /QuizSectionWindows/);
    assert.match(deadlinesTable, /CANVAS_QUIZ_WINDOWS_NOTE/);
    assert.match(agendaTable, /CANVAS_QUIZ_WINDOWS_NOTE/);
    assert.match(takePage, /CANVAS_QUIZ_WINDOWS_NOTE/);
    assert.equal(
      CANVAS_QUIZ_WINDOWS_NOTE,
      "Canvas is the source of truth for exact quiz windows.",
    );
    assert.doesNotMatch(quizWindowsSource, /from\s+["'].*schedule/);
    assert.doesNotMatch(quizWindowsSource, /takeLockAt|answersOpenAt|answersCloseAt/);
  });

  it("points assignment due dates at Canvas without saying they are missing", () => {
    assert.match(deadlinesNote, /Exact assignment due dates are in Canvas\./);
    assert.doesNotMatch(deadlinesNote, /will be posted on Canvas/);
    assert.doesNotMatch(deadlinesNote, /A4–A6 due dates will be posted/);
  });
});
