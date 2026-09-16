import type { ProjectDoc, ProjectDocSlug } from "../types";
import { open_endedDoc } from "./open-ended";
import { pazzaDoc } from "./pazza";
import { quizzesDoc } from "./quizzes";

export const PROJECT_DOCS = [quizzesDoc, pazzaDoc, open_endedDoc] as const;

export const PROJECT_DOC_SLUGS: ProjectDocSlug[] = [
  "quizzes",
  "pazza",
  "open-ended",
];

export function getProjectDoc(slug: string): ProjectDoc | undefined {
  return PROJECT_DOCS.find((doc) => doc.slug === slug);
}

export function isProjectDocSlug(slug: string): slug is ProjectDocSlug {
  return PROJECT_DOC_SLUGS.includes(slug as ProjectDocSlug);
}

export function projectDocHref(slug: ProjectDocSlug): `/project/${ProjectDocSlug}` {
  return `/project/${slug}`;
}
