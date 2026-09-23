import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { COURSE_SECTION_IDS } from "../roster/sections.ts";
import { bookPathForSection, bookSectionNumberLabel } from "./book-section.ts";
import {
  defaultVideoCourseId,
  defaultVideoSemester,
  sourceCourseIdForSyllabusSection,
  videoCourseOptions,
} from "./courses.ts";
import {
  bookSectionHasClip,
  defaultBookSectionId,
  lectureClipMap,
  listBookSectionIds,
} from "./map.ts";
import { parseVideosQuery, videosHref } from "./query.ts";
import {
  describeClipFallback,
  resolveLectureClip,
} from "./resolve.ts";
import { semesterCodeFromTermLabel, semesterRank } from "./semester.ts";
import type { LectureClipMap } from "./types.ts";
import { parseLectureClipMap } from "./validate.ts";
import {
  youtubeEmbedUrl,
  youtubeVideoIdFromUrl,
  youtubeWatchUrl,
} from "./youtube.ts";

const root = process.cwd();

function read(rel: string) {
  return readFileSync(join(root, rel), "utf8");
}

describe("semester codes", () => {
  it("orders spring, summer, and fall, then the next year", () => {
    const ranks = ["SP26", "SU26", "FA26", "SP27"].map((code) => semesterRank(code));
    assert.deepEqual(ranks, [...ranks].sort((a, b) => a! - b!));
    assert.ok(semesterRank("FA26")! > semesterRank("SP26")!);
    assert.ok(semesterRank("SP26")! > semesterRank("FA25")!);
    assert.equal(semesterRank("Fall 2026"), null);
    assert.equal(semesterCodeFromTermLabel("Fall 2026"), "FA26");
    assert.equal(semesterCodeFromTermLabel("Spring 2026"), "SP26");
  });
});

describe("resolveLectureClip", () => {
  const map: LectureClipMap = {
    sections: {
      "sec-1-2-1": [
        {
          youtubeVideoId: "Fa26Stub001",
          startSec: 90,
          endSec: 420,
          sourceCourse: "CS4550",
          semester: "FA26",
          confidence: "placeholder",
        },
        {
          youtubeVideoId: "Fa26Stub002",
          startSec: 40,
          endSec: 260,
          sourceCourse: "CS5610-02",
          semester: "FA26",
          confidence: "high",
        },
        {
          youtubeVideoId: "Sp26Stub001",
          startSec: 10,
          endSec: 80,
          sourceCourse: "CS4550",
          semester: "SP26",
          confidence: "high",
        },
        {
          youtubeVideoId: "Fa25Stub001",
          startSec: 10,
          endSec: 80,
          sourceCourse: "CS4550",
          semester: "FA25",
          confidence: "high",
        },
      ],
      "sec-9-9": [
        {
          url: "https://youtu.be/Sp26Stub001",
          startSec: 5,
          endSec: 15,
          sourceCourse: "CS5610-09",
          semester: "SP26",
          confidence: "medium",
        },
      ],
    },
  };

  it("prefers the same section in the preferred semester", () => {
    const resolved = resolveLectureClip(map, {
      bookSectionId: "sec-1-2-1",
      preferredCourse: "CS4550",
      preferredSemester: "FA26",
    });
    assert.equal(resolved?.tier, "same-section");
    assert.equal(resolved?.youtubeVideoId, "Fa26Stub001");
    assert.match(
      describeClipFallback(resolved!, { course: "CS4550", semester: "FA26" }),
      /CS4550 · FA26/,
    );
  });

  it("uses another section in the same semester before any prior semester", () => {
    const resolved = resolveLectureClip(map, {
      bookSectionId: "sec-1-2-1",
      preferredCourse: "CS5610-09",
      preferredSemester: "FA26",
    });
    assert.equal(resolved?.tier, "same-semester");
    assert.equal(resolved?.clip.semester, "FA26");
    assert.equal(resolved?.youtubeVideoId, "Fa26Stub002");
  });

  it("uses the latest prior semester and keeps the same section inside it", () => {
    const resolved = resolveLectureClip(map, {
      bookSectionId: "sec-1-2-1",
      preferredCourse: "CS4550",
      preferredSemester: "SU26",
    });
    assert.equal(resolved?.tier, "prior-semester");
    assert.equal(resolved?.clip.semester, "SP26");
    assert.equal(resolved?.clip.sourceCourse, "CS4550");
  });

  it("does not use a later semester when the preferred semester has no clip", () => {
    const resolved = resolveLectureClip(map, {
      bookSectionId: "sec-1-2-1",
      preferredCourse: "CS4550",
      preferredSemester: "SP25",
    });
    assert.equal(resolved, null);
  });

  it("returns null for an unknown book section or semester code", () => {
    assert.equal(
      resolveLectureClip(map, {
        bookSectionId: "sec-missing",
        preferredCourse: "CS4550",
        preferredSemester: "FA26",
      }),
      null,
    );
    assert.equal(
      resolveLectureClip(map, {
        bookSectionId: "sec-1-2-1",
        preferredCourse: "CS4550",
        preferredSemester: "Fall 2026",
      }),
      null,
    );
  });

  it("reads a YouTube url when no id is stored", () => {
    const resolved = resolveLectureClip(map, {
      bookSectionId: "sec-9-9",
      preferredCourse: "CS4550",
      preferredSemester: "FA26",
    });
    assert.equal(resolved?.tier, "prior-semester");
    assert.equal(resolved?.youtubeVideoId, "Sp26Stub001");
  });
});

