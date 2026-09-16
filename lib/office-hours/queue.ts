import { normalizeEmail } from "../roster/emails";

export const OFFICE_HOUR_QUEUES_COLLECTION = "office_hour_queues";
export const ESTIMATE_MINUTES_PER_STUDENT = 10;

export type QueueEntryStatus = "waiting" | "serving" | "done" | "left";

export type QueueEntry = {
  id: string;
  studentEmail: string;
  displayName: string;
  joinedAt: string;
  status: QueueEntryStatus;
};

export type OfficeHourQueue = {
  taId: string;
  taEmail: string;
  section: string;
  open: boolean;
  entries: QueueEntry[];
  updatedAt: string;
};

export type QueueMutationError =
  | "session_closed"
  | "already_in_line"
  | "not_in_line"
  | "unknown_entry"
  | "not_waiting";

export type QueueMutationResult =
  | { ok: true; queue: OfficeHourQueue }
  | { ok: false; code: QueueMutationError };

export function emptyQueue(input: {
  taId: string;
  taEmail: string;
  section: string;
  now?: string;
}): OfficeHourQueue {
  return {
    taId: input.taId,
    taEmail: input.taEmail,
    section: input.section,
    open: false,
    entries: [],
    updatedAt: input.now ?? new Date(0).toISOString(),
  };
}

export function isActiveStatus(status: QueueEntryStatus): boolean {
  return status === "waiting" || status === "serving";
}

export function activeEntries(queue: OfficeHourQueue): QueueEntry[] {
  return queue.entries.filter((entry) => isActiveStatus(entry.status));
}

export function waitingEntries(queue: OfficeHourQueue): QueueEntry[] {
  return queue.entries.filter((entry) => entry.status === "waiting");
}

export function studentActiveEntry(
  queue: OfficeHourQueue,
  studentEmail: string,
): QueueEntry | undefined {
  const email = normalizeEmail(studentEmail);
  return queue.entries.find(
    (entry) =>
      normalizeEmail(entry.studentEmail) === email &&
      isActiveStatus(entry.status),
  );
}

export function positionInLine(
  queue: OfficeHourQueue,
  studentEmail: string,
): number | null {
  const email = normalizeEmail(studentEmail);
  const index = activeEntries(queue).findIndex(
    (entry) => normalizeEmail(entry.studentEmail) === email,
  );
  return index >= 0 ? index + 1 : null;
}

/** Rough wait: ~10 minutes × position in the live line. */
export function estimateWaitMinutes(position: number): number {
  return Math.max(0, position) * ESTIMATE_MINUTES_PER_STUDENT;
}

function touch(
  queue: OfficeHourQueue,
  now: string,
  patch: Partial<OfficeHourQueue>,
): OfficeHourQueue {
  return { ...queue, ...patch, updatedAt: now };
}

export function canJoinQueue(
  queue: OfficeHourQueue,
  studentEmail: string,
): { ok: true } | { ok: false; code: QueueMutationError } {
  if (!queue.open) return { ok: false, code: "session_closed" };
  if (studentActiveEntry(queue, studentEmail)) {
    return { ok: false, code: "already_in_line" };
  }
  return { ok: true };
}

export function joinQueue(
  queue: OfficeHourQueue,
  input: {
    studentEmail: string;
    displayName: string;
    id: string;
    now: string;
  },
): QueueMutationResult {
  const gate = canJoinQueue(queue, input.studentEmail);
  if (!gate.ok) return gate;
  const entry: QueueEntry = {
    id: input.id,
    studentEmail: normalizeEmail(input.studentEmail),
    displayName: input.displayName.trim() || normalizeEmail(input.studentEmail),
    joinedAt: input.now,
    status: "waiting",
  };
  return {
    ok: true,
    queue: touch(queue, input.now, { entries: [...queue.entries, entry] }),
  };
}

export function leaveQueue(
  queue: OfficeHourQueue,
  studentEmail: string,
  now: string,
): QueueMutationResult {
  const active = studentActiveEntry(queue, studentEmail);
  if (!active) return { ok: false, code: "not_in_line" };
  return setEntryStatus(queue, active.id, "left", now);
}

export function openSession(
  queue: OfficeHourQueue,
  now: string,
): QueueMutationResult {
  return { ok: true, queue: touch(queue, now, { open: true }) };
}

export function closeSession(
  queue: OfficeHourQueue,
  now: string,
): QueueMutationResult {
  return { ok: true, queue: touch(queue, now, { open: false }) };
}

