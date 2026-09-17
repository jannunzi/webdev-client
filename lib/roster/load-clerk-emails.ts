import "server-only";

import { clerkClient } from "@clerk/nextjs/server";
import { mergeClerkRosterEmailSources } from "./emails";
import type { ClerkUserLike } from "./types";

/**
 * Emails for roster matching.
 *
 * currentUser() / the session JWT are often slim (user id, maybe one
 * primary). Always merge the Backend API user when we have a userId so a
 * secondary Canvas email like chen.rya@northeastern.edu is not dropped.
 */
export async function loadClerkRosterEmails(input: {
  user: ClerkUserLike | null | undefined;
  sessionClaims?: unknown;
  userId?: string | null;
}): Promise<string[]> {
  let backendUser: ClerkUserLike | undefined;
  if (input.userId) {
    try {
      const client = await clerkClient();
      backendUser = await client.users.getUser(input.userId);
    } catch (error) {
      console.error("clerk backend user email fetch failed", error);
    }
  }
  return mergeClerkRosterEmailSources({
    sessionUser: input.user,
    sessionClaims: input.sessionClaims,
    backendUser,
  });
}
