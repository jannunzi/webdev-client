import { normalizeEmail } from "./emails";
import type { CanvasRosterEntry } from "./types";

/**
 * Synthetic canvas_roster rows for staff A1 / quiz testing.
 * Not real students — do not treat as PII.
 *
 * Roster matching is by email string only. These are not Northeastern
 * addresses; Jose chose them so staff can Sign up without using student
 * or @northeastern.edu mailboxes.
 */
export const DEMO_ROSTER_STUDENTS: readonly CanvasRosterEntry[] = [
  {
    name: "Ada Lovelace",
    email: "ada@ada.com",
    section: "CS4550 CRN 11464",
    canvasUserId: "demo-ada-lovelace",
    sisUserId: "demo-ada-lovelace",
    source: "demo",
  },
  {
    name: "Bob Marley",
    email: "bob@bob.com",
    section: "CS4550 CRN 11464",
    canvasUserId: "demo-bob-marley",
    sisUserId: "demo-bob-marley",
    source: "demo",
  },
];

export function isDemoRosterEmail(value: string): boolean {
  const email = normalizeEmail(value);
  return DEMO_ROSTER_STUDENTS.some((row) => normalizeEmail(row.email) === email);
}

export function demoRosterStudentByEmail(
  value: string,
): CanvasRosterEntry | undefined {
  const email = normalizeEmail(value);
  return DEMO_ROSTER_STUDENTS.find((row) => normalizeEmail(row.email) === email);
}
