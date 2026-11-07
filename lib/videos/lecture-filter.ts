import {
  defaultSectionId,
  resolveStoredSectionId,
  SECTION_STORAGE_KEY,
  sections,
} from "@/app/syllabus/data/sections";
import { sourceCourseIdForSyllabusSection } from "./courses";
import type { LectureClipSet } from "./lectures";

/** Videos-only override. A real section is stored in the syllabus key instead. */
export const VIDEOS_LECTURE_ALL_KEY = "videos-lecture-section";
export const VIDEOS_LECTURE_TERM_KEY = "videos-lecture-term";
export const ALL_LECTURE_SECTIONS = "all";

export const LECTURE_SEASONS = [
  { id: "SP", label: "Spring" },
  { id: "SU", label: "Summer" },
  { id: "FA", label: "Fall" },
] as const;

export type LectureSeason = (typeof LECTURE_SEASONS)[number]["id"];

export type LectureTerm = {
  year: number;
  season: LectureSeason;
  semester: string;
};

export type LectureFilter = {
  sectionId: string;
  year: number;
  season: LectureSeason;
};

export type LectureFilterQuery = {
  sectionId: string | null;
  year: number | null;
  season: LectureSeason | null;
};

export type LectureFilterStorage = {
  getItem(key: string): string | null;
  setItem?(key: string, value: string): void;
  removeItem?(key: string): void;
};

const SEASON_BY_NAME: Record<string, LectureSeason> = {
  spring: "SP",
  summer: "SU",
  fall: "FA",
  sp: "SP",
  su: "SU",
  fa: "FA",
};

/** January–May spring, June–August summer, September–December fall. */
export function lectureSeasonForMonth(monthIndex: number): LectureSeason {
  if (monthIndex <= 4) return "SP";
  if (monthIndex <= 7) return "SU";
  return "FA";
}

export function lectureSemesterCode(year: number, season: LectureSeason): string {
  return `${season}${String(year).slice(-2)}`;
}

/**
 * Year and season for "now". Callers pass the clock so a build or a test
 * never freezes one term into the source.
 */
export function currentLectureTerm(now: Date): LectureTerm {
  const year = now.getFullYear();
  const season = lectureSeasonForMonth(now.getMonth());
  return { year, season, semester: lectureSemesterCode(year, season) };
}

export function lectureSeasonLabel(season: LectureSeason): string {
  return LECTURE_SEASONS.find((entry) => entry.id === season)?.label ?? season;
}

export function lectureSectionOptions(): { id: string; label: string }[] {
  return [
    { id: ALL_LECTURE_SECTIONS, label: "All sections" },
    ...sections.map((section) => ({ id: section.id, label: section.tabLabel })),
  ];
}

/**
 * Course ids that belong to a syllabus section.
 * Lecture sets use `CS4550-01` (from the lecture id). Book-clip rows use
 * `CS4550`. Graduate sections use `CS5610-02` / `CS5610-09` in both places.
 * Null means All sections. An empty list is an unknown section.
 */
export function lectureCourseIdsForSection(sectionId: string): string[] | null {
  if (sectionId === ALL_LECTURE_SECTIONS) return null;
  const section = sections.find((entry) => entry.id === sectionId);
  if (!section) return [];
  const compact = section.code.replace(/\s+/g, "").toUpperCase();
  const withNumber = `${compact}-${section.sectionNumber}`;
  const roster = sourceCourseIdForSyllabusSection(section);
  return [...new Set([withNumber, roster])];
}

export function lectureSetMatchesSection(course: string, sectionId: string): boolean {
  const ids = lectureCourseIdsForSection(sectionId);
  if (ids == null) return true;
  return ids.includes(course.trim().toUpperCase());
}

export function isLectureSeason(value: string): value is LectureSeason {
  return value === "SP" || value === "SU" || value === "FA";
}

export function parseLectureSeason(value: string | null | undefined): LectureSeason | null {
  if (!value) return null;
  const season = SEASON_BY_NAME[value.trim().toLowerCase()];
  return season ?? null;
}

export function parseLectureYear(value: string | null | undefined): number | null {
  if (!value || !/^\d{4}$/.test(value.trim())) return null;
  const year = Number(value);
  if (year < 2000 || year > 2100) return null;
  return year;
}

export function parseLectureFilterSearch(raw: {
  lectureSection?: string;
  lectureYear?: string;
  lectureSeason?: string;
}): LectureFilterQuery {
  const sectionRaw = raw.lectureSection?.trim().toLowerCase();
  const sectionId =
    sectionRaw === ALL_LECTURE_SECTIONS ||
    (sectionRaw != null && sections.some((section) => section.id === sectionRaw))
      ? sectionRaw
      : null;
  return {
    sectionId,
    year: parseLectureYear(raw.lectureYear),
    season: parseLectureSeason(raw.lectureSeason),
  };
}

