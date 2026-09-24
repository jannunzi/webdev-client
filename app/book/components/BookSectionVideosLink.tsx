import Link from "next/link";
import { bookSectionHasClip } from "@/lib/videos/map";
import { videosHref } from "@/lib/videos/query";

/**
 * Book → videos cross-link. Same placement and label style as
 * `BookSectionSlidesLink`. Renders only when this TOC id has a clip.
 */
export default function BookSectionVideosLink({
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
      Videos
    </Link>
  );
}
