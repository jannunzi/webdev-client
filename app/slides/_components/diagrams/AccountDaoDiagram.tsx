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
}: {
  x: number;
  name: string;
  stereotype: string;
  members: string[];
  tone: Tone;
}) {
  const padded = Array.from({ length: ROWS }, (_, index) => members[index] ?? "");
  return (
    <g>
      <rect x={x} y={BOX_Y} width={BOX_W} height={BOX_H} rx={8} fill={tone.body} stroke={tone.stroke} strokeWidth={3} />
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
      <text
        x={(x1 + x2) / 2}
        y={y - 12}
        textAnchor="middle"
        fontFamily={FONT}
        fontSize={15}
        fontWeight={700}
        fill="#171717"
      >
        {label}
      </text>
    </g>
  );
}

export default function AccountDaoDiagram() {
  const uiX = 36;
  const clientX = 360;
  const routesX = 780;
  const daoX = 1104;
  const dbX = 1504;
  const midY = BOX_Y + BOX_H / 2;
  const groupY = 12;
  const groupH = BOX_Y + BOX_H + 16 - groupY;
  const clientGroupX = uiX - 16;
  const clientGroupW = clientX + BOX_W + 16 - clientGroupX;
  const serverGroupX = routesX - 16;
  const serverGroupW = daoX + BOX_W + 16 - serverGroupX;

  return (
    <svg
      role="img"
      viewBox="0 0 1788 292"
      aria-labelledby="account-dao-title"
    >
      <title id="account-dao-title">
        AccountUI uses AccountClient. HTTP requests reach UserRoutes, which calls UserDao.
        UserDao reads and writes the JSON files.
      </title>
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
        name="AccountUI"
        stereotype="<<UI>>"
        members={["signin()", "signup()", "setCurrentUser()"]}
        tone={BLUE}
      />
      <ClassBox
        x={clientX}
        name="AccountClient"
        stereotype="<<client.ts>>"
        members={["signin()", "signup()", "profile()", "signout()"]}
        tone={BLUE}
      />
      <ClassBox
        x={routesX}
        name="UserRoutes"
        stereotype="<<routes.ts>>"
        members={[
          "POST /api/users/signup",
          "POST /api/users/signin",
          "POST /api/users/signout",
          "POST /api/users/profile",
          "PUT /api/users/:userId",
        ]}
        tone={YELLOW}
      />
      <ClassBox
        x={daoX}
        name="UserDao"
        stereotype="<<dao.ts>>"
        members={[
          "createUser()",
          "findUserByUsername()",
          "findUserByCredentials()",
          "updateUser()",
          "deleteUser()",
        ]}
        tone={YELLOW}
      />
      <ClassBox
        x={dbX}
        name="Database"
        stereotype="<<JSON>>"
        members={[
          "courses.json",
          "modules.json",
          "assignments.json",
          "users.json",
          "enrollments.json",
        ]}
        tone={RED}
      />

      <HArrow x1={uiX + BOX_W} x2={clientX} y={midY} label="uses" />
      <HArrow x1={clientX + BOX_W} x2={routesX} y={midY} label="HTTP requests" />
      <HArrow x1={routesX + BOX_W} x2={daoX} y={midY} label="calls" />
      <HArrow x1={daoX + BOX_W} x2={dbX} y={midY} label="reads/writes" />
    </svg>
  );
}
