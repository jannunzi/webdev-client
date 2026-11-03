import { handleAiSuggestRequest } from "@/lib/inline-edit/ai-suggest";
import { staffActor } from "../actor";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleAiSuggestRequest(request, { staff: await staffActor() });
}
