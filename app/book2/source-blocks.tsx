import BookSectionSlidesLink from "@/app/book/components/BookSectionSlidesLink";
import BookSectionVideosLink from "@/app/book/components/BookSectionVideosLink";
import PracticeCard from "@/app/book/components/PracticeCard";
import AssignmentsStep from "@/app/book/ch1/embeds/assignments-step/Assignments";
import AssignmentsFinished from "@/app/book/ch1/embeds/assignments-finished/Assignments";
import AccountNavigation from "@/app/book/ch1/embeds/_styled/AccountNavigation";
import DemoSignin from "@/app/book/ch1/embeds/DemoSignin";
import type { TableCell } from "@/lib/book-editor/source-catalog";
import { lectureTopicByBookSection, listDecksForBookSection } from "@/lib/lectures";
import { bookSectionHasClip } from "@/lib/videos/map";
import type { SupplementPlacement } from "@/lib/book-editor/book2-compose";
import type { Supplement } from "@/lib/book-editor/source-catalog";

const DEMO_PARAMS = Promise.resolve({ cid: "1234" });

export function SourceSupplement({
  item,
  placement,
}: {
  item: Supplement;
  placement: SupplementPlacement;
}) {
  if (item.kind === "slides" && !slidesExist(item.sectionId)) return null;
  if (item.kind === "videos" && !bookSectionHasClip(item.sectionId)) return null;
  return (
    <aside
      data-book-source="published"
      data-supplement={item.kind}
      data-placement={placement}
      className="my-4 rounded border border-sky-300 bg-sky-50 px-3 py-2"
    >
      <p className="mb-2 mt-0 font-sans text-xs font-semibold uppercase tracking-wide text-sky-900">
        {labelFor(item, placement)}
      </p>
      <SupplementBody item={item} />
    </aside>
  );
}

function SupplementBody({ item }: { item: Supplement }) {
  if (item.kind === "slides") return <BookSectionSlidesLink sectionId={item.sectionId} />;
  if (item.kind === "videos") return <BookSectionVideosLink sectionId={item.sectionId} />;
  if (item.kind === "practice") return <PracticeCard quizId={item.quizId} />;
  if (item.kind === "async-demo" && item.component === "AssignmentsStep") {
    return <AssignmentsStep params={DEMO_PARAMS} />;
  }
  if (item.kind === "async-demo") return <AssignmentsFinished params={DEMO_PARAMS} />;
  return <PublishedTable rows={item.rows} />;
}

export function PublishedTable({ rows }: { rows: TableCell[][] }) {
  const textual = rows.length > 0 && rows.every((row) => row.every((cell) => "text" in cell));
  const header = textual ? rows[0] ?? null : null;
  const body = textual ? rows.slice(1) : rows;
  return (
    <div className="my-2 overflow-x-auto">
      <table className="w-full border-collapse border border-neutral-400 text-left text-sm">
        {header ? (
          <thead>
            <tr className="bg-white">
              {header.map((cell, index) => (
                <th key={index} className="border border-neutral-400 px-2 py-1">
                  <TableCellView cell={cell} />
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {body.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, index) => (
                <td key={index} className="border border-neutral-400 px-2 py-1 align-top">
                  <TableCellView cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableCellView({ cell }: { cell: TableCell }) {
  if ("component" in cell) {
    if (cell.component === "AccountNavigation") return <AccountNavigation />;
    if (cell.component === "DemoSignin") return <DemoSignin />;
    return <code>{cell.component}</code>;
  }
  return cell.text;
}

function slidesExist(sectionId: string): boolean {
  return listDecksForBookSection(sectionId).length > 0 || Boolean(lectureTopicByBookSection(sectionId));
}

function labelFor(item: Supplement, placement: SupplementPlacement): string {
  if (placement === "appendix") return "Published source. This section heading is not in the saved draft.";
  if (item.kind === "table" && placement === "matched") {
    return "Published table. These cells match the saved draft, so those rows are not repeated.";
  }
  if (item.kind === "table") {
    return "Published table. The saved draft text stays as saved, and the table is shown beside it.";
  }
  if (item.kind === "practice" && placement === "matched") {
    return "Published practice card, in place of the draft placeholder.";
  }
  if (item.kind === "async-demo" && placement === "matched") {
    return "Published demo, in place of the draft placeholder.";
  }
  if (item.kind === "slides") return "Published slides link. The saved draft does not store this link.";
  if (item.kind === "videos") return "Published videos link. The saved draft does not store this link.";
  return "Published source, shown beside the saved draft.";
}
