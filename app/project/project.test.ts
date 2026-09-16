import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { projectOverview } from "./data.ts";
import {
  getProjectDoc,
  PROJECT_DOC_SLUGS,
  PROJECT_DOCS,
  projectDocHref,
} from "./docs/index.ts";

const root = process.cwd();

function read(rel: string) {
  return readFileSync(join(root, rel), "utf8");
}

describe("final project hub and requirement pages", () => {
  it("links hub options to on-site Quizzes, Pazza, and Open-Ended pages", () => {
    assert.deepEqual(
      projectOverview.options.map((option) => option.href),
      ["/project/quizzes", "/project/pazza", "/project/open-ended"],
    );
    const hub = read("app/project/page.tsx");
    assert.match(hub, /option\.href/);
    assert.doesNotMatch(hub, /docs\.google\.com/);
    assert.doesNotMatch(read("app/project/data.ts"), /docs\.google\.com/);
  });

  it("keeps a first-class page and original images for each option", () => {
    assert.equal(PROJECT_DOC_SLUGS.length, 3);
    assert.ok(existsSync(join(root, "app/project/[option]/page.tsx")));

    for (const doc of PROJECT_DOCS) {
      assert.equal(projectDocHref(doc.slug), `/project/${doc.slug}`);
      assert.equal(getProjectDoc(doc.slug)?.title, doc.title);
      const images = doc.blocks.filter((block) => block.type === "img");
      assert.ok(images.length > 0, `${doc.slug} should include screenshots`);
      for (const image of images) {
        assert.equal(image.src.startsWith(`/project/${doc.slug}/`), true);
        assert.ok(
          existsSync(join(root, "public", image.src)),
          `missing ${image.src}`,
        );
        assert.ok(image.alt.length > 0, `alt missing for ${image.src}`);
      }
    }
  });

  it("ports the Quizzes, Pazza, and Open-Ended requirement headings", () => {
    const quizzes = getProjectDoc("quizzes");
    const pazza = getProjectDoc("pazza");
    const openEnded = getProjectDoc("open-ended");
    assert.match(quizzes?.title ?? "", /Kambaz Quizzes/);
    assert.match(pazza?.title ?? "", /Kambaz Pazza/);
    assert.match(openEnded?.title ?? "", /Open-Ended Web Application/);

    const headings = (slug: string) =>
      (getProjectDoc(slug)?.blocks ?? [])
        .filter((block) => block.type === "h")
        .map((block) => block.text);

    assert.ok(headings("quizzes").includes("Quiz List Screen"));
    assert.ok(headings("quizzes").includes("Quiz Preview screen"));
    assert.ok(headings("pazza").includes("Questions and Answers Screen (Q&AS)"));
    assert.ok(headings("pazza").includes("Manage Folders Screen (MFS)"));
    assert.ok(headings("open-ended").includes("Page Requirements"));
    assert.ok(headings("open-ended").includes("External Web API requirements"));
  });

  it("does not send students to Google Docs from project nav or pages", () => {
    const files = [
      "app/project/page.tsx",
      "app/project/data.ts",
      "app/project/[option]/page.tsx",
      "app/project/components/ProjectOptionNav.tsx",
      "app/course-info/links.ts",
    ];
    for (const file of files) {
      assert.doesNotMatch(read(file), /docs\.google\.com/, file);
    }
    assert.match(read("next.config.ts"), /source: "\/project\/piazza"/);
    assert.match(read("next.config.ts"), /destination: "\/project\/pazza"/);
  });

  it("preserves Kambaz and Pazza naming from the source docs", () => {
    const pazzaText = JSON.stringify(getProjectDoc("pazza"));
    assert.match(pazzaText, /Kambaz/);
    assert.match(pazzaText, /Pazza/);
    assert.doesNotMatch(pazzaText, /\bCanvas\b/);
    const quizzesText = JSON.stringify(getProjectDoc("quizzes"));
    assert.match(quizzesText, /Kambaz/);
    assert.match(quizzesText, /Faculty/);
  });
});
