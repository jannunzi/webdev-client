import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  extractAssignmentIds,
  extractCourseIds,
  htmlHasAllIds,
  htmlHasAnyId,
  htmlHasHeadingLevels,
  htmlHasId,
  isCourseScreenPath,
  isLabsPath,
  pathnameOf,
  uniqueUrls,
} from "./html";

describe("htmlHasId", () => {
  it("matches quoted and unquoted ids", () => {
    assert.equal(htmlHasId('<div id="wd-labs">', "wd-labs"), true);
    assert.equal(htmlHasId("<div id='wd-labs'>", "wd-labs"), true);
    assert.equal(htmlHasId("<div id=wd-labs>", "wd-labs"), true);
    assert.equal(htmlHasId('<div id="wd-signin-btn">', "wd-labs"), false);
    assert.equal(htmlHasId('<div id="wd-labs-extra">', "wd-labs"), false);
  });
});

describe("html id and heading helpers", () => {
  it("requires all ids or any id", () => {
    const html = '<p id="wd-p-tag"></p><p id="wd-p-1"></p>';
    assert.deepEqual(htmlHasAllIds(html, ["wd-p-tag", "wd-p-1"]), {
      ok: true,
      missing: [],
    });
    assert.deepEqual(htmlHasAllIds(html, ["wd-p-tag", "wd-p-2"]), {
      ok: false,
      missing: ["wd-p-2"],
    });
    assert.equal(htmlHasAnyId(html, ["wd-p-2", "wd-p-1"]), true);
    assert.equal(htmlHasAnyId(html, ["wd-p-2", "wd-p-3"]), false);
  });

  it("detects heading levels", () => {
    const html = "<h1>A</h1><h4>B</h4><h6>C</h6>";
    assert.deepEqual(htmlHasHeadingLevels(html, [1, 4, 6]), {
      ok: true,
      missing: [],
    });
    assert.deepEqual(htmlHasHeadingLevels(html, [1, 2, 3, 4, 5, 6]), {
      ok: false,
      missing: [2, 3, 5],
    });
  });
});

describe("url and path helpers", () => {
  it("strips trailing slashes from pathnames", () => {
    assert.equal(
      pathnameOf(
        "https://kambaz-next-js-sp26-git-a1-kenneth-aldridges-projects.vercel.app/account/signin",
      ),
      "/account/signin",
    );
    assert.equal(pathnameOf("https://app.vercel.app/labs/"), "/labs");
    assert.equal(pathnameOf("https://app.vercel.app/"), "/");
  });

  it("classifies labs and course screens", () => {
    assert.equal(isLabsPath("/labs"), true);
    assert.equal(isLabsPath("/labs/lab1"), true);
    assert.equal(isLabsPath("/account/signin"), false);
    assert.equal(isCourseScreenPath("/courses/RS101/home"), true);
    assert.equal(isCourseScreenPath("/Courses/RS101/Assignments/123"), true);
    assert.equal(isCourseScreenPath("/dashboard"), false);
  });

  it("dedupes absolute urls", () => {
    assert.deepEqual(
      uniqueUrls([
        "https://app.vercel.app/labs",
        "https://app.vercel.app/labs",
        "not a url",
      ]),
      ["https://app.vercel.app/labs"],
    );
  });
});

describe("course and assignment id extraction", () => {
  it("reads /courses and /Courses hrefs", () => {
    const html = `
      <a href="/courses/1234/home">Home</a>
      <a href="/Courses/RS101/Home">RS101</a>
      <a href="/Courses/RS101/Assignments/A1">Editor</a>
    `;
    assert.deepEqual(extractCourseIds(html), ["1234", "RS101"]);
    assert.deepEqual(extractAssignmentIds(html, "RS101"), ["A1"]);
  });
});
