import type { ReactNode } from "react";
import PromptMarkup from "./PromptMarkup";

/**
 * Choice letter stays outside pretty-printed markup so the first HTML
 * line keeps its indent (A/B/C must not prefix the `<pre>` contents).
 */
export default function ChoiceContent({
  letter,
  text,
  after,
}: {
  letter: string;
  text: string;
  after?: ReactNode;
}) {
  const multiline = text.includes("\n");

  return (
    <div className="flex min-w-0 flex-1 items-start gap-2">
      <span className="mt-0.5 shrink-0 font-mono text-xs uppercase text-neutral-500">
        {letter}.
      </span>
      {multiline ? (
        <pre className="m-0 min-w-0 flex-1 overflow-x-auto rounded border border-neutral-200 bg-white px-2 py-1.5 font-mono text-[0.8rem] leading-relaxed whitespace-pre">
          <code>{text}</code>
        </pre>
      ) : (
        <PromptMarkup as="span" text={text} className="min-w-0 break-words" />
      )}
      {after}
    </div>
  );
}
