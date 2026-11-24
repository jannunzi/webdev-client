const BLUE = { fill: "#e8f0fe", header: "#a4c2f4", stroke: "#2f6fd0" };
const YELLOW = { fill: "#fff8dc", header: "#ffe59a", stroke: "#e09038" };
const RED = { fill: "#fff1f2", header: "#f8c8c8", stroke: "#dc2626" };

const FONT = "ui-sans-serif, system-ui, sans-serif";

const TONES = { blue: BLUE, yellow: YELLOW, red: RED } as const;

type ToneName = keyof typeof TONES;

type GoalBox = {
  title: string;
  lines: string[];
  tone: ToneName;
};

type GoalSpec = {
  label: string;
  boxes: GoalBox[];
  /** Label on the arrow between boxes. */
  arrow?: string;
  /** Word in the gap when the boxes are alternatives, not a flow. */
  between?: string;
  /** Aim the arrow at the last line, the row that is moving. */
  arrowOnLastLine?: boolean;
};

function headerPath(x: number, y: number, w: number, h: number) {
  const r = 12;
  return `M${x} ${y + r} a${r} ${r} 0 0 1 ${r} ${-r} h${w - 2 * r} a${r} ${r} 0 0 1 ${r} ${r} v${h - r} h${-w} z`;
}

