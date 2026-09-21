/**
 * Deterministic lenient scoring for short coding items.
 *
 * Forgives tag case, extra whitespace, attribute order, quote style,
 * optional self-closing slashes, implied </li>, and simple misspellings.
 * Used as the testable floor; xAI can only raise the score.
 */

import { BLANK_MARK, fillTemplate } from "../question-bank/blanks";
import type { CodingQuestion } from "../question-bank/types";

export { fillTemplate };

export type LocalCodingGrade = {
  score: number;
  feedback: string;
};

/**
 * Equivalence classes for short coding / FIB tokens.
 * `for` and `htmlFor` are the HTML vs JSX names for label association.
 */
const BLANK_ALIASES: Record<string, string[]> = {
  for: ["htmlfor"],
  htmlfor: ["for"],
  class: ["classname"],
  classname: ["class"],
  "background-color": ["backgroundcolor"],
  "font-size": ["fontsize"],
  addeventlistener: ["addevent", "on"],
  textcontent: ["innertext"],
  usestate: ["usestate()"],
  onclick: ["onclickcapture"],
  stringify: ["json.stringify"],
  insertone: ["insert"],
  find: ["find()"],
};

export function levenshtein(left: string, right: string): number {
  if (left === right) return 0;
  if (!left.length) return right.length;
  if (!right.length) return left.length;
  const prev = Array.from({ length: right.length + 1 }, (_, index) => index);
  const next = new Array<number>(right.length + 1);
  for (let i = 0; i < left.length; i += 1) {
    next[0] = i + 1;
    for (let j = 0; j < right.length; j += 1) {
      const cost = left[i] === right[j] ? 0 : 1;
      next[j + 1] = Math.min(
        (prev[j + 1] ?? i) + 1,
        (next[j] ?? i) + 1,
        (prev[j] ?? i) + cost,
      );
    }
    for (let j = 0; j < prev.length; j += 1) prev[j] = next[j] ?? 0;
  }
  return prev[right.length] ?? right.length;
}

export function normalizeToken(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/^['"`]+|['"`]+$/g, "")
    .replace(/[()]/g, "")
    .replace(/[=;]+$/g, "")
    .replace(/\s+/g, "");
}

export function tokensSimilar(expected: string, actual: string): boolean {
  const left = normalizeToken(expected);
  const right = normalizeToken(actual);
  if (!left || !right) return false;
  if (left === right) return true;
  if (BLANK_ALIASES[left]?.includes(right)) return true;
  if (BLANK_ALIASES[right]?.includes(left)) return true;
  const distance = levenshtein(left, right);
  const maxLen = Math.max(left.length, right.length);
  if (maxLen <= 4) return distance <= 1;
  return distance <= 2;
}

export function scoreCodingBlanks(
  accepted: string[][],
  blanks: string[],
): LocalCodingGrade {
  if (!accepted.length) {
    return { score: 0, feedback: "No accepted answers configured." };
  }
  let best = 0;
  let bestMatched = 0;
  for (const combo of accepted) {
    let matched = 0;
    for (let index = 0; index < combo.length; index += 1) {
      if (tokensSimilar(combo[index] ?? "", blanks[index] ?? "")) matched += 1;
    }
    const ratio = combo.length ? matched / combo.length : 0;
    if (ratio > best) {
      best = ratio;
      bestMatched = matched;
    }
  }
  if (best >= 0.999) {
    return { score: 1, feedback: "All blanks match (lenient)." };
  }
  if (best <= 0) {
    return { score: 0, feedback: "The blanks do not match the expected attributes." };
  }
  return {
    score: best,
    feedback: `${bestMatched} of the blanks are close enough for partial credit.`,
  };
}

function collapseSpace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/** Drop optional self-closing slashes and normalize quotes / case / space. */
export function normalizeMarkup(input: string): string {
  return collapseSpace(
    input
      .replace(/\r\n/g, "\n")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/\s*\/\s*>/g, ">")
      .replace(/<\s+/g, "<")
      .replace(/\s+>/g, ">")
      .replace(/<\/\s+/g, "</")
      .replace(/['`]/g, '"'),
  ).toLowerCase();
}

type HtmlToken =
  | { kind: "open"; name: string; attrs: Record<string, string> }
  | { kind: "close"; name: string }
  | { kind: "text"; value: string };

function parseAttrs(raw: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const pattern = /([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(raw))) {
    const name = (match[1] ?? "").toLowerCase();
    if (!name) continue;
    attrs[name] = (match[2] ?? match[3] ?? match[4] ?? "").trim();
  }
  return attrs;
}

export function tokenizeHtml(html: string): HtmlToken[] {
  const source = normalizeMarkup(html);
  const tokens: HtmlToken[] = [];
  const tag = /<\/?([a-z0-9]+)([^>]*)>/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = tag.exec(source))) {
    const text = source.slice(last, match.index).trim();
    if (text) tokens.push({ kind: "text", value: text });
    const name = match[1] ?? "";
    const closing = match[0].startsWith("</");
    if (closing) tokens.push({ kind: "close", name });
    else tokens.push({ kind: "open", name, attrs: parseAttrs(match[2] ?? "") });
    last = match.index + match[0].length;
  }
  const tail = source.slice(last).trim();
  if (tail) tokens.push({ kind: "text", value: tail });
  return tokens;
}

