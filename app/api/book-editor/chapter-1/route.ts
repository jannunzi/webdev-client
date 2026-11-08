import { staffActor } from "@/app/api/staff/actor";
import { handleChapterGet, handleChapterPut } from "@/lib/book-editor/handle";
import { openChapterStore } from "@/lib/book-editor/resolve";
import { storagePlan } from "@/lib/book-editor/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return handleChapterGet({
    staff: await staffActor(),
    store: await openChapterStore(),
    plan: storagePlan(),
  });
}

export async function PUT(request: Request) {
  return handleChapterPut(request, {
    staff: await staffActor(),
    store: await openChapterStore(),
    plan: storagePlan(),
  });
}
