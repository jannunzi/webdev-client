/**
 * Every link on a slide opens in a new tab so the deck (and fullscreen
 * presenting) is never replaced. The slide's own navigation (Continue,
 * in-page #anchors) is left alone.
 */
export function slideLinkHrefToOpen(anchor: {
  getAttribute(name: string): string | null;
  closest(selector: string): unknown;
}): string | null {
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("javascript:")) return null;
  if (anchor.closest(".lecture-slide-continue, [data-slide-nav]")) return null;
  return href;
}

export function openSlideLinksInNewTab(event: {
  target: EventTarget | null;
  defaultPrevented: boolean;
  button?: number;
  preventDefault(): void;
}): void {
  if (event.defaultPrevented || (event.button ?? 0) !== 0) return;
  const target = event.target as Element | null;
  const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
  if (!anchor) return;
  const href = slideLinkHrefToOpen(anchor);
  if (!href) return;
  event.preventDefault();
  window.open(anchor.href || href, "_blank", "noopener,noreferrer");
}
