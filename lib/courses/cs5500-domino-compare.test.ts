import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  cs5500AiEnhancements,
  cs5500DominoCompareTitle,
  cs5500DominoCourse,
  cs5500DominoOverlap,
  cs5500DominoScheduleMap,
  cs5500DominoSources,
  cs5500DominoUnits,
  cs5500OnlyCmu,
  cs5500OnlyDomino,
  cs5500StructureDiffs,
} from "./cs5500-domino-compare.ts";

describe("CS5500 Domino comparison", () => {
  it("keeps the summary, units, gaps, and sources from the supplied notes", () => {
    assert.equal(
      cs5500DominoCompareTitle,
      "Northeastern CS5500 (Spring 2026, Molly Domino) compared with CMU 17-313",
    );
    assert.equal(cs5500DominoCourse.instructor, "Molly Domino");
    assert.equal(cs5500DominoCourse.exams, "None (no quizzes or exams)");
    assert.match(cs5500DominoCourse.aiPolicy, /cited with the tool and prompt/);
    assert.equal(
      cs5500DominoCourse.grading.reduce((sum, row) => sum + row.pct, 0),
      100,
    );
    assert.equal(cs5500DominoUnits.length, 10);
    assert.equal(cs5500OnlyCmu.length, 8);
    assert.equal(cs5500OnlyDomino.length, 9);
    assert.equal(cs5500StructureDiffs.length, 6);
    assert.equal(cs5500AiEnhancements.length, 10);
    assert.deepEqual(
      cs5500DominoOverlap,
      {
        cmuTopics: 27,
        full: 8,
        partial: 14,
        none: 5,
        weightedPct: 55,
        touchedPct: 81,
        fullyMatchedPct: 30,
        note: "These are rough topic-title estimates.",
      },
    );
    assert.match(cs5500DominoScheduleMap, /weeks 1, 2, 3, 5, 6, 7, 11, 12 and 13/);
    assert.match(cs5500DominoScheduleMap, /weeks 4, 8-10 and 14/);
    assert.equal(
      cs5500DominoSources[0]?.label,
      "Canvas CS5500.39467.202630 (Northeastern login required)",
    );
    assert.equal(
      cs5500DominoSources[0]?.url,
      "https://northeastern.instructure.com/courses/246151",
    );
  });

  it("renders after the AI-courses section and before the proposed schedule", () => {
    const page = readFileSync(join(process.cwd(), "app/cs5500/page.tsx"), "utf8");
    const view = readFileSync(
      join(process.cwd(), "app/cs5500/Cs5500DominoCompare.tsx"),
      "utf8",
    );
    const coursesAt = page.indexOf("<Cs5500AiCourses />");
    const compareAt = page.indexOf("<Cs5500DominoCompare />");
    const scheduleAt = page.indexOf("<Cs5500Schedule />");
    assert.ok(coursesAt >= 0 && compareAt > coursesAt && scheduleAt > compareAt);
    assert.match(view, /id="wd-cs5500-domino"/);
    assert.match(view, /cs5500DominoSources/);
    assert.match(view, /How we could enhance it with AI/);
    assert.match(view, /Only in CMU/);
    assert.match(view, /Only in Northeastern CS5500/);
    assert.match(view, /target="_blank"/);
    assert.match(view, /rel="noopener noreferrer"/);
  });
});
