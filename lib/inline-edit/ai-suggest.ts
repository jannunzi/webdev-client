import { generateText } from "ai";
import type { StaffGate } from "./handle-edit";
import { suggestRateLimit } from "./rate-limit";
import {
  continuationSentence,
  placeholdersIntact,
  stripModelFence,
} from "./suggest-diff";

export const DEFAULT_SUGGEST_MODEL = "anthropic/claude-haiku-4.5";

const IMPROVE_SYSTEM = `You edit one passage from a web development textbook.
Fix typos and grammar. Smooth the wording in the book's style: open with the point, use precise terms, and join clauses only when they are one idea.
Do not invent scenarios, examples, tools, or facts.
The only markup you may use is <strong> and <em>.
Placeholders written ⟦n⟧ stand for links or code. Keep every placeholder exactly once. Do not invent new placeholders.
Return only the rewritten passage.`;

const CONTINUE_SYSTEM = `You continue one passage from a web development textbook.
Write the single next sentence in the same style: precise terms, no new scenario, no list, no heading.
Do not use placeholders. Do not use markup.
Return only that sentence.`;

export type SuggestMode = "improve" | "continue";

type Env = Record<string, string | undefined>;

export async function handleAiSuggestRequest(
  request: Request,
  options: {
    staff: StaffGate;
    env?: Env;
    generate?: (input: {
      model: string;
      system: string;
      prompt: string;
      maxOutputTokens: number;
    }) => Promise<string>;
    allow?: (key: string, now?: number) => boolean;
  },
): Promise<Response> {
  if ("error" in options.staff) {
    return Response.json(
      { ok: false, error: options.staff.error },
      { status: options.staff.status },
    );
  }
  const email = options.staff.email.trim();
  const allow = options.allow ?? suggestRateLimit;
  if (!allow(email)) {
    return Response.json(
      { ok: false, error: "Too many suggestions. Wait a minute and try again." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }
  const body = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const mode = body.mode === "improve" || body.mode === "continue" ? body.mode : null;
  const text = typeof body.text === "string" ? body.text : "";
  const maskCount = typeof body.maskCount === "number" ? body.maskCount : 0;
  if (!mode) {
    return Response.json({ ok: false, error: "Unknown suggestion mode." }, { status: 400 });
  }
  if (!text.trim() || text.length > 8_000) {
    return Response.json(
      { ok: false, error: "There is no text to suggest from." },
      { status: 400 },
    );
  }
  if (mode === "improve" && !placeholdersIntact(text, maskCount)) {
    return Response.json(
      { ok: false, error: "The passage lost a link or code span before it was sent." },
      { status: 400 },
    );
  }

  const env = options.env ?? process.env;
  const model = env.AI_SUGGEST_MODEL?.trim() || DEFAULT_SUGGEST_MODEL;
  const generate = options.generate ?? generateWithGateway;
  let raw = "";
  try {
    raw = await generate({
      model,
      system: mode === "improve" ? IMPROVE_SYSTEM : CONTINUE_SYSTEM,
      prompt: text,
      maxOutputTokens: mode === "continue" ? 120 : 800,
    });
  } catch {
    return Response.json(
      {
        ok: false,
        error:
          "AI suggestions are unavailable. On Vercel the deployment uses its OIDC token. Locally set AI_GATEWAY_API_KEY.",
      },
      { status: 503 },
    );
  }

  const cleaned = stripModelFence(raw);
  if (mode === "continue") {
    const sentence = continuationSentence(cleaned);
    if (!sentence) {
      return Response.json({ ok: false, error: "The model returned an empty sentence." }, { status: 502 });
    }
    return Response.json({ ok: true, mode, text: sentence });
  }
  if (!placeholdersIntact(cleaned, maskCount)) {
    return Response.json(
      { ok: false, error: "The suggestion dropped a link or code span. Try again." },
      { status: 422 },
    );
  }
  return Response.json({ ok: true, mode, text: cleaned });
}

async function generateWithGateway(input: {
  model: string;
  system: string;
  prompt: string;
  maxOutputTokens: number;
}): Promise<string> {
  const result = await generateText({
    model: input.model,
    system: input.system,
    prompt: input.prompt,
    maxOutputTokens: input.maxOutputTokens,
    temperature: 0.2,
  });
  return result.text;
}
