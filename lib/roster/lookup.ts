import "server-only";

import { isMongoConfigured } from "../config";
import { getCollection } from "../mongo";
import { parseRosterEmailsEnv } from "./emails";
import { matchRoster } from "./match";
import type { CanvasRosterEntry, RosterLookupResult } from "./types";

export const CANVAS_ROSTER_COLLECTION = "canvas_roster";

export async function getRosterCollection() {
  return getCollection<CanvasRosterEntry>(CANVAS_ROSTER_COLLECTION);
}

export async function lookupCanvasRoster(input: {
  emails: string[];
  canvasUserIds?: string[];
}): Promise<RosterLookupResult> {
  if (!isMongoConfigured()) {
    return { status: "not_configured" };
  }

  const envEmails = parseRosterEmailsEnv(process.env.CANVAS_ROSTER_EMAILS);
  const collection = await getRosterCollection();

  const or: Record<string, unknown>[] = [];
  if (input.emails.length > 0) {
    or.push({ email: { $in: input.emails } });
  }
  if (input.canvasUserIds && input.canvasUserIds.length > 0) {
    or.push({ canvasUserId: { $in: input.canvasUserIds } });
  }

  const mongoEntries =
    or.length > 0 ? await collection.find({ $or: or }).toArray() : [];

  let mongoCount = mongoEntries.length;
  if (mongoCount === 0) {
    mongoCount = await collection.countDocuments();
  }

  return matchRoster({
    emails: input.emails,
    canvasUserIds: input.canvasUserIds,
    mongoEntries,
    envEmails,
    mongoCount,
  });
}

export async function ensureRosterIndexes(): Promise<void> {
  const collection = await getRosterCollection();
  await collection.createIndex({ email: 1 }, { unique: true });
  await collection.createIndex(
    { canvasUserId: 1 },
    { unique: true, sparse: true },
  );
}
