import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  cs5500ResourceGroups,
  cs5500ResourceLinks,
} from "./cs5500-resources.ts";

const EXPECTED_URLS = [
  "https://github.com/cs5500-neu/admin/blob/main/syllabus.md",
  "https://github.com/cs5500-neu",
  "https://github.com/cs5500-neu/todo_api",
  "https://github.com/cs5500-neu/FakesNotMocks",
  "https://github.com/cs5500-neu/GildedRose-Refactoring-Kata",
  "https://github.com/cs5500-neu/monorepo-template-main",
  "https://neu-se.github.io/CS4530-CS5500-Spring-2021/",
  "https://neu-se.github.io/CS4530-CS5500-Spring-2021/modules/",
  "https://neu-se.github.io/CS4530-CS5500-Spring-2021/assignments/",
  "https://neu-se.github.io/CS4530-CS5500-Spring-2021/project-showcase",
  "https://github.com/neu-se/covey.town",
  "https://neu-se.github.io/CS4530-Spring-2026/",
  "https://neu-se.github.io/CS4530-Fall-2025/",
  "https://catalog.northeastern.edu/course-descriptions/cs/",
  "https://www.khoury.northeastern.edu/home/jewart/cs5500/",
];

describe("CS5500 instructor resources", () => {
  it("lists exactly the verified links, in group order", () => {
    const links = cs5500ResourceLinks();
    assert.deepEqual(
      links.map((link) => link.url),
      EXPECTED_URLS,
    );
    assert.equal(new Set(links.map((link) => link.url)).size, EXPECTED_URLS.length);
    for (const link of links) {
      assert.ok(link.label.trim(), link.url);
      assert.ok(link.note.trim(), link.url);
      assert.equal(link.note.includes("\n"), false);
    }
  });

  it("keeps the four groups and their headings", () => {
    assert.deepEqual(
      cs5500ResourceGroups.map((group) => group.title),
      [
        "Current CS5500 (Fall 2026, Mark Bonicillo, Seattle)",
        "Joint CS4530/CS5500 Spring 2021 (Bell, Boyland, Wand)",
        "Related undergrad sibling CS4530",
        "Other",
      ],
    );
    assert.match(
      cs5500ResourceGroups[1]?.note ?? "",
      /CC BY-SA 4\.0/,
    );
    assert.match(cs5500ResourceGroups[2]?.note ?? "", /not CS5500/);
    assert.equal(
      cs5500ResourceGroups[0]?.links.find((link) => link.label === "Syllabus")?.note,
      "Project Labs 80%, Quizzes 20%; 12-module schedule; no slides published",
    );
  });

  it("renders the list on the coming-soon page with links that open in a new tab", () => {
    const page = readFileSync(
      join(process.cwd(), "app/cs5500/page.tsx"),
      "utf8",
    );
    const resources = readFileSync(
      join(process.cwd(), "app/cs5500/Cs5500Resources.tsx"),
      "utf8",
    );
    assert.match(page, /Cs5500Resources/);
    assert.match(resources, /Resources from other CS5500 instructors/);
    assert.match(resources, /id="wd-cs5500-resources"/);
    assert.match(resources, /target="_blank"/);
    assert.match(resources, /rel="noopener noreferrer"/);
    assert.match(resources, /cs5500ResourceGroups/);
  });
});
