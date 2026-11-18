import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { cs5500AiCourses } from "./cs5500-ai-courses.ts";
import { cs5500AiSection } from "./cs5500-ai-strategies.ts";
import {
  cs5500Schedule,
  cs5500ScheduleNote,
  sweAtGoogle,
} from "./cs5500-schedule.ts";

describe("CS5500 courses already teaching AI", () => {
  it("lists the five source courses with a link and a note", () => {
    assert.deepEqual(
      cs5500AiCourses.map((course) => course.url),
      [
        "https://cmu-313.github.io/",
        "https://themodernsoftware.dev/",
        "https://courses.cs.washington.edu/courses/cse403/26au/",
        "https://cs169.org/fa26",
        "https://cs50.harvard.edu/x/honesty/",
      ],
    );
    for (const course of cs5500AiCourses) {
      assert.ok(course.name.trim());
      assert.ok(course.school.trim());
      assert.ok(course.note.trim());
      assert.ok(course.url.startsWith("https://"));
    }
    assert.match(cs5500AiCourses[0]?.note ?? "", /opencode/);
    assert.equal(cs5500AiCourses[3]?.links?.[0]?.url, "https://saasbook.info/");
  });
});

describe("CS5500 proposed schedule", () => {
  it("has 14 weeks and the required fields on every week", () => {
    assert.equal(cs5500Schedule.length, 14);
    assert.deepEqual(
      cs5500Schedule.map((week) => week.week),
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    );
    assert.equal(
      cs5500ScheduleNote,
      "Draft based on CMU 17-313 Fall 2026 and Software Engineering at Google; AI enhancements per week to come.",
    );
    assert.equal(sweAtGoogle.url, "https://abseil.io/resources/swe-book");
    assert.match(sweAtGoogle.title, /Software Engineering at Google/);
    for (const week of cs5500Schedule) {
      assert.ok(week.title.trim(), `week ${week.week} title`);
      assert.ok(week.lessons.length >= 1, `week ${week.week} lessons`);
      assert.ok(week.reading.trim(), `week ${week.week} reading`);
      assert.ok(week.assignment.trim(), `week ${week.week} assignment`);
      assert.ok(week.basedOn.trim(), `week ${week.week} basedOn`);
      for (const lesson of week.lessons) {
        assert.equal(lesson.includes("\n"), false);
      }
    }
    assert.equal(
      cs5500Schedule[0]?.title,
      "Introduction to software engineering & responsible AI use",
    );
    assert.equal(
      cs5500Schedule[13]?.title,
      "Reliable releases & final presentations",
    );
  });

  it("renders both new sections and leaves the AI proposals in place", () => {
    const page = readFileSync(join(process.cwd(), "app/cs5500/page.tsx"), "utf8");
    const courses = readFileSync(
      join(process.cwd(), "app/cs5500/Cs5500AiCourses.tsx"),
      "utf8",
    );
    const schedule = readFileSync(
      join(process.cwd(), "app/cs5500/Cs5500Schedule.tsx"),
      "utf8",
    );
    assert.match(page, /Cs5500AiStrategies/);
    assert.match(page, /Cs5500AiCourses/);
    assert.match(page, /Cs5500Schedule/);
    assert.equal(cs5500AiSection.title, "Bringing AI into the CS5500 topics");
    assert.equal(cs5500AiSection.status, "proposals");
    assert.match(courses, /target="_blank"/);
    assert.match(courses, /rel="noopener noreferrer"/);
    assert.match(courses, /id="wd-cs5500-ai-courses"/);
    assert.match(schedule, /id="wd-cs5500-schedule"/);
    assert.match(schedule, /Based on:/);
    assert.match(schedule, /cs5500ScheduleNote/);
  });
});
