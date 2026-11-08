import { highlightCodeToHtml } from "@/lib/code-block/highlight";
import type { JSONContent } from "@tiptap/core";

/** Reading view. Line numbers come from the highlighter chrome, not the saved text. */
export default async function HighlightedCode({ node }: { node: JSONContent }) {
  const code = (node.content ?? []).map((child) => (child.type === "text" ? child.text ?? "" : "")).join("");
  const language = typeof node.attrs?.language === "string" && node.attrs.language ? node.attrs.language : "text";
  const file = typeof node.attrs?.file === "string" ? node.attrs.file : "";
  const name = typeof node.attrs?.name === "string" ? node.attrs.name : "";
  const html = await highlightCodeToHtml({
    code,
    language,
    lineNumbers: true,
  });
  return (
    <div className="book-code-block my-4 overflow-hidden rounded border border-neutral-300" data-language={language}>
      {file || name ? (
        <div className="border-b border-neutral-700 bg-[#161b22] px-3 py-1.5 font-sans text-xs text-neutral-200">
          {name ? <span className="font-medium">{name}</span> : null}
          {name && file ? " " : null}
          {file ? <span className="text-neutral-400">{file}</span> : null}
        </div>
      ) : null}
      <div
        className="book-code-block-body book-code-block-lined overflow-x-auto text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
