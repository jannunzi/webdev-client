"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  SECTION_STORAGE_KEY,
  defaultSectionId,
  findSection,
  sections,
} from "../data/sections";
import type { CourseSection } from "../data/types";

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function readSectionId(fallback: string): string {
  const stored = window.localStorage.getItem(SECTION_STORAGE_KEY);
  if (stored && sections.some((section) => section.id === stored)) {
    return stored;
  }
  return fallback;
}

/**
 * Same section filter as the syllabus: CS 4550-01 / CS 5610-02 / CS 5610-09,
 * persisted in localStorage so course pages stay on one section.
 */
export function useCourseSection(initialId: string = defaultSectionId): {
  section: CourseSection;
  sections: CourseSection[];
  selectSection: (id: string) => void;
} {
  const getSnapshot = useCallback(() => readSectionId(initialId), [initialId]);
  const getServerSnapshot = useCallback(() => initialId, [initialId]);
  const sectionId = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  function selectSection(id: string) {
    window.localStorage.setItem(SECTION_STORAGE_KEY, id);
    emit();
  }

  return { section: findSection(sectionId), sections, selectSection };
}
