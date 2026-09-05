import type { AssignmentId } from "./types";
import {
  localProgressKey,
  resolveProgressSnapshot,
  serializeLocalProgress,
} from "./progress-store";

const listeners = new Set<() => void>();
const snapshotCache = new Map<
  string,
  { localRaw: string | undefined; serverKey: string; value: string[] }
>();

function emit() {
  for (const listener of listeners) listener();
}

export function subscribeLocalProgress(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function readMergedProgress(
  assignmentId: AssignmentId,
  serverIds: readonly string[],
): string[] {
  const localRaw = window.localStorage.getItem(localProgressKey(assignmentId));
  const serverKey = [...serverIds].sort().join(",");
  const cached = snapshotCache.get(assignmentId);
  if (
    cached &&
    cached.localRaw === (localRaw ?? undefined) &&
    cached.serverKey === serverKey
  ) {
    return cached.value;
  }
  const value = resolveProgressSnapshot(serverIds, localRaw);
  snapshotCache.set(assignmentId, {
    localRaw: localRaw ?? undefined,
    serverKey,
    value,
  });
  return value;
}

export function writeLocalProgress(
  assignmentId: AssignmentId,
  completedIds: readonly string[],
) {
  window.localStorage.setItem(
    localProgressKey(assignmentId),
    serializeLocalProgress(completedIds),
  );
  snapshotCache.delete(assignmentId);
  emit();
}

export function serverProgressSnapshot(serverIds: readonly string[]) {
  return [...serverIds].sort();
}
