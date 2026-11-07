import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { SECTION_STORAGE_KEY } from "@/app/syllabus/data/sections";
import { listVideoHubChapters } from "./hub";
import {
  ALL_LECTURE_SECTIONS,
  currentLectureTerm,
  filterLectureClipSets,
  lectureSetMatchesSection,
  lectureFilterFromRaw,
  lectureFilterRaw,
  lectureYearOptions,
  parseLectureFilterSearch,
  readLectureFilterPreference,
  VIDEOS_LECTURE_ALL_KEY,
  VIDEOS_LECTURE_TERM_KEY,
  writeLectureSectionPreference,
  writeLectureTermPreference,
  type LectureFilterStorage,
} from "./lecture-filter";
import { listLectureClipSets, type LectureClipSet } from "./lectures";
import { lectureClipMap } from "./map";
import { withLectureFilterParams } from "./query";

function memoryStorage(initial: Record<string, string> = {}): LectureFilterStorage {
  const data = new Map(Object.entries(initial));
  return {
    getItem(key) {
      return data.has(key) ? data.get(key)! : null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
  };
}

const clip = {
  part: 1,
  youtubeVideoId: "5rmZS4OI2PU",
  title: "t",
  topic: null,
  durationSec: 10,
  summary: "",
};

function lecture(partial: Pick<LectureClipSet, "lectureId" | "course" | "semester" | "date">): LectureClipSet {
  return { ...partial, partCount: 1, clips: [clip] };
}

const fallNow = new Date(2026, 10, 7);
const fallTerm = currentLectureTerm(fallNow);

test("current year and season come from the clock", () => {
  assert.deepEqual(currentLectureTerm(new Date(2026, 10, 7)), {
    year: 2026,
    season: "FA",
    semester: "FA26",
  });
  assert.deepEqual(currentLectureTerm(new Date(2027, 0, 15)), {
    year: 2027,
    season: "SP",
    semester: "SP27",
  });
  assert.deepEqual(currentLectureTerm(new Date(2026, 5, 1)), {
    year: 2026,
    season: "SU",
    semester: "SU26",
  });
  assert.equal(currentLectureTerm(new Date(2026, 4, 31)).season, "SP");
  assert.equal(currentLectureTerm(new Date(2026, 7, 31)).season, "SU");
  const source = readFileSync(new URL("./lecture-filter.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /FA26|Fall 2026/);
});

test("an existing syllabus section filters class recordings and is written back to the same key", () => {
  const storage = memoryStorage({ [SECTION_STORAGE_KEY]: "cs4550-01" });
  const preference = readLectureFilterPreference(storage, fallTerm);
  assert.equal(preference.sectionId, "cs4550-01");
  assert.equal(lectureSetMatchesSection("CS4550-01", preference.sectionId), true);
  assert.equal(lectureSetMatchesSection("CS4550", preference.sectionId), true);
  assert.equal(lectureSetMatchesSection("CS5610-02", preference.sectionId), false);
  const filtered = filterLectureClipSets(listLectureClipSets(), preference);
  assert.deepEqual(
    filtered.map((set) => set.date),
    ["2026-10-21", "2026-10-14", "2026-10-07", "2026-09-30"],
  );
  assert.ok(filtered.every((set) => set.course === "CS4550-01" && set.semester === "FA26"));

  writeLectureSectionPreference(storage, "cs5610-09");
  assert.equal(storage.getItem(SECTION_STORAGE_KEY), "cs5610-09");
  assert.equal(storage.getItem(VIDEOS_LECTURE_ALL_KEY), null);
  const tuesday = filterLectureClipSets(
    listLectureClipSets(),
    readLectureFilterPreference(storage, fallTerm),
  );
  assert.ok(tuesday.every((set) => set.course === "CS5610-09"));
  assert.equal(tuesday[0]?.lectureId, "cs5610-09_2026-10-20");
});

test("All sections keeps every course in the term and does not erase the syllabus pick", () => {
  const storage = memoryStorage({ [SECTION_STORAGE_KEY]: "cs4550-01" });
  writeLectureSectionPreference(storage, ALL_LECTURE_SECTIONS);
  assert.equal(storage.getItem(SECTION_STORAGE_KEY), "cs4550-01");
  assert.equal(storage.getItem(VIDEOS_LECTURE_ALL_KEY), "all");
  const preference = readLectureFilterPreference(storage, fallTerm);
  assert.equal(preference.sectionId, "all");
  const filtered = filterLectureClipSets(listLectureClipSets(), preference);
  assert.equal(filtered.length, 12);
  assert.deepEqual(
    [...new Set(filtered.map((set) => set.course))].sort(),
    ["CS4550-01", "CS5610-02", "CS5610-09"],
  );
});

test("archive year and season stay selectable without showing the current term", () => {
  const sets = [
    lecture({
      lectureId: "cs4550-01_2025-10-08",
      course: "CS4550",
      semester: "FA25",
      date: "2025-10-08",
    }),
    lecture({
      lectureId: "cs5610-02_2026-10-26",
      course: "CS5610-02",
      semester: "FA26",
      date: "2026-10-26",
    }),
    lecture({
      lectureId: "cs4550-01_2026-10-07",
      course: "CS4550",
      semester: "FA26",
      date: "2026-10-07",
    }),
  ];
  const archive = filterLectureClipSets(sets, {
    sectionId: "cs4550-01",
    year: 2025,
    season: "FA",
  });
  assert.deepEqual(
    archive.map((set) => set.lectureId),
    ["cs4550-01_2025-10-08"],
  );
  const storage = memoryStorage();
  writeLectureTermPreference(storage, { year: 2025, season: "FA" }, fallTerm);
  assert.equal(storage.getItem(VIDEOS_LECTURE_TERM_KEY), "2025-FA");
  const saved = readLectureFilterPreference(storage, fallTerm);
  assert.equal(saved.year, 2025);
  assert.equal(saved.season, "FA");
  assert.deepEqual(lectureYearOptions(sets, [fallTerm.year, saved.year]), [2026, 2025]);
  writeLectureTermPreference(storage, { year: fallTerm.year, season: fallTerm.season }, fallTerm);
  assert.equal(storage.getItem(VIDEOS_LECTURE_TERM_KEY), null);

  const query = parseLectureFilterSearch({
    lectureSection: "ALL",
    lectureYear: "2025",
    lectureSeason: "Fall",
  });
  assert.deepEqual(query, { sectionId: "all", year: 2025, season: "FA" });
  assert.equal(
    filterLectureClipSets(listLectureClipSets(), {
      sectionId: "all",
      year: 2025,
      season: "FA",
    }).length,
    0,
  );
  assert.equal(
    withLectureFilterParams("/videos?course=cs4550", {
      lectureSection: "all",
      lectureYear: "2025",
      lectureSeason: "FA",
    }),
    "/videos?course=cs4550&lectureSection=all&lectureYear=2025&lectureSeason=FA",
  );
});

test("book chapters stay visible no matter which section lecture filter is active", () => {
  const preferred = { course: "CS4550", semester: "FA26" };
  const before = listVideoHubChapters(lectureClipMap, preferred);
  const curated = before.flatMap((chapter) =>
    chapter.sections.flatMap((section) => section.clips.map((clip) => `${clip.id}:${clip.youtubeVideoId}`)),
  );
  assert.ok(curated.some((id) => id.startsWith("sec-1-3-1:")));
  assert.ok(curated.some((id) => id.startsWith("sec-2-1-19:")));

  filterLectureClipSets(listLectureClipSets(), {
    sectionId: "cs5610-02",
    year: 2025,
    season: "SP",
  });
  const after = listVideoHubChapters(lectureClipMap, preferred);
  const curatedAfter = after.flatMap((chapter) =>
    chapter.sections.flatMap((section) => section.clips.map((clip) => `${clip.id}:${clip.youtubeVideoId}`)),
  );
  assert.deepEqual(curatedAfter, curated);

  const page = readFileSync(new URL("../../app/videos/page.tsx", import.meta.url), "utf8");
  const hub = readFileSync(new URL("../../app/videos/components/VideosHub.tsx", import.meta.url), "utf8");
  const filter = readFileSync(
    new URL("../../app/videos/components/LectureSectionFilter.tsx", import.meta.url),
    "utf8",
  );
  assert.match(page, /listVideoHubChapters\(lectureClipMap/);
  assert.doesNotMatch(page, /filterLectureClipSets/);
  assert.match(hub, /data-curated-chapters/);
  assert.doesNotMatch(filter, /listVideoHubChapters/);
  assert.match(filter, /filterLectureClipSets/);
});

test("a blank storage snapshot uses the syllabus default section and the fallback term", () => {
  const preference = lectureFilterFromRaw("\n\n", fallTerm);
  assert.equal(preference.sectionId, "cs5610-02");
  assert.equal(preference.year, 2026);
  assert.equal(preference.season, "FA");
  assert.equal(
    lectureFilterRaw(memoryStorage({ [SECTION_STORAGE_KEY]: "cs5610-09", [VIDEOS_LECTURE_TERM_KEY]: "2025-FA" })),
    "\ncs5610-09\n2025-FA",
  );
  assert.equal(lectureSetMatchesSection("CS4550-01", "missing"), false);
  assert.equal(
    filterLectureClipSets(listLectureClipSets(), {
      sectionId: "missing",
      year: 2026,
      season: "FA",
    }).length,
    0,
  );
});
