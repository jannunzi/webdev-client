import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const toc = readFileSync(join(process.cwd(), "app/book/TOC.tsx"), "utf8");
const bookHome = readFileSync(join(process.cwd(), "app/book/page.tsx"), "utf8");
const layout = readFileSync(join(process.cwd(), "app/book/layout.tsx"), "utf8");

describe("book TOC is book-only", () => {
  it("keeps chapter navigation, practice, and a syllabus exit hatch", () => {
    assert.match(toc, /href="\/book"/);
    assert.match(toc, /href="\/book\/practice"/);
    assert.match(toc, /href="\/syllabus"/);
    assert.match(toc, /Exit book/);
    assert.match(toc, /Previous chapter/);
    assert.match(toc, /Next chapter/);
    assert.match(toc, /Chapters/);
    assert.match(layout, /CourseSiteHeader/);
  });

  it("does not list course destinations in the book sidebar", () => {
    const courseOnly = [
      /href="\/blog"/,
      /href="\/slides"/,
      /href="\/labs"/,
      /href="\/account\/signin"/,
      /href="\/calendar"/,
      /href="\/office-hours"/,
      /href="\/piazza-hours"/,
      /href="\/project"/,
      /href="\/assignments"/,
      /href="\/quizzes\/take"/,
    ];
    for (const pattern of courseOnly) {
      assert.doesNotMatch(toc, pattern, String(pattern));
    }
    assert.doesNotMatch(toc, /Resources/);
    assert.doesNotMatch(bookHome, /href="\/office-hours"/);
    assert.doesNotMatch(bookHome, /href="\/blog"/);
  });
});