describe("stub lecture clip map", () => {
  it("labels itself as a placeholder and resolves the three fallback stories", () => {
    assert.match(lectureClipMap.description ?? "", /PLACEHOLDER/);
    assert.equal(bookSectionHasClip("sec-1-2-1"), true);
    assert.equal(bookSectionHasClip("sec-1-1"), false);
    assert.deepEqual(listBookSectionIds(), ["sec-1-2-1", "sec-1-3"]);
    assert.equal(defaultBookSectionId(), "sec-1-2-1");

    const exact = resolveLectureClip(lectureClipMap, {
      bookSectionId: "sec-1-2-1",
      preferredCourse: "CS4550",
      preferredSemester: "FA26",
    });
    assert.equal(exact?.tier, "same-section");
    assert.equal(exact?.youtubeVideoId, "Fa26Stub001");

    const otherSection = resolveLectureClip(lectureClipMap, {
      bookSectionId: "sec-1-2-1",
      preferredCourse: "CS5610-09",
      preferredSemester: "FA26",
    });
    assert.equal(otherSection?.tier, "same-semester");
    assert.equal(otherSection?.clip.semester, "FA26");
    assert.notEqual(otherSection?.clip.sourceCourse, "CS5610-09");

    const prior = resolveLectureClip(lectureClipMap, {
      bookSectionId: "sec-1-3",
      preferredCourse: "CS4550",
      preferredSemester: "FA26",
    });
    assert.equal(prior?.tier, "prior-semester");
    assert.equal(prior?.youtubeVideoId, "Sp26Stub001");
    assert.equal(prior?.clip.semester, "SP26");
    assert.equal(prior?.clip.confidence, "placeholder");
  });

  it("rejects archive hosts and inconsistent ids", () => {
    assert.throws(() =>
      parseLectureClipMap({
        sections: {
          "sec-1-1": [
            {
              url: "https://northeastern.box.com/s/archive",
              startSec: 0,
              endSec: 10,
              sourceCourse: "CS4550",
              semester: "FA26",
              confidence: "low",
            },
          ],
        },
      }),
      /YouTube/,
    );
    assert.equal(youtubeVideoIdFromUrl("https://youtu.be/Fa26Stub001?t=12"), "Fa26Stub001");
    assert.equal(
      youtubeVideoIdFromUrl("https://www.youtube.com/watch?v=Fa26Stub002"),
      "Fa26Stub002",
    );
  });
});

