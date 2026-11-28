const BLUE = { header: "#a4c2f4", stroke: "#2f6fd0" };
const YELLOW = { header: "#ffe59a", stroke: "#e09038" };
const RED = { header: "#f8c8c8", stroke: "#dc2626" };

const FONT = "ui-sans-serif, system-ui, sans-serif";

type Tone = { header: string; stroke: string };
type ActorId = "a" | "b" | "c" | "server" | "store";

const TONE: Record<ActorId, Tone> = {
  a: BLUE,
  b: BLUE,
  c: BLUE,
  server: YELLOW,
  store: RED,
};

type Step = {
  from: ActorId;
  to: ActorId;
  lines: string[];
  dashed?: boolean;
};

function ArrowHead({ x, y, dir }: { x: number; y: number; dir: 1 | -1 }) {
  const base = x - dir * 14;
  return <polygon points={`${x},${y} ${base},${y - 7} ${base},${y + 7}`} fill="#171717" />;
}

/** Wide enough that "Session Store" still reaches the 24px label target. */
const ACTOR_W = 400;
const ACTOR_TOP = 18;
const ACTOR_H = 64;
/**
 * Baseline gap for a two-line message. The slide raiser aims at 24px and
 * will not grow a label past 80% of this gap, so the lines cannot overlap.
 */
const LABEL_LINE = 46;
/** Last baseline above the arrow shaft, clear of the self-call hump. */
const LABEL_ABOVE = 50;
/** Room under the actor box before the first label, past the open-gap pad. */
const PILL_CLEAR = 68;
/**
 * Shaft-to-shaft pitch. A two-line label sits above its shaft, so the pitch
 * has to clear that stack and the previous self-call hook.
 */
const STEP = 148;

function Actor({
  x,
  name,
  tone,
  lifeBottom,
}: {
  x: number;
  name: string;
  tone: Tone;
  lifeBottom: number;
}) {
  const left = x - ACTOR_W / 2;
  return (
    <g>
      <rect
        x={left}
        y={ACTOR_TOP}
        width={ACTOR_W}
        height={ACTOR_H}
        rx={12}
        fill={tone.header}
        stroke={tone.stroke}
        strokeWidth={3}
      />
      <text
        x={x}
        y={ACTOR_TOP + 42}
        textAnchor="middle"
        fontFamily={FONT}
        fontSize={22}
        fontWeight={700}
        fill="#171717"
      >
        {name}
      </text>
      <line
        x1={x}
        y1={ACTOR_TOP + ACTOR_H}
        x2={x}
        y2={lifeBottom}
        stroke="#737373"
        strokeWidth={2}
        strokeDasharray="6 6"
      />
    </g>
  );
}

