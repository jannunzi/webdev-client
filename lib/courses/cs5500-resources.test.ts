import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  cs5500ResourceGroups,
  cs5500ResourceLinks,
} from "./cs5500-resources.ts";

const EXPECTED_URLS = [
  "https://cmu-313.github.io/",
  "https://cmu-313.github.io/overview/",
  "https://cmu-313.github.io/syllabus/",
  "https://cmu-313.github.io/assignments/",
  "https://cmu-313.github.io/recitations/",
  "https://cmu-313.github.io/hall-of-fame/",
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

  it("keeps the groups and their headings, with CMU 17-313 first", () => {
    assert.deepEqual(
      cs5500ResourceGroups.map((group) => group.title),
      [
        "Reference course: CMU 17-313 Foundations of Software Engineering",
        "Current CS5500 (Fall 2026, Mark Bonicillo, Seattle)",
        "Joint CS4530/CS5500 Spring 2021 (Bell, Boyland, Wand)",
        "Related undergrad sibling CS4530",
        "Other",
      ],
    );
    const cmu = cs5500ResourceGroups[0];
    assert.equal(cmu?.id, "cmu-17-313");
    assert.equal(cmu?.links[0]?.url, "https://cmu-313.github.io/");
    const cmuUrls = cmu?.links.map((link) => link.url) ?? [];
    for (const missing of ["/slides/", "/lectures/", "/schedule/"]) {
      assert.equal(
        cmuUrls.some((url) => url.includes(missing)),
        false,
        missing,
      );
    }
    const joint = cs5500ResourceGroups.find((group) => group.id === "joint-spring-2021");
    assert.match(joint?.note ?? "", /CC BY-SA 4\.0/);
    const sibling = cs5500ResourceGroups.find((group) => group.id === "cs4530-sibling");
    assert.match(sibling?.note ?? "", /not CS5500/);
    const seattle = cs5500ResourceGroups.find((group) => group.id === "current-fall-2026");
    assert.equal(
      seattle?.links.find((link) => link.label === "Syllabus")?.note,
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
