/**
 * Student-facing Canvas take windows for quizzes whose section times are
 * known. These are not the website lock or answer-review dates in
 * `lib/quiz-exam/schedule.ts` (Q4’s class-wide lock is Nov 15 and answers
 * open Nov 16–23). Do not derive this copy from that schedule.
 *
 * Unknown section times stay off this list. Callers keep the shared
 * “week of” label and omit a window rather than inventing one.
 * Times are America/New_York.
 */

export const CANVAS_QUIZ_WINDOWS_NOTE =
  "Canvas is the source of truth for exact quiz windows.";

export type SectionQuizWindow = {
  /** Syllabus section label, e.g. "CS 5610-02". */
  section: string;
  /** Canvas availability, as posted for that section. */
  window: string;
};

const SECTION_QUIZ_WINDOWS: Record<string, readonly SectionQuizWindow[]> = {
  q4: [
    { section: "CS 5610-02", window: "Mon Nov 9 8:30–10:00 PM" },
    {
      section: "CS 5610-09",
      window: "Tue Nov 10 8:00 AM – Sun Nov 15 11:59 PM",
    },
    {
      section: "CS 4550-01",
      window: "Wed Nov 18, 7:30–9:00 PM ET, in class at the end of lecture",
    },
  ],
  q5: [{ section: "CS 5610-02", window: "Mon Nov 23 8:30–10:00 PM" }],
};

export function sectionQuizWindows(
  quizId: string,
): readonly SectionQuizWindow[] {
  return SECTION_QUIZ_WINDOWS[quizId.toLowerCase()] ?? [];
}

export function quizIdFromLabel(label: string): string | undefined {
  const match = /^(Q\d+)\b/i.exec(label);
  return match?.[1].toLowerCase();
}

export function sectionQuizWindowsForLabel(
  label: string,
): readonly SectionQuizWindow[] {
  const quizId = quizIdFromLabel(label);
  return quizId ? sectionQuizWindows(quizId) : [];
}

export function formatSectionQuizWindow(row: SectionQuizWindow): string {
  return `${row.section}: ${row.window}`;
}
