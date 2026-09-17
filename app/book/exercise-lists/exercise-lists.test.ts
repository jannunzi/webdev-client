import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BOOK_EXERCISE_RECAPS,
  CH2_KAMBAZ_EXERCISES,
  CH2_LAB_EXERCISES,
  CH3_KAMBAZ_EXERCISES,
  CH3_LAB_EXERCISES,
  CH4_KAMBAZ_EXERCISES,
  CH4_LAB_EXERCISES,
  CH5_LAB_EXERCISES,
} from "./catalogs.ts";
import type { BookExerciseParent } from "./types.ts";

function parentLabels(groups: readonly BookExerciseParent[]): string[] {
  return groups.map((group) => group.parentLabel);
}

function kinds(group: BookExerciseParent): string[] {
  return group.tasks.map((task) => task.kind);
}

describe("book exercise recap catalogs", () => {
  it("keeps one parent per existing recap topic, never repeating the title as siblings", () => {
    assert.deepEqual(parentLabels(CH2_LAB_EXERCISES), [
      "Lab 2 page and CSS file",
      "Selectors",
      "Color, border, and box model",
      "Position, float, flex, and media queries",
      "React Icons",
      "Tailwind samples",
    ]);
    assert.deepEqual(parentLabels(CH2_KAMBAZ_EXERCISES), [
      "Kambaz Navigation",
      "Dashboard",
      "Course Navigation",
      "Modules",
      "Home",
      "People",
      "Assignments",
      "Assignment Editor",
      "Account screens",
    ]);
    assert.equal(CH3_LAB_EXERCISES.length, 10);
    assert.equal(CH3_KAMBAZ_EXERCISES.length, 10);
    assert.equal(CH4_LAB_EXERCISES.length, 12);
    assert.equal(CH4_KAMBAZ_EXERCISES.length, 7);
    assert.equal(CH5_LAB_EXERCISES.length, 8);
    assert.equal(new Set(parentLabels(CH4_LAB_EXERCISES)).size, 12);
  });

  it("nests Lab / On your own / With AI under parents that have those blocks", () => {
    assert.deepEqual(kinds(CH4_LAB_EXERCISES[1]!), ["core", "oyo", "ai"]);
    assert.deepEqual(kinds(CH4_LAB_EXERCISES[11]!), ["core", "oyo", "ai"]);
    assert.deepEqual(kinds(CH2_LAB_EXERCISES[0]!), ["core"]);
    assert.deepEqual(kinds(CH5_LAB_EXERCISES[0]!), ["core", "oyo", "ai"]);
    assert.deepEqual(kinds(CH5_LAB_EXERCISES[1]!), ["core", "oyo"]);
    assert.match(
      CH4_LAB_EXERCISES[1]!.tasks[1]!.description,
      /greeting that includes your name/,
    );
    assert.match(
      CH5_LAB_EXERCISES[0]!.tasks[1]!.description,
      /Express greeting/,
    );
  });

  it("does not include the shipped A1 / §1.3.12 catalog", () => {
    assert.equal("1.3.12" in BOOK_EXERCISE_RECAPS, false);
    for (const groups of Object.values(BOOK_EXERCISE_RECAPS)) {
      assert.ok(
        groups.every((group) => !group.parentLabel.includes("HeadingTags")),
      );
    }
  });
});
