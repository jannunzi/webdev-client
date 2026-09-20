import "server-only";

import { getCollection } from "../mongo";
import {
  QUIZ_GRADE_OVERRIDES_COLLECTION,
  serializeClassOverride,
} from "./grade-override";
import type { QuizClassQuestionOverride } from "./types";

export { QUIZ_GRADE_OVERRIDES_COLLECTION };

export type QuizGradeOverrideDoc = QuizClassQuestionOverride & {
  updatedAt: Date;
};

export async function getQuizGradeOverridesCollection() {
  return getCollection<QuizGradeOverrideDoc>(QUIZ_GRADE_OVERRIDES_COLLECTION);
}

export async function listQuizGradeOverrides(
  quizId: string,
): Promise<QuizClassQuestionOverride[]> {
  try {
    const collection = await getQuizGradeOverridesCollection();
    const docs = await collection.find({ quizId }).toArray();
    return docs.map(serializeClassOverride);
  } catch {
    return [];
  }
}

export async function upsertQuizGradeOverride(input: {
  quizId: string;
  questionId: string;
  kind: "correct" | "wrong";
  updatedBy?: string;
  updatedAt?: Date;
}): Promise<QuizGradeOverrideDoc> {
  const doc: QuizGradeOverrideDoc = {
    quizId: input.quizId,
    questionId: input.questionId,
    scope: "all_students",
    kind: input.kind,
    updatedAt: input.updatedAt ?? new Date(),
    updatedBy: input.updatedBy,
  };
  const collection = await getQuizGradeOverridesCollection();
  await collection.updateOne(
    { quizId: doc.quizId, questionId: doc.questionId },
    { $set: doc },
    { upsert: true },
  );
  return doc;
}

export async function deleteQuizGradeOverride(
  quizId: string,
  questionId: string,
): Promise<void> {
  const collection = await getQuizGradeOverridesCollection();
  await collection.deleteOne({ quizId, questionId });
}

export async function ensureGradeOverrideIndexes(): Promise<void> {
  const collection = await getQuizGradeOverridesCollection();
  await collection.createIndex({ quizId: 1, questionId: 1 }, { unique: true });
}
