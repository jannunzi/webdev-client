import { DEMO_ROSTER_STUDENTS } from "./demo-students";
import {
  canonicalEmailKey,
  escapeRegex,
  isLikelyEmail,
  normalizeEmail,
  uniqueEmailMatchKeys,
} from "./emails";
import type { CanvasRosterEntry, RosterLookupResult } from "./types";

/**
 * Case-insensitive Mongo filter for `canvas_roster.email`.
 * Matches Canvas casing/padding and Northeastern mailbox aliases.
 * Lookup prefers an in-memory scan; this remains for targeted upserts.
 */
export function rosterEmailMatchFilter(
  emails: readonly string[],
): Record<string, unknown> | null {
  const keys = uniqueEmailMatchKeys(emails);
  if (keys.length === 0) return null;
  return {
    $or: keys.map((email) => ({
      email: {
        $regex: `^\\s*${escapeRegex(email)}\\s*$`,
        $options: "i",
      },
    })),
  };
}

function indexRosterEmails(
  entries: CanvasRosterEntry[],
): Map<string, CanvasRosterEntry> {
  const byEmail = new Map<string, CanvasRosterEntry>();
  for (const entry of entries) {
    if (entry.email) {
      const key = canonicalEmailKey(entry.email);
      if (key) byEmail.set(key, entry);
    }
    if (entry.sisUserId && isLikelyEmail(normalizeEmail(entry.sisUserId))) {
      const key = canonicalEmailKey(entry.sisUserId);
      if (key && !byEmail.has(key)) byEmail.set(key, entry);
    }
  }
  return byEmail;
}

export function matchRoster(input: {
  emails: string[];
  canvasUserIds?: string[];
  mongoEntries: CanvasRosterEntry[];
  envEmails: string[];
  mongoCount: number;
}): RosterLookupResult {
  const emails = input.emails.map(normalizeEmail).filter(Boolean);
  const canvasUserIds = (input.canvasUserIds ?? [])
    .map((id) => id.trim())
    .filter(Boolean);

  // Built-in Ada / Bob first; Atlas rows overwrite the same email key so a
  // seeded document wins. Demo students do not require a prior Atlas write.
  const entries = [...DEMO_ROSTER_STUDENTS, ...input.mongoEntries];
  const byEmail = indexRosterEmails(entries);
  const byCanvasId = new Map<string, CanvasRosterEntry>();
  for (const entry of entries) {
    if (entry.canvasUserId) byCanvasId.set(entry.canvasUserId.trim(), entry);
  }

  for (const email of emails) {
    const entry = byEmail.get(canonicalEmailKey(email));
    if (entry) {
      return { status: "matched", entry: { ...entry, email: normalizeEmail(email) } };
    }
  }

  for (const canvasUserId of canvasUserIds) {
    const entry = byCanvasId.get(canvasUserId);
    if (entry) return { status: "matched", entry };
  }

  const envKeys = new Set(input.envEmails.map(canonicalEmailKey).filter(Boolean));
  for (const email of emails) {
    if (envKeys.has(canonicalEmailKey(email))) {
      return {
        status: "matched",
        entry: { email: normalizeEmail(email), source: "env" },
      };
    }
  }

  if (input.mongoCount === 0 && envKeys.size === 0) {
    return { status: "empty" };
  }

  return { status: "not_on_roster" };
}
