import type { ReactNode } from "react";

const TOKEN =
  /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

function renderToken(token: string, key: number): ReactNode {
  if (token.startsWith("**") && token.endsWith("**")) {
    return (
      <strong key={key} className="font-semibold">
        {token.slice(2, -2)}
      </strong>
    );
  }
  if (token.startsWith("`") && token.endsWith("`")) {
    return <code key={key}>{token.slice(1, -1)}</code>;
  }
  const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  if (link) {
    const [, label, href] = link;
    const external = href.startsWith("http");
    return (
      <a
        key={key}
        href={href}
        {...(external
          ? { target: "_blank", rel: "noreferrer" }
          : undefined)}
      >
        {label}
      </a>
    );
  }
  return token;
}

export default function SlideText({ text }: { text: string }) {
  const parts = text.split(TOKEN);
  return (
    <>
      {parts.map((part, index) =>
        part ? renderToken(part, index) : null,
      )}
    </>
  );
}