function Arrow({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  const dir = x2 > x1 ? 1 : -1;
  const base = x2 - dir * 12;
  return (
    <g>
      <line x1={x1} y1={y} x2={base} y2={y} stroke="#171717" strokeWidth={3} />
      <polygon points={`${x2},${y} ${base},${y - 6} ${base},${y + 6}`} fill="#171717" />
    </g>
  );
}

function GoalPicture({ spec }: { spec: GoalSpec }) {
  const headerH = 46;
  const lineH = 28;
  const maxLines = Math.max(...spec.boxes.map((box) => box.lines.length));
  const boxH = headerH + maxLines * lineH + 18;
  const widths = spec.boxes.map((box) => {
    const longest = Math.max(box.title.length, ...box.lines.map((line) => line.length));
    return Math.max(220, Math.ceil(longest * 10.4 + 40));
  });
  const gapLabel = spec.arrow ?? spec.between ?? "";
  const gap = gapLabel ? Math.max(88, Math.ceil(gapLabel.length * 8.4 + 36)) : 36;
  const pad = 20;
  const width = pad + widths.reduce((sum, box) => sum + box, 0) + gap * (spec.boxes.length - 1) + pad;
  const height = 20 + boxH + 20;
  const y = 20;
  const arrowY = spec.arrowOnLastLine
    ? y + headerH + (maxLines - 0.5) * lineH
    : y + boxH / 2;
  let x = pad;

  return (
    <svg role="img" viewBox={`0 0 ${width} ${height}`} aria-labelledby="goal-diagram-title">
      <title id="goal-diagram-title">{spec.label}</title>
      {spec.boxes.map((box, index) => {
        const tone = TONES[box.tone];
        const boxW = widths[index] ?? 220;
        const boxX = x;
        const nextX = boxX + boxW + gap;
        const node = (
          <g key={box.title}>
            <rect
              x={boxX}
              y={y}
              width={boxW}
              height={boxH}
              rx={12}
              fill={tone.fill}
              stroke={tone.stroke}
              strokeWidth={3}
            />
            <path d={headerPath(boxX, y, boxW, headerH)} fill={tone.header} stroke={tone.stroke} strokeWidth={3} />
            <text
              x={boxX + boxW / 2}
              y={y + 30}
              textAnchor="middle"
              fontFamily={FONT}
              fontSize={18}
              fontWeight={700}
              fill="#171717"
            >
              {box.title}
            </text>
            {box.lines.map((line, lineIndex) => {
              const lineY = y + headerH + lineIndex * lineH;
              const last = spec.arrowOnLastLine && lineIndex === box.lines.length - 1;
              return (
                <g key={`${box.title}-${line}`}>
                  {last ? (
                    <rect
                      x={boxX + 12}
                      y={lineY + 2}
                      width={boxW - 24}
                      height={lineH - 4}
                      rx={6}
                      fill="#fff"
                      stroke={tone.stroke}
                      strokeWidth={2}
                    />
                  ) : null}
                  <text
                    x={boxX + boxW / 2}
                    y={lineY + 20}
                    textAnchor="middle"
                    fontFamily={FONT}
                    fontSize={15}
                    fontWeight={last ? 700 : 500}
                    fill="#171717"
                  >
                    {line}
                  </text>
                </g>
              );
            })}
            {index < spec.boxes.length - 1 && spec.arrow ? (
              <g>
                <Arrow x1={boxX + boxW + 8} x2={nextX - 8} y={arrowY} />
                <text
                  x={boxX + boxW + gap / 2}
                  y={arrowY - 12}
                  textAnchor="middle"
                  fontFamily={FONT}
                  fontSize={14}
                  fontWeight={700}
                  fill="#171717"
                >
                  {spec.arrow}
                </text>
              </g>
            ) : null}
            {index < spec.boxes.length - 1 && !spec.arrow && spec.between ? (
              <text
                x={boxX + boxW + gap / 2}
                y={y + boxH / 2}
                textAnchor="middle"
                fontFamily={FONT}
                fontSize={16}
                fontWeight={700}
                fill="#171717"
              >
                {spec.between}
              </text>
            ) : null}
          </g>
        );
        x = nextX;
        return node;
      })}
    </svg>
  );
}

const GOALS = {
  "migrate-db": {
    label:
      "The client database app/(kambaz)/database moves to the server database webdev-server/Kambaz/Database",
    arrow: "move the data to the server",
    arrowOnLastLine: true,
    boxes: [
      {
        title: "Client",
        tone: "blue",
        lines: ["React / Next.js", "UI", "app/(kambaz)/database"],
      },
      {
        title: "Server",
        tone: "yellow",
        lines: ["Express", "Routes", "webdev-server/Kambaz/Database"],
      },
    ],
  },
  "async-http-goal": {
    label: "Axios sends an HTTP request from the browser to Express without leaving the page",
    arrow: "Axios",
    boxes: [
      { title: "Browser", tone: "blue", lines: ["Page stays put", "Updates one part"] },
      { title: "Express", tone: "yellow", lines: ["POST, PUT, DELETE", "JSON response"] },
    ],
  },
  "next-routes-goal": {
    label: "Next.js route handlers in app/api answer on port 3000 instead of a separate Express server",
    between: "or",
    boxes: [
      { title: "Express", tone: "yellow", lines: ["Separate server", "Port 4000"] },
      { title: "Next.js", tone: "blue", lines: ["app/api/", "Port 3000"] },
    ],
  },
  "deploy-api-goal": {
    label: "Next.js deploys to Vercel and Express deploys to Render",
    boxes: [
      { title: "Next.js", tone: "blue", lines: ["git push", "Vercel"] },
      { title: "Express", tone: "yellow", lines: ["git push", "Render"] },
    ],
  },
  "mongoose-goal": {
    label: "Mongoose in webdev-server connects a schema to the kambaz MongoDB database",
    arrow: "connect",
    boxes: [
      { title: "Mongoose", tone: "yellow", lines: ["Schema in webdev-server", "find, create, updateOne"] },
      { title: "MongoDB", tone: "red", lines: ["kambaz database", "Collections"] },
    ],
  },
  "atlas-goal": {
    label: "Atlas hosts MongoDB so a public Node process can reach it",
    arrow: "connection string",
    boxes: [
      { title: "Laptop", tone: "blue", lines: ["mongod", "Port 27017"] },
      { title: "Atlas", tone: "red", lines: ["Hosted MongoDB", "Connection string"] },
    ],
  },
  "atlas-compass-goal": {
    label: "Compass connects to the Atlas cluster and imports the same JSON files",
    arrow: "mongodb+srv",
    boxes: [
      { title: "Compass", tone: "blue", lines: ["Local window", "Port 27017"] },
      { title: "Atlas", tone: "red", lines: ["Cluster", "Same JSON files"] },
    ],
  },
  "atlas-node-goal": {
    label: "Mongoose on Render reaches Atlas after Network Access allows 0.0.0.0/0",
    arrow: "Network Access",
    boxes: [
      { title: "Render", tone: "yellow", lines: ["Mongoose", "Drivers URI"] },
      { title: "Atlas", tone: "red", lines: ["0.0.0.0/0", "/kambaz"] },
    ],
  },
  "atlas-sessions-goal": {
    label: "Vercel sends connect.sid and Render stores currentUser in the session",
    arrow: "connect.sid",
    boxes: [
      { title: "Vercel", tone: "blue", lines: ["Browser", "CLIENT_URL"] },
      { title: "Render", tone: "yellow", lines: ["express-session", "currentUser"] },
    ],
  },
  "nodemon-goal": {
    label: "Saving a route file makes nodemon restart Express through tsx",
    arrow: "on save",
    boxes: [
      { title: "Route file", tone: "blue", lines: ["Hello.ts", "Save"] },
      { title: "Nodemon", tone: "yellow", lines: ["tsx", "Restarts Express"] },
    ],
  },
  "remote-objects-goal": {
    label: "The browser reads and updates one assignment object kept in server memory",
    arrow: "JSON",
    boxes: [
      { title: "Browser", tone: "blue", lines: ["One assignment", "Survives refresh"] },
      { title: "Server", tone: "yellow", lines: ["One object", "In memory"] },
    ],
  },
  "kambaz-db-goal": {
    label: "Kambaz screens read JSON from app/(kambaz)/database",
    arrow: "read JSON",
    boxes: [
      { title: "Screens", tone: "blue", lines: ["Dashboard", "Modules and people"] },
      { title: "Database", tone: "red", lines: ["app/(kambaz)/database", "JSON files"] },
    ],
  },
  "client-components-goal": {
    label: "A Server Component renders HTML. use client makes a Client Component that hydrates",
    arrow: "hydrates",
    boxes: [
      { title: "Server Component", tone: "yellow", lines: ["Renders HTML", "No hooks"] },
      { title: "Client Component", tone: "blue", lines: ["use client", "Hooks and clicks"] },
    ],
  },
  "commit-github-goal": {
    label: "A local commit is pushed to the GitHub remote",
    arrow: "git push",
    boxes: [
      { title: "Working copy", tone: "blue", lines: ["git commit", ".gitignore"] },
      { title: "GitHub", tone: "yellow", lines: ["Remote repo", "History"] },
    ],
  },
  "youtube-api-goal": {
    label: "The app calls YouTube Data API v3 with an API key",
    arrow: "HTTPS",
    boxes: [
      { title: "App", tone: "blue", lines: ["axios", "API key"] },
      { title: "YouTube", tone: "red", lines: ["Data API v3", "Search"] },
    ],
  },
  "chatgpt-api-goal": {
    label: "The OpenAI SDK sends a prompt to GPT-4 and gets text back",
    arrow: "prompt",
    boxes: [
      { title: "App", tone: "blue", lines: ["OpenAI SDK", "Prompt"] },
      { title: "GPT-4", tone: "yellow", lines: ["Text in", "Text out"] },
    ],
  },
  "usestate-goal": {
    label: "A click calls the useState setter and React renders again",
    arrow: "useState",
    boxes: [
      { title: "Click", tone: "blue", lines: ["Event", "setCount"] },
      { title: "React", tone: "yellow", lines: ["New state", "New render"] },
    ],
  },
  "grok-api-goal": {
    label: "The app calls the xAI API at api.x.ai/v1 with grok-4-latest",
    arrow: "HTTPS",
    boxes: [
      { title: "App", tone: "blue", lines: ["OpenAI SDK", "XAI_API_KEY"] },
      { title: "xAI", tone: "yellow", lines: ["api.x.ai/v1", "grok-4-latest"] },
    ],
  },
  "grok-chat-goal": {
    label: "Chat POSTs messages to /v1/chat/completions and gets a complete reply",
    arrow: "POST",
    boxes: [
      { title: "App", tone: "blue", lines: ["Messages", "Chat"] },
      { title: "xAI", tone: "yellow", lines: ["/v1/chat/completions", "Complete reply"] },
    ],
  },
  "grok-images-goal": {
    label: "Image generation POSTs to /v1/images/generations and returns a JPG URL",
    arrow: "POST",
    boxes: [
      { title: "App", tone: "blue", lines: ["Prompt", "grok-2-image"] },
      { title: "xAI", tone: "yellow", lines: ["/v1/images/generations", "JPG URL"] },
    ],
  },
  "kambaz-overview-goal": {
    label: "Chapter 1 builds Kambaz screens as HTML under app/(kambaz)",
    arrow: "page.tsx",
    boxes: [
      { title: "Files", tone: "blue", lines: ["app/(kambaz)", "page.tsx"] },
      { title: "Screens", tone: "yellow", lines: ["Account", "Dashboard"] },
    ],
  },
  "react-context-goal": {
    label: "A provider publishes the signed-in user and any descendant reads it",
    arrow: "context",
    boxes: [
      { title: "Provider", tone: "yellow", lines: ["Signed-in user", "Publishes"] },
      { title: "Descendant", tone: "blue", lines: ["Reads context", "No prop chain"] },
    ],
  },
  "zustand-counter-goal": {
    label: "A component imports the Zustand store hook. No provider is required",
    arrow: "hook",
    boxes: [
      { title: "Store", tone: "yellow", lines: ["count", "setCount"] },
      { title: "Component", tone: "blue", lines: ["Imports the hook", "No provider"] },
    ],
  },
  "zustand-todos-goal": {
    label: "The form and each todo item use the Zustand store directly",
    arrow: "hook",
    boxes: [
      { title: "Store", tone: "yellow", lines: ["Todos", "Add, edit, delete"] },
      { title: "Components", tone: "blue", lines: ["Form", "Each item"] },
    ],
  },
  "use-effect-goal": {
    label: "The component renders JSX, then useEffect runs the side effect after paint",
    arrow: "after paint",
    boxes: [
      { title: "Render", tone: "blue", lines: ["JSX from state", "Paint"] },
      { title: "useEffect", tone: "yellow", lines: ["document, timer", "Network"] },
    ],
  },
  "courses-store-goal": {
    label: "The shared course list lives in a store so every screen re-renders when it changes",
    arrow: "Zustand",
    boxes: [
      { title: "Store", tone: "yellow", lines: ["Course list", "Shared state"] },
      { title: "Screens", tone: "blue", lines: ["Dashboard", "Re-render"] },
    ],
  },
  "modules-store-goal": {
    label: "Modules and Home both read the module list from one Zustand store",
    arrow: "Zustand",
    boxes: [
      { title: "Store", tone: "yellow", lines: ["Module list", "Add, rename, delete"] },
      { title: "Screens", tone: "blue", lines: ["Modules", "Home"] },
    ],
  },
  "dashboard-data-goal": {
    label: "The dashboard maps course JSON into cards keyed by course._id",
    arrow: "map",
    boxes: [
      { title: "courses JSON", tone: "red", lines: ["course._id", "courses.length"] },
      { title: "Dashboard", tone: "blue", lines: ["One card each", "/courses/RS101/home"] },
    ],
  },
  "courses-data-goal": {
    label: "The course layout awaits params.cid and finds the course with that _id",
    arrow: "find",
    boxes: [
      { title: "URL", tone: "blue", lines: ["params.cid", "layout.tsx"] },
      { title: "Course", tone: "yellow", lines: ["find by _id", "Course name"] },
    ],
  },
  "modules-data-goal": {
    label: "modules.json rows are filtered by the course id from useParams",
    arrow: "filter",
    boxes: [
      { title: "modules.json", tone: "red", lines: ["course field", "Lessons"] },
      { title: "Modules", tone: "blue", lines: ["useParams cid", "Map lessons"] },
    ],
  },
  "assignments-data-goal": {
    label: "Assignments filter by course id. People joins users to enrollments",
    arrow: "filter",
    boxes: [
      { title: "JSON", tone: "red", lines: ["assignments", "enrollments"] },
      { title: "Screens", tone: "blue", lines: ["Filter by cid", "People join"] },
    ],
  },
  "dashboard-crud-goal": {
    label: "The dashboard form edits a draft, then saving updates the shared course store",
    arrow: "save",
    boxes: [
      { title: "Form", tone: "blue", lines: ["Draft course", "Create, edit, delete"] },
      { title: "Store", tone: "yellow", lines: ["Course list", "Re-render"] },
    ],
  },
  "account-context-goal": {
    label: "Account context holds the signed-in user for Profile, Dashboard, and Account Navigation",
    arrow: "context",
    boxes: [
      { title: "Context", tone: "yellow", lines: ["Current user", "Sign in, sign out"] },
      { title: "Screens", tone: "blue", lines: ["Profile", "Dashboard"] },
    ],
  },
  "account-pages-goal": {
    label: "Profile edits the signed-in user. Sign up adds a user to the context list",
    arrow: "context",
    boxes: [
      { title: "Context", tone: "yellow", lines: ["Users list", "Current user"] },
      { title: "Pages", tone: "blue", lines: ["Profile", "Sign up"] },
    ],
  },
  "enrollments-goal": {
    label: "The enrollments store records which user is in which course, and the layout checks it",
    arrow: "enrolled?",
    boxes: [
      { title: "Store", tone: "yellow", lines: ["User and course", "Enroll, unenroll"] },
      { title: "Layout", tone: "blue", lines: ["Course guard", "Cards"] },
    ],
  },
  "users-crud-goal": {
    label: "CRUD Users: filter the list, open one user, then delete, update, and create",
    arrow: "then",
    boxes: [
      { title: "Filter", tone: "blue", lines: ["?role=", "?name="] },
      { title: "One user", tone: "yellow", lines: ["GET /:userId", "Details"] },
      { title: "Write", tone: "red", lines: ["DELETE", "PUT $set", "POST"] },
    ],
  },
  "people-table-goal": {
    label: "The People table lists enrolled users and writes add, edit, and delete through account context",
    arrow: "context",
    boxes: [
      { title: "Context", tone: "yellow", lines: ["Users", "Add, edit, delete"] },
      { title: "People", tone: "blue", lines: ["Enrolled users", "Re-render"] },
    ],
  },
  "sharing-parent-goal": {
    label: "The parent holds useState and passes the value and setter down as props",
    arrow: "props",
    boxes: [
      { title: "Parent", tone: "yellow", lines: ["useState", "Value and setter"] },
      { title: "Child", tone: "blue", lines: ["Props", "Displays, calls setter"] },
    ],
  },
  "prop-drill-goal": {
    label: "State can be passed as props, stored in the URL, or shared with Context or Zustand",
    between: "or",
    boxes: [
      { title: "Props", tone: "blue", lines: ["Parent passes down", "Deep trees get long"] },
      { title: "URL", tone: "yellow", lines: ["Query or path", "Next page reads it"] },
      { title: "Store", tone: "red", lines: ["Context", "Zustand"] },
    ],
  },
} as const satisfies Record<string, GoalSpec>;

export type GoalDiagramId = keyof typeof GOALS;

export function isGoalDiagram(id: string): id is GoalDiagramId {
  return Object.prototype.hasOwnProperty.call(GOALS, id);
}

export function GoalDiagram({ id }: { id: GoalDiagramId }) {
  return <GoalPicture spec={GOALS[id]} />;
}
