const BLUE = { header: "#a4c2f4", stroke: "#2f6fd0", group: "#e8f0fe", body: "#ffffff" };
const YELLOW = { header: "#ffe59a", stroke: "#e09038", group: "#fff8dc", body: "#ffffff" };
const RED = { header: "#f8c8c8", stroke: "#dc2626", group: "#fff1f2", body: "#ffffff" };

const FONT = "ui-sans-serif, system-ui, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

const BOX_W = 268;
const HEADER_H = 58;
const ROW_H = 28;
const ROWS = 5;
const BOX_H = HEADER_H + ROWS * ROW_H + 8;
const BOX_Y = 64;

type Tone = { header: string; stroke: string; group: string; body: string };

function ClassBox({
  x,
  name,
  stereotype,
  members,
  tone,
  focused = false,
}: {
  x: number;
  name: string;
  stereotype: string;
  members: string[];
  tone: Tone;
  focused?: boolean;
}) {
  const padded = Array.from({ length: ROWS }, (_, index) => members[index] ?? "");
  return (
    <g>
      <rect
        x={x}
        y={BOX_Y}
        width={BOX_W}
        height={BOX_H}
        rx={8}
        fill={tone.body}
        stroke={tone.stroke}
        strokeWidth={focused ? 6 : 3}
      />
      <path
        d={`M${x} ${BOX_Y + 8} a8 8 0 0 1 8 -8 h${BOX_W - 16} a8 8 0 0 1 8 8 v${HEADER_H - 8} h-${BOX_W} z`}
        fill={tone.header}
        stroke={tone.stroke}
        strokeWidth={3}
      />
      <line
        x1={x}
        y1={BOX_Y + HEADER_H}
        x2={x + BOX_W}
        y2={BOX_Y + HEADER_H}
        stroke={tone.stroke}
        strokeWidth={3}
      />
      <text
        x={x + BOX_W / 2}
        y={BOX_Y + 22}
        textAnchor="middle"
        fontFamily={FONT}
        fontSize={15}
        fill="#404040"
      >
        {stereotype}
      </text>
      <text
        x={x + BOX_W / 2}
        y={BOX_Y + 44}
        textAnchor="middle"
        fontFamily={FONT}
        fontSize={20}
        fontWeight={700}
        fill="#171717"
      >
        {name}
      </text>
      {padded.map((member, index) => (
        <text
          key={`${name}-${index}`}
          x={x + 14}
          y={BOX_Y + HEADER_H + 22 + index * ROW_H}
          fontFamily={MONO}
          fontSize={15}
          fill="#171717"
        >
          {member}
        </text>
      ))}
    </g>
  );
}

