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
}: {
  x1: number;
  x2: number;
  y: number;
  dashed?: boolean;
}) {
  const dir = x2 > x1 ? 1 : -1;
  const base = x2 - dir * 12;
  return (
    <g>
      <line
        x1={x1}
        y1={y}
        x2={base}
        y2={y}
        stroke="#171717"
        strokeWidth={3}
        strokeDasharray={dashed ? "8 6" : undefined}
      />
      <polygon points={`${x2},${y} ${base},${y - 6} ${base},${y + 6}`} fill="#171717" />
    </g>
  );
}

function Flow({ title, boxes, boxWidth }: { title: string; boxes: Box[]; boxWidth: number }) {
  const gap = 108;
  const heights = boxes.map((box) => boxHeight(box.lines.length));
  const width = 36 + boxes.length * boxWidth + (boxes.length - 1) * gap + 36;
  const height = 24 + Math.max(...heights) + 20;
  const top = 20;
  const requestY = top + HEADER_H + 10;
  const responseY = top + HEADER_H + 32;

  return (
    <svg role="img" viewBox={`0 0 ${width} ${height}`} aria-label={title}>
      <title>{title}</title>
      {boxes.map((box, index) => {
        const tone: Tone = TONES[box.tone];
        const x = 36 + index * (boxWidth + gap);
        const h = heights[index]!;
        const stroke = box.emphasis ? 6 : 3;
        return (
          <g key={`${box.name}-${index}`}>
            {index > 0 ? (
              <g>
                <Arrow x1={x - gap + 4} x2={x - 4} y={requestY} />
                <text
                  x={x - gap / 2}
                  y={requestY - 6}
                  textAnchor="middle"
                  fontFamily={FONT}
                  fontSize={13}
                  fontWeight={700}
                  fill="#171717"
                >
                  request
                </text>
                <Arrow x1={x - 4} x2={x - gap + 4} y={responseY} dashed />
                <text
                  x={x - gap / 2}
                  y={responseY + 16}
                  textAnchor="middle"
                  fontFamily={FONT}
                  fontSize={13}
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
              d={headerPath(x, top, boxWidth, HEADER_H)}
              fill={tone.header}
              stroke={tone.stroke}
              strokeWidth={stroke}
            />
            <line
              x1={x}
              y1={top + HEADER_H}
              x2={x + boxWidth}
              y2={top + HEADER_H}
              stroke={tone.stroke}
              strokeWidth={stroke}
            />
            <text
              x={x + boxWidth / 2}
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
                x={x + 12}
                y={top + HEADER_H + 20 + lineIndex * LINE_H}
                fontFamily={MONO}
                fontSize={14}
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

const STACKS: Record<string, { title: string; boxWidth: number; boxes: Box[] }> = {
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
    boxWidth: 230,
    boxes: [
      { name: "Users", lines: ["setUsers"], tone: "blue" },
      { name: "findAllUsers", lines: ["GET"], tone: "blue" },
      { name: "GET /api/users", lines: ["await dao"], tone: "yellow" },
      { name: "model.find()", lines: ["users"], tone: "red" },
    ],
  },
  "users-filter": {
    title: "GET /api/users?role and ?name",
    boxWidth: 250,
    boxes: [
      { name: "Users", lines: ["role or name"], tone: "blue" },
      { name: "findUsersByRole", lines: ["GET ?role"], tone: "blue" },
      { name: "GET /api/users", lines: ["?name too"], tone: "yellow" },
      { name: "find()", lines: ["role or $regex"], tone: "red" },
    ],
  },
  "users-read-one": {
    title: "GET /api/users/:userId",
    boxWidth: 230,
    boxes: [
      { name: "Details", lines: ["uid"], tone: "blue" },
      { name: "findUserById", lines: ["GET"], tone: "blue" },
      { name: "GET /:userId", lines: ["await dao"], tone: "yellow" },
      { name: "findById", lines: ["one user"], tone: "red" },
    ],
  },
  "users-delete": {
    title: "DELETE /api/users/:userId",
    boxWidth: 240,
    boxes: [
      { name: "Details", lines: ["onDelete"], tone: "blue" },
      { name: "deleteUser", lines: ["DELETE"], tone: "blue" },
      { name: "DELETE /:userId", lines: ["await dao"], tone: "yellow" },
      { name: "deleteOne", lines: ["users"], tone: "red" },
    ],
  },
  "users-update": {
    title: "PUT /api/users/:userId",
    boxWidth: 230,
    boxes: [
      { name: "Details", lines: ["onSave"], tone: "blue" },
      { name: "updateUser", lines: ["PUT"], tone: "blue" },
      { name: "PUT /:userId", lines: ["$set"], tone: "yellow" },
      { name: "updateOne", lines: ["users"], tone: "red" },
    ],
  },
  "users-create": {
    title: "POST /api/users",
    boxWidth: 230,
    boxes: [
      { name: "Users", lines: ["onCreate"], tone: "blue" },
      { name: "createUser", lines: ["POST"], tone: "blue" },
      { name: "POST /api/users", lines: ["await dao"], tone: "yellow" },
      { name: "model.create", lines: ["users"], tone: "red" },
    ],
  },
  "courses-stack": {
    title: "Courses from the Dashboard to MongoDB",
    boxWidth: 320,
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
    boxes: [
      { name: "Dashboard", lines: ["setCourses"], tone: "blue" },
      { name: "fetchAllCourses", lines: ["GET"], tone: "blue" },
      { name: "GET /api/courses", lines: ["await dao"], tone: "yellow" },
      { name: "model.find()", lines: ["courses"], tone: "red" },
    ],
  },
  "courses-read-one": {
    title: "GET /api/courses/:courseId",
    boxWidth: 240,
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
    boxes: [
      { name: "Dashboard", lines: ["addCourse"], tone: "blue" },
      { name: "createCourse", lines: ["POST"], tone: "blue" },
      { name: "POST /api/courses", lines: ["await dao"], tone: "yellow" },
      { name: "model.create", lines: ["courses"], tone: "red" },
    ],
  },
  "modules-stack": {
    title: "Modules from the page to MongoDB",
    boxWidth: 360,
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
    boxes: [
      { name: "Modules", lines: ["addModule"], tone: "blue" },
      { name: "createModule", lines: ["POST"], tone: "blue" },
      { name: "POST nested", lines: ["await dao"], tone: "yellow" },
      { name: "model.create", lines: ["modules"], tone: "red" },
    ],
  },
  "enroll-stack": {
    title: "Enrollments from People to MongoDB",
    boxWidth: 360,
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
    boxes: [
      { name: "Dashboard", lines: ["setCourses"], tone: "blue" },
      { name: "findMyCourses", lines: ["GET"], tone: "blue" },
      { name: "GET current", lines: ["populate"], tone: "yellow" },
      { name: "enrollments", lines: ["course ref"], tone: "red" },
    ],
  },
  "enroll-people": {
    title: "GET /api/courses/:cid/users",
    boxWidth: 260,
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
    boxes: [
      { name: "Dashboard", lines: ["delete course"], tone: "blue" },
      { name: "deleteCourse", lines: ["DELETE"], tone: "blue" },
      { name: "DELETE /:courseId", lines: ["deleteMany"], tone: "yellow" },
      { name: "enrollments", lines: ["{ course }"], tone: "red" },
    ],
  },
  "enroll-create": {
    title: "POST enrolls the user",
    boxWidth: 250,
    boxes: [
      { name: "Dashboard", lines: ["enroll"], tone: "blue" },
      { name: "enrollIntoCourse", lines: ["POST"], tone: "blue" },
      { name: "POST /:uid/courses/:cid", lines: ["session"], tone: "yellow" },
      { name: "model.create", lines: ["enrollments"], tone: "red" },
    ],
  },
  "enroll-unenroll": {
    title: "DELETE unenrolls the user",
    boxWidth: 260,
    boxes: [
      { name: "Dashboard", lines: ["unenroll"], tone: "blue" },
      { name: "unenrollFromCourse", lines: ["DELETE"], tone: "blue" },
      { name: "DELETE /:uid/courses/:cid", lines: ["session"], tone: "yellow" },
      { name: "deleteOne", lines: ["enrollments"], tone: "red" },
    ],
  },
};

export type StackDiagramId = keyof typeof STACKS;

export function isStackDiagram(id: string): id is StackDiagramId {
  return Object.prototype.hasOwnProperty.call(STACKS, id);
}

export function StackDiagram({ id }: { id: string }) {
  const spec = STACKS[id];
  if (!spec) return null;
  return <Flow title={spec.title} boxes={spec.boxes} boxWidth={spec.boxWidth} />;
}

export const STACK_DIAGRAM_IDS = Object.keys(STACKS);
