import { svgIndentedLine } from "@/lib/lectures/svg-indent";

const BLUE = { fill: "#e8f0fe", header: "#a4c2f4", stroke: "#2f6fd0" };
const YELLOW = { fill: "#fff8dc", header: "#ffe59a", stroke: "#e09038" };
const RED = { fill: "#fff1f2", header: "#f8c8c8", stroke: "#dc2626" };

const FONT = "ui-sans-serif, system-ui, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

type Tone = typeof BLUE;

const TONES = {
  blue: BLUE,
  yellow: YELLOW,
  red: RED,
} as const;

type Box = {
  name: string;
  lines: string[];
  tone: keyof typeof TONES;
  /** Thicker stroke. The first line is the “new in this chapter” mark. */
  emphasis?: boolean;
};

const HEADER_H = 48;
const LINE_H = 22;
const PAD_B = 14;
const RADIUS = 12;

function boxHeight(lines: number) {
  return HEADER_H + Math.max(lines, 1) * LINE_H + PAD_B;
}

/** Header band: top corners match the body radius, bottom corners stay square. */
function headerPath(x: number, y: number, w: number, h: number) {
  const r = RADIUS;
  return `M${x} ${y + r} a${r} ${r} 0 0 1 ${r} ${-r} h${w - 2 * r} a${r} ${r} 0 0 1 ${r} ${r} v${h - r} h${-w} z`;
}

function Arrow({
  x1,
  x2,
  y,
  dashed,
  stroke = 3,
  head = 6,
}: {
  x1: number;
  x2: number;
  y: number;
  dashed?: boolean;
  stroke?: number;
  head?: number;
}) {
  const dir = x2 > x1 ? 1 : -1;
  const base = x2 - dir * (head + 8);
  return (
    <g>
      <line
        x1={x1}
        y1={y}
        x2={base}
        y2={y}
        stroke="#171717"
        strokeWidth={stroke}
        strokeDasharray={dashed ? "10 7" : undefined}
      />
      <polygon points={`${x2},${y} ${base},${y - head} ${base},${y + head}`} fill="#171717" />
    </g>
  );
}

