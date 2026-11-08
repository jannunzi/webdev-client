"use client";

import { BOOK_EMBEDS } from "@/lib/book-editor/embed-registry";

export default function DraftEmbed({
  component,
  name,
}: {
  component: string;
  name: string;
}) {
  const Demo = component ? BOOK_EMBEDS[component] : undefined;
  return (
    <figure className="book-live-demo my-4" data-book-embed={component || "missing"}>
      <figcaption className="mb-2 font-sans text-sm text-neutral-600">{name}</figcaption>
      {Demo ? (
        <Demo />
      ) : (
        <p className="m-0 text-sm">This demo is not registered, so it is not replaced with other content.</p>
      )}
    </figure>
  );
}
