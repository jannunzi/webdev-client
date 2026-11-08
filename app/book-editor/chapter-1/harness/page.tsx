import { notFound } from "next/navigation";
import { readChapter } from "@/lib/book-editor/handle";
import { openChapterStore } from "@/lib/book-editor/resolve";
import { storagePlan } from "@/lib/book-editor/store";
import ChapterEditor from "../editor";
import "@/app/book/book.css";

export const dynamic = "force-dynamic";

/**
 * Local browser check only. Production always 404s, even if the env var is set.
 * The staff route remains /book-editor/chapter-1.
 */
export default async function ChapterEditorHarnessPage() {
  if (process.env.NODE_ENV === "production" || process.env.BOOK_EDITOR_HARNESS !== "1") notFound();
  const initial = await readChapter(await openChapterStore(), storagePlan());
  return (
    <main className="book-shell">
      <article className="book-content px-6 py-8">
        <ChapterEditor initial={initial} />
      </article>
    </main>
  );
}
