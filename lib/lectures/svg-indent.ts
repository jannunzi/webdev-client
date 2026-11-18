/**
 * SVG `<text>` collapses leading spaces. Pretty-printed lines keep their
 * indent as an x offset: two source spaces are one nesting level.
 */
export function svgIndentedLine(
  line: string,
  pxPerLevel = 22,
): { text: string; xOffset: number } {
  const spaces = line.match(/^ */)?.[0].length ?? 0;
  const level = Math.floor(spaces / 2);
  const text = line.slice(spaces);
  return { text: text.length > 0 ? text : " ", xOffset: level * pxPerLevel };
}
