/**
 * Branded posters for the HTML §1.3 pilot (G2).
 * Solid #E34F26, white HTML5 mark and “HTML” together at the top left,
 * centered Oswald Bold topic, WebDevTV at the bottom left.
 * Every other clip keeps `youtubeThumbUrl` (`img.youtube.com/.../hqdefault.jpg`).
 * Keys are book TOC ids from `lecture-clips.json`, not YouTube ids — several
 * sections share one recording, and each card still needs its own title.
 */
export const HTML_1_3_POSTERS: Record<string, string> = {
  "sec-1-3": "/videos/thumbs/html-1-3/01-html-overview.jpg",
  "sec-1-3-1": "/videos/thumbs/html-1-3/02-headings-div.jpg",
  "sec-1-3-2": "/videos/thumbs/html-1-3/03-paragraphs.jpg",
  "sec-1-3-3": "/videos/thumbs/html-1-3/04-lists.jpg",
  "sec-1-3-6": "/videos/thumbs/html-1-3/05-html-forms.jpg",
  "sec-1-3-6-1": "/videos/thumbs/html-1-3/06-text-inputs.jpg",
  "sec-1-3-9": "/videos/thumbs/html-1-3/07-anchors.jpg",
  "sec-1-3-11": "/videos/thumbs/html-1-3/08-layouts.jpg",
};

/** Local poster for a pilot section, or null so the hub uses the YouTube still. */
export function brandedPosterUrl(bookSectionId: string): string | null {
  return HTML_1_3_POSTERS[bookSectionId] ?? null;
}
