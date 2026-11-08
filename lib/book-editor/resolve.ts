import "server-only";

import { createFileStore, localStoreDir, storagePlan, type ChapterStore } from "./store";

/** Mongo when configured. A local file only outside production. Never the public book. */
export async function openChapterStore(): Promise<ChapterStore | null> {
  const plan = storagePlan();
  if (!plan.available) return null;
  if (plan.kind === "local-file") return createFileStore(localStoreDir());
  const { createMongoStore } = await import("./store-mongo");
  return createMongoStore();
}
