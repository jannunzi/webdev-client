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
