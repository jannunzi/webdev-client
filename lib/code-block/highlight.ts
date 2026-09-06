import { codeToHtml, type BundledLanguage } from "shiki";
import { expandLineMarks, type CodeLineMarks } from "./lines";

const LANG_ALIASES: Record<string, string> = {
  text: "plaintext",
  txt: "plaintext",
  plain: "plaintext",
  shell: "bash",
  sh: "bash",
  js: "javascript",
  ts: "typescript",
};

export function resolveHighlightLanguage(language?: string): string {
  const raw = (language ?? "tsx").trim() || "tsx";
  return LANG_ALIASES[raw] ?? raw;
}

export async function highlightCodeToHtml({
  code,
  language = "tsx",
  lineNumbers = false,
  highlightLines,
  addedLines,
}: {
  code: string;
  language?: string;
  lineNumbers?: boolean;
  highlightLines?: CodeLineMarks;
  addedLines?: CodeLineMarks;
}): Promise<string> {
  const highlighted = expandLineMarks(highlightLines);
  const added = expandLineMarks(addedLines);
  const markLines =
    lineNumbers || highlighted.size > 0 || added.size > 0;
  const lang = resolveHighlightLanguage(language);
  const transformers = markLines
    ? [
        {
          line(node: { properties: Record<string, unknown> }, line: number) {
            node.properties["data-line"] = String(line);
            const classes = new Set(
              String(node.properties.class ?? "")
                .split(/\s+/)
                .filter(Boolean),
            );
            if (highlighted.has(line)) classes.add("line-highlight");
            if (added.has(line)) classes.add("line-added");
            node.properties.class = [...classes].join(" ");
          },
        },
      ]
    : [];

  try {
    return await codeToHtml(code, {
      lang: lang as BundledLanguage,
      theme: "github-dark",
      transformers,
    });
  } catch {
    return await codeToHtml(code, {
      lang: "plaintext",
      theme: "github-dark",
      transformers,
    });
  }
}
