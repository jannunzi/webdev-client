import { notFound } from "next/navigation";
import type { JSONContent } from "@tiptap/core";
import CourseSiteHeader from "@/app/course-info/CourseSiteHeader";
import BookTOC from "@/app/book/TOC";
import Book2Links from "@/app/book2/book2-links";
import Book2Chapter1 from "@/app/book2/chapter1-edit";
import ComposedDraft from "@/app/book2/composed-draft";
import { composeDraft } from "@/lib/book-editor/book2-compose";
import { chapter1Seed } from "@/lib/book-editor/seed";
import { book2FixtureEnabled } from "@/lib/book-editor/book2-path";
import { chapter1Supplements, type Supplement } from "@/lib/book-editor/source-catalog";
import "@/app/book/book.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "book2 fixture",
  robots: { index: false, follow: false },
};

/**
 * Local screenshot of the draft-plus-published-blocks reader.
 * Production always 404s. This page does not read or write a saved chapter.
 */
export default async function Book2FixturePage({
  searchParams,
}: {
  searchParams: Promise<{ doc?: string }>;
}) {
  if (!book2FixtureEnabled()) notFound();
  const { doc: which } = await searchParams;
  const supplements = which === "seed" ? chapter1Supplements() : fixtureSupplements(chapter1Supplements());
  const doc = which === "seed" ? chapter1Seed().doc : fixtureDoc(supplements);
  return (
    <div className="book-shell flex min-h-screen flex-col">
      <CourseSiteHeader />
      <div className="flex min-h-0 flex-1">
        <BookTOC base="/book2" />
        <main className="min-w-0 w-full flex-1 overflow-x-auto py-6">
          <div className="page-content px-4 sm:px-6">
            <Book2Links>
              <p
                role="note"
                data-book-source="fixture"
                className="rounded border border-amber-400 bg-amber-50 px-3 py-2 font-sans text-sm text-amber-950"
              >
                Fixture. Not a signed-in session and not a production save. doc=seed uses the checked-in Chapter 1 import only. Nothing is written.
              </p>
              <Book2Chapter1
                initial={{
                  ok: true,
                  id: "chapter-1",
                  revision: 0,
                  persisted: false,
                  doc,
                  storage: {
                    available: false,
                    kind: "unavailable",
                    message: "Fixture. Nothing is written.",
                  },
                  inventory: chapter1Seed().inventory,
                  updatedAt: null,
                }}
              >
                <ComposedDraft pieces={composeDraft(doc, supplements)} />
              </Book2Chapter1>
            </Book2Links>
          </div>
        </main>
      </div>
    </div>
  );
}

function fixtureSupplements(all: Supplement[]): Supplement[] {
  const slides = all.find((item) => item.kind === "slides" && item.sectionId === "intro");
  const videos = all.find((item) => item.kind === "videos");
  const table = all.find((item) => item.kind === "table" && item.lines.length >= 2);
  const practice = all.find((item) => item.kind === "practice");
  const step = all.find((item) => item.kind === "async-demo" && item.component === "AssignmentsStep");
  return [slides, videos, table, practice, step].filter((item): item is Supplement => Boolean(item));
}

function fixtureDoc(supplements: Supplement[]): JSONContent {
  const table = supplements.find((item) => item.kind === "table");
  const videos = supplements.find((item) => item.kind === "videos");
  const content: JSONContent[] = [
    heading("intro", "Introduction"),
      {
        type: "paragraph",
        content: [
          { type: "text", text: "Edited draft sentence that must stay. " },
          { type: "text", text: "const inline", marks: [{ type: "code" }] },
          { type: "text", text: " " },
          {
            type: "text",
            text: "Chapter 2 anchor",
            marks: [{ type: "link", attrs: { href: "/book/ch2#intro" } }],
          },
        ],
      },
      {
        type: "codeBlock",
        attrs: { language: "tsx" },
        content: [{ type: "text", text: "const visible = \"code\";" }],
      },
  ];
  if (videos) content.push(heading(videos.sectionId, "Text fields"));
  if (table && table.kind === "table") {
    content.push(heading(table.sectionId, "Table section"));
    table.lines.forEach((line, index) => {
      const text = index === table.lines.length - 1 ? `${line} edited` : line;
      content.push({ type: "paragraph", content: [{ type: "text", text }] });
    });
  }
  content.push({
    type: "unsupported",
    attrs: { name: "PracticeCard", reason: "The practice quiz stays on the published chapter." },
  });
  content.push({
    type: "unsupported",
    attrs: { name: "AssignmentsStep", reason: "This demo is an async server page." },
  });
  return { type: "doc", content };
}

function heading(id: string, text: string): JSONContent {
  return { type: "heading", attrs: { level: 2, id }, content: [{ type: "text", text }] };
}
