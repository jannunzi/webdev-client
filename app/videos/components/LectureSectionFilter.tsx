"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  EMPTY_LECTURE_FILTER_RAW,
  LECTURE_SEASONS,
  filterLectureClipSets,
  lectureFilterFromRaw,
  lectureFilterRaw,
  lectureSectionOptions,
  lectureYearOptions,
  writeLectureSectionPreference,
  writeLectureTermPreference,
  type LectureFilterQuery,
  type LectureSeason,
  type LectureTerm,
} from "@/lib/videos/lecture-filter";
import type { LectureClipSet } from "@/lib/videos/lectures";
import LectureClipRows from "./LectureClipRows";

const LECTURE_FILTER_EVENT = "videos-lecture-filter";

function subscribeToLectureFilter(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(LECTURE_FILTER_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(LECTURE_FILTER_EVENT, onChange);
  };
}

function readLectureFilterRaw(): string {
  try {
    return lectureFilterRaw(window.localStorage);
  } catch {
    return EMPTY_LECTURE_FILTER_RAW;
  }
}

function notifyLectureFilter(): void {
  window.dispatchEvent(new Event(LECTURE_FILTER_EVENT));
}

function replaceLectureParams(next: {
  sectionId: string;
  year: number;
  season: LectureSeason;
  defaultTerm: LectureTerm;
  defaultSectionId: string;
}): void {
  const url = new URL(window.location.href);
  if (next.sectionId === next.defaultSectionId) url.searchParams.delete("lectureSection");
  else url.searchParams.set("lectureSection", next.sectionId);
  if (next.year === next.defaultTerm.year && next.season === next.defaultTerm.season) {
    url.searchParams.delete("lectureYear");
    url.searchParams.delete("lectureSeason");
  } else {
    url.searchParams.set("lectureYear", String(next.year));
    url.searchParams.set("lectureSeason", next.season);
  }
  const search = url.searchParams.toString();
  window.history.replaceState(null, "", `${url.pathname}${search ? `?${search}` : ""}`);
}

export default function LectureSectionFilter({
  lectures,
  defaultTerm,
  urlFilter,
  defaultSectionId,
}: {
  lectures: LectureClipSet[];
  defaultTerm: LectureTerm;
  urlFilter: LectureFilterQuery;
  defaultSectionId: string;
}) {
  const [sectionOverride, setSectionOverride] = useState<string | null>(urlFilter.sectionId);
  const [yearOverride, setYearOverride] = useState<number | null>(urlFilter.year);
  const [seasonOverride, setSeasonOverride] = useState<LectureSeason | null>(urlFilter.season);
  const raw = useSyncExternalStore(
    subscribeToLectureFilter,
    readLectureFilterRaw,
    () => EMPTY_LECTURE_FILTER_RAW,
  );
  const stored = useMemo(
    () => lectureFilterFromRaw(raw, defaultTerm),
    [raw, defaultTerm],
  );
  const sectionId = sectionOverride ?? stored.sectionId;
  const year = yearOverride ?? stored.year;
  const season = seasonOverride ?? stored.season;
  const filtered = filterLectureClipSets(lectures, { sectionId, year, season });
  const years = lectureYearOptions(lectures, [defaultTerm.year, year]);
  const sectionChoices = lectureSectionOptions();

  function persist(next: { sectionId: string; year: number; season: LectureSeason }) {
    try {
      writeLectureSectionPreference(window.localStorage, next.sectionId);
      writeLectureTermPreference(window.localStorage, next, defaultTerm);
      notifyLectureFilter();
    } catch {
      // Storage blocked: the controls still filter this visit.
    }
    replaceLectureParams({ ...next, defaultTerm, defaultSectionId });
  }

  return (
    <LectureClipRows
      lectures={filtered}
      toolbar={
        <div data-lecture-controls className="mt-4 flex flex-wrap items-end gap-3">
          <label className="min-w-[14rem] flex-1 font-sans text-sm font-semibold" htmlFor="lecture-section">
            Section
            <select
              id="lecture-section"
              value={sectionId}
              onChange={(event) => {
                const nextSection = event.target.value;
                setSectionOverride(nextSection);
                persist({ sectionId: nextSection, year, season });
              }}
              aria-describedby="lecture-filter-note"
              className="mt-1 w-full rounded border border-neutral-400 bg-white px-3 py-2 font-normal"
            >
              {sectionChoices.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
              {sectionChoices.some((option) => option.id === sectionId) ? null : (
                <option value={sectionId}>{sectionId}</option>
              )}
            </select>
          </label>
          <label className="min-w-[7rem] font-sans text-sm font-semibold" htmlFor="lecture-year">
            Year
            <select
              id="lecture-year"
              value={year}
              onChange={(event) => {
                const nextYear = Number(event.target.value);
                setYearOverride(nextYear);
                persist({ sectionId, year: nextYear, season });
              }}
              aria-describedby="lecture-filter-note"
              className="mt-1 w-full rounded border border-neutral-400 bg-white px-3 py-2 font-normal"
            >
              {years.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="min-w-[8rem] font-sans text-sm font-semibold" htmlFor="lecture-season">
            Semester
            <select
              id="lecture-season"
              value={season}
              onChange={(event) => {
                const nextSeason = event.target.value as LectureSeason;
                setSeasonOverride(nextSeason);
                persist({ sectionId, year, season: nextSeason });
              }}
              aria-describedby="lecture-filter-note"
              className="mt-1 w-full rounded border border-neutral-400 bg-white px-3 py-2 font-normal"
            >
              {LECTURE_SEASONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <p id="lecture-filter-note" className="mb-2 max-w-sm font-sans text-sm font-normal text-neutral-600">
            Class recordings for this section and term. Book clips further down are not filtered.
          </p>
        </div>
      }
    />
  );
}
