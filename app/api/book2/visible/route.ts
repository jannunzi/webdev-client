import { canSeeBook2 } from "@/lib/book-editor/preview-access";

export const dynamic = "force-dynamic";

/** Whether the signed-in user may see the book2 nav link. No chapter document. */
export async function GET() {
  const show = await canSeeBook2();
  return Response.json(
    { show },
    { headers: { "cache-control": "private, no-store" } },
  );
}
