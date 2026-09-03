import type { ClerkEmailLike, ClerkUserLike } from "./types";

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
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

function isVerified(email: ClerkEmailLike): boolean {
  return email.verification?.status === "verified";
}

/**
 * Ordered unique emails for roster matching.
 * Primary first, then other verified, then remaining addresses.
 */
export function collectClerkEmails(user: ClerkUserLike | null | undefined): string[] {
  if (!user) return [];

  const byId = new Map<string, ClerkEmailLike>();
  for (const email of user.emailAddresses ?? []) {
    if (email.id) byId.set(email.id, email);
  }

  const ordered: ClerkEmailLike[] = [];
  const primary =
    user.primaryEmailAddress ??
    (user.primaryEmailAddressId
      ? byId.get(user.primaryEmailAddressId)
      : undefined);
  if (primary) ordered.push(primary);

  const rest = (user.emailAddresses ?? []).filter(
    (email) => email.emailAddress !== primary?.emailAddress,
  );
  rest.sort((a, b) => Number(isVerified(b)) - Number(isVerified(a)));
  ordered.push(...rest);

  const seen = new Set<string>();
  const emails: string[] = [];
  for (const item of ordered) {
    const email = normalizeEmail(item.emailAddress);
    if (!email || !isLikelyEmail(email) || seen.has(email)) continue;
    seen.add(email);
    emails.push(email);
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