function SequenceDiagram({
  title,
  actors,
  steps,
}: {
  title: string;
  actors: { id: ActorId; name: string }[];
  steps: Step[];
}) {
  const width = 1440;
  const inset = ACTOR_W / 2 + 28;
  const xs = actors.map(
    (_, index) => inset + index * ((width - 2 * inset) / Math.max(actors.length - 1, 1)),
  );
  const xOf = (id: ActorId) => xs[actors.findIndex((actor) => actor.id === id)]!;
  const maxLines = Math.max(1, ...steps.map((step) => step.lines.length));
  const firstArrow = ACTOR_TOP + ACTOR_H + PILL_CLEAR + (maxLines - 1) * LABEL_LINE + LABEL_ABOVE;
  const height = firstArrow + Math.max(steps.length - 1, 0) * STEP + 48;

  return (
    <svg
      role="img"
      data-diagram-natural=""
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      aria-labelledby={`${title.replace(/\s+/g, "-")}-title`}
    >
      <title id={`${title.replace(/\s+/g, "-")}-title`}>{title}</title>
      {actors.map((actor, index) => (
        <Actor
          key={actor.id}
          x={xs[index]!}
          name={actor.name}
          tone={TONE[actor.id]}
          lifeBottom={height - 24}
        />
      ))}
      {steps.map((step, index) => {
        const y = firstArrow + index * STEP;
        const x1 = xOf(step.from);
        const x2 = xOf(step.to);
        const self = step.from === step.to;
        const labelX = self ? x1 + 150 : (x1 + x2) / 2;
        return (
          <g key={`${step.from}-${step.to}-${index}`}>
            {self ? (
              <>
                <path
                  d={`M${x1} ${y - 24} h56 v24`}
                  fill="none"
                  stroke="#171717"
                  strokeWidth={3}
                />
                <line x1={x1 + 56} y1={y} x2={x1 + 16} y2={y} stroke="#171717" strokeWidth={3} />
                <ArrowHead x={x1} y={y} dir={-1} />
              </>
            ) : (
              <>
                <line
                  x1={x1}
                  y1={y}
                  x2={x2 > x1 ? x2 - 16 : x2 + 16}
                  y2={y}
                  stroke="#171717"
                  strokeWidth={3}
                  strokeDasharray={step.dashed ? "8 6" : undefined}
                />
                <ArrowHead x={x2} y={y} dir={x2 > x1 ? 1 : -1} />
              </>
            )}
            {step.lines.map((line, lineIndex) => (
              <text
                key={line}
                x={labelX}
                y={y - LABEL_ABOVE - (step.lines.length - 1 - lineIndex) * LABEL_LINE}
                textAnchor="middle"
                fontFamily={FONT}
                fontSize={18}
                fontWeight={700}
                fill="#171717"
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

const BROWSER_SERVER_STORE = [
  { id: "a" as const, name: "Browser" },
  { id: "server" as const, name: "Server" },
  { id: "store" as const, name: "Session Store" },
];

export function SessionCreateDiagram() {
  return (
    <SequenceDiagram
      title="First write creates the session and sets the cookie"
      actors={BROWSER_SERVER_STORE}
      steps={[
        { from: "a", to: "server", lines: ["POST /api/users/signin", "(no cookie)"] },
        { from: "server", to: "server", lines: ["Find user by credentials"] },
        { from: "server", to: "server", lines: ["Generate session ID abc123"] },
        {
          from: "server",
          to: "store",
          lines: ["Store { currentUser: user }", "indexed by abc123"],
        },
        {
          from: "server",
          to: "a",
          lines: ["200 user + Set-Cookie:", "connect.sid=abc123"],
          dashed: true,
        },
        { from: "a", to: "a", lines: ["Store cookie"] },
      ]}
    />
  );
}

export function SessionUpdateDiagram() {
  return (
    <SequenceDiagram
      title="Setting a value in an existing session"
      actors={BROWSER_SERVER_STORE}
      steps={[
        {
          from: "a",
          to: "server",
          lines: ["PUT /api/users/:userId", "Cookie: connect.sid=abc123"],
        },
        { from: "server", to: "store", lines: ["Look up session abc123"] },
        { from: "store", to: "server", lines: ["{ currentUser: user }"], dashed: true },
        {
          from: "server",
          to: "store",
          lines: ["req.session.currentUser", "= updated user"],
        },
        { from: "server", to: "a", lines: ["200 user"], dashed: true },
      ]}
    />
  );
}

export function SessionReadDiagram() {
  return (
    <SequenceDiagram
      title="Reading a value from the session"
      actors={BROWSER_SERVER_STORE}
      steps={[
        {
          from: "a",
          to: "server",
          lines: ["GET /api/users/profile", "Cookie: connect.sid=abc123"],
        },
        { from: "server", to: "store", lines: ["Look up session abc123"] },
        { from: "store", to: "server", lines: ["{ currentUser: user }"], dashed: true },
        { from: "server", to: "a", lines: ["200 user"], dashed: true },
      ]}
    />
  );
}

export function OneCurrentUserDiagram() {
  return (
    <SequenceDiagram
      title="One currentUser shared by every browser"
      actors={[
        { id: "a", name: "Browser A" },
        { id: "server", name: "Server" },
        { id: "b", name: "Browser B" },
      ]}
      steps={[
        { from: "a", to: "server", lines: ["POST /api/users/signin", "as Alice"] },
        { from: "server", to: "server", lines: ["currentUser = Alice"] },
        { from: "b", to: "server", lines: ["POST /api/users/signin", "as Bob"] },
        { from: "server", to: "server", lines: ["currentUser = Bob"] },
        { from: "a", to: "server", lines: ["GET /api/users/profile"] },
        { from: "server", to: "a", lines: ["200 Bob"], dashed: true },
      ]}
    />
  );
}

export function ManySessionsDiagram() {
  const rows = [
    { name: "Alice", cookie: "cookie a1", session: "{ currentUser: Alice }" },
    { name: "Bob", cookie: "cookie b2", session: "{ currentUser: Bob }" },
    { name: "Carol", cookie: "cookie c3", session: "{ currentUser: Carol }" },
  ];
  return (
    <svg
      role="img"
      viewBox="0 0 1440 820"
      preserveAspectRatio="xMidYMid meet"
      aria-labelledby="many-sessions-title"
    >
      <title id="many-sessions-title">
        Alice, Bob, and Carol each have a cookie that maps to a separate session
      </title>
      <rect x={520} y={70} width={300} height={680} rx={12} fill={YELLOW.header} stroke={YELLOW.stroke} strokeWidth={3} />
      <text x={670} y={120} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={700} fill="#171717">
        Server
      </text>
      <rect x={980} y={70} width={400} height={680} rx={12} fill={RED.header} stroke={RED.stroke} strokeWidth={3} />
      <text x={1180} y={120} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={700} fill="#171717">
        Session Store
      </text>
      {rows.map((row, index) => {
        const y = 180 + index * 200;
        return (
          <g key={row.name}>
            <rect x={40} y={y} width={280} height={140} rx={12} fill={BLUE.header} stroke={BLUE.stroke} strokeWidth={3} />
            <text x={180} y={y + 58} textAnchor="middle" fontFamily={FONT} fontSize={26} fontWeight={700} fill="#171717">
              {row.name}
            </text>
            <text x={180} y={y + 98} textAnchor="middle" fontFamily={FONT} fontSize={18} fill="#171717">
              {row.cookie}
            </text>
            <line x1={320} y1={y + 70} x2={504} y2={y + 70} stroke="#171717" strokeWidth={3} />
            <ArrowHead x={520} y={y + 70} dir={1} />
            <line x1={820} y1={y + 70} x2={1004} y2={y + 70} stroke="#171717" strokeWidth={3} />
            <ArrowHead x={1020} y={y + 70} dir={1} />
            <rect x={1040} y={y} width={300} height={140} rx={10} fill="#fff" stroke={RED.stroke} strokeWidth={3} />
            <text x={1190} y={y + 64} textAnchor="middle" fontFamily={FONT} fontSize={20} fontWeight={700} fill="#171717">
              {row.cookie.split(" ")[1]}
            </text>
            <text x={1190} y={y + 100} textAnchor="middle" fontFamily={FONT} fontSize={18} fill="#171717">
              {row.session}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
