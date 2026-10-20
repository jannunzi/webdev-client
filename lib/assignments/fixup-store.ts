import "server-only";

import { getCollection } from "../mongo";
import { fixupApprovalKey } from "./fixup";
import type {
  FixupApproval,
  FixupRecord,
  FixupRound,
  FixupSnapshot,
  FixupStaffOverride,
  FixupWindow,
} from "./fixup";

/**
 * Separate collections, so a re-run or a staff Save on
 * assignment_submissions can never touch the frozen original.
 */
export const ASSIGNMENT_FIXUPS_COLLECTION = "assignment_fixups";
export const ASSIGNMENT_FIXUP_WINDOWS_COLLECTION = "assignment_fixup_windows";

type FixupDoc = FixupRecord & { createdAt: Date; updatedAt: Date };
type WindowDoc = FixupWindow & { updatedAt: Date; updatedBy?: string };

async function fixups() {
  const collection = await getCollection<FixupDoc>(ASSIGNMENT_FIXUPS_COLLECTION);
  await collection.createIndex({ clerkUserId: 1, assignmentId: 1 }, { unique: true });
  return collection;
}

async function windows() {
  const collection = await getCollection<WindowDoc>(ASSIGNMENT_FIXUP_WINDOWS_COLLECTION);
  await collection.createIndex({ assignmentId: 1, section: 1 }, { unique: true });
  return collection;
}

function strip<T extends { _id?: unknown }>(doc: T): Omit<T, "_id"> {
  const { _id, ...rest } = doc;
  void _id;
  return rest;
}

export async function listFixupWindows(): Promise<FixupWindow[]> {
  const docs = await (await windows()).find({}).toArray();
  return docs.map((doc) => ({ assignmentId: doc.assignmentId, section: doc.section, opensAt: doc.opensAt }));
}

export async function setFixupWindow(window: FixupWindow, updatedBy?: string): Promise<void> {
  await (await windows()).updateOne(
    { assignmentId: window.assignmentId, section: window.section },
    { $set: { ...window, updatedAt: new Date(), updatedBy } },
    { upsert: true },
  );
}

export async function clearFixupWindow(assignmentId: string, section: string): Promise<void> {
  await (await windows()).deleteOne({ assignmentId, section });
}

export async function findFixup(clerkUserId: string, assignmentId: string): Promise<FixupRecord | null> {
  const doc = await (await fixups()).findOne({ clerkUserId, assignmentId });
  return doc ? (strip(doc) as FixupRecord) : null;
}

export async function listFixupsForAssignment(assignmentId: string): Promise<FixupRecord[]> {
  const docs = await (await fixups()).find({ assignmentId }).toArray();
  return docs.map((doc) => strip(doc) as FixupRecord);
}

/**
 * Open the one round. $setOnInsert only: an existing round (and its frozen
 * original) is never replaced. Returns false when a round already existed.
 */
export async function openFixupRound(input: {
  clerkUserId: string;
  assignmentId: string;
  email?: string;
  canvasUserId?: string;
  section?: string;
  original: FixupSnapshot;
  round: FixupRound;
}): Promise<boolean> {
  const now = new Date();
  const result = await (await fixups()).updateOne(
    { clerkUserId: input.clerkUserId, assignmentId: input.assignmentId },
    { $setOnInsert: { ...input, createdAt: now, updatedAt: now } },
    { upsert: true },
  );
  return result.upsertedCount === 1;
}

/** Store a fix-up run. Never touches `original`. Clears earlier staff decisions. */
export async function saveFixupRun(input: {
  clerkUserId: string;
  assignmentId: string;
  githubUrl: string;
  vercelUrl: string;
  checkResults: FixupRound["checkResults"];
  submittedAt: string;
}): Promise<boolean> {
  const result = await (await fixups()).updateOne(
    { clerkUserId: input.clerkUserId, assignmentId: input.assignmentId },
    {
      $set: {
        "round.githubUrl": input.githubUrl,
        "round.vercelUrl": input.vercelUrl,
        "round.checkResults": input.checkResults,
        "round.submittedAt": input.submittedAt,
        updatedAt: new Date(),
      },
      $unset: { "round.approvals": 1 as const },
    },
  );
  return result.matchedCount === 1;
}

export async function setFixupApproval(input: {
  clerkUserId: string;
  assignmentId: string;
  criterionId: string;
  approval: FixupApproval | null;
}): Promise<boolean> {
  const key = `round.approvals.${fixupApprovalKey(input.criterionId)}`;
  const update = input.approval
    ? { $set: { [key]: input.approval, updatedAt: new Date() } }
    : { $unset: { [key]: 1 as const }, $set: { updatedAt: new Date() } };
  const result = await (await fixups()).updateOne(
    { clerkUserId: input.clerkUserId, assignmentId: input.assignmentId },
    update,
  );
  return result.matchedCount === 1;
}

export async function setFixupOverride(input: {
  clerkUserId: string;
  assignmentId: string;
  override: FixupStaffOverride | null;
}): Promise<boolean> {
  const update = input.override
    ? { $set: { "round.staffOverride": input.override, updatedAt: new Date() } }
    : { $unset: { "round.staffOverride": 1 as const }, $set: { updatedAt: new Date() } };
  const result = await (await fixups()).updateOne(
    { clerkUserId: input.clerkUserId, assignmentId: input.assignmentId },
    update,
  );
  return result.matchedCount === 1;
}
