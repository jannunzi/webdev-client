import type { ReactNode } from "react";
import { highlightCodeToHtml } from "@/lib/code-block/highlight";
import type { CodeLineMarks } from "@/lib/code-block/lines";
import CopyButton from "./CopyButton";

function normalizeCode(children: ReactNode): string {
  if (typeof children === "string") {
    return children.replace(/^\n/, "").replace(/\n$/, "");
  }
  if (Array.isArray(children)) {
    return children.map((child) => normalizeCode(child)).join("");
  }
  if (children == null || typeof children === "boolean") return "";
  return String(children);
}

/**
 * File snippets: pass `file` (and optionally `name`) for path header, copy, line numbers.
 * Terminal / illustrative snippets: omit `file` — no title, copy, or line numbers.
 * Pass `highlightLines` / `addedLines` (1-based) to call out what changed.
 */
export default async function CodeBlock({
  children,
  language = "tsx",
  name,
  file,
  highlightLines,
  addedLines,
}: {
  children: ReactNode;
  language?: string;
  /** Function / component name, e.g. Lab1 */
  name?: string;
  /** Path where students write the code, e.g. app/labs/lab1/page.tsx */
  file?: string;
  highlightLines?: CodeLineMarks;
  addedLines?: CodeLineMarks;
}) {
  const code = normalizeCode(children);
  const isFile = Boolean(file || name);
  const showLines =
    isFile || Boolean(highlightLines?.length || addedLines?.length);

  const html = await highlightCodeToHtml({
    code,
    language,
    lineNumbers: showLines,
    highlightLines,
    addedLines,
  });

  return (
    <div className="book-code-block relative my-4 w-full max-w-full overflow-hidden rounded border border-neutral-300">
      {isFile ? (
        <div className="book-code-block-header flex items-center justify-between gap-2 border-b border-neutral-700 bg-[#161b22] px-3 py-1.5 font-sans">
          <span className="flex min-w-0 items-baseline gap-2">
            {name ? (
              <span className="truncate text-xs font-medium text-neutral-200">
                {name}
              </span>
            ) : null}
            {file ? (
              <span className="truncate font-mono text-xs text-neutral-400">
                {file}
              </span>
            ) : null}
          </span>
          <CopyButton code={code} />
        </div>
      ) : null}
      <div
        className={`book-code-block-body overflow-x-auto text-sm leading-relaxed ${
          showLines ? "book-code-block-lined" : "book-code-block-plain"
        }`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
