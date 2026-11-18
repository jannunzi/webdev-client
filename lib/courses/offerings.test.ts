import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { COURSE_INFO_LINKS, isCourseInfoCurrent } from "../../app/course-info/links.ts";
import { sections } from "../../app/syllabus/data/sections.ts";
import {
  courseOfferings,
  landingCards,
  legacySectionPath,
  legacyTabRedirects,
  offeringById,
  offeringHeading,
  sectionIdFromLegacyTab,
} from "./offerings.ts";

const root = process.cwd();

function read(rel: string) {
  return readFileSync(join(root, rel), "utf8");
}

describe("course offerings", () => {
  it("builds one card per current section, then the CS5500 placeholder", () => {
    const cards = landingCards();
    assert.deepEqual(
      cards.map((card) => card.sectionId),
      ["cs5610-02", "cs5610-09", "cs4550-01", null],
    );
    assert.deepEqual(
      sections.map((section) => section.id),
      ["cs5610-02", "cs5610-09", "cs4550-01"],
    );
    assert.deepEqual(
      cards.slice(0, 3).map((card) => card.heading),
      [
        "CS5610 · Web Development · Fall 2026",
        "CS5610 · Web Development · Fall 2026",
        "CS4550 · Web Development · Fall 2026",
      ],
    );
    assert.deepEqual(
      cards.slice(0, 3).map((card) => card.sectionLabel),
      ["CS5610-02", "CS5610-09", "CS4550-01"],
    );
    assert.deepEqual(
      cards.slice(0, 3).map((card) => card.href),
      ["/syllabus/cs5610-02", "/syllabus/cs5610-09", "/syllabus/cs4550-01"],
    );
    for (const card of cards.slice(0, 3)) {
      assert.equal(card.status, "active");
      assert.equal(card.bookHref, "/book");
    }
  });

  it("keeps section modality in step with the syllabus sections", () => {
    const cards = landingCards();
    for (const section of sections) {
      const card = cards.find((item) => item.sectionId === section.id);
      assert.ok(card, section.id);
      const detail = section.modality === "online" ? "Online" : "In person";
      assert.equal(card.detail, detail);
      assert.equal(card.sectionLabel, `${section.code.replace(/\s+/g, "")}-${section.sectionNumber}`);
    }
  });

  it("marks CS5500 Summer 2027 as coming soon with its own book route", () => {
    const offering = offeringById("cs5500-su2027");
    assert.ok(offering);
    assert.equal(offering.status, "coming-soon");
    assert.equal(offering.courseNumber, "CS5500");
    assert.equal(offering.title, "Foundations of Software Engineering");
    assert.deepEqual(offering.term, { season: "Summer", year: 2027 });
    assert.equal(offering.syllabusHref, "/cs5500");
    assert.equal(offering.bookHref, "/cs5500/book");
    assert.deepEqual(offering.sections, []);
    assert.equal(
      offeringHeading(offering),
      "CS5500 · Foundations of Software Engineering · Summer 2027",
    );

    const card = landingCards().find((item) => item.offeringId === "cs5500-su2027");
    assert.ok(card);
    assert.equal(card.status, "coming-soon");
    assert.equal(card.href, "/cs5500");
    assert.equal(card.bookHref, "/cs5500/book");
    assert.equal(card.sectionLabel, null);
  });

  it("shares /book across the active Web Development offerings only", () => {
    const active = courseOfferings.filter((offering) => offering.status === "active");
    assert.deepEqual(
      active.map((offering) => offering.courseNumber),
      ["CS5610", "CS4550"],
    );
    for (const offering of active) {
      assert.equal(offering.bookHref, "/book");
    }
  });

  it("maps old tab ids and hashes onto the section syllabus", () => {
    assert.equal(sectionIdFromLegacyTab("cs5610-02"), "cs5610-02");
    assert.equal(sectionIdFromLegacyTab("#cs5610-09"), "cs5610-09");
    assert.equal(sectionIdFromLegacyTab("syllabus-tab-cs4550-01"), "cs4550-01");
    assert.equal(sectionIdFromLegacyTab("#syllabus-tab-cs5610-02"), "cs5610-02");
    assert.equal(sectionIdFromLegacyTab("cs5500"), undefined);
    assert.equal(sectionIdFromLegacyTab(""), undefined);
    assert.equal(legacySectionPath("cs4550-01"), "/syllabus/cs4550-01");
    assert.equal(legacySectionPath("missing"), undefined);
  });

  it("redirects bare section paths and the old tab button ids", () => {
    const redirects = legacyTabRedirects();
    assert.deepEqual(
      redirects.map((item) => [item.source, item.destination]),
      [
        ["/syllabus-tab-cs5610-02", "/syllabus/cs5610-02"],
        ["/cs5610-02", "/syllabus/cs5610-02"],
        ["/syllabus-tab-cs5610-09", "/syllabus/cs5610-09"],
        ["/cs5610-09", "/syllabus/cs5610-09"],
        ["/syllabus-tab-cs4550-01", "/syllabus/cs4550-01"],
        ["/cs4550-01", "/syllabus/cs4550-01"],
      ],
    );
    for (const item of redirects) assert.equal(item.permanent, false);
  });
});

describe("course landing routes", () => {
  it("serves / as the card page and keeps /syllabus", () => {
    const config = read("next.config.ts");
    assert.match(config, /legacyTabRedirects\(\)/);
    assert.doesNotMatch(config, /destination:\s*"\/syllabus"/);
    assert.match(read("app/(course)/page.tsx"), /CourseOfferingCards/);
    assert.match(read("app/(course)/page.tsx"), /wd-course-dashboard-title/);
    assert.match(read("app/courses/CourseOfferingCards.tsx"), /wd-course-dashboard/);
    assert.match(read("app/courses/CourseOfferingCards.tsx"), /wd-course-card-/);
    assert.match(read("app/syllabus/page.tsx"), /sectionIdFromLegacyTab/);
    assert.match(read("app/syllabus/components/SyllabusView.tsx"), /CourseBreadcrumb/);
    assert.match(read("app/syllabus/components/SyllabusView.tsx"), /wd-all-courses-link|CourseBreadcrumb/);
    assert.doesNotMatch(read("app/syllabus/components/SyllabusView.tsx"), /SectionTabs/);
    assert.match(read("app/cs5500/page.tsx"), /wd-coming-soon/);
    assert.match(read("app/cs5500/book/page.tsx"), /wd-cs5500-book/);
    assert.match(read("app/courses/CourseBreadcrumb.tsx"), /href="\/"/);
  });

  it("puts Courses first in the header, linking back to the landing page", () => {
    assert.equal(COURSE_INFO_LINKS[0]?.href, "/");
    assert.equal(COURSE_INFO_LINKS[0]?.label, "Courses");
    assert.equal(COURSE_INFO_LINKS[1]?.href, "/syllabus");
    assert.equal(isCourseInfoCurrent("/", "/"), true);
    assert.equal(isCourseInfoCurrent("/syllabus", "/"), false);
    assert.equal(isCourseInfoCurrent("/syllabus/cs5610-02", "/"), false);
    assert.equal(isCourseInfoCurrent("/syllabus/cs5610-02", "/syllabus"), true);
    assert.equal(isCourseInfoCurrent("/cs5500", "/syllabus"), false);
    assert.equal(isCourseInfoCurrent("/cs5500/book", "/book"), false);
  });
});
