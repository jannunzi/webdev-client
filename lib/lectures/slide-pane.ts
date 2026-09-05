/** Pixels of leftover scroll that still count as “fits” (sub-pixel / border). */
const OVERFLOW_SLOP = 2;

/**
 * True when the slide content pane is taller than its viewport.
 * Used by LectureDeckShell: ArrowUp/ArrowDown scroll this pane when
 * overflowing; otherwise they change slides. Left/Right always change slides.
 */
export function slidePaneOverflows(
  el: { scrollHeight: number; clientHeight: number } | null,
): boolean {
  if (!el) return false;
  return el.scrollHeight - el.clientHeight > OVERFLOW_SLOP;
}

export function slidePaneScrollStep(clientHeight: number): number {
  return Math.max(80, Math.round(clientHeight * 0.7));
}
