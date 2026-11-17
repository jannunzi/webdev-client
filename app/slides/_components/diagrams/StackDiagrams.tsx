const BLUE = { fill: "#e8f0fe", header: "#a4c2f4", stroke: "#2f6fd0" };
const YELLOW = { fill: "#fff8dc", header: "#ffe59a", stroke: "#e09038" };
const RED = { fill: "#fff1f2", header: "#f8c8c8", stroke: "#dc2626" };

const FONT = "ui-sans-serif, system-ui, sans-serif";

type Tone = typeof BLUE;

const TONES = {
  blue: BLUE,
  yellow: YELLOW,
  red: RED,
} as const;

type Box = { name: string; detail: string; tone: keyof typeof TONES };

function Flow({ title, boxes }: { title: string; boxes: Box[] }) {
  const width = 80 + boxes.length * 300;
  const height = 320;
  return (
    <svg role="img" viewBox={`0 0 ${width} ${height}`} aria-label={title}>
      <title>{title}</title>
      {boxes.map((box, index) => {
        const tone: Tone = TONES[box.tone];
        const x = 40 + index * 300;
        return (
          <g key={box.name}>
            {index > 0 ? (
              <line
                x1={x - 36}
                y1={150}
                x2={x}
                y2={150}
                stroke="#171717"
                strokeWidth={3}
              />
            ) : null}
            <rect
              x={x}
              y={70}
              width={250}
              height={160}
              rx={12}
              fill={tone.fill}
              stroke={tone.stroke}
              strokeWidth={3}
            />
            <rect
              x={x}
              y={70}
              width={250}
              height={48}
              rx={12}
              fill={tone.header}
              stroke={tone.stroke}
              strokeWidth={3}
            />
            <text
              x={x + 125}
              y={102}
              textAnchor="middle"
              fontFamily={FONT}
              fontSize={20}
              fontWeight={700}
              fill="#171717"
            >
              {box.name}
            </text>
            <text
              x={x + 125}
              y={160}
              textAnchor="middle"
              fontFamily={FONT}
              fontSize={16}
              fill="#171717"
            >
              {box.detail}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const STACKS: Record<string, { title: string; boxes: Box[] }> = {
  "users-stack": {
    title: "Users from the page to MongoDB",
    boxes: [
      { name: "Users page", detail: "useEffect", tone: "blue" },
      { name: "account client", detail: "axios", tone: "blue" },
      { name: "UserRoutes", detail: "/api/users", tone: "yellow" },
      { name: "UsersDao", detail: "model.find", tone: "yellow" },
      { name: "users", detail: "MongoDB", tone: "red" },
    ],
  },
  "users-read-all": {
    title: "GET /api/users",
    boxes: [
      { name: "Users", detail: "setUsers", tone: "blue" },
      { name: "findAllUsers", detail: "GET", tone: "blue" },
      { name: "GET /api/users", detail: "await dao", tone: "yellow" },
      { name: "model.find()", detail: "users", tone: "red" },
    ],
  },
  "users-read-one": {
    title: "GET /api/users/:userId",
    boxes: [
      { name: "Details", detail: "uid", tone: "blue" },
      { name: "findUserById", detail: "GET", tone: "blue" },
      { name: "GET /:userId", detail: "await dao", tone: "yellow" },
      { name: "findById", detail: "one user", tone: "red" },
    ],
  },
  "users-delete": {
    title: "DELETE /api/users/:userId",
    boxes: [
      { name: "Details", detail: "onDelete", tone: "blue" },
      { name: "deleteUser", detail: "DELETE", tone: "blue" },
      { name: "DELETE /:userId", detail: "await dao", tone: "yellow" },
      { name: "deleteOne", detail: "users", tone: "red" },
    ],
  },
  "users-update": {
    title: "PUT /api/users/:userId",
    boxes: [
      { name: "Details", detail: "onSave", tone: "blue" },
      { name: "updateUser", detail: "PUT", tone: "blue" },
      { name: "PUT /:userId", detail: "$set", tone: "yellow" },
      { name: "updateOne", detail: "users", tone: "red" },
    ],
  },
  "users-create": {
    title: "POST /api/users",
    boxes: [
      { name: "Users", detail: "onCreate", tone: "blue" },
      { name: "createUser", detail: "POST", tone: "blue" },
      { name: "POST /api/users", detail: "await dao", tone: "yellow" },
      { name: "model.create", detail: "users", tone: "red" },
    ],
  },
  "courses-stack": {
    title: "Courses from the Dashboard to MongoDB",
    boxes: [
      { name: "Dashboard", detail: "store", tone: "blue" },
      { name: "courses client", detail: "axios", tone: "blue" },
      { name: "CourseRoutes", detail: "/api/courses", tone: "yellow" },
      { name: "CoursesDao", detail: "CourseModel", tone: "yellow" },
      { name: "courses", detail: "MongoDB", tone: "red" },
    ],
  },
  "courses-read-all": {
    title: "GET /api/courses",
    boxes: [
      { name: "Dashboard", detail: "setCourses", tone: "blue" },
      { name: "fetchAllCourses", detail: "GET", tone: "blue" },
      { name: "GET /api/courses", detail: "await dao", tone: "yellow" },
      { name: "model.find()", detail: "courses", tone: "red" },
    ],
  },
  "courses-read-one": {
    title: "GET /api/courses/:courseId",
    boxes: [
      { name: "Editor", detail: "setCourse", tone: "blue" },
      { name: "findCourseById", detail: "GET", tone: "blue" },
      { name: "GET /:courseId", detail: "await dao", tone: "yellow" },
      { name: "findById", detail: "one course", tone: "red" },
    ],
  },
  "courses-delete": {
    title: "DELETE /api/courses/:courseId",
    boxes: [
      { name: "Dashboard", detail: "deleteCourse", tone: "blue" },
      { name: "deleteCourse", detail: "DELETE", tone: "blue" },
      { name: "DELETE /:courseId", detail: "await dao", tone: "yellow" },
      { name: "deleteOne", detail: "courses", tone: "red" },
    ],
  },
  "courses-update": {
    title: "PUT /api/courses/:courseId",
    boxes: [
      { name: "Dashboard", detail: "updateCourse", tone: "blue" },
      { name: "updateCourse", detail: "PUT", tone: "blue" },
      { name: "PUT /:courseId", detail: "$set", tone: "yellow" },
      { name: "updateOne", detail: "courses", tone: "red" },
    ],
  },
  "courses-create": {
    title: "POST /api/courses",
    boxes: [
      { name: "Dashboard", detail: "addCourse", tone: "blue" },
      { name: "createCourse", detail: "POST", tone: "blue" },
      { name: "POST /api/courses", detail: "await dao", tone: "yellow" },
      { name: "model.create", detail: "courses", tone: "red" },
    ],
  },
  "modules-stack": {
    title: "Modules from the page to MongoDB",
    boxes: [
      { name: "Modules", detail: "store", tone: "blue" },
      { name: "courses client", detail: "axios", tone: "blue" },
      { name: "ModuleRoutes", detail: "/api/.../modules", tone: "yellow" },
      { name: "ModulesDao", detail: "course id", tone: "yellow" },
      { name: "modules", detail: "MongoDB", tone: "red" },
    ],
  },
  "modules-read": {
    title: "GET /api/courses/:courseId/modules",
    boxes: [
      { name: "Modules", detail: "setModules", tone: "blue" },
      { name: "findModules", detail: "GET", tone: "blue" },
      { name: "GET nested", detail: "await dao", tone: "yellow" },
      { name: "find", detail: "{ course }", tone: "red" },
    ],
  },
  "modules-delete": {
    title: "DELETE /api/modules/:moduleId",
    boxes: [
      { name: "Modules", detail: "deleteModule", tone: "blue" },
      { name: "deleteModule", detail: "DELETE", tone: "blue" },
      { name: "DELETE /:moduleId", detail: "await dao", tone: "yellow" },
      { name: "deleteOne", detail: "modules", tone: "red" },
    ],
  },
  "modules-update": {
    title: "PUT /api/modules/:moduleId",
    boxes: [
      { name: "Modules", detail: "updateModule", tone: "blue" },
      { name: "updateModule", detail: "PUT", tone: "blue" },
      { name: "PUT /:moduleId", detail: "$set", tone: "yellow" },
      { name: "updateOne", detail: "modules", tone: "red" },
    ],
  },
  "modules-create": {
    title: "POST /api/courses/:courseId/modules",
    boxes: [
      { name: "Modules", detail: "addModule", tone: "blue" },
      { name: "createModule", detail: "POST", tone: "blue" },
      { name: "POST nested", detail: "await dao", tone: "yellow" },
      { name: "model.create", detail: "modules", tone: "red" },
    ],
  },
  "enroll-stack": {
    title: "Enrollments from People to MongoDB",
    boxes: [
      { name: "People", detail: "PeopleTable", tone: "blue" },
      { name: "courses client", detail: "axios", tone: "blue" },
      { name: "CourseRoutes", detail: "/courses/:cid/users", tone: "yellow" },
      { name: "EnrollmentsDao", detail: "populate", tone: "yellow" },
      { name: "enrollments", detail: "MongoDB", tone: "red" },
    ],
  },
  "enroll-read": {
    title: "GET enrolled courses and people",
    boxes: [
      { name: "Dashboard", detail: "setCourses", tone: "blue" },
      { name: "findMyCourses", detail: "GET", tone: "blue" },
      { name: "GET current", detail: "populate", tone: "yellow" },
      { name: "enrollments", detail: "refs", tone: "red" },
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
  return <Flow title={spec.title} boxes={spec.boxes} />;
}

export const STACK_DIAGRAM_IDS = Object.keys(STACKS);
