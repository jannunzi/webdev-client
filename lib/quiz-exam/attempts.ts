import "server-only";

import type { Filter, ObjectId } from "mongodb";
import { getCollection } from "../mongo";
import { escapeRegex, uniqueEmailMatchKeys } from "../roster/emails";
import type { QuizAttemptDoc, QuizQuestionOverride } from "./types";

export const QUIZ_ATTEMPTS_COLLECTION = "quiz_attempts";

export type QuizAttemptStored = QuizAttemptDoc & { _id?: ObjectId };

export type AttemptInsertResult = { insertedId: unknown };

export type AttemptStore = {
  insertOne(doc: QuizAttemptDoc): Promise<AttemptInsertResult>;
};

export async function getQuizAttemptsCollection() {
  return getCollection<QuizAttemptStored>(QUIZ_ATTEMPTS_COLLECTION);
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

export async function findLatestQuizAttempt(
  clerkUserId: string,
  quizId: string,
): Promise<QuizAttemptStored | null> {
  const collection = await getQuizAttemptsCollection();
  return collection.findOne(
    { clerkUserId, quizId },
    { sort: { submittedAt: -1 } },
  );
}

function emailMatchFilter(email: string): Filter<QuizAttemptStored> | null {
  const keys = uniqueEmailMatchKeys([email]);
  if (keys.length === 0) return null;
  return {
    $or: keys.flatMap((key) => [
      {
        email: { $regex: `^\\s*${escapeRegex(key)}\\s*$`, $options: "i" },
      },
      {
        "meta.rosterEmail": {
          $regex: `^\\s*${escapeRegex(key)}\\s*$`,
          $options: "i",
        },
      },
    ]),
  };
}

export async function findLatestQuizAttemptForStaff(input: {
  quizId: string;
  clerkUserId?: string;
  email?: string;
}): Promise<QuizAttemptStored | null> {
  const collection = await getQuizAttemptsCollection();
  if (input.clerkUserId) {
    const byClerk = await collection.findOne(
      { clerkUserId: input.clerkUserId, quizId: input.quizId },
      { sort: { submittedAt: -1 } },
    );
    if (byClerk) return byClerk;
  }
  if (input.email) {
    const emailFilter = emailMatchFilter(input.email);
    if (emailFilter) {
      return collection.findOne(
        { quizId: input.quizId, ...emailFilter },
        { sort: { submittedAt: -1 } },
      );
    }
  }
  return null;
}

/**
 * Latest attempt per student for a quiz. Dedupes by clerkUserId, then email.
 * Never deletes documents.
 */
export async function listLatestQuizAttempts(
  quizId: string,
): Promise<QuizAttemptStored[]> {
  const collection = await getQuizAttemptsCollection();
  const docs = await collection
    .find({ quizId })
    .sort({ submittedAt: -1 })
    .toArray();
  const seen = new Set<string>();
  const latest: QuizAttemptStored[] = [];
  for (const doc of docs) {
    const key = doc.clerkUserId || doc.email || doc.meta?.rosterEmail;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    latest.push(doc);
  }
  return latest;
}

export async function listAttemptsDrawingQuestion(
  quizId: string,
  questionId: string,
): Promise<QuizAttemptStored[]> {
  const collection = await getQuizAttemptsCollection();
  return collection
    .find({
      quizId,
      $or: [
        { "meta.drawnQuestionIds": questionId },
        { "answers.questionId": questionId },
      ],
    })
    .sort({ submittedAt: -1 })
    .toArray();
}

/**
 * Writes effective score + per-student overrides only. Leaves `answers[]`
 * (including `asd@asd.com` Q1) untouched. Never deletes an attempt.
 */
export async function updateQuizAttemptGrade(input: {
  attempt: QuizAttemptStored;
  score: number;
  maxScore: number;
  overrides: Record<string, QuizQuestionOverride>;
}): Promise<void> {
  const collection = await getQuizAttemptsCollection();
  const filter = input.attempt._id
    ? { _id: input.attempt._id }
    : {
        clerkUserId: input.attempt.clerkUserId,
        quizId: input.attempt.quizId,
        submittedAt: input.attempt.submittedAt,
      };
  const unsetEmpty =
    Object.keys(input.overrides).length === 0
      ? { $unset: { overrides: "" as const } }
      : {};
  await collection.updateOne(filter, {
    $set: {
      score: input.score,
      maxScore: input.maxScore,
      ...(Object.keys(input.overrides).length > 0
        ? { overrides: input.overrides }
        : {}),
    },
    ...unsetEmpty,
  });
}

export async function ensureAttemptIndexes(): Promise<void> {
  const collection = await getQuizAttemptsCollection();
  await collection.createIndex({ clerkUserId: 1, quizId: 1, submittedAt: -1 });
  await collection.createIndex({ email: 1, quizId: 1, submittedAt: -1 });
  await collection.createIndex({ quizId: 1, submittedAt: -1 });
}
