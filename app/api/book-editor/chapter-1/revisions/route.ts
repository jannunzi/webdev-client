import { staffActor } from "@/app/api/staff/actor";
import { handleRevisionList, handleRevisionRestore } from "@/lib/book-editor/handle";
import { openChapterStore } from "@/lib/book-editor/resolve";
import { storagePlan } from "@/lib/book-editor/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return handleRevisionList({
    staff: await staffActor(),
    store: await openChapterStore(),
  });
}

export async function POST(request: Request) {
  return handleRevisionRestore(request, {
    staff: await staffActor(),
    store: await openChapterStore(),
    plan: storagePlan(),
  });
}
