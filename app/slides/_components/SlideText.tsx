import type { ReactNode } from "react";
import {
  inlineEditDataProps,
  textOf,
  type InlineLoc,
} from "@/lib/inline-edit/mark";

const TOKEN =
  /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|<strong>[\s\S]*?<\/strong>|<em>[\s\S]*?<\/em>)/g;

function renderParts(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(TOKEN);
  return parts.map((part, index) =>
    part ? renderToken(part, `${keyPrefix}-${index}`) : null,
  );
}

function renderToken(token: string, key: string): ReactNode {
  if (token.startsWith("**") && token.endsWith("**")) {
    return (
      <strong key={key} className="font-semibold">
        {token.slice(2, -2)}
      </strong>
    );
  }
  if (token.startsWith("<strong>") && token.endsWith("</strong>")) {
    return (
      <strong key={key} className="font-semibold">
        {renderParts(token.slice(8, -9), key)}
      </strong>
    );
  }
  if (token.startsWith("<em>") && token.endsWith("</em>")) {
    return <em key={key}>{renderParts(token.slice(4, -5), key)}</em>;
  }
  if (token.startsWith("`") && token.endsWith("`")) {
    return (
      <code
        key={key}
        data-edit-lock=""
        className="rounded bg-black/8 px-1.5 py-0.5 font-mono"
      >
        {token.slice(1, -1)}
      </code>
    );
  }
  const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  if (link) {
    const [, label, href] = link;
    const external = href.startsWith("http");
    return (
      <a
        key={key}
        href={href}
        data-edit-lock=""
        {...(external ? { target: "_blank", rel: "noreferrer" } : undefined)}
      >
        {label}
      </a>
    );
  }
  return token;
}

export default function SlideText({
  text,
  density = "spacious",
  loc,
  bare = false,
}: {
  text: string;
  density?: "dense" | "spacious";
  loc?: InlineLoc;
  /** Render the tokens with no wrapper so a parent heading can carry the locator. */
  bare?: boolean;
}) {
  const raw = textOf(text);
  const parts = renderParts(raw, "t");
  if (bare) return <>{parts}</>;
  return (
    <span data-slide-text-density={density} {...inlineEditDataProps(loc)}>
      {parts}
    </span>
  );
}
