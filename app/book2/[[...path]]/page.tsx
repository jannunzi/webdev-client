import { notFound } from "next/navigation";
import Chapter1 from "@/app/book/ch1/Chapter1";
import Chapter2 from "@/app/book/ch2/Chapter2";
import Chapter3 from "@/app/book/ch3/Chapter3";
import Chapter4 from "@/app/book/ch4/Chapter4";
import Chapter5 from "@/app/book/ch5/Chapter5";
import Chapter6 from "@/app/book/ch6/Chapter6";
import { PracticeQuizArticle } from "@/app/book/practice/[quizId]/page";
import { PracticeIndex } from "@/app/book/practice/page";
import { getPracticeQuiz } from "@/app/book/quizzes/registry";
import { composeDraft } from "@/lib/book-editor/book2-compose";
import { book2View } from "@/lib/book-editor/book2-path";
import { readChapter } from "@/lib/book-editor/handle";
import { chapter1Supplements } from "@/lib/book-editor/source-catalog";
import { openChapterStore } from "@/lib/book-editor/resolve";
import { canSeeBook2 } from "@/lib/book-editor/preview-access";
import Book2Chapter1 from "../chapter1-edit";
import ChapterPager from "../chapter-pager";
import ComposedDraft from "../composed-draft";
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
  const chapter1 = path.length === 1 && path[0] === "ch1";
  const payload = chapter1 ? await readChapter(await openChapterStore()) : null;
  const view = book2View(path, Boolean(payload?.persisted));
  if (view.kind === "missing") notFound();
  if (view.kind === "home") return <Book2Home />;
  if (view.kind === "practice") {
    return (
      <>
        <SourceNote source="practice" title="Published practice quizzes.">
          These are the same ungraded quizzes as the public book. Chapter links and opening a quiz stay in book2.
        </SourceNote>
        <PracticeIndex linkBase="/book2" />
      </>
    );
  }
  if (view.kind === "practice-quiz") {
    const quiz = getPracticeQuiz(view.quizId);
    if (!quiz) notFound();
    return (
      <>
        <SourceNote source="practice" title="Published practice quiz.">
          This is the public self-check. Links back to a chapter or the practice list stay in book2.
        </SourceNote>
        <PracticeQuizArticle quiz={quiz} linkBase="/book2" />
      </>
    );
  }
  if (chapter1 && payload) {
    const reading = payload.persisted ? (
      <>
        <SourceNote source="draft" title="Saved Chapter 1 draft.">
          {`Read-only until you press Edit. Saved at ${payload.updatedAt}. Slide links, video links, real tables, the practice card, and the assignment demos are labeled published blocks and do not replace text you changed. The public book at /book/ch1 is unchanged.`}
        </SourceNote>
        <ComposedDraft pieces={composeDraft(payload.doc, chapter1Supplements())} />
      </>
    ) : (
      <>
        <SourceNote source="published" title="Published chapter.">
          Chapter 1 has no saved draft, so this reading view is the published chapter. Edit stores a draft in the chapter editor document. The public book stays unchanged.
        </SourceNote>
        <Chapter1 />
      </>
    );
    return (
      <Book2Chapter1 initial={payload}>
        {reading}
        <ChapterPager chapter={1} />
      </Book2Chapter1>
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
        {`${publishedText} Links to other chapters, section anchors, and practice stay in book2.`}
      </SourceNote>
      <Published />
      <ChapterPager chapter={view.chapter} />
    </>
  );
}
