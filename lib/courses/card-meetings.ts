import { formatMeetingWeekdays } from "@/app/syllabus/data/dates";
import { sections as syllabusSections } from "@/app/syllabus/data/sections";
import {
  courseOfferings,
  landingGroups,
  type CourseOffering,
  type LandingCard,
  type LandingGroup,
} from "./offerings";

function sectionLines(sectionId: string): string[] | null {
  const section = syllabusSections.find((item) => item.id === sectionId);
  if (!section) return null;
  const lines = [section.modality === "online" ? "Online" : "In person"];
  if (section.daysOfWeek.length > 0 && section.time) {
    lines.push(`${formatMeetingWeekdays(section.daysOfWeek)}, ${section.time}`);
  }
  if (section.modality !== "online" && section.location.trim()) {
    lines.push(section.location);
  }
  return lines;
}

function offeringMeetingLines(offering: CourseOffering | undefined): string[] {
  if (!offering?.meeting) return [];
  return [offering.meeting.delivery, offering.meeting.when];
}

/** Card subtitles from syllabus sections, or from offering.meeting when there is no section. */
export function withMeetingLines(
  groups: readonly LandingGroup[],
  offeringsById: ReadonlyMap<string, CourseOffering>,
): LandingGroup[] {
  return groups.map((group) => ({
    ...group,
    cards: group.cards.map((card) => decorate(card, offeringsById.get(card.offeringId))),
  }));
}

function decorate(card: LandingCard, offering: CourseOffering | undefined): LandingCard {
  if (card.sectionId) {
    const meeting = sectionLines(card.sectionId);
    if (!meeting) return card;
    return { ...card, lines: [card.lines[0] ?? "", ...meeting].filter(Boolean) };
  }
  const meeting = offeringMeetingLines(offering);
  if (meeting.length === 0) return card;
  return { ...card, lines: [card.lines[0] ?? "", ...meeting].filter(Boolean) };
}

export function landingGroupsWithMeetings(): LandingGroup[] {
  const byId = new Map(courseOfferings.map((offering) => [offering.id, offering]));
  return withMeetingLines(landingGroups(), byId);
}
