import type { JSONContent } from "@tiptap/core";

export type BookBase = "/book" | "/book2";

export const BOOK2_CHAPTERS = [
  { chapter: 1, label: "Chapter 1 — HTML" },
  { chapter: 2, label: "Chapter 2 — CSS & Tailwind" },
  { chapter: 3, label: "Chapter 3 — JavaScript" },
  { chapter: 4, label: "Chapter 4 — Client State" },
  { chapter: 5, label: "Chapter 5 — Express REST APIs" },
  { chapter: 6, label: "Chapter 6 — MongoDB" },
] as const;

export type BookChapterNumber = (typeof BOOK2_CHAPTERS)[number]["chapter"];

export type Book2View =
  | { kind: "home" }
  | { kind: "practice" }
  | { kind: "draft"; chapter: 1 }
  | { kind: "published"; chapter: BookChapterNumber }
  | { kind: "missing" };

/** Keep a book URL inside the public book or the staff preview. */
export function rewriteBookPath(href: string, base: BookBase): string {
  if (base === "/book") return href;
  return href.replace(/^\/book(?=\/|#|$)/, "/book2");
}

export function book2View(path: readonly string[], savedChapter1: boolean): Book2View {
  if (path.length === 0) return { kind: "home" };
  if (path.length === 1 && path[0] === "practice") return { kind: "practice" };
  if (path.length !== 1) return { kind: "missing" };
  const match = /^ch([1-6])$/.exec(path[0] ?? "");
  if (!match) return { kind: "missing" };
  const chapter = Number(match[1]) as BookChapterNumber;
  if (chapter === 1 && savedChapter1) return { kind: "draft", chapter: 1 };
  return { kind: "published", chapter };
}

export function chapterPager(chapter: BookChapterNumber, base: BookBase = "/book2") {
  const index = BOOK2_CHAPTERS.findIndex((item) => item.chapter === chapter);
  const previous = index > 0 ? BOOK2_CHAPTERS[index - 1] : null;
  const next =
    index >= 0 && index < BOOK2_CHAPTERS.length - 1 ? BOOK2_CHAPTERS[index + 1] : null;
  return {
    previous: previous
      ? { href: rewriteBookPath(`/book/ch${previous.chapter}`, base), label: previous.label }
      : null,
    next: next
      ? { href: rewriteBookPath(`/book/ch${next.chapter}`, base), label: next.label }
      : null,
  };
}

export function unsupportedNames(doc: JSONContent): string[] {
  const names: string[] = [];
  const walk = (node: JSONContent) => {
    if (node.type === "unsupported") {
      const name = typeof node.attrs?.name === "string" && node.attrs.name.trim()
        ? node.attrs.name.trim()
        : "block";
      if (!names.includes(name)) names.push(name);
    }
    for (const child of node.content ?? []) walk(child);
  };
  walk(doc);
  return names;
}
