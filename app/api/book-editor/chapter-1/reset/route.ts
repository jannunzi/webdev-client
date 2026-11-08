import { staffActor } from "@/app/api/staff/actor";
import { handleChapterReset } from "@/lib/book-editor/handle";
import { openChapterStore } from "@/lib/book-editor/resolve";
import { storagePlan } from "@/lib/book-editor/store";

export const dynamic = "force-dynamic";

/** Staff-only. Backs up the current Chapter 1 draft, then imports the published chapter. */
export async function POST() {
  return handleChapterReset({
    staff: await staffActor(),
    store: await openChapterStore(),
    plan: storagePlan(),
  });
}