function HArrow({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  const dir = x2 > x1 ? 1 : -1;
  const tip = x2;
  const base = x2 - dir * 14;
  return (
    <g>
      <line x1={x1} y1={y} x2={base} y2={y} stroke="#171717" strokeWidth={3} />
      <polygon points={`${tip},${y} ${base},${y - 7} ${base},${y + 7}`} fill="#171717" />
      {label.split("\n").map((line, index, lines) => (
        <text
          key={line}
          x={(x1 + x2) / 2}
          y={y - 10 - (lines.length - 1 - index) * 16}
          textAnchor="middle"
          fontFamily={FONT}
          fontSize={15}
          fontWeight={700}
          fill="#171717"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

export type TierDiagramFocus = "ui" | "client" | "routes" | "dao";

type TierSpec = {
  titleId: string;
  title: string;
  uiName: string;
  uiMembers: string[];
  clientName: string;
  clientMembers: string[];
  routesName: string;
  routesMembers: string[];
  daoName: string;
  daoMembers: string[];
  focus?: TierDiagramFocus;
};

export function TierDiagram({
  titleId,
  title,
  uiName,
  uiMembers,
  clientName,
  clientMembers,
  routesName,
  routesMembers,
  daoName,
  daoMembers,
  focus,
}: TierSpec) {
  const uiX = 32;
  const clientX = 352;
  const routesX = 756;
  const daoX = 1076;
  const dbX = 1488;
  const midY = BOX_Y + BOX_H / 2;
  const groupY = 12;
  const clientGroupX = uiX - 16;
  const clientGroupW = clientX + BOX_W + 16 - clientGroupX;
  const serverGroupX = routesX - 16;
  const serverGroupW = dbX + BOX_W + 16 - serverGroupX;
  const filesX = dbX + BOX_W + 88;
  const filesY = BOX_Y + 36;
  const focusX =
    focus === "ui" ? uiX : focus === "client" ? clientX : focus === "routes" ? routesX : focus === "dao" ? daoX : null;
  const hereExtra = focusX == null ? 0 : 78;
  const groupBottom = BOX_Y + BOX_H + 16 + hereExtra;
  const groupH = groupBottom - groupY;

  return (
    <svg
      role="img"
      viewBox={`0 0 2048 ${292 + hereExtra}`}
      aria-labelledby={titleId}
    >
      <title id={titleId}>{title}</title>
      <rect x={clientGroupX} y={groupY} width={clientGroupW} height={groupH} rx={16} fill={BLUE.group} stroke={BLUE.stroke} strokeWidth={3} />
      <text x={uiX} y={groupY + 28} fontFamily={FONT} fontSize={18} fontWeight={700} fill={BLUE.stroke}>
        Client
      </text>
      <rect x={serverGroupX} y={groupY} width={serverGroupW} height={groupH} rx={16} fill={YELLOW.group} stroke={YELLOW.stroke} strokeWidth={3} />
      <text x={routesX} y={groupY + 28} fontFamily={FONT} fontSize={18} fontWeight={700} fill={YELLOW.stroke}>
        Server
      </text>

      <ClassBox
        x={uiX}
        name={uiName}
        stereotype="<<UI>>"
        members={uiMembers}
        tone={BLUE}
        focused={focusX === uiX}
      />
      <ClassBox
        x={clientX}
        name={clientName}
        stereotype="<<client.ts>>"
        members={clientMembers}
        tone={BLUE}
        focused={focusX === clientX}
      />
      <ClassBox
        x={routesX}
        name={routesName}
        stereotype="<<routes.ts>>"
        members={routesMembers}
        tone={YELLOW}
        focused={focusX === routesX}
      />
      <ClassBox
        x={daoX}
        name={daoName}
        stereotype="<<dao.ts>>"
        members={daoMembers}
        tone={YELLOW}
        focused={focusX === daoX}
      />
      <ClassBox
        x={dbX}
        name="Database"
        stereotype="<<in-memory object>>"
        members={["courses", "modules", "assignments", "users", "enrollments"]}
        tone={RED}
      />

      <g>
        <rect
          x={filesX}
          y={filesY}
          width={176}
          height={148}
          rx={8}
          fill="#fff"
          stroke={RED.stroke}
          strokeWidth={2}
          strokeDasharray="7 5"
        />
        {["courses.json", "modules.json", "assignments.json", "users.json", "enrollments.json"].map(
          (file, index) => (
            <text
              key={file}
              x={filesX + 12}
              y={filesY + 28 + index * 24}
              fontFamily={MONO}
              fontSize={14}
              fill="#171717"
            >
              {file}
            </text>
          ),
        )}
        <line
          x1={filesX}
          y1={filesY + 74}
          x2={dbX + BOX_W + 12}
          y2={midY}
          stroke={RED.stroke}
          strokeWidth={2}
          strokeDasharray="7 5"
        />
        <polygon
          points={`${dbX + BOX_W},${midY} ${dbX + BOX_W + 12},${midY - 6} ${dbX + BOX_W + 12},${midY + 6}`}
          fill={RED.stroke}
        />
        <text
          x={(filesX + dbX + BOX_W) / 2}
          y={filesY + 52}
          textAnchor="middle"
          fontFamily={FONT}
          fontSize={14}
          fontWeight={700}
          fill={RED.stroke}
        >
          imported at startup
        </text>
      </g>

      <HArrow x1={uiX + BOX_W} x2={clientX} y={midY} label="uses" />
      <HArrow x1={clientX + BOX_W} x2={routesX} y={midY} label="HTTP requests" />
      <HArrow x1={routesX + BOX_W} x2={daoX} y={midY} label="calls" />
      <HArrow x1={daoX + BOX_W} x2={dbX} y={midY} label={"reads/updates\nin memory"} />
      {focusX == null ? null : (
        <g>
          <line
            x1={focusX + BOX_W / 2}
            y1={BOX_Y + BOX_H + 46}
            x2={focusX + BOX_W / 2}
            y2={BOX_Y + BOX_H + 16}
            stroke="#171717"
            strokeWidth={3}
          />
          <polygon
            points={`${focusX + BOX_W / 2},${BOX_Y + BOX_H + 4} ${focusX + BOX_W / 2 - 8},${BOX_Y + BOX_H + 18} ${focusX + BOX_W / 2 + 8},${BOX_Y + BOX_H + 18}`}
            fill="#171717"
          />
          <text
            x={focusX + BOX_W / 2}
            y={BOX_Y + BOX_H + 66}
            textAnchor="middle"
            fontFamily={FONT}
            fontSize={15}
            fontWeight={700}
            fill="#171717"
          >
            you are here
          </text>
        </g>
      )}
    </svg>
  );
}

const ACCOUNT: TierSpec = {
  titleId: "account-dao-title",
  title:
    "AccountUI uses AccountClient. HTTP requests reach UserRoutes, which calls UserDao. UserDao reads and updates the in-memory Database. JSON files are imported once at startup and are not written.",
  uiName: "AccountUI",
  uiMembers: ["signin()", "signup()", "setCurrentUser()"],
  clientName: "AccountClient",
  clientMembers: ["signin()", "signup()", "profile()", "signout()"],
  routesName: "UserRoutes",
  routesMembers: [
    "POST /api/users/signup",
    "POST /api/users/signin",
    "POST /api/users/signout",
    "GET /api/users/profile",
    "PUT /api/users/:userId",
  ],
  daoName: "UserDao",
  daoMembers: [
    "createUser()",
    "findUserByUsername()",
    "findUserByCredentials()",
    "updateUser()",
    "deleteUser()",
  ],
};

export default function AccountDaoDiagram({ focus }: { focus?: TierDiagramFocus }) {
  return <TierDiagram {...ACCOUNT} focus={focus} />;
}

export function CoursesTierDiagram() {
  return (
    <TierDiagram
      titleId="courses-dao-title"
      title="Dashboard uses CoursesClient. HTTP requests reach CourseRoutes, which calls CoursesDao. CoursesDao reads and updates the in-memory Database."
      uiName="Dashboard"
      uiMembers={["findMyCourses()", "createCourse()", "fetchAllCourses()"]}
      clientName="CoursesClient"
      clientMembers={["fetchAllCourses()", "findMyCourses()", "createCourse()"]}
      routesName="CourseRoutes"
      routesMembers={[
        "GET /api/courses",
        "GET /users/:userId/courses",
        "POST /users/current/courses",
      ]}
      daoName="CoursesDao"
      daoMembers={["findAllCourses()", "findCoursesForEnrolledUser()", "createCourse()"]}
    />
  );
}

export function AssignmentsTierDiagram() {
  return (
    <TierDiagram
      titleId="assignments-dao-title"
      title="AssignmentsPage uses AssignmentsClient. HTTP requests reach AssignmentRoutes, which calls AssignmentsDao. AssignmentsDao reads and updates the in-memory Database."
      uiName="AssignmentsPage"
      uiMembers={[
        "findAssignmentsForCourse()",
        "createAssignmentForCourse()",
        "updateAssignment()",
        "deleteAssignment()",
      ]}
      clientName="AssignmentsClient"
      clientMembers={[
        "findAssignmentsForCourse()",
        "createAssignmentForCourse()",
        "updateAssignment()",
        "deleteAssignment()",
      ]}
      routesName="AssignmentRoutes"
      routesMembers={[
        "GET /courses/:cid/assignments",
        "POST /courses/:cid/assignments",
        "PUT /assignments/:id",
        "DELETE /assignments/:id",
      ]}
      daoName="AssignmentsDao"
      daoMembers={[
        "findAssignmentsForCourse()",
        "createAssignment()",
        "updateAssignment()",
        "deleteAssignment()",
      ]}
    />
  );
}

export function ModulesTierDiagram() {
  return (
    <TierDiagram
      titleId="modules-dao-title"
      title="ModulesPage uses ModulesClient. HTTP requests reach ModuleRoutes, which calls ModulesDao. ModulesDao reads and updates the in-memory Database."
      uiName="ModulesPage"
      uiMembers={[
        "findModulesForCourse()",
        "createModuleForCourse()",
        "updateModule()",
        "deleteModule()",
      ]}
      clientName="ModulesClient"
      clientMembers={[
        "findModulesForCourse()",
        "createModuleForCourse()",
        "updateModule()",
        "deleteModule()",
      ]}
      routesName="ModuleRoutes"
      routesMembers={[
        "GET /courses/:cid/modules",
        "POST /courses/:cid/modules",
        "PUT /modules/:moduleId",
        "DELETE /modules/:moduleId",
      ]}
      daoName="ModulesDao"
      daoMembers={[
        "findModulesForCourse()",
        "createModule()",
        "updateModule()",
        "deleteModule()",
      ]}
    />
  );
}
