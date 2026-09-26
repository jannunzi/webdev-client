/** Legacy checklist keys. Progress is no longer stored in the browser. */
export const LEGACY_ASSIGNMENT_PROGRESS_PREFIX = "webdev.assignmentProgress.";

export type KeyIndexStorage = {
  readonly length: number;
  key(index: number): string | null;
  removeItem(key: string): void;
};

/** Remove every `webdev.assignmentProgress.*` key. Other keys are left alone. */
export function clearLegacyAssignmentProgressStorage(
  storage: KeyIndexStorage,
): string[] {
  const keys: string[] = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key?.startsWith(LEGACY_ASSIGNMENT_PROGRESS_PREFIX)) keys.push(key);
  }
  for (const key of keys) storage.removeItem(key);
  return keys;
}
