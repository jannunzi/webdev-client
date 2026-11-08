import type { DraftPiece } from "@/lib/book-editor/book2-compose";
import { DraftNode } from "./draft-chapter";
import { SourceSupplement } from "./source-blocks";

export default function ComposedDraft({ pieces }: { pieces: DraftPiece[] }) {
  const appendixAt = pieces.findIndex((piece) => piece.kind === "supplement" && piece.placement === "appendix");
  return (
    <article className="book-content" data-book-source="draft">
      {pieces.map((piece, index) => {
        if (piece.kind === "node") return <DraftNode key={index} node={piece.node} />;
        return (
          <div key={`${piece.item.id}:${piece.placement}`}>
            {index === appendixAt ? (
              <h2 className="mt-10 font-sans text-xl font-semibold">Published source not anchored in this draft</h2>
            ) : null}
            <SourceSupplement item={piece.item} placement={piece.placement} />
          </div>
        );
      })}
    </article>
  );
}
