import "server-only";

import { getCollection } from "../mongo";
import { courseSectionIdFromRoster } from "../roster/sections";
import {
  toOverrideView,
  type QuizAccessOverrideRecord,
  type QuizAccessOverrideView,
} from "./access-override";
import type {
  QuizAnswersVisibleMode,
  QuizTakeOverrideMode,
} from "./schedule";

export const QUIZ_ACCESS_OVERRIDES_COLLECTION = "quiz_access_overrides";

export type QuizAccessOverrideDoc = QuizAccessOverrideRecord & {
  updatedAt: Date;
};

export async function getQuizAccessOverridesCollection() {
  return getCollection<QuizAccessOverrideDoc>(QUIZ_ACCESS_OVERRIDES_COLLECTION);
}

export type QuizAccessForRoster = {
  takeOverride?: QuizTakeOverrideMode;
  answersVisible?: QuizAnswersVisibleMode;
};

export async function loadTakeOverrideForRoster(
  quizId: string,
  rosterSection: string | undefined | null,
): Promise<QuizTakeOverrideMode | undefined> {
  const access = await loadQuizAccessForRoster(quizId, rosterSection);
  return access.takeOverride;
}

export async function loadAnswersVisibleForRoster(
  quizId: string,
  rosterSection: string | undefined | null,
): Promise<QuizAnswersVisibleMode | undefined> {
  const access = await loadQuizAccessForRoster(quizId, rosterSection);
  return access.answersVisible;
}

export async function loadQuizAccessForRoster(
  quizId: string,
  rosterSection: string | undefined | null,
): Promise<QuizAccessForRoster> {
  const sectionId = courseSectionIdFromRoster(rosterSection);
  if (!sectionId) return {};
  try {
    const doc = await findQuizAccessOverride(quizId, sectionId);
    return {
      takeOverride: doc?.mode,
      answersVisible: doc?.answersVisible,
    };
  } catch {
    return {};
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
  mode?: QuizTakeOverrideMode;
  answersVisible?: QuizAnswersVisibleMode;
  updatedBy?: string;
  updatedAt?: Date;
}): Promise<QuizAccessOverrideDoc> {
  const quizId = input.quizId;
  const sectionId = input.sectionId;
  const updatedAt = input.updatedAt ?? new Date();
  const $set: Partial<QuizAccessOverrideDoc> = {
    quizId,
    sectionId,
    updatedAt,
  };
  if (input.mode) $set.mode = input.mode;
  if (input.answersVisible) $set.answersVisible = input.answersVisible;
  if (input.updatedBy) $set.updatedBy = input.updatedBy;

  const $setOnInsert: Partial<QuizAccessOverrideDoc> = {};
  if (!input.mode) $setOnInsert.mode = "schedule";
  if (!input.answersVisible) $setOnInsert.answersVisible = "schedule";

  const collection = await getQuizAccessOverridesCollection();
  await collection.updateOne(
    { quizId, sectionId },
    {
      $set,
      ...(Object.keys($setOnInsert).length > 0 ? { $setOnInsert } : {}),
    },
    { upsert: true },
  );
  const saved = await collection.findOne({ quizId, sectionId });
  if (saved) return saved;
  return {
    quizId,
    sectionId,
    mode: input.mode ?? "schedule",
    answersVisible: input.answersVisible ?? "schedule",
    updatedAt,
    updatedBy: input.updatedBy,
  };
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
