import { generateText } from "ai";
import type { StaffGate } from "./handle-edit";
import { suggestRateLimit } from "./rate-limit";
import {
  fitGhost,
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

const CONTINUE_SYSTEM = `You insert text at the caret in a web development textbook.
BEFORE is the text up to the caret. AFTER is the text that already follows it.
If BEFORE ends a sentence, write the next sentence.
If BEFORE is mid-sentence, finish that sentence so it reads into AFTER.
Begin with a single space when the insertion starts a new word. Do not begin with a space when it finishes the word at the caret.
Do not repeat AFTER. Do not invent a scenario, list, or heading.
Do not use placeholders or markup.
Return only the insertion.`;

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
  const before = typeof body.before === "string" ? body.before : text;
  const after = typeof body.after === "string" ? body.after : "";
  const maskCount = typeof body.maskCount === "number" ? body.maskCount : 0;
  if (!mode) {
    return Response.json({ ok: false, error: "Unknown suggestion mode." }, { status: 400 });
  }
  const passage = mode === "continue" ? `${before}${after}` : text;
  if (!passage.trim() || passage.length > 8_000) {
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
      prompt:
        mode === "continue"
          ? `BEFORE:\n${before}\n\nAFTER:\n${after}`
          : text,
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
    const sentence = fitGhost(cleaned, after);
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
