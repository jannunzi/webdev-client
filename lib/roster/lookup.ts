import "server-only";

import { isMongoConfigured } from "../config";
import { getCollection } from "../mongo";
import { parseRosterEmailsEnv } from "./emails";
import { matchRoster } from "./match";
import type { CanvasRosterEntry, RosterLookupResult } from "./types";
import { impersonationRosterMatch } from "./view-mode";

export const CANVAS_ROSTER_COLLECTION = "canvas_roster";

const ROSTER_MATCH_PROJECTION = {
  email: 1,
  canvasUserId: 1,
  sisUserId: 1,
  name: 1,
  section: 1,
  source: 1,
} as const;

export async function getRosterCollection() {
  return getCollection<CanvasRosterEntry>(CANVAS_ROSTER_COLLECTION);
}

/**
 * Match a signed-in Clerk user to canvas_roster.
 *
 * Loads the course-sized roster and matches in memory so Atlas rows with
 * mixed case, padding, husky.neu.edu aliases, or SIS-login emails still
 * unlock A1. `$expr` queries are not used — they can miss or fail on Atlas
 * and hide the Submit URLs fields.
 */
export async function lookupCanvasRoster(input: {
  emails: string[];
  canvasUserIds?: string[];
  /** Staff “View as student”: synthetic Demo Student, no Mongo read or write. */
  impersonating?: boolean;
}): Promise<RosterLookupResult> {
  const dummy = impersonationRosterMatch(Boolean(input.impersonating));
  if (dummy) return dummy;

  if (!isMongoConfigured()) {
    return { status: "not_configured" };
  }

  try {
    const envEmails = parseRosterEmailsEnv(process.env.CANVAS_ROSTER_EMAILS);
    const collection = await getRosterCollection();
    const mongoEntries = await collection
      .find({})
      .project<CanvasRosterEntry>(ROSTER_MATCH_PROJECTION)
      .toArray();

    return matchRoster({
      emails: input.emails,
      canvasUserIds: input.canvasUserIds,
      mongoEntries,
      envEmails,
      mongoCount: mongoEntries.length,
    });
  } catch (error) {
    console.error("canvas roster lookup failed", error);
    return { status: "not_configured" };
  }
}

export async function ensureRosterIndexes(): Promise<void> {
  const collection = await getRosterCollection();
  await collection.createIndex({ email: 1 }, { unique: true });
  await collection.createIndex(
    { canvasUserId: 1 },
    { unique: true, sparse: true },
  );
}
