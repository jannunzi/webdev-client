import "server-only";

import { clerkClient } from "@clerk/nextjs/server";
import {
  collectClerkEmails,
  collectSessionClaimEmails,
  mergeRosterLookupEmails,
} from "./emails";
import type { ClerkUserLike } from "./types";

/**
 * Emails for roster matching. currentUser() can omit address arrays;
 * the Backend API user is the fallback so ada@ada.com still matches.
 */
export async function loadClerkRosterEmails(input: {
  user: ClerkUserLike | null | undefined;
  sessionClaims?: unknown;
  userId?: string | null;
}): Promise<string[]> {
  const fromSession = mergeRosterLookupEmails(
    collectClerkEmails(input.user),
    collectSessionClaimEmails(input.sessionClaims),
  );
  if (fromSession.length > 0 || !input.userId) return fromSession;

  try {
    const client = await clerkClient();
    const full = await client.users.getUser(input.userId);
    return mergeRosterLookupEmails(fromSession, collectClerkEmails(full));
  } catch (error) {
    console.error("clerk backend user email fetch failed", error);
    return fromSession;
  }
}
