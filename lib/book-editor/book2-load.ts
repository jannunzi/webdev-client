import type { JSONContent } from "@tiptap/core";
import { readChapter } from "./handle";
import type { ChapterStore, StoragePlan } from "./store";
import { storagePlan } from "./store";

/**
 * Latest saved Chapter 1 document. Reading does not create a document or a revision.
 * An unsaved seed is not a draft: the preview falls back to the published chapter.
 */
export async function loadSavedChapter1(
  store: ChapterStore | null,
  plan: StoragePlan = storagePlan(),
): Promise<{ doc: JSONContent; updatedAt: string } | null> {
  const payload = await readChapter(store, plan);
  if (!payload.persisted || !payload.updatedAt) return null;
  return { doc: payload.doc, updatedAt: payload.updatedAt };
}