function Flow({
  title,
  boxes,
  boxWidth,
  large = false,
}: {
  title: string;
  boxes: Box[];
  boxWidth: number;
  /** Taller boxes, type, and arrows so a horizontal row fills the slide. */
  large?: boolean;
}) {
  const headerH = large ? 78 : HEADER_H;
  const lineH = large ? 34 : LINE_H;
  const padB = large ? 36 : PAD_B;
  const gap = large ? 148 : 108;
  const side = large ? 24 : 36;
  const nameSize = large ? 28 : 18;
  const lineSize = large ? 22 : 14;
  const labelSize = large ? 22 : 13;
  const strokeW = large ? 5 : 3;
  const head = large ? 10 : 6;
  const contentHeights = boxes.map(
    (box) => headerH + Math.max(box.lines.length, 1) * lineH + padB,
  );
  // A short horizontal row stays a thin strip unless the boxes themselves are tall.
  const boxH = Math.max(...contentHeights, large ? 460 : 0);
  const width = side + boxes.length * boxWidth + (boxes.length - 1) * gap + side;
  const height = (large ? 12 : 24) + boxH + (large ? 12 : 20);
  const top = large ? 12 : 20;
  const bodyMid = top + headerH + (boxH - headerH) / 2;
  const requestY = large ? bodyMid - 36 : top + HEADER_H + 10;
  const responseY = large ? bodyMid + 36 : top + HEADER_H + 32;

  return (
    <svg role="img" viewBox={`0 0 ${width} ${height}`} aria-label={title}>
      <title>{title}</title>
      {boxes.map((box, index) => {
        const tone: Tone = TONES[box.tone];
        const x = side + index * (boxWidth + gap);
        const h = boxH;
        const stroke = box.emphasis ? 6 : 3;
        return (
          <g key={`${box.name}-${index}`}>
            {index > 0 ? (
              <g>
                <Arrow
                  x1={x - gap + 6}
                  x2={x - 8}
                  y={requestY}
                  stroke={strokeW}
                  head={head}
                />
                <text
                  x={x - gap / 2}
                  y={requestY - (large ? 14 : 6)}
                  textAnchor="middle"
                  fontFamily={FONT}
                  fontSize={labelSize}
                  fontWeight={700}
                  fill="#171717"
                >
                  request
                </text>
                <Arrow
                  x1={x - 8}
                  x2={x - gap + 6}
                  y={responseY}
                  dashed
                  stroke={strokeW}
                  head={head}
                />
                <text
                  x={x - gap / 2}
                  y={responseY + (large ? 28 : 16)}
                  textAnchor="middle"
                  fontFamily={FONT}
                  fontSize={labelSize}
                  fontWeight={700}
                  fill="#171717"
                >
                  response
                </text>
              </g>
            ) : null}
            <rect
              x={x}
              y={top}
              width={boxWidth}
              height={h}
              rx={RADIUS}
              fill={tone.fill}
              stroke={tone.stroke}
              strokeWidth={stroke}
            />
            <path
              d={headerPath(x, top, boxWidth, headerH)}
              fill={tone.header}
              stroke={tone.stroke}
              strokeWidth={stroke}
            />
            <line
              x1={x}
              y1={top + headerH}
              x2={x + boxWidth}
              y2={top + headerH}
              stroke={tone.stroke}
              strokeWidth={stroke}
            />
            <text
              x={x + boxWidth / 2}
              y={large ? top + headerH * 0.62 : top + 31}
              textAnchor="middle"
              fontFamily={FONT}
              fontSize={nameSize}
              fontWeight={700}
              fill="#171717"
            >
              {box.name}
            </text>
            {box.lines.map((line, lineIndex) => (
              <text
                key={line}
                x={large ? x + boxWidth / 2 : x + 12}
                y={(large
                  ? top + headerH + (h - headerH - box.lines.length * lineH) / 2 + 22
                  : top + HEADER_H + 20) + lineIndex * lineH}
                textAnchor={large ? "middle" : "start"}
                fontFamily={MONO}
                fontSize={lineSize}
                fontWeight={box.emphasis && lineIndex === 0 ? 700 : 400}
                fill={box.emphasis && lineIndex === 0 ? tone.stroke : "#171717"}
              >
                {line}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

const STACKS: Record<string, { title: string; boxWidth: number; boxes: Box[]; large?: boolean }> = {
  "mongo-roadmap": {
    title: "From the React UI to the database",
    boxWidth: 220,
    boxes: [
      { name: "React UI", lines: ["Next.js client", "built in ch3–5"], tone: "blue" },
      { name: "client.ts", lines: ["axios", "built in ch5"], tone: "blue" },
      { name: "Routes", lines: ["Express", "built in ch5"], tone: "yellow" },
      { name: "DAO", lines: ["in-memory arrays", "built in ch5"], tone: "yellow" },
      {
        name: "Database",
        lines: ["new in ch6", "local MongoDB", "Atlas later"],
        tone: "red",
        emphasis: true,
      },
    ],
  },
  "users-stack": {
    title: "Users from the page to MongoDB",
    boxWidth: 268,
    boxes: [
      { name: "Users page", lines: ["useEffect", "Details"], tone: "blue" },
      { name: "account client", lines: ["axios"], tone: "blue" },
      {
        name: "UserRoutes",
        lines: [
          "GET /api/users",
          "GET /api/users?role",
          "GET /api/users?name",
          "GET /api/users/:userId",
          "POST /api/users",
          "PUT /api/users/:userId",
          "DELETE /api/users/:userId",
          "POST /api/users/signup",
          "POST /api/users/signin",
          "POST /api/users/signout",
          "GET /api/users/profile",
        ],
        tone: "yellow",
      },
      { name: "UsersDao", lines: ["model.find", "findById"], tone: "yellow" },
      { name: "users", lines: ["MongoDB"], tone: "red" },
    ],
  },
  "users-read-all": {
    title: "GET /api/users",
    boxWidth: 300,
    large: true,
    boxes: [
      { name: "Users", lines: ["setUsers"], tone: "blue" },
      { name: "findAllUsers", lines: ["GET"], tone: "blue" },
      { name: "GET /api/users", lines: ["await dao"], tone: "yellow" },
      { name: "model.find()", lines: ["users"], tone: "red" },
    ],
  },
  "users-filter-role": {
    title: "GET /api/users?role=",
    boxWidth: 340,
    large: true,
    boxes: [
      { name: "Users", lines: ["role select"], tone: "blue" },
      { name: "findUsersByRole", lines: ["GET ?role="], tone: "blue" },
      { name: "GET /api/users", lines: ["if role"], tone: "yellow" },
      { name: "find({ role })", lines: ["users"], tone: "red" },
    ],
  },
  "users-filter-name": {
    title: "GET /api/users?name=",
    boxWidth: 420,
    large: true,
    boxes: [
      { name: "Users", lines: ["Search people"], tone: "blue" },
      { name: "Client", lines: ["findUsersByPartialName", "GET ?name="], tone: "blue" },
      { name: "GET /api/users", lines: ["if name"], tone: "yellow" },
      { name: "find()", lines: ["$or", "$regex firstName", "$regex lastName"], tone: "red" },
    ],
  },
  "users-read-one": {
    title: "GET /api/users/:userId",
    boxWidth: 320,
    large: true,
    boxes: [
      { name: "Details", lines: ["uid"], tone: "blue" },
      { name: "findUserById", lines: ["GET"], tone: "blue" },
      { name: "GET /:userId", lines: ["await dao"], tone: "yellow" },
      { name: "findById", lines: ["one user"], tone: "red" },
    ],
  },
  "users-delete": {
    title: "DELETE /api/users/:userId",
    boxWidth: 380,
    large: true,
    boxes: [
      { name: "Details", lines: ["onDelete"], tone: "blue" },
      { name: "deleteUser", lines: ["DELETE"], tone: "blue" },
      { name: "DELETE /:userId", lines: ["await dao"], tone: "yellow" },
      { name: "findByIdAndDelete", lines: ["one user"], tone: "red" },
    ],
  },
  "users-update": {
    title: "PUT /api/users/:userId",
    boxWidth: 300,
    large: true,
    boxes: [
      { name: "Details", lines: ["onSave"], tone: "blue" },
      { name: "updateUser", lines: ["PUT"], tone: "blue" },
      { name: "PUT /:userId", lines: ["$set"], tone: "yellow" },
      { name: "updateOne", lines: ["users"], tone: "red" },
    ],
  },
  "users-create": {
    title: "POST /api/users",
    boxWidth: 300,
    large: true,
    boxes: [
      { name: "Users", lines: ["onCreate"], tone: "blue" },
      { name: "createUser", lines: ["POST"], tone: "blue" },
      { name: "POST /api/users", lines: ["await dao"], tone: "yellow" },
      { name: "model.create", lines: ["users"], tone: "red" },
    ],
  },
  "courses-stack": {
    title: "Courses from the Dashboard to MongoDB",
    boxWidth: 460,
    large: true,
    boxes: [
      { name: "Dashboard", lines: ["store"], tone: "blue" },
      { name: "courses client", lines: ["axios"], tone: "blue" },
      {
        name: "CourseRoutes",
        lines: [
          "GET /api/courses",
          "GET /api/courses/:courseId",
          "POST /api/courses",
          "PUT /api/courses/:courseId",
          "DELETE /api/courses/:courseId",
        ],
        tone: "yellow",
      },
      { name: "CoursesDao", lines: ["CourseModel"], tone: "yellow" },
      { name: "courses", lines: ["MongoDB"], tone: "red" },
    ],
  },
  "courses-read-all": {
    title: "GET /api/courses",
    boxWidth: 240,
    large: true,
    boxes: [
      { name: "Dashboard", lines: ["setCourses"], tone: "blue" },
      { name: "fetchAllCourses", lines: ["GET"], tone: "blue" },
      { name: "GET /api/courses", lines: ["await dao"], tone: "yellow" },
      { name: "model.find()", lines: ["courses"], tone: "red" },
    ],
  },
  "courses-read-one": {
    title: "GET /api/courses/:courseId",
    boxWidth: 300,
    large: true,
    boxes: [
      { name: "Editor", lines: ["setCourse"], tone: "blue" },
      { name: "findCourseById", lines: ["GET"], tone: "blue" },
      { name: "GET /:courseId", lines: ["await dao"], tone: "yellow" },
      { name: "findById", lines: ["one course"], tone: "red" },
    ],
  },
  "courses-delete": {
    title: "DELETE /api/courses/:courseId",
    boxWidth: 250,
    large: true,
    boxes: [
      { name: "Dashboard", lines: ["deleteCourse"], tone: "blue" },
      { name: "deleteCourse", lines: ["DELETE"], tone: "blue" },
      { name: "DELETE /:courseId", lines: ["await dao"], tone: "yellow" },
      { name: "deleteOne", lines: ["courses"], tone: "red" },
    ],
  },
  "courses-update": {
    title: "PUT /api/courses/:courseId",
    boxWidth: 240,
    large: true,
    boxes: [
      { name: "Dashboard", lines: ["updateCourse"], tone: "blue" },
      { name: "updateCourse", lines: ["PUT"], tone: "blue" },
      { name: "PUT /:courseId", lines: ["$set"], tone: "yellow" },
      { name: "updateOne", lines: ["courses"], tone: "red" },
    ],
  },
  "courses-create": {
    title: "POST /api/courses",
    boxWidth: 240,
    large: true,
    boxes: [
      { name: "Dashboard", lines: ["addCourse"], tone: "blue" },
      { name: "createCourse", lines: ["POST"], tone: "blue" },
      { name: "POST /api/courses", lines: ["await dao"], tone: "yellow" },
      { name: "model.create", lines: ["courses"], tone: "red" },
    ],
  },
  "modules-stack": {
    title: "Modules from the page to MongoDB",
    boxWidth: 520,
    large: true,
    boxes: [
      { name: "Modules", lines: ["store"], tone: "blue" },
      { name: "courses client", lines: ["axios"], tone: "blue" },
      {
        name: "ModuleRoutes",
        lines: [
          "GET /api/courses/:courseId/modules",
          "POST /api/courses/:courseId/modules",
          "PUT /api/modules/:moduleId",
          "DELETE /api/modules/:moduleId",
        ],
        tone: "yellow",
      },
      { name: "ModulesDao", lines: ["course id"], tone: "yellow" },
      { name: "modules", lines: ["MongoDB"], tone: "red" },
    ],
  },
  "modules-read": {
    title: "GET /api/courses/:courseId/modules",
    boxWidth: 250,
    large: true,
    boxes: [
      { name: "Modules", lines: ["setModules"], tone: "blue" },
      { name: "findModules", lines: ["GET"], tone: "blue" },
      { name: "GET nested", lines: ["await dao"], tone: "yellow" },
      { name: "find", lines: ["{ course }"], tone: "red" },
    ],
  },
  "modules-delete": {
    title: "DELETE /api/modules/:moduleId",
    boxWidth: 250,
    large: true,
    boxes: [
      { name: "Modules", lines: ["deleteModule"], tone: "blue" },
      { name: "deleteModule", lines: ["DELETE"], tone: "blue" },
      { name: "DELETE /:moduleId", lines: ["await dao"], tone: "yellow" },
      { name: "deleteOne", lines: ["modules"], tone: "red" },
    ],
  },
  "modules-update": {
    title: "PUT /api/modules/:moduleId",
    boxWidth: 240,
    large: true,
    boxes: [
      { name: "Modules", lines: ["updateModule"], tone: "blue" },
      { name: "updateModule", lines: ["PUT"], tone: "blue" },
      { name: "PUT /:moduleId", lines: ["$set"], tone: "yellow" },
      { name: "updateOne", lines: ["modules"], tone: "red" },
    ],
  },
  "modules-create": {
    title: "POST /api/courses/:courseId/modules",
    boxWidth: 250,
    large: true,
    boxes: [
      { name: "Modules", lines: ["addModule"], tone: "blue" },
      { name: "createModule", lines: ["POST"], tone: "blue" },
      { name: "POST nested", lines: ["await dao"], tone: "yellow" },
      { name: "model.create", lines: ["modules"], tone: "red" },
    ],
  },
  "enroll-stack": {
    title: "Enrollments from People to MongoDB",
    boxWidth: 520,
    large: true,
    boxes: [
      { name: "People", lines: ["PeopleTable"], tone: "blue" },
      { name: "courses client", lines: ["axios"], tone: "blue" },
      {
        name: "CourseRoutes",
        lines: [
          "GET /api/users/:userId/courses",
          "POST /api/users/:uid/courses/:cid",
          "DELETE /api/users/:uid/courses/:cid",
          "GET /api/courses/:cid/users",
          "DELETE /api/courses/:courseId",
        ],
        tone: "yellow",
      },
      { name: "EnrollmentsDao", lines: ["populate"], tone: "yellow" },
      { name: "enrollments", lines: ["MongoDB"], tone: "red" },
    ],
  },
  "enroll-read": {
    title: "GET enrolled courses",
    boxWidth: 250,
    large: true,
    boxes: [
      { name: "Dashboard", lines: ["setCourses"], tone: "blue" },
      { name: "findMyCourses", lines: ["GET"], tone: "blue" },
      { name: "GET current", lines: ["populate"], tone: "yellow" },
      { name: "enrollments", lines: ["course ref"], tone: "red" },
    ],
  },
  "enroll-people": {
    title: "GET /api/courses/:cid/users",
    boxWidth: 340,
    large: true,
    boxes: [
      { name: "People", lines: ["setUsers"], tone: "blue" },
      { name: "findUsersForCourse", lines: ["GET"], tone: "blue" },
      { name: "GET /:cid/users", lines: ["await dao"], tone: "yellow" },
      { name: "populate", lines: ["user ref"], tone: "red" },
    ],
  },
  "enroll-joins": {
    title: "DELETE a course and its joins",
    boxWidth: 250,
    large: true,
    boxes: [
      { name: "Dashboard", lines: ["delete course"], tone: "blue" },
      { name: "deleteCourse", lines: ["DELETE"], tone: "blue" },
      { name: "DELETE /:courseId", lines: ["deleteMany"], tone: "yellow" },
      { name: "enrollments", lines: ["{ course }"], tone: "red" },
    ],
  },
  "enroll-create": {
    title: "POST enrolls the user",
    boxWidth: 420,
    large: true,
    boxes: [
      { name: "Dashboard", lines: ["enroll"], tone: "blue" },
      { name: "enrollIntoCourse", lines: ["POST"], tone: "blue" },
      { name: "POST /:uid/courses/:cid", lines: ["session"], tone: "yellow" },
      { name: "model.create", lines: ["enrollments"], tone: "red" },
    ],
  },
  "enroll-unenroll": {
    title: "DELETE unenrolls the user",
    boxWidth: 440,
    large: true,
    boxes: [
      { name: "Dashboard", lines: ["unenroll"], tone: "blue" },
      { name: "unenrollFromCourse", lines: ["DELETE"], tone: "blue" },
      { name: "DELETE /:uid/courses/:cid", lines: ["session"], tone: "yellow" },
      { name: "deleteOne", lines: ["enrollments"], tone: "red" },
    ],
  },
};

function DataTable({
  x,
  y,
  caption,
  columns,
  rows,
}: {
  x: number;
  y: number;
  caption: string;
  columns: { label: string; width: number }[];
  rows: string[][];
}) {
  const headH = 46;
  const rowH = 44;
  const width = columns.reduce((sum, column) => sum + column.width, 0);
  const height = headH + rows.length * rowH;
  let cursor = x;
  const centers = columns.map((column) => {
    const center = cursor + column.width / 2;
    cursor += column.width;
    return center;
  });
  return (
    <g>
      <text x={x} y={y - 12} fontFamily={FONT} fontSize={18} fontWeight={700} fill={YELLOW.stroke}>
        {caption}
      </text>
      <rect x={x} y={y} width={width} height={height} fill="#fff" stroke={YELLOW.stroke} strokeWidth={2} />
      <rect x={x} y={y} width={width} height={headH} fill={YELLOW.header} stroke={YELLOW.stroke} strokeWidth={2} />
      {columns.map((column, index) => {
        const cellX = x + columns.slice(0, index).reduce((sum, item) => sum + item.width, 0);
        return (
          <g key={column.label}>
            {index > 0 ? (
              <line x1={cellX} y1={y} x2={cellX} y2={y + height} stroke={YELLOW.stroke} strokeWidth={2} />
            ) : null}
            <text
              x={centers[index]}
              y={y + 30}
              textAnchor="middle"
              fontFamily={MONO}
              fontSize={16}
              fontWeight={700}
              fill="#171717"
            >
              {column.label}
            </text>
          </g>
        );
      })}
      {rows.map((row, rowIndex) => {
        const rowY = y + headH + rowIndex * rowH;
        return (
          <g key={row.join("-")}>
            <line x1={x} y1={rowY} x2={x + width} y2={rowY} stroke={YELLOW.stroke} strokeWidth={2} />
            {row.map((cell, index) => (
              <text
                key={cell}
                x={centers[index]}
                y={rowY + 29}
                textAnchor="middle"
                fontFamily={MONO}
                fontSize={16}
                fill="#171717"
              >
                {cell}
              </text>
            ))}
          </g>
        );
      })}
    </g>
  );
}

function SqlVsDocument() {
  const coursesX = 36;
  const coursesY = 96;
  const courseCols = [
    { label: "_id (PK)", width: 150 },
    { label: "name", width: 280 },
    { label: "number", width: 150 },
  ];
  const moduleCols = [
    { label: "_id (PK)", width: 150 },
    { label: "course (FK)", width: 170 },
    { label: "name", width: 420 },
  ];
  const coursesW = courseCols.reduce((sum, column) => sum + column.width, 0);
  const modulesW = moduleCols.reduce((sum, column) => sum + column.width, 0);
  const headH = 46;
  const rowH = 44;
  const coursesBottom = coursesY + headH + 2 * rowH;
  const modulesY = coursesBottom + 88;
  const pkX = coursesX + courseCols[0].width / 2;
  const fkX = coursesX + moduleCols[0].width + moduleCols[1].width / 2;
  const gapY = coursesBottom + 44;
  const json = `{
  "_id": "RS101",
  "name": "Rocket Propulsion",
  "number": "RS4550",
  "modules": [{
      "_id": "M101",
      "name": "Introduction to Rocket Propulsion"
    }, {
      "_id": "M102",
      "name": "Fuel and Combustion"
    }]
}`.split("\n");
  const leftW = 36 + modulesW + 36;
  const rightX = leftW + 28;
  const rightW = 760;
  const height = 620;
  const width = rightX + rightW + 20;
  return (
    <svg
      role="img"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      aria-label="SQL tables beside one indented course document"
    >
      <title>SQL tables beside one indented course document</title>
      <rect x={16} y={16} width={leftW - 8} height={height - 32} rx={12} fill={YELLOW.fill} stroke={YELLOW.stroke} strokeWidth={3} />
      <path d={headerPath(16, 16, leftW - 8, 48)} fill={YELLOW.header} stroke={YELLOW.stroke} strokeWidth={3} />
      <line x1={16} y1={64} x2={leftW + 8} y2={64} stroke={YELLOW.stroke} strokeWidth={3} />
      <text x={16 + (leftW - 8) / 2} y={48} textAnchor="middle" fontFamily={FONT} fontSize={22} fontWeight={700} fill="#171717">
        SQL tables
      </text>
      <DataTable
        x={coursesX}
        y={coursesY}
        caption="courses"
        columns={courseCols}
        rows={[
          ["RS101", "Rocket Propulsion", "RS4550"],
          ["RS102", "Aerodynamics", "RS4560"],
        ]}
      />
      <DataTable
        x={coursesX}
        y={modulesY}
        caption="modules"
        columns={moduleCols}
        rows={[
          ["M101", "RS101", "Introduction to Rocket Propulsion"],
          ["M102", "RS101", "Fuel and Combustion"],
        ]}
      />
      <line x1={fkX} y1={modulesY} x2={fkX} y2={gapY} stroke="#171717" strokeWidth={3} />
      <line x1={fkX} y1={gapY} x2={pkX} y2={gapY} stroke="#171717" strokeWidth={3} />
      <line x1={pkX} y1={gapY} x2={pkX} y2={coursesBottom + 14} stroke="#171717" strokeWidth={3} />
      <polygon points={`${pkX},${coursesBottom} ${pkX - 7},${coursesBottom + 14} ${pkX + 7},${coursesBottom + 14}`} fill="#171717" />
      <text x={(fkX + pkX) / 2} y={gapY - 10} textAnchor="middle" fontFamily={FONT} fontSize={16} fontWeight={700} fill="#171717">
        FK → PK
      </text>

      <rect x={rightX} y={16} width={rightW} height={height - 32} rx={12} fill={RED.fill} stroke={RED.stroke} strokeWidth={3} />
      <path d={headerPath(rightX, 16, rightW, 48)} fill={RED.header} stroke={RED.stroke} strokeWidth={3} />
      <line x1={rightX} y1={64} x2={rightX + rightW} y2={64} stroke={RED.stroke} strokeWidth={3} />
      <text x={rightX + rightW / 2} y={48} textAnchor="middle" fontFamily={FONT} fontSize={22} fontWeight={700} fill="#171717">
        JSON document
      </text>
      <rect x={rightX + 28} y={92} width={rightW - 56} height={json.length * 32 + 28} fill="#fff" stroke={RED.stroke} strokeWidth={2} />
      {json.map((line, index) => {
        const indented = svgIndentedLine(line, 22);
        return (
          <text
            key={`${index}-${indented.text}`}
            x={rightX + 44 + indented.xOffset}
            y={124 + index * 32}
            fontFamily={MONO}
            fontSize={18}
            fill="#171717"
          >
            {indented.text}
          </text>
        );
      })}
    </svg>
  );
}

const ARRAY_ROUTES = [
  "GET /lab5/todos",
  "GET /lab5/todos/:id",
  "GET /lab5/todos?completed=true",
  "GET /lab5/todos/create",
  "GET /lab5/todos/:id/delete",
  "GET /lab5/todos/:id/title/:title",
  "GET /lab5/todos/:id/completed/:completed",
  "GET /lab5/todos/:id/description/:description",
];

const ARRAY_METHODS = ["fetchTodos", "createNewTodo", "removeTodo"];

function ArraysPicture() {
  const uiW = 360;
  const clientW = 250;
  const routeW = 500;
  const gapUi = 28;
  const gapHttp = 176;
  const left = 24;
  const uiX = left;
  const clientX = uiX + uiW + gapUi;
  const routeX = clientX + clientW + gapHttp;
  const width = routeX + routeW + 24;
  const routeH = boxHeight(ARRAY_ROUTES.length);
  const clientH = boxHeight(ARRAY_METHODS.length);
  const uiH = boxHeight(1);
  const boxH = Math.max(routeH, clientH, uiH);
  const height = 24 + boxH + 20;
  const top = 20;
  const requestY = top + HEADER_H + 18;
  const responseY = top + HEADER_H + 52;
  const boxes = [
    {
      x: uiX,
      w: uiW,
      h: boxH,
      name: "WorkingWithRemoteArrays",
      lines: ["WorkingWithRemoteArrays.tsx"],
      tone: BLUE,
    },
    {
      x: clientX,
      w: clientW,
      h: boxH,
      name: "client.ts",
      lines: ARRAY_METHODS,
      tone: BLUE,
    },
    {
      x: routeX,
      w: routeW,
      h: boxH,
      name: "WorkingWithRemoteArrays.ts",
      lines: ARRAY_ROUTES,
      tone: YELLOW,
    },
  ];

  return (
    <svg
      role="img"
      viewBox={`0 0 ${width} ${height}`}
      aria-label="WorkingWithRemoteArrays calls client.ts, which requests every Lab 5 todos route"
    >
      <title>Remote arrays from the component to the routes</title>
      <Arrow x1={clientX + clientW + 8} x2={routeX - 8} y={requestY} />
      <text
        x={clientX + clientW + gapHttp / 2}
        y={requestY - 8}
        textAnchor="middle"
        fontFamily={FONT}
        fontSize={13}
        fontWeight={700}
        fill="#171717"
      >
        HTTP REQUEST
      </text>
      <Arrow x1={routeX - 8} x2={clientX + clientW + 8} y={responseY} dashed />
      <text
        x={clientX + clientW + gapHttp / 2}
        y={responseY + 18}
        textAnchor="middle"
        fontFamily={FONT}
        fontSize={13}
        fontWeight={700}
        fill="#171717"
      >
        HTTP RESPONSE
      </text>
      {boxes.map((box) => (
        <g key={box.name}>
          <rect
            x={box.x}
            y={top}
            width={box.w}
            height={box.h}
            rx={RADIUS}
            fill={box.tone.fill}
            stroke={box.tone.stroke}
            strokeWidth={3}
          />
          <path
            d={headerPath(box.x, top, box.w, HEADER_H)}
            fill={box.tone.header}
            stroke={box.tone.stroke}
            strokeWidth={3}
          />
          <line
            x1={box.x}
            y1={top + HEADER_H}
            x2={box.x + box.w}
            y2={top + HEADER_H}
            stroke={box.tone.stroke}
            strokeWidth={3}
          />
          <text
            x={box.x + box.w / 2}
            y={top + 31}
            textAnchor="middle"
            fontFamily={FONT}
            fontSize={18}
            fontWeight={700}
            fill="#171717"
          >
            {box.name}
          </text>
          {box.lines.map((line, lineIndex) => (
            <text
              key={line}
              x={box.x + 16}
              y={top + HEADER_H + 22 + lineIndex * LINE_H}
              fontFamily={MONO}
              fontSize={15}
              fill="#171717"
            >
              {line}
            </text>
          ))}
        </g>
      ))}
    </svg>
  );
}

export type StackDiagramId = keyof typeof STACKS;

export function isStackDiagram(id: string): id is StackDiagramId | "sql-vs-document" | "arrays-stack" {
  return id === "sql-vs-document" || id === "arrays-stack" || Object.prototype.hasOwnProperty.call(STACKS, id);
}

export function StackDiagram({ id }: { id: string }) {
  if (id === "sql-vs-document") return <SqlVsDocument />;
  if (id === "arrays-stack") return <ArraysPicture />;
  const spec = STACKS[id];
  if (!spec) return null;
  return (
    <Flow
      title={spec.title}
      boxes={spec.boxes}
      boxWidth={spec.boxWidth}
      large={spec.large}
    />
  );
}

export const STACK_DIAGRAM_IDS = ["sql-vs-document", "arrays-stack", ...Object.keys(STACKS)];
