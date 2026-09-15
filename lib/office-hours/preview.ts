import { ESTIMATE_MINUTES_PER_STUDENT, type QueueView } from "./queue";

export type QueuePreviewRole = "student" | "ta" | "join";

/** Fixture line used only when `OH_QUEUE_PREVIEW=1` (non-production). */
export function previewQueueView(role: QueuePreviewRole): QueueView {
  const line = [
    {
      id: "preview-1",
      displayName: "Ada Lovelace",
      status: "serving" as const,
      position: 1,
      isYou: role === "student",
      joinedAt: "2026-09-14T15:01:00.000Z",
      ...(role === "ta" ? { studentEmail: "ada@northeastern.edu" } : {}),
    },
    {
      id: "preview-2",
      displayName: "Alan Turing",
      status: "waiting" as const,
      position: 2,
      isYou: false,
      joinedAt: "2026-09-14T15:04:00.000Z",
      ...(role === "ta" ? { studentEmail: "turing@northeastern.edu" } : {}),
    },
  ];
  return {
    taId: "shloka-trivedi",
    taEmail: role === "ta" ? "trivedi.shl@northeastern.edu" : undefined,
    section: "cs4550-01",
    open: true,
    line,
    waitingCount: 1,
    myEntryId: role === "student" ? "preview-1" : undefined,
    myPosition: role === "student" ? 1 : undefined,
    myEstimateMinutes:
      role === "student" ? ESTIMATE_MINUTES_PER_STUDENT : undefined,
    updatedAt: "2026-09-14T15:10:00.000Z",
  };
}
