import type { ClerkEmailLike, ClerkUserLike } from "./types";

/** Student mailbox aliases that Canvas and Clerk treat as the same person. */
export const NORTHEASTERN_EMAIL_DOMAINS = [
  "northeastern.edu",
  "husky.neu.edu",
  "neu.edu",
] as const;

const NORTHEASTERN_DOMAIN_SET = new Set<string>(NORTHEASTERN_EMAIL_DOMAINS);

const UNICODE_SPACE = /[\u00A0\u1680\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g;
const CONTROL_CHARS = /[\u0000-\u001F\u007F-\u009F]/g;

export function normalizeEmail(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(CONTROL_CHARS, "")
    .replace(UNICODE_SPACE, " ")
    .trim()
    .toLowerCase();
}

export function isLikelyEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function parseRosterEmailsEnv(value: string | undefined): string[] {
  if (!value?.trim()) return [];
  const seen = new Set<string>();
  const emails: string[] = [];
  for (const part of value.split(/[\s,;]+/)) {
    const email = normalizeEmail(part);
    if (!email || !isLikelyEmail(email) || seen.has(email)) continue;
    seen.add(email);
    emails.push(email);
  }
  return emails;
}

export function splitEmail(
  value: string,
): { local: string; domain: string } | null {
  const normalized = normalizeEmail(value);
  const at = normalized.lastIndexOf("@");
  if (at <= 0 || at === normalized.length - 1) return null;
  const localRaw = normalized.slice(0, at);
  const domain = normalized.slice(at + 1);
  const plus = localRaw.indexOf("+");
  const local = (plus === -1 ? localRaw : localRaw.slice(0, plus)).trim();
  if (!local || !domain || !isLikelyEmail(`${local}@${domain}`)) return null;
  return { local, domain };
}

/**
 * One key per mailbox so Canvas `northeastern.edu` matches Clerk
 * `husky.neu.edu` / `neu.edu` and plus-address tags.
 */
export function canonicalEmailKey(value: string): string {
  const parts = splitEmail(value);
  if (!parts) return normalizeEmail(value);
  const domain = NORTHEASTERN_DOMAIN_SET.has(parts.domain)
    ? "northeastern.edu"
    : parts.domain;
  return `${parts.local}@${domain}`;
}

export function emailMatchKeys(value: string): string[] {
  const parts = splitEmail(value);
  if (!parts) {
    const normalized = normalizeEmail(value);
    return normalized ? [normalized] : [];
  }
  const keys = new Set<string>([`${parts.local}@${parts.domain}`]);
  if (NORTHEASTERN_DOMAIN_SET.has(parts.domain)) {
    for (const domain of NORTHEASTERN_EMAIL_DOMAINS) {
      keys.add(`${parts.local}@${domain}`);
    }
  }
  return [...keys];
}

export function uniqueEmailMatchKeys(emails: readonly string[]): string[] {
  const seen = new Set<string>();
  const keys: string[] = [];
  for (const email of emails) {
    for (const key of emailMatchKeys(email)) {
      if (seen.has(key)) continue;
      seen.add(key);
      keys.push(key);
    }
  }
  return keys;
}

export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isVerified(email: ClerkEmailLike): boolean {
  return email.verification?.status === "verified";
}

function emailAddressOf(
  item: ClerkEmailLike | string | null | undefined,
): string {
  if (!item) return "";
  if (typeof item === "string") return normalizeEmail(item);
  return normalizeEmail(item.emailAddress ?? item.email_address);
}

function asEmailList(value: unknown): ClerkEmailLike[] {
  if (Array.isArray(value)) return value as ClerkEmailLike[];
  if (
    value &&
    typeof value === "object" &&
    Array.isArray((value as { data?: unknown }).data)
  ) {
    return (value as { data: ClerkEmailLike[] }).data;
  }
  return [];
}

function clerkEmailRows(user: ClerkUserLike): ClerkEmailLike[] {
  return [
    ...asEmailList(user.emailAddresses),
    ...asEmailList(user.email_addresses),
  ];
}

function externalAccountEmails(user: ClerkUserLike): string[] {
  const accounts = [
    ...(user.externalAccounts ?? []),
    ...(user.external_accounts ?? []),
  ];
  return accounts
    .map((account) => normalizeEmail(account.emailAddress ?? account.email_address))
    .filter((email) => email && isLikelyEmail(email));
}

/**
 * Ordered unique emails for roster matching.
 * Primary first, then other verified, then remaining addresses, then
 * Google/SSO external accounts and an email-shaped username.
 */
export function collectClerkEmails(user: ClerkUserLike | null | undefined): string[] {
  if (!user) return [];

  const rows = clerkEmailRows(user);
  const byId = new Map<string, ClerkEmailLike>();
  for (const email of rows) {
    if (email.id) byId.set(email.id, email);
  }

  const ordered: ClerkEmailLike[] = [];
  const primary =
    user.primaryEmailAddress ??
    user.primary_email_address ??
    (user.primaryEmailAddressId
      ? byId.get(user.primaryEmailAddressId)
      : undefined);
  if (primary && typeof primary !== "string") ordered.push(primary);

  const primaryAddress = emailAddressOf(primary);
  const rest = rows.filter((email) => emailAddressOf(email) !== primaryAddress);
  rest.sort((a, b) => Number(isVerified(b)) - Number(isVerified(a)));
  ordered.push(...rest);

  const seen = new Set<string>();
  const emails: string[] = [];
  function push(raw: string): void {
    const email = normalizeEmail(raw);
    if (!email || !isLikelyEmail(email) || seen.has(email)) return;
    seen.add(email);
    emails.push(email);
  }

  for (const item of ordered) push(emailAddressOf(item));
  if (typeof primary === "string") push(primary);
  if (user.email) push(user.email);
  for (const email of externalAccountEmails(user)) push(email);
  if (user.username) push(user.username);
  return emails;
}

/**
 * Emails from a Clerk session JWT. currentUser() can omit address arrays
 * while the session still carries `email` / `email_address`.
 */
export function collectSessionClaimEmails(claims: unknown): string[] {
  if (!claims || typeof claims !== "object") return [];
  const record = claims as Record<string, unknown>;
  const emails: string[] = [];
  const seen = new Set<string>();
  function push(raw: unknown): void {
    if (typeof raw !== "string") return;
    const email = normalizeEmail(raw);
    if (!email || !isLikelyEmail(email) || seen.has(email)) return;
    seen.add(email);
    emails.push(email);
  }
  push(record.email);
  push(record.email_address);
  push(record.emailAddress);
  push(record.primary_email_address);
  push(record.primaryEmailAddress);
  const nested = record.primaryEmailAddress;
  if (nested && typeof nested === "object") {
    push((nested as { emailAddress?: unknown }).emailAddress);
    push((nested as { email_address?: unknown }).email_address);
  }
  return emails;
}

export function mergeRosterLookupEmails(
  ...lists: Array<readonly string[] | undefined>
): string[] {
  const seen = new Set<string>();
  const emails: string[] = [];
  for (const list of lists) {
    for (const raw of list ?? []) {
      const email = normalizeEmail(raw);
      if (!email || !isLikelyEmail(email) || seen.has(email)) continue;
      seen.add(email);
      emails.push(email);
    }
  }
  return emails;
}

export function preferredRosterEmail(
  user: ClerkUserLike | null | undefined,
  matchedEmail?: string,
): string | undefined {
  if (matchedEmail) return normalizeEmail(matchedEmail);
  return collectClerkEmails(user)[0];
}

export function canvasUserIdFromMetadata(
  user: ClerkUserLike | null | undefined,
): string | undefined {
  const value = user?.publicMetadata?.canvasUserId;
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
