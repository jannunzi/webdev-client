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
  pad = 36,
): number[] {
  const em = DIAGRAM_FONT_EM;
  return boxes.map((box) => {
    const longestLine = box.lines.reduce((max, line) => Math.max(max, line.length), 0);
    const list = box.lines.length > 1 && longestLine > 16;
    const nameW = box.name.length * nameSize * em + pad;
    if (list) return Math.round(Math.max(nameW, longestLine * lineSize * em + pad));
    const lineW = Math.max(longestLine, 1) * nameSize * em + pad;
    return Math.round(Math.max(nameW, lineW));
  });
}

export type DiagramRule = { x1: number; y1: number; x2: number; y2: number };

/**
 * Width of the column that contains `x` when vertical rules split a table.
 * Returns null when the rect is not a gridded table, so flow-box labels
 * keep measuring the whole box.
 */
export function tableColumnWidth(
  x: number,
  rect: { x: number; y: number; width: number; height: number },
  lines: DiagramRule[],
): number | null {
  const dividers = lines
    .filter((line) => {
      if (Math.abs(line.x1 - line.x2) > 1.5) return false;
      const ruleX = (line.x1 + line.x2) / 2;
      if (ruleX <= rect.x + 2 || ruleX >= rect.x + rect.width - 2) return false;
      const top = Math.min(line.y1, line.y2);
      const bottom = Math.max(line.y1, line.y2);
      const overlap = Math.min(bottom, rect.y + rect.height) - Math.max(top, rect.y);
      return overlap > rect.height * 0.6;
    })
    .map((line) => (line.x1 + line.x2) / 2)
    .sort((a, b) => a - b);
  if (dividers.length === 0) return null;
  const bounds = [rect.x, ...dividers, rect.x + rect.width];
  for (let index = 0; index < bounds.length - 1; index++) {
    const start = bounds[index]!;
    const end = bounds[index + 1]!;
    if (x >= start - 1 && x <= end + 1) return end - start;
  }
  return null;
}

/** Largest font whose text stays inside `boxWidth`, leaving `padding`. */
export function fontPxThatFits(text: string, boxWidth: number, padding = 20): number {
  const inner = boxWidth - padding;
  const chars = Math.max(text.trim().length, 1);
  if (inner <= 4) return 0;
  return inner / (chars * DIAGRAM_FONT_EM);
}

/**
 * How far below a box a caption still counts as sitting in that row's gap.
 * Relationship captions are 36px under the tallest box and about 52px under
 * a shorter neighbor. Sequence labels start further down the lifeline.
 */
export const DIAGRAM_OPEN_GAP_Y_PAD = 56;

/**
 * Width of the gap a label sits in, when boxes flank it on the same row.
 * Boxes well above or below the baseline do not count, so an actor pill
 * cannot squeeze a message label that is drawn further down the lifeline.
 * Returns 0 when the label is not between two boxes.
 */
export function openGapWidth(
  x: number,
  y: number,
  rects: { x: number; y: number; width: number; height: number }[],
  yPad = DIAGRAM_OPEN_GAP_Y_PAD,
): number {
  let left = Number.NEGATIVE_INFINITY;
  let right = Number.POSITIVE_INFINITY;
  for (const rect of rects) {
    if (y < rect.y - yPad || y > rect.y + rect.height + yPad) continue;
    const end = rect.x + rect.width;
    if (end <= x + 2) left = Math.max(left, end);
    else if (rect.x >= x - 2) right = Math.min(right, rect.x);
  }
  if (!Number.isFinite(left) || !Number.isFinite(right) || right <= left) return 0;
  return right - left;
}

/**
 * Distance to the nearest other label in this column.
 * Open-space sequence labels stack a fixed SVG distance apart and are not
 * inside a rect, so the raiser caps the font at 80% of this gap.
 * Returns 0 when the label has no neighbor in the column.
 */
export function stackedLabelGap(
  x: number,
  y: number,
  points: { x: number; y: number }[],
  columnSlack = 8,
): number {
  let gap = Number.POSITIVE_INFINITY;
  for (const point of points) {
    if (Math.abs(point.x - x) > columnSlack) continue;
    const distance = Math.abs(point.y - y);
    if (distance < 0.5) continue;
    if (distance < gap) gap = distance;
  }
  return Number.isFinite(gap) ? gap : 0;
}
