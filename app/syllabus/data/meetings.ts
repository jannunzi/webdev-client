import type { MeetingInfo } from "./types";

/**
 * Typical CS 4550 Online Full pattern: Tuesday / Thursday lectures,
 * plus a Friday introductory setup session in week 1.
 * Change `firstMeeting` / `lastMeeting` / `daysOfWeek` for a new term.
 */
export const meetings: MeetingInfo = {
  pattern: "Tuesday and Thursday",
  daysOfWeek: [2, 4],
  time: "Live session times are posted on Canvas",
  location: "Online (Canvas and Zoom)",
  modality: "Online, full semester",
  firstMeeting: "2026-09-10",
  lastMeeting: "2026-12-10",
  extraMeetings: [
    {
      date: "2026-09-11",
      label: "Friday introductory session — environment setup",
    },
  ],
  notes: [
    "Northeastern Fall 2026 full-semester classes begin Wednesday, September 9. The first Thursday meeting is September 10.",
    "A Friday introductory session on September 11 walks through Node.js, Git, the Next.js starter, and Vercel so everyone is ready before the first full Tuesday lecture.",
    "After that, regular meetings are Tuesday and Thursday. There are no lectures during Thanksgiving week (Tuesday, November 24 through Sunday, November 29).",
  ],
};
