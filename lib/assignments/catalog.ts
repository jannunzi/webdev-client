import { assignments as syllabusAssignments } from "@/app/syllabus/data/assignments";
import { deadlines } from "@/app/syllabus/data/deadlines";
import type { Deadline } from "@/app/syllabus/data/types";
import { A1_RUBRIC } from "./a1";
import { A2_RUBRIC } from "./a2";
import type {
  AssignmentHubItem,
  AssignmentId,
  AssignmentRubric,
  RubricCriterion,
} from "./types";

const RUBRICS: Partial<Record<AssignmentId, AssignmentRubric>> = {
  a1: A1_RUBRIC,
  a2: A2_RUBRIC,
};

export const COURSE_SITE_ORIGIN = "https://webdev-client.vercel.app";

const CHAPTERS: Record<string, { href: string; title: string }> = {
  "Chapter 1": {
    href: "/book/ch1",
    title: "Building Next.js User Interfaces with HTML",
  },
  "Chapter 2": {
    href: "/book/ch2",
    title: "Styling User Interfaces with CSS and Tailwind",
  },
  "Chapter 3": {
    href: "/book/ch3",
    title: "Creating Single Page Applications with JavaScript",
  },
  "Chapter 4": {
    href: "/book/ch4",
    title: "Managing Client State",
  },
  "Chapter 5": {
    href: "/book/ch5",
    title: "Implementing RESTful Web APIs with Express.js",
  },
  "Chapter 6": {
    href: "/book/ch6",
    title: "Integrating React with MongoDB",
  },
};

export function assignmentPublicUrl(id: AssignmentId): string {
  return `${COURSE_SITE_ORIGIN}/assignments/${id}`;
}

function canvasIdToSlug(canvasId: string): AssignmentId {
  return canvasId.toLowerCase() as AssignmentId;
}

function findAssignmentDeadline(
  canvasId: string,
  kind: "due" | "assigned",
): Deadline | undefined {
  const needle =
    kind === "due" ? `${canvasId} due` : `${canvasId} assigned`;
  return deadlines.find(
    (row) => row.kind === "assignment" && row.label.startsWith(needle),
  );
}

export function listAssignmentIds(): AssignmentId[] {
  return syllabusAssignments.map((item) => canvasIdToSlug(item.id));
}

export function getAssignment(id: string): AssignmentHubItem | undefined {
  const slug = id.toLowerCase() as AssignmentId;
  const syllabus = syllabusAssignments.find(
    (item) => canvasIdToSlug(item.id) === slug,
  );
  if (!syllabus) return undefined;

  const rubric = RUBRICS[slug];
  const chapter = CHAPTERS[syllabus.chapter];
  return {
    id: slug,
    canvasId: syllabus.id,
    title: syllabus.title,
    chapter: syllabus.chapter,
    chapterTitle: chapter?.title ?? syllabus.chapter,
    chapterHref: chapter?.href ?? "/book",
    publicUrl: assignmentPublicUrl(slug),
    summary: syllabus.summary,
    dueDate: findAssignmentDeadline(syllabus.id, "due")?.date,
    assignedDate: findAssignmentDeadline(syllabus.id, "assigned")?.date,
    status: rubric ? "ready" : "coming_soon",
    rubric,
  };
}

export function listAssignments(): AssignmentHubItem[] {
  return listAssignmentIds()
    .map((id) => getAssignment(id))
    .filter((item): item is AssignmentHubItem => Boolean(item));
}

export function listRubricCriteria(
  rubric: AssignmentRubric,
): RubricCriterion[] {
  return rubric.groups.flatMap((group) => group.criteria);
}

export function findCriterion(
  rubric: AssignmentRubric,
  criterionId: string,
): RubricCriterion | undefined {
  return listRubricCriteria(rubric).find((row) => row.id === criterionId);
}

export function rubricPointTotal(rubric: AssignmentRubric): number {
  return listRubricCriteria(rubric).reduce((sum, row) => sum + row.points, 0);
}

export function isAssignmentId(value: string): value is AssignmentId {
  return listAssignmentIds().includes(value as AssignmentId);
}