describe("videos query and course ids", () => {
  it("matches Fall 2026 roster section ids and builds a YouTube deep link", () => {
    assert.deepEqual(
      videoCourseOptions().map((option) => option.id),
      [...COURSE_SECTION_IDS],
    );
    assert.equal(
      sourceCourseIdForSyllabusSection({ code: "CS 5610", sectionNumber: "09" }),
      "CS5610-09",
    );
    assert.equal(defaultVideoCourseId(), "CS4550");
    assert.equal(defaultVideoSemester(), "FA26");
    assert.equal(bookSectionNumberLabel("sec-1-2-1"), "1.2.1");
    assert.equal(bookPathForSection("sec-1-3"), "/book/ch1#sec-1-3");

    const href = videosHref("sec-1-2-1", { course: "CS4550", semester: "FA26" });
    assert.equal(href, "/videos?section=sec-1-2-1&course=CS4550&semester=FA26");
    assert.match(youtubeEmbedUrl("Fa26Stub001", 90, 420), /start=90/);
    assert.match(youtubeEmbedUrl("Fa26Stub001", 90, 420), /end=420/);
    assert.match(youtubeEmbedUrl("Fa26Stub001", 90, 420), /youtube-nocookie\.com\/embed\//);
    assert.match(youtubeWatchUrl("Fa26Stub001", 90), /[?&]start=90/);
    assert.match(youtubeWatchUrl("Fa26Stub001", 90), /[?&]t=90s/);
    assert.doesNotMatch(youtubeWatchUrl("Fa26Stub001", 90), /mux|blob/i);
  });

  it("canonicalizes bookSectionId, course case, and semester case", () => {
    const defaults = { section: "sec-1-2-1", course: "CS4550", semester: "FA26" };
    const known = ["CS4550", "CS5610-02", "CS5610-09"];
    const fromBook = parseVideosQuery(
      { bookSectionId: "sec-1-3" },
      defaults,
      known,
    );
    assert.equal(fromBook.canonical, false);
    assert.equal(fromBook.section, "sec-1-3");
    assert.equal(fromBook.course, "CS4550");
    assert.equal(fromBook.semester, "FA26");

    const cased = parseVideosQuery(
      { section: "sec-1-2-1", course: "cs5610-02", semester: "fa26" },
      defaults,
      known,
    );
    assert.equal(cased.canonical, false);
    assert.equal(cased.course, "CS5610-02");
    assert.equal(cased.semester, "FA26");
    assert.equal(cased.semesterValid, true);

    const ready = parseVideosQuery(
      { section: "sec-1-2-1", course: "CS4550", semester: "FA26" },
      defaults,
      known,
    );
    assert.equal(ready.canonical, true);

    const badSemester = parseVideosQuery(
      { section: "sec-1-2-1", course: "CS4550", semester: "2026" },
      defaults,
      known,
    );
    assert.equal(badSemester.semesterValid, false);
    assert.equal(badSemester.semester, "2026");
  });
});

describe("videos page shell", () => {
  it("links the course nav and mapped book headings to /videos without a hosted player", () => {
    const links = read("app/course-info/links.ts");
    assert.match(links, /href: "\/videos", label: "Videos"/);
    assert.match(read("app/book/components/Section.tsx"), /BookSectionClipLink/);
    assert.match(read("app/book/components/BookSectionClipLink.tsx"), /Watch lecture clip/);
    assert.match(
      read("app/book/ch1/sections/IntroAndSetup.tsx"),
      /BookSectionClipLink sectionId="sec-1-2-1"/,
    );

    const page = read("app/videos/page.tsx");
    assert.match(page, /resolveLectureClip/);
    assert.doesNotMatch(page, /mux|vercel\/blob|@mux/i);
    const clip = read("app/videos/components/VideoClip.tsx");
    assert.match(clip, /youtubeEmbedUrl/);
    assert.match(clip, /youtubeWatchUrl/);
    assert.doesNotMatch(`${page}\n${clip}`, /mux|blob\.vercel/i);
  });
});
