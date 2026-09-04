import {
  collectClerkEmails,
  normalizeEmail,
  parseRosterEmailsEnv,
} from "./emails";
import type { ClerkUserLike } from "./types";

/** Jose’s instructor Gmail. Used when `INSTRUCTOR_EMAILS` is unset or empty. */
export const DEFAULT_INSTRUCTOR_EMAIL = "jannunzi@gmail.com";

export function instructorEmailsFromEnv(
  value: string | undefined = process.env.INSTRUCTOR_EMAILS,
): string[] {
  const parsed = parseRosterEmailsEnv(value);
  return parsed.length > 0 ? parsed : [DEFAULT_INSTRUCTOR_EMAIL];
}

export function isInstructorEmail(
  email: string,
  allowlist: string[] = instructorEmailsFromEnv(),
): boolean {
  const normalized = normalizeEmail(email);
  return allowlist.some((allowed) => normalizeEmail(allowed) === normalized);
}

/**
 * True when any collected Clerk email is on the instructor allowlist.
 * Server-side only for access decisions — do not treat a client check as a gate.
 */
export function isInstructorUser(
  user: ClerkUserLike | null | undefined,
  allowlist: string[] = instructorEmailsFromEnv(),
): boolean {
  const allowed = new Set(allowlist.map(normalizeEmail));
  return collectClerkEmails(user).some((email) => allowed.has(email));
}
