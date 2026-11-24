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

/** Average SVG glyph width relative to the font size. Matches the slide mono font. */
export const DIAGRAM_FONT_EM = 0.61;

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
 * A list box is as wide as its longest line at the list size, so every route
 * stays on one row. Every other box fits its title and its body label at the
 * title size, so PeopleTable is not shrunk to make room for the routes.
 */
export function balanceBoxWidths(
  boxes: { name: string; lines: string[] }[],
  _shared: number,
  nameSize: number,
  lineSize: number,
): number[] {
  const em = DIAGRAM_FONT_EM;
  const pad = 36;
  return boxes.map((box) => {
    const longestLine = box.lines.reduce((max, line) => Math.max(max, line.length), 0);
    const list = box.lines.length > 1 && longestLine > 16;
    const nameW = box.name.length * nameSize * em + pad;
    if (list) return Math.round(Math.max(nameW, longestLine * lineSize * em + pad));
    const lineW = Math.max(longestLine, 1) * nameSize * em + pad;
    return Math.round(Math.max(nameW, lineW));
  });
}

/** Largest font whose text stays inside `boxWidth`, leaving `padding`. */
export function fontPxThatFits(text: string, boxWidth: number, padding = 20): number {
  const inner = boxWidth - padding;
  const chars = Math.max(text.trim().length, 1);
  if (inner <= 4) return 0;
  return inner / (chars * DIAGRAM_FONT_EM);
}
