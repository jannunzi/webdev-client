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

export type NameVerdict = "found" | "review" | "missing";

/** Words of the visible page text: tags, attributes, scripts and styles removed. */
function visibleWords(html: string): string[] {
  const text = html
    .replace(/<(script|style|noscript|template)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#x27;|&#39;|&apos;/gi, "'");
  return text
    .normalize("NFC")
    .toLowerCase()
    .split(/[^\p{L}\p{N}'-]+/u)
    .map((word) => word.replace(/^['-]+|['-]+$/g, "").replace(/'s$/, ""))
    .filter(Boolean);
}

function nameTokens(value: string | undefined): string[] {
  return (value ?? "")
    .normalize("NFC")
    .toLowerCase()
    .split(/[^\p{L}\p{N}'-]+/u)
    .filter((token) => token.length >= 2 && !SKIP_NAME_TOKENS.has(token));
}

function hasSequence(words: string[], tokens: string[]): boolean {
  if (tokens.length === 0) return false;
  for (let i = 0; i + tokens.length <= words.length; i += 1) {
    if (tokens.every((token, k) => words[i + k] === token)) return true;
  }
  return false;
}

/**
 * Whole-word name check on visible text only (A3 onward). Found: a full
 * name phrase appears as consecutive words, or the first and last names
 * both appear as words. Review: the roster name is one word or initials,
 * or only one of the two names is on the page. One-letter tokens never count.
 */
export function studentNameVerdict(html: string, query: NameQuery): NameVerdict {
  const words = visibleWords(html);
  const set = new Set(words);
  for (const phrase of query.phrases) {
    const tokens = nameTokens(phrase);
    if (tokens.length >= 2 && hasSequence(words, tokens)) return "found";
  }
  let first = nameTokens(query.first);
  let last = nameTokens(query.last);
  if (!first.length || !last.length) {
    // Roster-only queries ("Lee, Ann"): first and last words of the full name.
    const full = query.phrases.map(nameTokens).find((tokens) => tokens.length >= 2);
    if (full) {
      first = [full[0]];
      last = [full[full.length - 1]];
    }
  }
  if (first.length && last.length) {
    const hasFirst = first.every((token) => set.has(token));
    const hasLast = last.every((token) => set.has(token));
    if (hasFirst && hasLast) return "found";
    return hasFirst || hasLast ? "review" : "missing";
  }
  // One usable word (or only initials): never pass on its own.
  const markers = query.markers.flatMap((marker) => nameTokens(marker));
  return markers.some((token) => set.has(token)) || markers.length === 0 ? "review" : "missing";
}
