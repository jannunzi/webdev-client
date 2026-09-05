import DiagramFrame from "./DiagramFrame";

const CLIENT_RIGHT = 250;
const SERVER_LEFT = 430;
const REQUEST_Y = 116;
const RESPONSE_Y = 200;
const ARROW_INSET = 10;
const REQUEST_X1 = CLIENT_RIGHT + ARROW_INSET;
const REQUEST_X2 = SERVER_LEFT - ARROW_INSET;
const LABEL_W = 148;
const LABEL_H = 26;

function ArrowLabel({
  x1,
  x2,
  y,
  text,
}: {
  x1: number;
  x2: number;
  y: number;
  text: string;
}) {
  const midX = (x1 + x2) / 2;
  return (
    <g>
      <rect
        x={midX - LABEL_W / 2}
        y={y - LABEL_H / 2}
        width={LABEL_W}
        height={LABEL_H}
        rx="6"
        fill="#ffffff"
      />
      <text
        x={midX}
        y={y + 5}
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        {text}
      </text>
    </g>
  );
}

export default function ClientServerDiagram() {
  return (
    <DiagramFrame label="Diagram">
      <svg
        role="img"
        viewBox="0 0 880 280"
        className="mx-auto h-auto w-full max-w-5xl"
        aria-labelledby="client-server-title"
      >
        <title id="client-server-title">
          A React browser client sends an HTTP request to a Node server, which
          reads files or MongoDB and returns an HTTP response
        </title>
        <defs>
          <marker
            id="cs-arrow"
            markerUnits="userSpaceOnUse"
            markerWidth="12"
            markerHeight="12"
            refX="12"
            refY="6"
            orient="auto"
          >
            <path d="M0,0 L12,6 L0,12 Z" fill="#171717" />
          </marker>
        </defs>
        <rect x="20" y="36" width="230" height="208" rx="12" fill="#fafafa" stroke="#171717" strokeWidth="2.5" />
        <text x="135" y="72" textAnchor="middle" fontSize="16" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Clients
        </text>
        <rect x="44" y="92" width="182" height="48" rx="8" fill="#fee2e2" stroke="#171717" strokeWidth="2" />
        <text x="135" y="123" textAnchor="middle" fontSize="20" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          React
        </text>
        <text x="135" y="168" textAnchor="middle" fontSize="16" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Browser · HTML · CSS · JS
        </text>
        <text x="135" y="196" textAnchor="middle" fontSize="16" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Next.js UI
        </text>

        <line
          x1={REQUEST_X1}
          y1={REQUEST_Y}
          x2={REQUEST_X2}
          y2={REQUEST_Y}
          stroke="#171717"
          strokeWidth="3"
          markerEnd="url(#cs-arrow)"
        />
        <ArrowLabel x1={REQUEST_X1} x2={REQUEST_X2} y={REQUEST_Y} text="HTTP request" />
        <line
          x1={REQUEST_X2}
          y1={RESPONSE_Y}
          x2={REQUEST_X1}
          y2={RESPONSE_Y}
          stroke="#171717"
          strokeWidth="3"
          markerEnd="url(#cs-arrow)"
        />
        <ArrowLabel x1={REQUEST_X1} x2={REQUEST_X2} y={RESPONSE_Y} text="HTTP response" />

        <rect x="430" y="36" width="200" height="208" rx="12" fill="#e0f2fe" stroke="#171717" strokeWidth="2.5" />
        <text x="530" y="72" textAnchor="middle" fontSize="16" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Servers
        </text>
        <rect x="452" y="92" width="156" height="48" rx="8" fill="#fee2e2" stroke="#171717" strokeWidth="2" />
        <text x="530" y="123" textAnchor="middle" fontSize="20" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Node
        </text>
        <text x="530" y="176" textAnchor="middle" fontSize="16" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Express
        </text>

        <line x1="648" y1="140" x2="678" y2="140" stroke="#171717" strokeWidth="3" markerEnd="url(#cs-arrow)" />
        <line x1="678" y1="168" x2="648" y2="168" stroke="#171717" strokeWidth="3" markerEnd="url(#cs-arrow)" />

        <rect x="690" y="36" width="170" height="208" rx="12" fill="#fafafa" stroke="#171717" strokeWidth="2.5" />
        <text x="775" y="72" textAnchor="middle" fontSize="16" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Resources
        </text>
        <rect x="710" y="92" width="130" height="48" rx="8" fill="#fee2e2" stroke="#171717" strokeWidth="2" />
        <text x="775" y="123" textAnchor="middle" fontSize="20" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Mongo
        </text>
        <text x="775" y="176" textAnchor="middle" fontSize="16" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Files · HTML · JSON
        </text>
      </svg>
    </DiagramFrame>
  );
}
