"use client";

import { useEffect } from "react";
import { clearLegacyAssignmentProgressStorage } from "@/lib/assignments/clear-legacy-progress";

let cleared = false;

/** One pass per page load. Later visits no-op once the keys are gone. */
export default function ClearLegacyProgressStorage() {
  useEffect(() => {
    if (cleared) return;
    cleared = true;
    try {
      clearLegacyAssignmentProgressStorage(window.localStorage);
    } catch {
      // Private mode can throw. Checklist state does not read this storage.
    }
  }, []);
  return null;
}
