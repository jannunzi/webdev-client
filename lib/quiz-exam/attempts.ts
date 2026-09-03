import "server-only";

import { getCollection } from "../mongo";
import type { QuizAttemptDoc } from "./types";

export const QUIZ_ATTEMPTS_COLLECTION = "quiz_attempts";

export type AttemptInsertResult = { insertedId: unknown };

export type AttemptStore = {
  insertOne(doc: QuizAttemptDoc): Promise<AttemptInsertResult>;
};

export async function getQuizAttemptsCollection() {
  return getCollection<QuizAttemptDoc>(QUIZ_ATTEMPTS_COLLECTION);
}

export async function persistQuizAttempt(
  store: AttemptStore,
  doc: QuizAttemptDoc,
): Promise<AttemptInsertResult> {
  return store.insertOne(doc);
}

export async function insertQuizAttempt(
  doc: QuizAttemptDoc,
): Promise<AttemptInsertResult> {
  const collection = await getQuizAttemptsCollection();
  return persistQuizAttempt(collection, doc);
}

export async function ensureAttemptIndexes(): Promise<void> {
  const collection = await getQuizAttemptsCollection();
  await collection.createIndex({ clerkUserId: 1, quizId: 1, submittedAt: -1 });
  await collection.createIndex({ email: 1, quizId: 1, submittedAt: -1 });
}
