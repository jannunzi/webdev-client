import {
  courseSectionIdFromRoster,
  type CourseSectionId,
} from "../roster/sections";
import { findSection } from "@/app/syllabus/data/sections";

const SYLLABUS_TO_ROSTER: Record<string, CourseSectionId> = {
  "cs4550-01": "CS4550",
  "cs5610-02": "CS5610-02",
  "cs5610-09": "CS5610-09",
};

export function syllabusSectionToRosterId(
  sectionId: string,
): CourseSectionId | undefined {
  return SYLLABUS_TO_ROSTER[sectionId];
}

export function isSyllabusSectionId(sectionId: string): boolean {
  return sectionId in SYLLABUS_TO_ROSTER;
}

export function rosterMatchesSyllabusSection(
  rosterSection: string | undefined | null,
  syllabusSectionId: string,
): boolean {
  const expected = syllabusSectionToRosterId(syllabusSectionId);
  const rosterId = courseSectionIdFromRoster(rosterSection);
  return Boolean(expected && rosterId && expected === rosterId);
}

export function sectionLabelForId(sectionId: string): string {
  const section = findSection(sectionId);
  return `${section.code}-${section.sectionNumber}`;
}
