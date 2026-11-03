import { handleEditTextRequest } from "@/lib/inline-edit/handle-edit";
import { staffActor } from "../actor";

export const runtime = "nodejs";

/** Staff probe used by the book and slides editor. Anonymous visitors get `{ staff: false }`. */
export async function GET() {
  const staff = await staffActor();
  return Response.json({ staff: "email" in staff });
}

export async function POST(request: Request) {
  return handleEditTextRequest(request, {
    staff: await staffActor(),
    env: process.env,
  });
}
