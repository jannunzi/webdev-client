const BLUE = { fill: "#e8f0fe", header: "#a4c2f4", stroke: "#2f6fd0" };
const YELLOW = { fill: "#fff8dc", header: "#ffe59a", stroke: "#e09038" };
const RED = { fill: "#fff1f2", header: "#f8c8c8", stroke: "#dc2626" };

const FONT = "ui-sans-serif, system-ui, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

const HEADER_H = 52;
const LINE_H = 32;
const RADIUS = 14;

type Tone = typeof BLUE;

function headerPath(x: number, y: number, w: number, h: number) {
  const r = RADIUS;
  return `M${x} ${y + r} a${r} ${r} 0 0 1 ${r} ${-r} h${w - 2 * r} a${r} ${r} 0 0 1 ${r} ${r} v${h - r} h${-w} z`;
}

function Arrow({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  const dir = x2 > x1 ? 1 : -1;
  const base = x2 - dir * 14;
  return (
    <g>
      <line x1={x1} y1={y} x2={base} y2={y} stroke="#171717" strokeWidth={3.5} />
      <polygon points={`${x2},${y} ${base},${y - 8} ${base},${y + 8}`} fill="#171717" />
    </g>
  );
}

function Box({
  x,
  y,
  w,
  h,
  title,
  lines,
  tone,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  lines: string[];
  tone: Tone;
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
      {lines.map((line, index) => (
        <text
          key={line}
          x={x + 18}
          y={y + HEADER_H + 28 + index * LINE_H}
          textAnchor="start"
          fontFamily={MONO}
          fontSize={18}
          fill="#171717"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function Caption({ x, y, width, text }: { x: number; y: number; width: number; text: string }) {
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

function linesHeight(count: number) {
  return HEADER_H + count * LINE_H + 22;
}

/** Embedded arrays on both sides, beside one enrollments collection. */
export default function EnrollmentsMnDiagram() {
  const rowH = linesHeight(3);
  const top = 16;
  const yFor = (lines: number) => top + (rowH - linesHeight(lines)) / 2;
  const coursesW = 196;
  const usersW = 196;
  const enrollW = 196;
  const pairGap = 92;
  const joinGap = 60;
  const groupGap = 72;

  const leftX = 8;
  const leftUsersX = leftX + coursesW + pairGap;
  const leftW = leftUsersX + usersW - leftX;

  const rightX = leftUsersX + usersW + groupGap;
  const enrollX = rightX + coursesW + joinGap;
  const rightUsersX = enrollX + enrollW + joinGap;
  const rightW = rightUsersX + usersW - rightX;

  const width = rightUsersX + usersW + 8;
  const captionY = top + rowH + 36;
  const height = captionY + 10;

  const mid = top + rowH / 2;

  return (
    <svg role="img" viewBox={`0 0 ${width} ${height}`} aria-label="Two ways to store many users in many courses">
      <title>Arrays in both documents, or one enrollments collection</title>
      <Box
        x={leftX}
        y={yFor(3)}
        w={coursesW}
        h={linesHeight(3)}
        title="courses"
        lines={["_id", "name", "[ user _id ]"]}
        tone={BLUE}
      />
      <Box
        x={leftUsersX}
        y={yFor(3)}
        w={usersW}
        h={linesHeight(3)}
        title="users"
        lines={["_id", "username", "[ course _id ]"]}
        tone={RED}
      />
      <Arrow x1={leftX + coursesW + 8} x2={leftUsersX - 8} y={mid - 16} />
      <Arrow x1={leftUsersX - 8} x2={leftX + coursesW + 8} y={mid + 16} />
      <Caption x={leftX} y={captionY} width={leftW} text="Arrays in both documents" />

      <Box
        x={rightX}
        y={yFor(2)}
        w={coursesW}
        h={linesHeight(2)}
        title="courses"
        lines={["_id", "name"]}
        tone={BLUE}
      />
      <Box
        x={enrollX}
        y={yFor(3)}
        w={enrollW}
        h={linesHeight(3)}
        title="enrollments"
        lines={["_id", "user", "course"]}
        tone={YELLOW}
      />
      <Box
        x={rightUsersX}
        y={yFor(2)}
        w={usersW}
        h={linesHeight(2)}
        title="users"
        lines={["_id", "username"]}
        tone={RED}
      />
      <Arrow x1={enrollX - 8} x2={rightX + coursesW + 8} y={mid} />
      <Arrow x1={enrollX + enrollW + 8} x2={rightUsersX - 8} y={mid} />
      <Caption x={rightX} y={captionY} width={rightW} text="Enrollments collection" />
    </svg>
  );
}
