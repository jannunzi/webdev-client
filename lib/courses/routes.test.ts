import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { sections } from "../../app/syllabus/data/sections.ts";
import {
  contextualHref,
  courseContentRewrites,
  courseNumberPath,
  DEFAULT_COURSE_CONTEXT,
  FALL_2026_SECTIONS,
  FOUNDATIONS_SUBJECT,
  isMinimalCourseHeader,
  legacyCourseRedirect,
  parseCoursePath,
  sectionSyllabusPath,
  sharedContentRewrite,
  sharedPagePath,
  WEBDEV_SUBJECT,
} from "./routes.ts";

function redirect(path: string, query = ""): { pathname: string; search: string } | null {
  return legacyCourseRedirect(path, new URLSearchParams(query));
}

describe("course URL helper", () => {
  it("keeps the CS5500 subject slug in one constant", () => {
    assert.equal(FOUNDATIONS_SUBJECT, "fse");
    assert.equal(WEBDEV_SUBJECT, "webdev");
    const source = readFileSync(new URL("./routes.ts", import.meta.url), "utf8");
    assert.equal(source.includes("foundations-software-engineering"), false);
  });

  it("builds shared pages and section syllabi", () => {
    assert.equal(
      sharedPagePath({ year: "2026", term: "fall", subject: WEBDEV_SUBJECT }, "book"),
      "/2026/fall/webdev/book",
    );
    assert.equal(
      sharedPagePath({ year: "2026", term: "fall", subject: WEBDEV_SUBJECT }, "slides") +
        "/local-mongo",
      "/2026/fall/webdev/slides/local-mongo",
    );
    assert.equal(
      sectionSyllabusPath({
        year: "2026",
        term: "fall",
        subject: WEBDEV_SUBJECT,
        courseNumber: "cs5610",
        section: "02",
      }),
      "/2026/fall/webdev/cs5610/02/syllabus",
    );
    assert.equal(
      sectionSyllabusPath({
        year: "2026",
        term: "fall",
        subject: WEBDEV_SUBJECT,
        courseNumber: "cs5610",
        section: "09",
      }),
      "/2026/fall/webdev/cs5610/09/syllabus",
    );
    assert.equal(
      sectionSyllabusPath({
        year: "2026",
        term: "fall",
        subject: WEBDEV_SUBJECT,
        courseNumber: "cs4550",
        section: "01",
      }),
      "/2026/fall/webdev/cs4550/01/syllabus",
    );
    assert.equal(
      courseNumberPath({
        year: "2027",
        term: "summer",
        subject: FOUNDATIONS_SUBJECT,
        courseNumber: "cs5500",
      }),
      "/2027/summer/fse/cs5500",
    );
    assert.equal(
      sharedPagePath(
        { year: "2027", term: "summer", subject: FOUNDATIONS_SUBJECT },
        "book",
      ),
      "/2027/summer/fse/book",
    );
    assert.equal(
      courseNumberPath({
        year: "2027",
        term: "spring",
        subject: WEBDEV_SUBJECT,
        courseNumber: "cs5610",
      }),
      "/2027/spring/webdev/cs5610",
    );
  });

  it("matches Fall 2026 syllabus sections", () => {
    assert.deepEqual(
      FALL_2026_SECTIONS.map((item) => `${item.courseNumber}-${item.section}`),
      sections.map((section) => section.id),
    );
  });

  it("redirects old course URLs onto the new paths", () => {
    assert.deepEqual(redirect("/book"), {
      pathname: "/2026/fall/webdev/book",
      search: "",
    });
    assert.deepEqual(redirect("/book/ch1"), {
      pathname: "/2026/fall/webdev/book/ch1",
      search: "",
    });
    assert.deepEqual(redirect("/slides/local-mongo"), {
      pathname: "/2026/fall/webdev/slides/local-mongo",
      search: "",
    });
    assert.deepEqual(redirect("/videos"), {
      pathname: "/2026/fall/webdev/videos",
      search: "",
    });
    assert.deepEqual(redirect("/syllabus"), {
      pathname: "/2026/fall/webdev/cs5610/02/syllabus",
      search: "",
    });
    assert.deepEqual(redirect("/syllabus", "section=cs5610-09"), {
      pathname: "/2026/fall/webdev/cs5610/09/syllabus",
      search: "",
    });
    assert.deepEqual(redirect("/syllabus", "section=CS4550-01&utm=canvas"), {
      pathname: "/2026/fall/webdev/cs4550/01/syllabus",
      search: "?utm=canvas",
    });
    assert.deepEqual(redirect("/syllabus/cs5610-02"), {
      pathname: "/2026/fall/webdev/cs5610/02/syllabus",
      search: "",
    });
    assert.deepEqual(redirect("/syllabus/CS5610-09"), {
      pathname: "/2026/fall/webdev/cs5610/09/syllabus",
      search: "",
    });
    assert.deepEqual(redirect("/cs4550-01"), {
      pathname: "/2026/fall/webdev/cs4550/01/syllabus",
      search: "",
    });
    assert.deepEqual(redirect("/syllabus-tab-cs5610-02"), {
      pathname: "/2026/fall/webdev/cs5610/02/syllabus",
      search: "",
    });
    assert.deepEqual(redirect("/cs5500"), {
      pathname: "/2027/summer/fse/cs5500",
      search: "",
    });
    assert.deepEqual(redirect("/cs5500/book"), {
      pathname: "/2027/summer/fse/book",
      search: "",
    });
    assert.deepEqual(redirect("/coming-soon/cs5610-sp2027"), {
      pathname: "/2027/spring/webdev/cs5610",
      search: "",
    });
    assert.deepEqual(redirect("/coming-soon/cs4550-sp2027"), {
      pathname: "/2027/spring/webdev/cs4550",
      search: "",
    });
    assert.equal(redirect("/book2"), null);
    assert.equal(redirect("/sign-in"), null);
    assert.equal(redirect("/account/signin"), null);
    assert.equal(redirect("/book-editor/chapter-1"), null);
  });

  it("rewrites shared webdev pages and leaves the fse book alone", () => {
    assert.equal(
      sharedContentRewrite("/2026/fall/webdev/slides/local-mongo"),
      "/slides/local-mongo",
    );
    assert.equal(sharedContentRewrite("/2026/fall/webdev/book"), "/book");
    assert.equal(sharedContentRewrite("/2027/summer/fse/book"), null);
    assert.equal(sharedContentRewrite("/2026/fall/webdev/cs5610/02/syllabus"), null);
    const sources = courseContentRewrites().map((item) => item.source);
    assert.ok(sources.some((source) => source.includes(`${WEBDEV_SUBJECT}/book`)));
    assert.equal(sources.some((source) => source.includes(FOUNDATIONS_SUBJECT)), false);
  });

  it("points header links at the shared subject and the section in context", () => {
    const onSection = parseCoursePath("/2026/fall/webdev/cs4550/01/syllabus");
    assert.ok(onSection);
    assert.equal(
      contextualHref("/book", onSection),
      "/2026/fall/webdev/book",
    );
    assert.equal(
      contextualHref("/slides", onSection),
      "/2026/fall/webdev/slides",
    );
    assert.equal(
      contextualHref("/syllabus", onSection),
      "/2026/fall/webdev/cs4550/01/syllabus",
    );
    assert.equal(contextualHref("/account/signin", onSection), "/account/signin");
    assert.equal(contextualHref("/", onSection), "/");
    const onBook = parseCoursePath("/2026/fall/webdev/book/ch1");
    assert.equal(
      contextualHref("/syllabus", onBook),
      "/2026/fall/webdev/cs5610/02/syllabus",
    );
    assert.equal(
      contextualHref("/book", parseCoursePath("/2027/summer/fse/cs5500")),
      "/2027/summer/fse/book",
    );
    assert.equal(DEFAULT_COURSE_CONTEXT.subject, WEBDEV_SUBJECT);
  });

  it("uses a minimal header on the landing page and spring placeholders only", () => {
    assert.equal(isMinimalCourseHeader("/"), true);
    assert.equal(isMinimalCourseHeader("/coming-soon/cs5610-sp2027"), true);
    assert.equal(isMinimalCourseHeader("/2027/spring/webdev/cs5610"), true);
    assert.equal(isMinimalCourseHeader("/2027/spring/webdev/cs4550"), true);
    assert.equal(isMinimalCourseHeader("/2027/summer/fse/cs5500"), false);
    assert.equal(isMinimalCourseHeader("/2026/fall/webdev/book"), false);
    assert.equal(isMinimalCourseHeader("/2026/fall/webdev/cs5610/02/syllabus"), false);
    const home = readFileSync(
      join(process.cwd(), "app/(course)/layout.tsx"),
      "utf8",
    );
    const header = readFileSync(
      join(process.cwd(), "app/course-info/CourseSiteHeader.tsx"),
      "utf8",
    );
    assert.match(home, /header="home"/);
    assert.match(header, /id="wd-site-home"/);
    assert.match(header, /CourseAuthButtons/);
    assert.match(header, /CourseSiteNav/);
  });
});
