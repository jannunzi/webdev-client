const SKIP_NAME_TOKENS = new Set([
  "demo",
  "student",
  "test",
  "user",
  "admin",
  "ta",
  "instructor",
]);

export type NameSource = {
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  rosterName?: string | null;
};

export type NameQuery = {
  first?: string;
  last?: string;
  phrases: string[];
  markers: string[];
};

function cleanToken(value: string): string {
  return value.replace(/[^\p{L}\p{N}'-]+/gu, "").trim();
}

function splitName(value: string | null | undefined): string[] {
  if (!value?.trim()) return [];
  const trimmed = value.trim();
  if (trimmed.includes(",")) {
    const [last, ...rest] = trimmed.split(",");
    return [...rest.join(" ").split(/\s+/), last].flatMap((part) =>
      part.trim() ? [part.trim()] : [],
    );
  }
  return trimmed.split(/\s+/).filter(Boolean);
}

function usableMarker(value: string): string | null {
  const cleaned = cleanToken(value);
  if (cleaned.length < 2) return null;
  if (SKIP_NAME_TOKENS.has(cleaned.toLowerCase())) return null;
  return cleaned;
}

export function resolveNameQuery(input: NameSource): NameQuery {
  const first = usableMarker(input.firstName ?? "");
  const last = usableMarker(input.lastName ?? "");
  const tokens = [
    ...splitName(input.fullName),
    ...splitName(input.rosterName),
  ]
    .map(usableMarker)
    .filter((token): token is string => Boolean(token));

  const markers: string[] = [];
  const seen = new Set<string>();
  for (const token of [first, last, ...tokens]) {
    if (!token) continue;
    const key = token.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    markers.push(token);
  }

  const phrases: string[] = [];
  if (first && last) phrases.push(`${first} ${last}`);
  if (input.fullName?.trim() && !input.fullName.includes(",")) {
    phrases.push(input.fullName.trim());
  }
  if (input.rosterName?.includes(",")) {
    const [rosterLast, rosterFirst] = input.rosterName.split(",");
    const restored = `${rosterFirst?.trim() ?? ""} ${rosterLast?.trim() ?? ""}`.trim();
    if (restored) phrases.push(restored);
  }

  return {
    first: first ?? undefined,
    last: last ?? undefined,
    phrases,
    markers,
  };
}

export function htmlHasStudentName(html: string, query: NameQuery): boolean {
  if (query.markers.length === 0 && query.phrases.length === 0) return false;
  const lower = html.toLowerCase();
  if (query.phrases.some((phrase) => lower.includes(phrase.toLowerCase()))) {
    return true;
  }
  if (query.first && query.last) {
    return (
      lower.includes(query.first.toLowerCase()) &&
      lower.includes(query.last.toLowerCase())
    );
  }
  if (query.markers.length === 1) {
    return lower.includes(query.markers[0].toLowerCase());
  }
  if (query.markers.length >= 2) {
    const found = query.markers.filter((marker) =>
      lower.includes(marker.toLowerCase()),
    );
    return found.length >= 2;
  }
  return false;
}

export function hasUsableNameQuery(query: NameQuery): boolean {
  return Boolean(
    (query.first && query.last) ||
      query.phrases.length > 0 ||
      query.markers.length > 0,
  );
}