function parseStoredTerm(value: string | null): { year: number; season: LectureSeason } | null {
  if (!value) return null;
  const match = /^(\d{4})-(SP|SU|FA)$/.exec(value.trim().toUpperCase());
  if (!match) return null;
  const year = Number(match[1]);
  const season = match[2];
  if (!isLectureSeason(season) || year < 2000 || year > 2100) return null;
  return { year, season };
}

/**
 * Section comes from the syllabus pick unless this page last chose All sections.
 * Term comes from this page's saved archive choice, otherwise the fallback
 * (the request's current year and season).
 */
export function readLectureFilterPreference(
  storage: LectureFilterStorage,
  fallback: LectureTerm,
): LectureFilter {
  const all = storage.getItem(VIDEOS_LECTURE_ALL_KEY) === ALL_LECTURE_SECTIONS;
  const sectionId = all
    ? ALL_LECTURE_SECTIONS
    : resolveStoredSectionId(storage.getItem(SECTION_STORAGE_KEY));
  const storedTerm = parseStoredTerm(storage.getItem(VIDEOS_LECTURE_TERM_KEY));
  return {
    sectionId,
    year: storedTerm?.year ?? fallback.year,
    season: storedTerm?.season ?? fallback.season,
  };
}

export function writeLectureSectionPreference(storage: LectureFilterStorage, sectionId: string): void {
  if (sectionId === ALL_LECTURE_SECTIONS) {
    storage.setItem?.(VIDEOS_LECTURE_ALL_KEY, ALL_LECTURE_SECTIONS);
    return;
  }
  storage.removeItem?.(VIDEOS_LECTURE_ALL_KEY);
  if (sections.some((section) => section.id === sectionId)) {
    storage.setItem?.(SECTION_STORAGE_KEY, sectionId);
  }
}

export function writeLectureTermPreference(
  storage: LectureFilterStorage,
  term: { year: number; season: LectureSeason },
  fallback: LectureTerm,
): void {
  if (term.year === fallback.year && term.season === fallback.season) {
    storage.removeItem?.(VIDEOS_LECTURE_TERM_KEY);
    return;
  }
  storage.setItem?.(VIDEOS_LECTURE_TERM_KEY, `${term.year}-${term.season}`);
}

export const EMPTY_LECTURE_FILTER_RAW = "\n\n";

/** Stable snapshot for useSyncExternalStore: all-flag, syllabus id, saved term. */
export function lectureFilterRaw(storage: LectureFilterStorage): string {
  return [
    storage.getItem(VIDEOS_LECTURE_ALL_KEY) ?? "",
    storage.getItem(SECTION_STORAGE_KEY) ?? "",
    storage.getItem(VIDEOS_LECTURE_TERM_KEY) ?? "",
  ].join("\n");
}

export function lectureFilterFromRaw(raw: string, fallback: LectureTerm): LectureFilter {
  const [all = "", section = "", term = ""] = raw.split("\n");
  return readLectureFilterPreference(
    {
      getItem(key: string) {
        if (key === VIDEOS_LECTURE_ALL_KEY) return all || null;
        if (key === SECTION_STORAGE_KEY) return section || null;
        if (key === VIDEOS_LECTURE_TERM_KEY) return term || null;
        return null;
      },
    },
    fallback,
  );
}

export function lectureYearOptions(
  sets: readonly LectureClipSet[],
  extraYears: readonly number[],
): number[] {
  const years = new Set<number>();
  for (const year of extraYears) {
    if (year >= 2000 && year <= 2100) years.add(year);
  }
  for (const set of sets) {
    const year = Number(set.date.slice(0, 4));
    if (year >= 2000 && year <= 2100) years.add(year);
  }
  return [...years].sort((a, b) => b - a);
}

/**
 * Class recordings for one section and term. All sections keeps every course.
 * An unknown section matches nothing. Book-chapter clips are not an input.
 */
export function filterLectureClipSets(
  sets: readonly LectureClipSet[],
  filter: LectureFilter,
): LectureClipSet[] {
  const semester = lectureSemesterCode(filter.year, filter.season);
  const courses = lectureCourseIdsForSection(filter.sectionId);
  if (courses != null && courses.length === 0) return [];
  return sets.filter((set) => {
    if (set.semester !== semester) return false;
    if (courses != null && !courses.includes(set.course.trim().toUpperCase())) return false;
    return true;
  });
}

export function defaultLectureSectionId(): string {
  return defaultSectionId;
}
