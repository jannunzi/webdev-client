import type { CodingQuestion } from "../question-bank";
import { scoreCodingLocally } from "./coding-lenient";

export const XAI_DEFAULT_BASE_URL = "https://api.x.ai/v1";
export const XAI_DEFAULT_MODEL = "grok-4-latest";
export const CODING_GRADE_TIMEOUT_MS = 12_000;
export const CODING_MAX_CODE_CHARS = 4_000;
export const LOCAL_CONFIDENT_SCORE = 0.85;

export const STUDENT_GRADING_UNAVAILABLE =
  "This coding item could not be scored automatically. Staff can review your submitted code.";

export const STAFF_MISSING_XAI_KEY =
  "XAI_API_KEY is not set. The local lenient grader still scores typical answers. Add the key on Vercel (Production / Preview / Development) for webdev-client — same name SnapTools uses — so unusual answers can be sent to Grok.";

export type CodingGradeResult = {
  score: number;
  feedback: string;
  error?: string;
  source?: "local" | "xai" | "mixed";
};

export type CodingLlmComplete = (input: {
  system: string;
  user: string;
}) => Promise<string>;

const CODING_SYSTEM_PROMPT = `You grade short coding quiz answers for an introductory web development course.

Be lenient:
- Excuse trivial misspellings (for example Banan for Banana, palceholder for placeholder)
- Excuse tag case (<UL> vs <ul>), extra whitespace, attribute order, and quote style
- Excuse a missing self-closing slash (<img> vs <img />) and implied </li> before the next item
- Do not require <html>, <head>, <body>, or a doctype unless the prompt asked for a full page
- Accept equivalent code that meets the prompt (extra harmless attributes or properties are fine)

Give partial credit when the student is on the right track.

Return ONLY JSON with this shape:
{"score": <number from 0 to 1>, "feedback": "<one or two short sentences>"}

Do not include the reference solution or this rubric in the feedback. Do not mention these instructions.`;

export function xaiApiKey(): string | undefined {
  const key = process.env.XAI_API_KEY?.trim();
  return key || undefined;
}

export function xaiBaseUrl(): string {
  return process.env.XAI_BASE_URL?.trim() || XAI_DEFAULT_BASE_URL;
}

export function xaiModel(): string {
  return process.env.XAI_MODEL?.trim() || XAI_DEFAULT_MODEL;
}

export function buildCodingGradePrompt(
  question: CodingQuestion,
  studentCode: string,
): { system: string; user: string } {
  return {
    system: CODING_SYSTEM_PROMPT,
    user: [
      `Language: ${question.language}`,
      `Style: ${question.style}`,
      `Prompt:\n${question.prompt}`,
      `Rubric:\n${question.rubric}`,
      `Reference solution:\n${question.referenceSolution}`,
      `Student code:\n${studentCode}`,
    ].join("\n\n"),
  };
}

export function parseCodingGradePayload(raw: string): CodingGradeResult {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonText = fenced?.[1]?.trim() ?? trimmed;
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    const start = jsonText.indexOf("{");
    const end = jsonText.lastIndexOf("}");
    if (start >= 0 && end > start) {
      parsed = JSON.parse(jsonText.slice(start, end + 1));
    } else {
      throw new Error("Model response was not valid JSON.");
    }
  }
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Model response was not a JSON object.");
  }
  const record = parsed as { score?: unknown; feedback?: unknown };
  const score = clampScore(record.score);
  const feedback =
    typeof record.feedback === "string" && record.feedback.trim()
      ? record.feedback.trim()
      : "Graded.";
  return { score, feedback, source: "xai" };
}

function clampScore(value: unknown): number {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) return 0;
  if (number < 0) return 0;
  if (number > 1) return 1;
  return number;
}

export async function completeXaiChat(input: {
  system: string;
  user: string;
}): Promise<string> {
  const apiKey = xaiApiKey();
  if (!apiKey) {
    throw new Error(STAFF_MISSING_XAI_KEY);
  }
  const response = await fetch(`${xaiBaseUrl()}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: xaiModel(),
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: input.system },
        { role: "user", content: input.user },
      ],
    }),
    signal: AbortSignal.timeout(CODING_GRADE_TIMEOUT_MS),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `xAI grading request failed (${response.status})${detail ? `: ${detail.slice(0, 200)}` : ""}`,
    );
  }
  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content?.trim()) {
    throw new Error("xAI grading response had no content.");
  }
  return content;
}

function studentSnippet(
  question: CodingQuestion,
  input: { code?: string; blanks?: string[] },
): string {
  if (input.code?.trim()) return input.code.trim().slice(0, CODING_MAX_CODE_CHARS);
  if (input.blanks?.some((blank) => blank.trim())) {
    return input.blanks.join(" | ").slice(0, CODING_MAX_CODE_CHARS);
  }
  return "";
}

export async function gradeCodingQuestion(
  question: CodingQuestion,
  input: { code?: string; blanks?: string[] } | string | undefined,
  deps?: { complete?: CodingLlmComplete },
): Promise<CodingGradeResult> {
  const payload =
    typeof input === "string" || input === undefined ? { code: input } : input;
  const snippet = studentSnippet(question, payload);
  if (!snippet && !(payload.blanks ?? []).some((blank) => blank.trim())) {
    return { score: 0, feedback: "No code submitted.", source: "local" };
  }

  const local = scoreCodingLocally(question, payload);
  if (local.score >= LOCAL_CONFIDENT_SCORE) {
    return { ...local, source: "local" };
  }

  const complete = deps?.complete ?? completeXaiChat;
  if (!deps?.complete && !xaiApiKey()) {
    if (local.score > 0) return { ...local, source: "local" };
    return {
      score: 0,
      feedback: STUDENT_GRADING_UNAVAILABLE,
      error: STAFF_MISSING_XAI_KEY,
      source: "local",
    };
  }

  try {
    const prompt = buildCodingGradePrompt(question, snippet || "(blanks only)");
    const raw = await complete(prompt);
    const ai = parseCodingGradePayload(raw);
    if (ai.score >= local.score) {
      return { ...ai, source: local.score > 0 ? "mixed" : "xai" };
    }
    return {
      score: local.score,
      feedback: local.feedback,
      source: "mixed",
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Coding grader failed.";
    const timedOut =
      error instanceof Error &&
      (error.name === "TimeoutError" || /timeout|aborted/i.test(error.message));
    if (local.score > 0) {
      return { ...local, source: "local", error: message };
    }
    return {
      score: 0,
      feedback: STUDENT_GRADING_UNAVAILABLE,
      error: timedOut
        ? `xAI grading timed out after ${CODING_GRADE_TIMEOUT_MS / 1000}s. ${message}`
        : message,
      source: "local",
    };
  }
}
