import DiagramFrame from "./DiagramFrame";

const FONT = "ui-sans-serif, system-ui, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const GREEN = "#339933";
const BLUE = "#2563EB";

function Folder({ x, name, color }: { x: number; name: string; color: string }) {
  return (
    <g>
      <path
        d={`M${x} 40 h150 l18 22 h262 a14 14 0 0 1 14 14 v232 a14 14 0 0 1 -14 14 h-416 a14 14 0 0 1 -14 -14 v-254 a14 14 0 0 1 14 -14 z`}
        fill={`${color}10`}
        stroke={color}
        strokeWidth="3"
        strokeDasharray="10 6"
      />
      <text x={x + 18} y={88} fontFamily={MONO} fontSize="24" fontWeight="700" fill={color}>
        {name}/
      </text>
    </g>
  );
}

function Arrow({ y, dir, color, label, sub }: { y: number; dir: 1 | -1; color: string; label: string; sub: string }) {
  const x1 = dir === 1 ? 478 : 722;
  const x2 = dir === 1 ? 722 : 478;
  const base = x2 - dir * 18;
  return (
    <g>
      <line x1={x1} y1={y} x2={base} y2={y} stroke={color} strokeWidth="5" strokeLinecap="round" />
      <polygon points={`${x2},${y} ${base},${y - 11} ${base},${y + 11}`} fill={color} />
      <text x={600} y={y - 16} textAnchor="middle" fontFamily={FONT} fontSize="24" fontWeight="800" fill={color}>
        {label}
      </text>
      <text x={600} y={y + 36} textAnchor="middle" fontFamily={MONO} fontSize="19" fill="#404040">
        {sub}
      </text>
    </g>
  );
}

export default function TwoPortsDiagram() {
  return (
    <DiagramFrame label="Two sibling projects, two ports">
      <svg role="img" viewBox="0 0 1200 380" className="mx-auto block h-auto w-full max-w-[1400px]" aria-labelledby="two-ports-title">
        <title id="two-ports-title">
          The browser runs the Next.js React UI from webdev-client on localhost:3000 and sends HTTP
          requests to the Node Express server from webdev-server on localhost:4000, which returns HTTP
          responses. Both folders sit side by side in the same parent folder.
        </title>

        <Folder x={20} name="webdev-client" color={BLUE} />
        <Folder x={720} name="webdev-server" color={GREEN} />

        {/* Browser window */}
        <rect x={44} y={110} width={410} height={186} rx={14} fill="#fff" stroke="#171717" strokeWidth="3" />
        <path d="M44 124 a14 14 0 0 1 14 -14 h382 a14 14 0 0 1 14 14 v26 h-410 z" fill="#E5E5E5" />
        <circle cx={66} cy={130} r={6} fill="#EF4444" />
        <circle cx={86} cy={130} r={6} fill="#F59E0B" />
        <circle cx={106} cy={130} r={6} fill="#22C55E" />
        <rect x={124} y={119} width={316} height={23} rx={11} fill="#fff" />
        <text x={138} y={137} fontFamily={MONO} fontSize="17" fill="#171717">localhost:3000</text>
        <text x={249} y={206} textAnchor="middle" fontFamily={FONT} fontSize="30" fontWeight="800" fill="#171717">
          Browser
        </text>
        <text x={249} y={246} textAnchor="middle" fontFamily={FONT} fontSize="22" fill={BLUE} fontWeight="700">
          Next.js · React UI
        </text>
        <text x={249} y={278} textAnchor="middle" fontFamily={FONT} fontSize="18" fill="#525252">
          the client
        </text>

        {/* Server */}
        <rect x={746} y={110} width={410} height={186} rx={14} fill={GREEN} />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={770} y={128 + i * 48} width={44} height={34} rx={6} fill="#ffffff33" />
            <circle cx={802} cy={145 + i * 48} r={4} fill="#fff" />
          </g>
        ))}
        <text x={985} y={182} textAnchor="middle" fontFamily={FONT} fontSize="30" fontWeight="800" fill="#fff">
          Node + Express
        </text>
        <text x={985} y={222} textAnchor="middle" fontFamily={MONO} fontSize="22" fontWeight="700" fill="#fff">
          localhost:4000
        </text>
        <text x={985} y={262} textAnchor="middle" fontFamily={FONT} fontSize="18" fill="#E8F5E8">
          the server · HTTP, later Mongo
        </text>

        <Arrow y={164} dir={1} color="#171717" label="HTTP request" sub="GET /hello" />
        <Arrow y={256} dir={-1} color={GREEN} label="HTTP response" sub="text / JSON" />

        {/* Shared parent */}
        <path d="M40 336 v14 h1120 v-14" fill="none" stroke="#737373" strokeWidth="2.5" />
        <text x={600} y={374} textAnchor="middle" fontFamily={FONT} fontSize="20" fontWeight="700" fill="#525252">
          same parent folder · siblings, never nested
        </text>
      </svg>
    </DiagramFrame>
  );
}
