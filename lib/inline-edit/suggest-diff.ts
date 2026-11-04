/**
 * Word-level diff for staff writing suggestions.
 * Preserved inline pieces travel as ⟦n⟧ placeholders and are restored from
 * the original HTML, so a glossary link or code span cannot be rewritten.
 */

export type HunkChoice = "accept" | "reject";

export type DiffPart =
  | { type: "equal"; html: string }
  | { type: "hunk"; id: string; deleteHtml: string; insertHtml: string };

type Atom = { key: string; html: string };

const PRESERVED =
  /<slot\b[^>]*data-i="\d+"[^>]*>\s*<\/slot>|<code\b[^>]*>[\s\S]*?<\/code>|<a\b[^>]*>[\s\S]*?<\/a>/gi;

export function maskPreservedHtml(html: string): { prompt: string; masks: string[] } {
  const masks: string[] = [];
  const prompt = html.replace(PRESERVED, (match) => {
    const id = masks.length;
    masks.push(match);
    return `⟦${id}⟧`;
  });
  return { prompt, masks };
}

export function placeholderIds(prompt: string): number[] {
  return [...prompt.matchAll(/⟦(\d+)⟧/g)].map((match) => Number(match[1]));
}

export function placeholdersIntact(prompt: string, count: number): boolean {
  const ids = placeholderIds(prompt);
  if (ids.length !== count) return false;
  const seen = new Set(ids);
  if (seen.size !== count) return false;
  for (let index = 0; index < count; index += 1) {
    if (!seen.has(index)) return false;
  }
  return true;
}

