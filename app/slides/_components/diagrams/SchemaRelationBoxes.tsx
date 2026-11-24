import { svgIndentedLine } from "@/lib/lectures/svg-indent";

export const BLUE = { fill: "#e8f0fe", header: "#a4c2f4", stroke: "#2f6fd0" };
export const YELLOW = { fill: "#fff8dc", header: "#ffe59a", stroke: "#e09038" };
export const RED = { fill: "#fff1f2", header: "#f8c8c8", stroke: "#dc2626" };

export const FONT = "ui-sans-serif, system-ui, sans-serif";
export const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

export const HEADER_H = 52;
export const LINE_H = 32;
const RADIUS = 14;

export type SchemaTone = typeof BLUE;

function headerPath(x: number, y: number, w: number, h: number) {
  const r = RADIUS;
  return `M${x} ${y + r} a${r} ${r} 0 0 1 ${r} ${-r} h${w - 2 * r} a${r} ${r} 0 0 1 ${r} ${r} v${h - r} h${-w} z`;
}

export function Arrow({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  const dir = x2 > x1 ? 1 : -1;
  const base = x2 - dir * 14;
  return (
    <g>
      <line x1={x1} y1={y} x2={base} y2={y} stroke="#171717" strokeWidth={3.5} />
      <polygon points={`${x2},${y} ${base},${y - 8} ${base},${y + 8}`} fill="#171717" />
    </g>
  );
}

/** Relationship line ending in a crow's foot. `x` is the many-side tip. */
export function CrowsFoot({ x, y }: { x: number; y: number }) {
  const reach = 18;
  const spread = 12;
  const base = x - reach;
  return (
    <g fill="none" stroke="#171717" strokeWidth={3.5} strokeLinecap="round">
      <line x1={base} y1={y} x2={x} y2={y - spread} />
      <line x1={base} y1={y} x2={x} y2={y} />
      <line x1={base} y1={y} x2={x} y2={y + spread} />
    </g>
  );
}

export function Box({
  x,
  y,
  w,
  h,
  title,
  lines,
  tone,
  lineH = LINE_H,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  lines: string[];
  tone: SchemaTone;
  lineH?: number;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={RADIUS} fill={tone.fill} stroke={tone.stroke} strokeWidth={3} />
      <path d={headerPath(x, y, w, HEADER_H)} fill={tone.header} stroke={tone.stroke} strokeWidth={3} />
      <line x1={x} y1={y + HEADER_H} x2={x + w} y2={y + HEADER_H} stroke={tone.stroke} strokeWidth={3} />
      <text
        x={x + w / 2}
        y={y + 34}
        textAnchor="middle"
        fontFamily={FONT}
        fontSize={22}
        fontWeight={700}
        fill="#171717"
      >
        {title}
      </text>
      {lines.map((line, index) => {
        const indented = svgIndentedLine(line, 22);
        return (
          <text
            key={`${index}-${indented.text}`}
            x={x + 18 + indented.xOffset}
            y={y + HEADER_H + 28 + index * lineH}
            textAnchor="start"
            fontFamily={MONO}
            fontSize={18}
            fill="#171717"
          >
            {indented.text}
          </text>
        );
      })}
    </g>
  );
}

export function Caption({ x, y, width, text }: { x: number; y: number; width: number; text: string }) {
  return (
    <text
      x={x + width / 2}
      y={y}
      textAnchor="middle"
      fontFamily={FONT}
      fontSize={20}
      fontWeight={700}
      fill="#171717"
    >
      {text}
    </text>
  );
}

export function GapLabel({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontFamily={FONT}
      fontSize={22}
      fontWeight={700}
      fill="#171717"
    >
      {text}
    </text>
  );
}

export function linesHeight(count: number, lineH = LINE_H) {
  return HEADER_H + count * lineH + 22;
}
