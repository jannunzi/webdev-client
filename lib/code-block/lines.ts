/** 1-based line number, or an inclusive [start, end] range. */
export type CodeLineRange = number | readonly [start: number, end: number];

export type CodeLineMarks = readonly CodeLineRange[];

export function expandLineMarks(marks?: CodeLineMarks | null): Set<number> {
  const lines = new Set<number>();
  if (!marks) return lines;
  for (const mark of marks) {
    if (typeof mark === "number") {
      if (mark > 0) lines.add(mark);
      continue;
    }
    const start = Math.min(mark[0], mark[1]);
    const end = Math.max(mark[0], mark[1]);
    for (let line = start; line <= end; line++) {
      if (line > 0) lines.add(line);
    }
  }
  return lines;
}