/** Implied </li> before the next <li> or list close; drop void-element closes. */
function canonicalizeTokens(tokens: HtmlToken[]): HtmlToken[] {
  const voidTags = new Set(["img", "input", "br", "hr", "meta", "link"]);
  const out: HtmlToken[] = [];
  let openLi = false;
  for (const token of tokens) {
    if (token.kind === "open" && token.name === "li") {
      if (openLi) out.push({ kind: "close", name: "li" });
      openLi = true;
      out.push(token);
      continue;
    }
    if (token.kind === "close" && token.name === "li") {
      openLi = false;
      out.push(token);
      continue;
    }
    if (
      token.kind === "close" &&
      (token.name === "ul" || token.name === "ol") &&
      openLi
    ) {
      out.push({ kind: "close", name: "li" });
      openLi = false;
      out.push(token);
      continue;
    }
    if (token.kind === "close" && voidTags.has(token.name)) continue;
    out.push(token);
  }
  if (openLi) out.push({ kind: "close", name: "li" });
  return out;
}

function canonicalHtml(html: string): string {
  return canonicalizeTokens(tokenizeHtml(html))
    .map((token) => {
      if (token.kind === "text") return token.value;
      if (token.kind === "close") return `</${token.name}>`;
      const attrs = Object.keys(token.attrs)
        .sort()
        .map((name) => `${name}="${token.attrs[name]}"`)
        .join(" ");
      return attrs ? `<${token.name} ${attrs}>` : `<${token.name}>`;
    })
    .join("");
}

function textsSimilar(expected: string, actual: string): boolean {
  const left = collapseSpace(expected).toLowerCase();
  const right = collapseSpace(actual).toLowerCase();
  if (left === right) return true;
  return tokensSimilar(left, right);
}

function hasSimilarText(html: string, expected: string): boolean {
  const texts = tokenizeHtml(html)
    .filter((token): token is Extract<HtmlToken, { kind: "text" }> => token.kind === "text")
    .map((token) => token.value);
  if (texts.some((text) => textsSimilar(expected, text))) return true;
  return textsSimilar(expected, html);
}

function hasTag(html: string, tag: string): boolean {
  return tokenizeHtml(html).some(
    (token) => token.kind === "open" && token.name === normalizeToken(tag),
  );
}

function hasAttr(
  html: string,
  spec: { tag?: string; name: string; value?: string },
): boolean {
  return tokenizeHtml(html).some((token) => {
    if (token.kind !== "open") return false;
    if (spec.tag && token.name !== normalizeToken(spec.tag)) return false;
    const match = Object.keys(token.attrs).find((attrName) =>
      tokensSimilar(spec.name, attrName),
    );
    if (match === undefined) return false;
    if (spec.value == null) return true;
    return textsSimilar(spec.value, token.attrs[match] ?? "");
  });
}

