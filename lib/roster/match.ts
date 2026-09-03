import { normalizeEmail } from "./emails";
import type { CanvasRosterEntry, RosterLookupResult } from "./types";

export function matchRoster(input: {
  emails: string[];
  canvasUserIds?: string[];
  mongoEntries: CanvasRosterEntry[];
  envEmails: string[];
  mongoCount: number;
}): RosterLookupResult {
  const emails = input.emails.map(normalizeEmail).filter(Boolean);
  const canvasUserIds = (input.canvasUserIds ?? []).map((id) => id.trim()).filter(Boolean);

  const byEmail = new Map<string, CanvasRosterEntry>();
  const byCanvasId = new Map<string, CanvasRosterEntry>();
  for (const entry of input.mongoEntries) {
    if (entry.email) byEmail.set(normalizeEmail(entry.email), entry);
    if (entry.canvasUserId) byCanvasId.set(entry.canvasUserId.trim(), entry);
  }

  for (const email of emails) {
    const entry = byEmail.get(email);
    if (entry) return { status: "matched", entry: { ...entry, email } };
  }

  for (const canvasUserId of canvasUserIds) {
    const entry = byCanvasId.get(canvasUserId);
    if (entry) return { status: "matched", entry };
  }

  const envSet = new Set(input.envEmails.map(normalizeEmail));
  for (const email of emails) {
    if (envSet.has(email)) {
      return {
        status: "matched",
        entry: { email, source: "env" },
      };
    }
  }

  if (input.mongoCount === 0 && envSet.size === 0) {
    return { status: "empty" };
  }

  return { status: "not_on_roster" };
}
