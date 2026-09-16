import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  COURSE_INFO_LINKS,
  courseHeaderHiddenOnPath,
  courseNavIsCurrent,
} from "../../app/course-info/course-nav.ts";

function read(relPath: string) {
  return readFileSync(new URL(`../../${relPath}`, import.meta.url), "utf8");
}

describe("course site chrome", () => {
  it("keeps the shared destinations students jump between", () => {
    const hrefs = COURSE_INFO_LINKS.map((link) => link.href);
    for (const href of [
      "/syllabus",
      "/book",
      "/assignments",
      "/quizzes/take",
      "/slides",
      "/blog",
    ] as const) {
      assert.ok(hrefs.includes(href), href);
    }
  });

  it("marks the current course section without colliding nearby paths", () => {
    assert.equal(courseNavIsCurrent("/syllabus", "/syllabus"), true);
    assert.equal(courseNavIsCurrent("/", "/syllabus"), true);
    assert.equal(courseNavIsCurrent("/book/ch1", "/book"), true);
    assert.equal(courseNavIsCurrent("/blog", "/book"), false);
    assert.equal(courseNavIsCurrent("/quizzes/take/q1", "/quizzes/take"), true);
    assert.equal(courseNavIsCurrent("/quizzes", "/quizzes/take"), true);
    assert.equal(courseNavIsCurrent("/account/profile", "/account/signin"), true);
    assert.equal(courseHeaderHiddenOnPath("/slides"), false);
    assert.equal(courseHeaderHiddenOnPath("/slides/installing-nodejs"), true);
  });

  it("puts Clerk sign-in controls on the shared course header", () => {
    const header = read("app/course-info/CourseSiteHeader.tsx");
    const chrome = read("app/course-info/CourseSiteChrome.tsx");
    const auth = read("app/course-info/CourseAuthControls.tsx");
    const syllabusLayout = read("app/syllabus/layout.tsx");
    assert.match(header, /CourseSiteChrome/);
    assert.match(header, /isClerkPublishableKeySet/);
    assert.match(chrome, /CourseAuthControls/);
    assert.match(chrome, /COURSE_INFO_LINKS/);
    assert.match(auth, /SignInButton/);
    assert.match(auth, /SignUpButton/);
    assert.match(auth, /UserButton/);
    assert.match(syllabusLayout, /CourseChromeShell/);
  });

  it("uses the shared header on syllabus, book, and other course hubs", () => {
    for (const file of [
      "app/course-info/CourseInfoLayout.tsx",
      "app/book/layout.tsx",
      "app/assignments/layout.tsx",
      "app/quizzes/layout.tsx",
      "app/slides/layout.tsx",
      "app/blog/layout.tsx",
      "app/office-hours/layout.tsx",
    ]) {
      assert.match(read(file), /CourseChromeShell|CourseInfoLayout/, file);
    }
  });
});

describe("book-local navigation", () => {
  it("keeps in-book links and a syllabus exit, not course-wide destinations", () => {
    const toc = read("app/book/TOC.tsx");
    assert.match(toc, /Book Home/);
    assert.match(toc, /Practice quizzes/);
    assert.match(toc, /href="\/syllabus"/);
    assert.match(toc, /Chapters/);
    assert.doesNotMatch(toc, /href="\/blog"/);
    assert.doesNotMatch(toc, /href="\/slides"/);
    assert.doesNotMatch(toc, /href="\/labs"/);
    assert.doesNotMatch(toc, /href="\/account\/signin"/);
    assert.doesNotMatch(toc, /href="\/calendar"/);
    assert.doesNotMatch(toc, /href="\/office-hours"/);
    assert.doesNotMatch(toc, /href="\/piazza-hours"/);
    assert.doesNotMatch(toc, /href="\/project"/);
    assert.doesNotMatch(toc, /Academic Calendar/);
    assert.doesNotMatch(toc, /Office Hours/);
    assert.doesNotMatch(toc, /Piazza Hours/);
    assert.doesNotMatch(toc, /Final Project/);
  });
});
