/**
 * React Icons draw an SVG with width/height "1em" and a large viewBox
 * (FaUserCircle is 496×512). That is an icon, not the diagram canvas.
 */
export function isLectureIconSvg(width: string | null, height: string | null): boolean {
  return width === "1em" || height === "1em";
}

/**
 * CRUD Users slide 2, at 1280×800, draws its diagram at about a third of
 * the stage. Taller drawings stop there instead of filling the leftover slot.
 */
export const DIAGRAM_MAX_HEIGHT_OF_SLIDE = 0.34;

/**
 * Largest uniform scale that fits a diagram in the leftover slide slot
 * without growing past the slide-2 height. The graphic keeps its aspect
 * ratio. The result never exceeds the slot on either axis.
 */
export function diagramFitScale(
  slotWidth: number,
  slotHeight: number,
  naturalWidth: number,
  naturalHeight: number,
  maxHeight = Number.POSITIVE_INFINITY,
): number {
  if (
    slotWidth <= 0 ||
    slotHeight <= 0 ||
    naturalWidth <= 0 ||
    naturalHeight <= 0
  ) {
    return 1;
  }
  const fit = Math.min(slotWidth / naturalWidth, slotHeight / naturalHeight);
  if (maxHeight <= 0) return fit;
  return Math.min(fit, maxHeight / naturalHeight);
}

/** Average SVG glyph width relative to the font size. */
export const DIAGRAM_FONT_EM = 0.68;

/**
 * Diagram labels should stay readable at fullscreen and approach the
 * lecture's regular bullet size. A wide slide aims higher; a narrow one
 * never drops below 22px.
 */
export function diagramMinFontPx(slideWidth: number, bulletPx: number): number {
  const scaled = 32 * (Math.max(slideWidth, 1) / 1280);
  const nearBullet = bulletPx > 0 ? bulletPx * 0.8 : scaled;
  return Math.round(Math.max(22, Math.min(nearBullet, scaled)) * 10) / 10;
}

/** Largest font whose text stays inside `boxWidth`, leaving `padding`. */
export function fontPxThatFits(text: string, boxWidth: number, padding = 20): number {
  const inner = boxWidth - padding;
  const chars = Math.max(text.trim().length, 1);
  if (inner <= 4) return 0;
  return inner / (chars * DIAGRAM_FONT_EM);
}
