import { notFound } from "next/navigation";
import Chapter1 from "@/app/book/ch1/Chapter1";
import Chapter2 from "@/app/book/ch2/Chapter2";
import Chapter3 from "@/app/book/ch3/Chapter3";
import Chapter4 from "@/app/book/ch4/Chapter4";
import Chapter5 from "@/app/book/ch5/Chapter5";
import Chapter6 from "@/app/book/ch6/Chapter6";
import { PracticeIndex } from "@/app/book/practice/page";
import { loadSavedChapter1 } from "@/lib/book-editor/book2-load";
import { book2View, unsupportedNames } from "@/lib/book-editor/book2-path";
import { openChapterStore } from "@/lib/book-editor/resolve";
import { canSeeBook2 } from "@/lib/book-editor/preview-access";
import ChapterPager from "../chapter-pager";
import DraftChapter from "../draft-chapter";
import Book2Home from "../home";
import SourceNote from "../source-note";

export const dynamic = "force-dynamic";

const PUBLISHED = [Chapter1, Chapter2, Chapter3, Chapter4, Chapter5, Chapter6] as const;

export default async function Book2Page({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const [allowed, { path = [] }] = await Promise.all([canSeeBook2(), params]);
  if (!allowed) return null;
  const saved =
    path.length === 1 && path[0] === "ch1" ? await loadSavedChapter1(await openChapterStore()) : null;
  const view = book2View(path, saved != null);
  if (view.kind === "missing") notFound();
  if (view.kind === "home") return <Book2Home />;
  if (view.kind === "practice") {
    return (
      <>
        <SourceNote source="practice" title="Published practice quizzes.">
          These are the same ungraded quizzes as /book/practice. Chapter links stay in book2. Opening a quiz leaves this preview for the public quiz page.
        </SourceNote>
        <PracticeIndex linkBase="/book2" />
      </>
    );
  }
  if (view.kind === "draft" && saved) {
    const names = unsupportedNames(saved.doc);
    const gaps = names.length ? ` Named gaps in this draft: ${names.join(", ")}.` : "";
    return (
      <>
        <SourceNote source="draft" title="Saved Chapter 1 draft.">
          {`Read-only copy of the latest saved editor document (${saved.updatedAt}). It does not change /book/ch1. This document has no slide or video links and no real HTML tables.${gaps} Those pieces remain on the published chapter.`}
        </SourceNote>
        <DraftChapter doc={saved.doc} />
        <ChapterPager chapter={1} />
      </>
    );
  }
  const Published = PUBLISHED[view.chapter - 1];
  const publishedText =
    view.chapter === 1
      ? "Chapter 1 has no saved draft, so this is the published chapter from /book/ch1, including its tables, slide and video links, quizzes, figures, and demos."
      : `Chapter ${view.chapter} is not in the editor, so this is the published chapter from /book/ch${view.chapter}.`;
  return (
    <>
      <SourceNote source="published" title="Published chapter.">
        {publishedText}
      </SourceNote>
      <Published />
      <ChapterPager chapter={view.chapter} />
    </>
  );
}
