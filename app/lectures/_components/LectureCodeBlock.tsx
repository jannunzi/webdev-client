"use client";

import { useState } from "react";
import type { LectureCodeBlock as LectureCodeBlockData } from "@/lib/lectures/types";

export default function LectureCodeBlock({
  block,
}: {
  block: LectureCodeBlockData;
}) {
  const language = block.language ?? "tsx";
  const [copied, setCopied] = useState(false);

  function fallbackCopy(text: string) {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.left = "-9999px";
    document.body.appendChild(field);
    field.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(field);
    if (!ok) throw new Error("copy failed");
  }

  async function copyCode() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(block.code);
      } else {
        fallbackCopy(block.code);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      try {
        fallbackCopy(block.code);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      } catch {
        setCopied(false);
      }
    }
  }

  return (
    <div className="book-code-block relative my-5 w-full max-w-full overflow-hidden rounded border border-neutral-300">
      <div className="book-code-block-header flex items-center justify-between gap-2 border-b border-neutral-700 bg-[#161b22] px-3 py-2 font-sans">
        <span className="truncate font-mono text-sm text-neutral-400 md:text-base">
          {block.file ?? language}
        </span>
        <div className="flex shrink-0 items-center gap-2">
          {block.file ? (
            <span className="font-mono text-xs uppercase tracking-wide text-neutral-500 md:text-sm">
              {language}
            </span>
          ) : null}
          <button
            type="button"
            className="rounded border border-neutral-500 bg-neutral-800 px-2.5 py-1 font-sans text-sm text-neutral-100 hover:bg-neutral-700"
            onClick={() => void copyCode()}
            aria-label={copied ? "Copied to clipboard" : "Copy code"}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </p>
      <pre className="book-code-block-body book-code-block-plain m-0 overflow-x-auto bg-[#0d1117] p-5 leading-relaxed text-neutral-100 !text-[1.4rem] md:!text-[1.65rem] [&_code]:!text-[1em]">
        <code>{block.code}</code>
      </pre>
    </div>
  );
}
