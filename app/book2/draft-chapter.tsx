import type { JSONContent } from "@tiptap/core";
import Link from "next/link";
import type { ReactNode } from "react";
import BookFigure from "@/app/book/components/BookFigure";
import { rewriteBookPath } from "@/lib/book-editor/book2-path";
import { safeHref } from "@/lib/book-editor/schema";
import DraftEmbed from "./draft-embed";

export default function DraftChapter({ doc }: { doc: JSONContent }) {
  return (
    <article className="book-content" data-book-source="draft">
      {(doc.content ?? []).map((node, index) => (
        <DraftNode key={index} node={node} />
      ))}
    </article>
  );
}

function DraftNode({ node }: { node: JSONContent }) {
  switch (node.type) {
    case "paragraph":
      return <p>{inline(node.content)}</p>;
    case "heading":
      return <DraftHeading node={node} />;
    case "bulletList":
      return <ul className="list-disc pl-6">{listItems(node)}</ul>;
    case "orderedList":
      return <ol className="list-decimal pl-6">{listItems(node)}</ol>;
    case "listItem":
      return <li>{blocks(node.content)}</li>;
    case "blockquote":
      return (
        <blockquote className="border-l-4 border-neutral-300 pl-4">
          {blocks(node.content)}
        </blockquote>
      );
    case "codeBlock":
      return <DraftCode node={node} />;
    case "bookFigure":
      return <DraftFigure node={node} />;
    case "bookEmbed":
      return (
        <DraftEmbed
          component={typeof node.attrs?.component === "string" ? node.attrs.component : ""}
          name={
            typeof node.attrs?.name === "string" && node.attrs.name
              ? node.attrs.name
              : typeof node.attrs?.component === "string"
                ? node.attrs.component
                : "Demo"
          }
        />
      );
    case "unsupported":
      return <DraftGap node={node} />;
    case "hardBreak":
      return <br />;
    default:
      return (
        <DraftGap
          node={{
            type: "unsupported",
            attrs: { name: node.type ?? "block", reason: "This block is not part of the saved draft." },
          }}
        />
      );
  }
}

function DraftHeading({ node }: { node: JSONContent }) {
  const level = headingLevel(node.attrs?.level);
  const id = typeof node.attrs?.id === "string" && node.attrs.id ? node.attrs.id : undefined;
  const className = `scroll-mt-24 font-sans font-semibold ${headingSize(level)}`;
  const children = inline(node.content);
  if (level === 1) return <h1 id={id} className={className}>{children}</h1>;
  if (level === 2) return <h2 id={id} className={className}>{children}</h2>;
  if (level === 3) return <h3 id={id} className={className}>{children}</h3>;
  if (level === 4) return <h4 id={id} className={className}>{children}</h4>;
  if (level === 5) return <h5 id={id} className={className}>{children}</h5>;
  return <h6 id={id} className={className}>{children}</h6>;
}

function DraftCode({ node }: { node: JSONContent }) {
  const language = typeof node.attrs?.language === "string" ? node.attrs.language : "text";
  const text = (node.content ?? []).map((child) => child.text ?? "").join("");
  return (
    <div className="book-code-block book-code-block-plain my-4">
      <div className="book-code-block-body">
        <pre>
          <code data-language={language}>{text}</code>
        </pre>
      </div>
    </div>
  );
}

function DraftFigure({ node }: { node: JSONContent }) {
  const src = typeof node.attrs?.src === "string" ? node.attrs.src : "";
  const alt = typeof node.attrs?.alt === "string" ? node.attrs.alt : "";
  const caption = typeof node.attrs?.caption === "string" ? node.attrs.caption : undefined;
  const id = typeof node.attrs?.id === "string" ? node.attrs.id : undefined;
  if (!src.startsWith("/") || src.startsWith("//") || src.includes("..")) {
    return (
      <DraftGap
        node={{
          type: "unsupported",
          attrs: { name: "BookFigure", reason: "This figure has no site image path." },
        }}
      />
    );
  }
  return <BookFigure src={src} alt={alt} caption={caption} id={id} />;
}

function DraftGap({ node }: { node: JSONContent }) {
  const name = typeof node.attrs?.name === "string" && node.attrs.name ? node.attrs.name : "block";
  const reason = typeof node.attrs?.reason === "string" ? node.attrs.reason : "";
  return (
    <aside
      data-unsupported={name}
      className="my-4 rounded border border-amber-300 bg-amber-50 px-3 py-2 font-sans text-sm text-amber-950"
    >
      <p className="m-0 font-semibold">{name}</p>
      {reason ? <p className="mb-0 mt-1">{reason}</p> : null}
      <p className="mb-0 mt-1 text-amber-900">
        This stays a named gap. The published chapter still has the original block.
      </p>
    </aside>
  );
}

function listItems(node: JSONContent) {
  return (node.content ?? []).map((child, index) => (
    <DraftNode key={index} node={child.type === "listItem" ? child : { type: "listItem", content: [child] }} />
  ));
}

function blocks(content: JSONContent[] | undefined) {
  return (content ?? []).map((child, index) => <DraftNode key={index} node={child} />);
}

function inline(content: JSONContent[] | undefined): ReactNode {
  return (content ?? []).map((node, index) => {
    if (node.type === "hardBreak") return <br key={index} />;
    if (node.type !== "text") return <DraftNode key={index} node={node} />;
    return <span key={index}>{applyMarks(node.text ?? "", node.marks)}</span>;
  });
}

function applyMarks(text: string, marks: JSONContent["marks"]): ReactNode {
  return (marks ?? []).reduce<ReactNode>((child, mark) => {
    if (mark.type === "bold") return <strong>{child}</strong>;
    if (mark.type === "italic") return <em>{child}</em>;
    if (mark.type === "underline") return <u>{child}</u>;
    if (mark.type === "code") return <code>{child}</code>;
    if (mark.type === "link") {
      const raw = typeof mark.attrs?.href === "string" ? mark.attrs.href : "";
      if (!safeHref(raw)) return child;
      return <DraftLink href={rewriteBookPath(raw, "/book2")}>{child}</DraftLink>;
    }
    return child;
  }, text);
}

function DraftLink({ href, children }: { href: string; children: ReactNode }) {
  if (href.startsWith("/") || href.startsWith("#")) {
    return <Link href={href}>{children}</Link>;
  }
  return <a href={href}>{children}</a>;
}

function headingLevel(value: unknown): 1 | 2 | 3 | 4 | 5 | 6 {
  if (value === 1 || value === 2 || value === 3 || value === 4 || value === 5 || value === 6) return value;
  return 2;
}

function headingSize(level: 1 | 2 | 3 | 4 | 5 | 6): string {
  if (level === 1) return "text-3xl";
  if (level === 2) return "text-xl";
  if (level === 3) return "text-lg";
  return "text-base";
}