function setEntryStatus(
  queue: OfficeHourQueue,
  entryId: string,
  status: QueueEntryStatus,
  now: string,
): QueueMutationResult {
  const index = queue.entries.findIndex((entry) => entry.id === entryId);
  if (index < 0) return { ok: false, code: "unknown_entry" };
  const entries = queue.entries.map((entry) =>
    entry.id === entryId ? { ...entry, status } : entry,
  );
  return { ok: true, queue: touch(queue, now, { entries }) };
}

/** Mark this student as now serving. Any other serving student stays serving. */
export function serveStudent(
  queue: OfficeHourQueue,
  entryId: string,
  now: string,
): QueueMutationResult {
  const entry = queue.entries.find((row) => row.id === entryId);
  if (!entry) return { ok: false, code: "unknown_entry" };
  if (entry.status !== "waiting" && entry.status !== "serving") {
    return { ok: false, code: "not_waiting" };
  }
  return setEntryStatus(queue, entryId, "serving", now);
}

export function markStudentDone(
  queue: OfficeHourQueue,
  entryId: string,
  now: string,
): QueueMutationResult {
  const entry = queue.entries.find((row) => row.id === entryId);
  if (!entry) return { ok: false, code: "unknown_entry" };
  if (!isActiveStatus(entry.status)) return { ok: false, code: "not_waiting" };
  return setEntryStatus(queue, entryId, "done", now);
}

export function removeStudent(
  queue: OfficeHourQueue,
  entryId: string,
  now: string,
): QueueMutationResult {
  const entry = queue.entries.find((row) => row.id === entryId);
  if (!entry) return { ok: false, code: "unknown_entry" };
  if (!isActiveStatus(entry.status)) return { ok: false, code: "not_waiting" };
  return setEntryStatus(queue, entryId, "left", now);
}

export function reorderWaiting(
  queue: OfficeHourQueue,
  entryId: string,
  direction: "up" | "down",
  now: string,
): QueueMutationResult {
  const waitingIds = waitingEntries(queue).map((entry) => entry.id);
  const from = waitingIds.indexOf(entryId);
  if (from < 0) return { ok: false, code: "not_waiting" };
  const to = direction === "up" ? from - 1 : from + 1;
  if (to < 0 || to >= waitingIds.length) {
    return { ok: true, queue };
  }
  const reorderedWaiting = [...waitingIds];
  const [moved] = reorderedWaiting.splice(from, 1);
  reorderedWaiting.splice(to, 0, moved);

  const waitingQueue = new Map(
    waitingEntries(queue).map((entry) => [entry.id, entry]),
  );
  let waitingIndex = 0;
  const entries = queue.entries.map((entry) => {
    if (entry.status !== "waiting") return entry;
    const next = waitingQueue.get(reorderedWaiting[waitingIndex]);
    waitingIndex += 1;
    return next ?? entry;
  });
  return { ok: true, queue: touch(queue, now, { entries }) };
}

export type QueueLineItem = {
  id: string;
  displayName: string;
  studentEmail?: string;
  status: QueueEntryStatus;
  position: number;
  isYou: boolean;
  joinedAt: string;
};

export type QueueView = {
  taId: string;
  taEmail?: string;
  section: string;
  open: boolean;
  line: QueueLineItem[];
  waitingCount: number;
  myEntryId?: string;
  myPosition?: number;
  myEstimateMinutes?: number;
  updatedAt: string;
};

export function toQueueView(
  queue: OfficeHourQueue,
  input: { viewerEmail?: string; includeEmails?: boolean } = {},
): QueueView {
  const viewer = input.viewerEmail ? normalizeEmail(input.viewerEmail) : "";
  const line = activeEntries(queue).map((entry, index) => {
    const position = index + 1;
    const item: QueueLineItem = {
      id: entry.id,
      displayName: entry.displayName,
      status: entry.status,
      position,
      isYou: Boolean(viewer && normalizeEmail(entry.studentEmail) === viewer),
      joinedAt: entry.joinedAt,
    };
    if (input.includeEmails) item.studentEmail = entry.studentEmail;
    return item;
  });
  const mine = viewer ? studentActiveEntry(queue, viewer) : undefined;
  const myPosition = viewer ? positionInLine(queue, viewer) : null;
  return {
    taId: queue.taId,
    taEmail: input.includeEmails ? queue.taEmail : undefined,
    section: queue.section,
    open: queue.open,
    line,
    waitingCount: waitingEntries(queue).length,
    myEntryId: mine?.id,
    myPosition: myPosition ?? undefined,
    myEstimateMinutes:
      myPosition != null ? estimateWaitMinutes(myPosition) : undefined,
    updatedAt: queue.updatedAt,
  };
}