function normalizeCode(input: string): string {
  return collapseSpace(
    input
      .replace(/\r\n/g, "\n")
      .replace(/\/\/[^\n]*/g, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/['`]/g, '"')
      .replace(/;+\s*/g, ";")
      .replace(/\s*([{}():,=])\s*/g, "$1"),
  ).toLowerCase();
}

function hasToken(code: string, token: string): boolean {
  const haystack = normalizeCode(code);
  const needle = normalizeToken(token);
  if (haystack.includes(needle)) return true;
  const parts = haystack.split(/[^a-z0-9_-]+/);
  return parts.some((part) => tokensSimilar(needle, part));
}

function scoreFromChecks(question: CodingQuestion, student: string): number | null {
  const checks = question.checks;
  if (!checks) return null;
  const parts: boolean[] = [];
  for (const tag of checks.requiredTags ?? []) parts.push(hasTag(student, tag));
  for (const text of checks.requiredText ?? []) parts.push(hasSimilarText(student, text));
  for (const attr of checks.requiredAttrs ?? []) parts.push(hasAttr(student, attr));
  for (const token of checks.requiredTokens ?? []) parts.push(hasToken(student, token));
  if (!parts.length) return null;
  return parts.filter(Boolean).length / parts.length;
}

function scoreHtmlImplement(question: CodingQuestion, student: string): LocalCodingGrade {
  const expected = question.referenceSolution;
  if (canonicalHtml(student) === canonicalHtml(expected)) {
    return { score: 1, feedback: "Matches the expected markup (lenient)." };
  }
  const fromChecks = scoreFromChecks(question, student);
  if (fromChecks != null) {
    if (fromChecks >= 0.999) {
      return { score: 1, feedback: "Required tags and text are present (lenient)." };
    }
    if (fromChecks <= 0) {
      return { score: 0, feedback: "The snippet is missing the required markup." };
    }
    return {
      score: fromChecks,
      feedback: "Some of the required markup is present.",
    };
  }
  return { score: 0, feedback: "Could not match the expected markup." };
}

function scoreTokenImplement(question: CodingQuestion, student: string): LocalCodingGrade {
  if (normalizeCode(student) === normalizeCode(question.referenceSolution)) {
    return { score: 1, feedback: "Matches the reference (lenient)." };
  }
  const fromChecks = scoreFromChecks(question, student);
  if (fromChecks != null) {
    if (fromChecks >= 0.999) {
      return { score: 1, feedback: "Required pieces are present (lenient)." };
    }
    if (fromChecks <= 0) {
      return { score: 0, feedback: "The snippet is missing the required pieces." };
    }
    return { score: fromChecks, feedback: "Some of the required pieces are present." };
  }
  return { score: 0, feedback: "Could not match the expected snippet." };
}

export function scoreCodingLocally(
  question: CodingQuestion,
  input: { code?: string; blanks?: string[] },
): LocalCodingGrade {
  if (question.style === "fib") {
    const blanks =
      input.blanks ??
      (question.blankCount
        ? Array.from({ length: question.blankCount }, () => "")
        : []);
    if (blanks.every((blank) => !blank.trim()) && input.code?.trim() && question.code) {
      return scoreCodingBlanks(
        question.acceptedBlanks ?? [],
        recoverBlanksFromCode(question.code, input.code, question.blankCount ?? 0),
      );
    }
    return scoreCodingBlanks(question.acceptedBlanks ?? [], blanks);
  }
  const code = input.code?.trim() ?? "";
  if (!code) return { score: 0, feedback: "No code submitted." };
  if (question.language === "html") return scoreHtmlImplement(question, code);
  return scoreTokenImplement(question, code);
}

function recoverBlanksFromCode(
  template: string,
  filled: string,
  blankCount: number,
): string[] {
  const escaped = template.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`^${escaped.replace(BLANK_MARK, "(.+?)")}$`, "i");
  const match = collapseSpace(filled).match(pattern);
  if (!match) return Array.from({ length: blankCount }, () => "");
  return Array.from({ length: blankCount }, (_, index) => match[index + 1] ?? "");
}
