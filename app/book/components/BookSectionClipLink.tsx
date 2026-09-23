import Link from "next/link";
import { bookSectionHasClip } from "@/lib/videos/map";
import { videosHref } from "@/lib/videos/query";

/**
 * Book → /videos cross-link. Renders only when the derived map has a clip
 * for this TOC id. The videos page applies section and semester fallback.
 */
export default function BookSectionClipLink({
  sectionId,
}: {
  sectionId: string;
}) {
  if (!bookSectionHasClip(sectionId)) return null;

  return (
    <Link
      href={videosHref(sectionId)}
      className="font-sans text-sm font-medium text-blue-700 no-underline hover:underline"
    >
      Watch lecture clip
    </Link>
  );
}
