import { normalizeEmail, parseRosterEmailsEnv } from "./emails";

/** Jose’s instructor Gmail. Used when `INSTRUCTOR_EMAILS` is unset or empty. */
export const DEFAULT_INSTRUCTOR_EMAIL = "jannunzi@gmail.com";

export function instructorEmailsFromEnv(
  value: string | undefined = process.env.INSTRUCTOR_EMAILS,
): string[] {
  const parsed = parseRosterEmailsEnv(value);
  return parsed.length > 0 ? parsed : [DEFAULT_INSTRUCTOR_EMAIL];
}

/** Empty when `TA_EMAILS` is unset. TAs are never inferred. */
export function taEmailsFromEnv(
  value: string | undefined = process.env.TA_EMAILS,
): string[] {
  return parseRosterEmailsEnv(value);
}

function anyEmailOnAllowlist(emails: string[], allowlist: string[]): boolean {
  const allowed = new Set(allowlist.map(normalizeEmail));
  return emails
    .map(normalizeEmail)
    .some((email) => Boolean(email) && allowed.has(email));
}

/**
 * True when any address is on `INSTRUCTOR_EMAILS`.
 * Privilege is env allowlist only — not Clerk roles, not canvas_roster.
 */
export function isInstructor(
  emails: string[],
  allowlist: string[] = instructorEmailsFromEnv(),
): boolean {
  return anyEmailOnAllowlist(emails, allowlist);
}

export function isTa(
  emails: string[],
  allowlist: string[] = taEmailsFromEnv(),
): boolean {
  return anyEmailOnAllowlist(emails, allowlist);
}

/** Instructor or TA. Use this to gate `/people` and author-review banks. */
export function isStaff(
  emails: string[],
  instructorAllowlist: string[] = instructorEmailsFromEnv(),
  taAllowlist: string[] = taEmailsFromEnv(),
): boolean {
  return isInstructor(emails, instructorAllowlist) || isTa(emails, taAllowlist);
}

export type StaffAccessStatus =
  | "not_configured"
  | "signed_out"
  | "forbidden"
  | "ok";

/**
 * Staff gate for `/people` and `/quizzes` author review (not `/quizzes/take`).
 * Signed-in users with no allowlisted email are forbidden, even with empty emails.
 */
export function staffAccessFromUser(
  clerkConfigured: boolean,
  signedIn: boolean,
  emails: string[],
): StaffAccessStatus {
  if (!clerkConfigured) return "not_configured";
  if (!signedIn) return "signed_out";
  if (!isStaff(emails)) return "forbidden";
  return "ok";
}