export function stripModelFence(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:html|text|markdown)?\s*([\s\S]*?)```$/i);
  return (fenced?.[1] ?? trimmed).trim();
}

/** The next ghost word, including any leading space, and the remainder. */
export function splitGhostWord(ghost: string): { take: string; rest: string } | null {
  const match = /^(\s*\S+)([\s\S]*)$/.exec(ghost);
  if (!match?.[1]) return null;
  return { take: match[1], rest: match[2] ?? "" };
}

/**
 * Insertion that belongs between the caret and the following text.
 * One sentence, with a repeated tail of the following text removed.
 */
export function fitGhost(raw: string, after: string): string {
  let sentence = continuationSentence(raw);
  const afterPlain = after
    .replace(/⟦\d+⟧/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (afterPlain.length >= 12) {
    const probe = afterPlain.slice(0, 12).toLowerCase();
    const at = sentence.toLowerCase().indexOf(probe);
    if (at === 0) return "";
    if (at > 0) {
      const lead = sentence.startsWith(" ") ? " " : "";
      const cut = sentence.slice(0, at).trim();
      sentence = cut ? `${lead}${cut}` : "";
    }
  }
  return sentence;
}

/**
 * One sentence for ghost text. Placeholders and tags from the model are
 * dropped. A single leading space is kept so a new word stays separate from
 * the caret and a mid-word completion stays attached.
 */
export function continuationSentence(raw: string): string {
  const lead = /^\s/.test(raw) ? " " : "";
  const stripped = stripModelFence(raw).replace(/⟦\d+⟧/g, "").replace(/<[^>]+>/g, "");
  const cleaned = stripped.replace(/\s+/g, " ").trim();
  const match = cleaned.match(/^[\s\S]*?[.!](?=\s|$)|^[\s\S]*?\?(?=\s|$)/);
  const text = (match?.[0] ?? cleaned).trim();
  return text ? `${lead}${text}` : "";
}

export function buildDiff(
  beforePrompt: string,
  afterPrompt: string,
  masks: string[],
): { ok: true; parts: DiffPart[] } | { ok: false; error: string } {
  const after = stripModelFence(afterPrompt);
  if (!placeholdersIntact(after, masks.length) || !placeholdersIntact(beforePrompt, masks.length)) {
    return {
      ok: false,
      error: "The suggestion dropped or duplicated a link or code span.",
    };
  }
  const beforeAtoms = parseAtoms(beforePrompt, masks);
  const afterAtoms = parseAtoms(after, masks);
  if (!beforeAtoms || !afterAtoms) {
    return { ok: false, error: "The suggestion could not be read." };
  }
  return { ok: true, parts: groupHunks(diffAtoms(beforeAtoms, afterAtoms)) };
}

export function applyChoices(
  parts: readonly DiffPart[],
  choices: Readonly<Record<string, HunkChoice>>,
): string {
  return parts
    .map((part) => {
      if (part.type === "equal") return part.html;
      return choices[part.id] === "accept" ? part.insertHtml : part.deleteHtml;
    })
    .join("");
}

export function acceptAllChoices(parts: readonly DiffPart[]): Record<string, HunkChoice> {
  const choices: Record<string, HunkChoice> = {};
  for (const part of parts) {
    if (part.type === "hunk") choices[part.id] = "accept";
  }
  return choices;
}

export function renderReview(
  parts: readonly DiffPart[],
  choices: Readonly<Record<string, HunkChoice>>,
): string {
  return parts
    .map((part) => {
      if (part.type === "equal") return part.html;
      const choice = choices[part.id];
      if (choice === "accept") return part.insertHtml;
      if (choice === "reject") return part.deleteHtml;
      return `<span data-diff-hunk="${part.id}"><del class="rounded bg-red-100 text-red-900 line-through">${part.deleteHtml}</del><mark class="rounded bg-emerald-100 text-emerald-950">${part.insertHtml}</mark> <button type="button" data-hunk-id="${part.id}" data-hunk-choice="accept" class="mx-0.5 rounded border border-neutral-300 bg-white px-1 text-[10px] font-sans text-neutral-800">Accept</button><button type="button" data-hunk-id="${part.id}" data-hunk-choice="reject" class="mx-0.5 rounded border border-neutral-300 bg-white px-1 text-[10px] font-sans text-neutral-800">Reject</button></span>`;
    })
    .join("");
}

function parseAtoms(prompt: string, masks: readonly string[]): Atom[] | null {
  const tokens = prompt.match(/⟦\d+⟧|<\/?(?:strong|em)>|\s+|[^\s<⟦]+/g) ?? [];
  let strong = false;
  let em = false;
  let spaced = false;
  const atoms: Atom[] = [];
  for (const token of tokens) {
    if (/^\s+$/.test(token)) {
      spaced = true;
      continue;
    }
    if (token === "<strong>") {
      strong = true;
      continue;
    }
    if (token === "</strong>") {
      strong = false;
      continue;
    }
    if (token === "<em>") {
      em = true;
      continue;
    }
    if (token === "</em>") {
      em = false;
      continue;
    }
    const slot = /^⟦(\d+)⟧$/.exec(token);
    if (slot) {
      const id = Number(slot[1]);
      const mask = masks[id];
      if (mask == null) return null;
      atoms.push({ key: `slot:${id}`, html: `${spaced ? " " : ""}${mask}` });
      spaced = false;
      continue;
    }
    let html = escapeHtml(token);
    if (em) html = `<em>${html}</em>`;
    if (strong) html = `<strong>${html}</strong>`;
    atoms.push({
      key: `w:${strong ? 1 : 0}:${em ? 1 : 0}:${token}`,
      html: `${spaced ? " " : ""}${html}`,
    });
    spaced = false;
  }
  return atoms;
}

type Op =
  | { type: "equal"; atom: Atom }
  | { type: "delete"; atom: Atom }
  | { type: "insert"; atom: Atom };

function diffAtoms(before: readonly Atom[], after: readonly Atom[]): Op[] {
  const n = before.length;
  const m = after.length;
  const scores: number[][] = Array.from({ length: n + 1 }, () => Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      const left = before[i];
      const right = after[j];
      scores[i]![j] =
        left && right && left.key === right.key
          ? scores[i + 1]![j + 1]! + 1
          : Math.max(scores[i + 1]![j]!, scores[i]![j + 1]!);
    }
  }
  const ops: Op[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    const left = before[i]!;
    const right = after[j]!;
    if (left.key === right.key) {
      ops.push({ type: "equal", atom: left });
      i += 1;
      j += 1;
    } else if (scores[i + 1]![j]! >= scores[i]![j + 1]!) {
      ops.push({ type: "delete", atom: left });
      i += 1;
    } else {
      ops.push({ type: "insert", atom: right });
      j += 1;
    }
  }
  while (i < n) ops.push({ type: "delete", atom: before[i++]! });
  while (j < m) ops.push({ type: "insert", atom: after[j++]! });
  return ops;
}

function groupHunks(ops: readonly Op[]): DiffPart[] {
  const parts: DiffPart[] = [];
  let deleteHtml = "";
  let insertHtml = "";
  let count = 0;
  const flush = () => {
    if (!deleteHtml && !insertHtml) return;
    parts.push({ type: "hunk", id: `h${count}`, deleteHtml, insertHtml });
    count += 1;
    deleteHtml = "";
    insertHtml = "";
  };
  for (const op of ops) {
    if (op.type === "equal") {
      flush();
      parts.push({ type: "equal", html: op.atom.html });
      continue;
    }
    if (op.type === "delete") deleteHtml += op.atom.html;
    else insertHtml += op.atom.html;
  }
  flush();
  return parts;
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
