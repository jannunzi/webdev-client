const SEASON_RANK = { SP: 0, SU: 1, FA: 2 } as const;

const SEMESTER_CODE = /^(SP|SU|FA)(\d{2})$/;

/**
 * Order semester codes chronologically.
 * `SP26` < `SU26` < `FA26` < `SP27`. Years are 20xx (`FA26` → 2026).
 * Returns null when the code is not `SP` / `SU` / `FA` plus two digits.
 */
export function semesterRank(code: string): number | null {
  const match = SEMESTER_CODE.exec(code.trim().toUpperCase());
  if (!match) return null;
  const season = match[1] as keyof typeof SEASON_RANK;
  const year = 2000 + Number(match[2]);
  return year * 10 + SEASON_RANK[season];
}

/** `Fall 2026` → `FA26`. Returns null when the label is not a season and 4-digit year. */
export function semesterCodeFromTermLabel(label: string): string | null {
  const match = /^(Spring|Summer|Fall)\s+(\d{4})$/i.exec(label.trim());
  if (!match) return null;
  const season = { spring: "SP", summer: "SU", fall: "FA" }[
    match[1].toLowerCase()
  ];
  if (!season) return null;
  return `${season}${match[2].slice(2)}`;
}

export function normalizeSemesterCode(code: string): string | null {
  const normalized = code.trim().toUpperCase();
  return semesterRank(normalized) == null ? null : normalized;
}
