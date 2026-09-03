/** Shared with the self-check blank matcher: trim, casefold, collapse space, drop quotes. */
export function normalizeBlank(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ").replace(/['"]/g, "");
}

export function normalizeTuple(values: string[]): string[] {
  return values.map(normalizeBlank);
}

export function tuplesEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
}

export function isFibCombinationCorrect(
  acceptedCombinations: string[][],
  response: string[],
): boolean {
  const got = normalizeTuple(response);
  return acceptedCombinations.some((combo) =>
    tuplesEqual(normalizeTuple(combo), got),
  );
}
