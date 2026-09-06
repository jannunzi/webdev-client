import "server-only";

import { getCollection } from "../mongo";
import { courseSectionIdFromRoster } from "../roster/sections";
import {
  toOverrideView,
  type QuizAccessOverrideRecord,
  type QuizAccessOverrideView,
} from "./access-override";
import type { QuizTakeOverrideMode } from "./schedule";

export const QUIZ_ACCESS_OVERRIDES_COLLECTION = "quiz_access_overrides";

export type QuizAccessOverrideDoc = QuizAccessOverrideRecord & {
  updatedAt: Date;
};

export async function getQuizAccessOverridesCollection() {
  return getCollection<QuizAccessOverrideDoc>(QUIZ_ACCESS_OVERRIDES_COLLECTION);
}

export async function loadTakeOverrideForRoster(
  quizId: string,
  rosterSection: string | undefined | null,
): Promise<QuizTakeOverrideMode | undefined> {
  const sectionId = courseSectionIdFromRoster(rosterSection);
  if (!sectionId) return undefined;
  try {
    const doc = await findQuizAccessOverride(quizId, sectionId);
    return doc?.mode;
  } catch {
    return undefined;
  }
}

export async function findQuizAccessOverride(
  quizId: string,
  sectionId: string,
): Promise<QuizAccessOverrideDoc | null> {
  const collection = await getQuizAccessOverridesCollection();
  return collection.findOne({ quizId, sectionId });
}

export async function listQuizAccessOverrides(
  quizIds?: string[],
): Promise<QuizAccessOverrideDoc[]> {
  const collection = await getQuizAccessOverridesCollection();
  const filter = quizIds?.length ? { quizId: { $in: quizIds } } : {};
  return collection.find(filter).toArray();
}

export async function upsertQuizAccessOverride(input: {
  quizId: string;
  sectionId: string;
  mode: QuizTakeOverrideMode;
  updatedBy?: string;
  updatedAt?: Date;
}): Promise<QuizAccessOverrideDoc> {
  const doc: QuizAccessOverrideDoc = {
    quizId: input.quizId,
    sectionId: input.sectionId,
    mode: input.mode,
    updatedAt: input.updatedAt ?? new Date(),
    updatedBy: input.updatedBy,
  };
  const collection = await getQuizAccessOverridesCollection();
  await collection.updateOne(
    { quizId: doc.quizId, sectionId: doc.sectionId },
    { $set: doc },
    { upsert: true },
  );
  return doc;
}

export function overrideDocsToViews(
  docs: readonly QuizAccessOverrideDoc[],
): QuizAccessOverrideView[] {
  return docs.map(toOverrideView);
}

export async function ensureOverrideIndexes(): Promise<void> {
  const collection = await getQuizAccessOverridesCollection();
  await collection.createIndex({ quizId: 1, sectionId: 1 }, { unique: true });
}
