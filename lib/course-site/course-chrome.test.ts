import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  COURSE_INFO_LINKS,
  isCourseInfoCurrent,
} from "../../app/course-info/links.ts";

const root = process.cwd();

function read(rel: string) {
  return readFileSync(join(root, rel), "utf8");
}

describe("shared course chrome", () => {
  it("keeps Blog next to Book in COURSE_INFO_LINKS", () => {
    const hrefs = COURSE_INFO_LINKS.map((link) => link.href);
    assert.ok(hrefs.includes("/blog"));
    assert.ok(hrefs.indexOf("/blog") === hrefs.indexOf("/book") + 1);
    assert.ok(hrefs.includes("/assignments"));
    assert.ok(hrefs.includes("/quizzes/take"));
    assert.ok(hrefs.includes("/office-hours"));
    assert.ok(hrefs.includes("/slides"));
    assert.ok(!hrefs.includes("/calendar"));
    assert.ok(!hrefs.includes("/piazza-hours"));
    assert.match(read("app/syllabus/components/SyllabusNav.tsx"), /href="\/calendar"/);
    assert.match(
      read("app/syllabus/components/SyllabusNav.tsx"),
      /href="\/piazza-hours"/,
    );
  });

  it("treats nested book and quiz-take paths as current", () => {
    assert.equal(isCourseInfoCurrent("/book/ch1", "/book"), true);
    assert.equal(isCourseInfoCurrent("/quizzes/take/q1", "/quizzes/take"), true);
    assert.equal(isCourseInfoCurrent("/quizzes", "/quizzes/take"), false);
    assert.equal(isCourseInfoCurrent("/account/profile", "/account/signin"), true);
    assert.equal(isCourseInfoCurrent("/syllabus", "/book"), false);
  });

  it("mounts CourseSiteHeader on syllabus, course-info, book, assignments, quizzes, slides, and people", () => {
    const files = [
      "app/course-info/CourseInfoLayout.tsx",
      "app/syllabus/layout.tsx",
      "app/book/layout.tsx",
      "app/assignments/layout.tsx",
      "app/quizzes/layout.tsx",
      "app/slides/layout.tsx",
      "app/people/layout.tsx",
    ];
    for (const file of files) {
      assert.match(read(file), /CourseSiteHeader|CourseInfoLayout/, file);
    }
    assert.match(read("app/syllabus/layout.tsx"), /CourseInfoLayout/);
    assert.match(
      read("app/course-info/CourseInfoLayout.tsx"),
      /<CourseSiteHeader/,
    );
    assert.match(read("app/course-info/CourseSiteHeader.tsx"), /CourseAuthButtons/);
    assert.match(read("app/course-info/CourseSiteHeader.tsx"), /CourseAuthFallback/);
    assert.match(read("app/course-info/CourseSiteHeader.tsx"), /CourseSiteNav/);
  });

  it("keeps Sign in / Sign up on shared chrome and does not name Clerk", () => {
    const buttons = read("app/course-info/CourseAuthButtons.tsx");
    const fallback = read("app/course-info/CourseAuthFallback.tsx");
    assert.match(buttons, /Sign in/);
    assert.match(buttons, /Sign up/);
    assert.match(buttons, /UserButton/);
    assert.match(fallback, /href="\/sign-in"/);
    assert.match(fallback, /href="\/sign-up"/);
    assert.match(buttons, /signInLabel = "Sign in"/);
    assert.match(buttons, /signUpLabel = "Sign up"/);
    assert.doesNotMatch(fallback, /\bClerk\b/);
  });

  it("does not weaken staff quiz or people auth bars — they keep title/hint only", () => {
    assert.match(
      read("app/quizzes/take/components/QuizAuthBar.tsx"),
      /showActions=\{false\}/,
    );
    assert.match(
      read("app/quizzes/(review)/layout.tsx"),
      /showActions=\{false\}/,
    );
    assert.match(
      read("app/people/components/PeopleAuthBar.tsx"),
      /showActions=\{false\}/,
    );
    assert.match(read("app/people/page.tsx"), /getEffectiveStaffAccess/);
    assert.match(read("app/quizzes/(review)/page.tsx"), /renderStaffReview/);
  });
});
