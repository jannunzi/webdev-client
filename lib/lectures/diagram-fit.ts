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
 * Fullscreen rendered size of the slide 9 labels on main
 * (`setCourses`, `GET`, `populate`, `course ref`): SVG 22px at zoom 1.099.
 * Labels and arrow text aim for this size and do not grow toward bullet type.
 */
export const DIAGRAM_LABEL_TARGET_PX = 24;

export function diagramMinFontPx(_slideWidth: number, _bulletPx: number): number {
  return DIAGRAM_LABEL_TARGET_PX;
}

/**
 * Give a long list the extra width and keep short boxes a little narrower,
 * so one wide column does not force every label down to the same tiny zoom.
 */
export function balanceBoxWidths(
  boxes: { name: string; lines: string[] }[],
  shared: number,
  nameSize: number,
  lineSize: number,
): number[] {
  const em = 0.66;
  const pad = 64;
  const narrow = shared * 0.7;
  const wide = shared * 1.3;
  return boxes.map((box) => {
    const longest = box.lines.reduce((max, line) => Math.max(max, line.length), 0);
    const list = box.lines.length > 1 && longest > 24;
    const lineChars = list ? Math.min(longest, 22) : longest;
    const nameW = box.name.length * nameSize * em + pad;
    // Short labels such as PeopleTable need enough box to reach the slide 9 size.
    const bodySize = list ? lineSize : Math.max(lineSize, 46);
    const lineW = lineChars * bodySize * em + pad;
    return Math.round(Math.min(wide, Math.max(narrow, nameW, lineW)));
  });
}

/** Largest font whose text stays inside `boxWidth`, leaving `padding`. */
export function fontPxThatFits(text: string, boxWidth: number, padding = 20): number {
  const inner = boxWidth - padding;
  const chars = Math.max(text.trim().length, 1);
  if (inner <= 4) return 0;
  return inner / (chars * DIAGRAM_FONT_EM);
}
