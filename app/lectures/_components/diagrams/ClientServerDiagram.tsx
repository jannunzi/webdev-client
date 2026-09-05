import DiagramFrame from "./DiagramFrame";

const CLIENT = { x: 16, w: 220 };
const SERVER = { x: 470, w: 190 };
const RESOURCE = { x: 780, w: 164 };
const BOX_Y = 36;
const BOX_H = 208;
const REQUEST_Y = 116;
const RESPONSE_Y = 204;
const ARROW_HEAD = 12;
const ARROW_PAD = 12;
const LABEL_W = 136;
const LABEL_H = 26;

function HArrow({
  x1,
  x2,
  y,
}: {
  x1: number;
  x2: number;
  y: number;
}) {
  const goingRight = x2 > x1;
  const tip = x2;
  const base = goingRight ? x2 - ARROW_HEAD : x2 + ARROW_HEAD;
  return (
    <g>
      <line x1={x1} y1={y} x2={base} y2={y} stroke="#171717" strokeWidth="3" />
      <polygon
        points={`${tip},${y} ${base},${y - 6} ${base},${y + 6}`}
        fill="#171717"
      />
    </g>
  );
}

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
  const requestX1 = CLIENT.x + CLIENT.w + ARROW_PAD;
  const requestX2 = SERVER.x - ARROW_PAD;
  const resourceX1 = SERVER.x + SERVER.w + 10;
  const resourceX2 = RESOURCE.x - 10;
  const clientCx = CLIENT.x + CLIENT.w / 2;
  const serverCx = SERVER.x + SERVER.w / 2;
  const resourceCx = RESOURCE.x + RESOURCE.w / 2;

  return (
    <DiagramFrame label="Diagram">
      <svg
        role="img"
        viewBox="0 0 960 280"
        className="mx-auto h-auto w-full max-w-5xl"
        aria-labelledby="client-server-title"
      >
        <title id="client-server-title">
          A React browser client sends an HTTP request to a Node server, which
          reads files or MongoDB and returns an HTTP response
        </title>
        <rect
          x={CLIENT.x}
          y={BOX_Y}
          width={CLIENT.w}
          height={BOX_H}
          rx="12"
          fill="#fafafa"
          stroke="#171717"
          strokeWidth="2.5"
        />
        <text x={clientCx} y="72" textAnchor="middle" fontSize="16" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Clients
        </text>
        <rect x={CLIENT.x + 22} y="92" width="176" height="48" rx="8" fill="#fee2e2" stroke="#171717" strokeWidth="2" />
        <text x={clientCx} y="123" textAnchor="middle" fontSize="20" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          React
        </text>
        <text x={clientCx} y="168" textAnchor="middle" fontSize="16" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Browser · HTML · CSS · JS
        </text>
        <text x={clientCx} y="196" textAnchor="middle" fontSize="16" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Next.js UI
        </text>

        <HArrow x1={requestX1} x2={requestX2} y={REQUEST_Y} />
        <ArrowLabel x1={requestX1} x2={requestX2} y={REQUEST_Y} text="HTTP request" />
        <HArrow x1={requestX2} x2={requestX1} y={RESPONSE_Y} />
        <ArrowLabel x1={requestX1} x2={requestX2} y={RESPONSE_Y} text="HTTP response" />

        <rect
          x={SERVER.x}
          y={BOX_Y}
          width={SERVER.w}
          height={BOX_H}
          rx="12"
          fill="#e0f2fe"
          stroke="#171717"
          strokeWidth="2.5"
        />
        <text x={serverCx} y="72" textAnchor="middle" fontSize="16" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Servers
        </text>
        <rect x={SERVER.x + 17} y="92" width="156" height="48" rx="8" fill="#fee2e2" stroke="#171717" strokeWidth="2" />
        <text x={serverCx} y="123" textAnchor="middle" fontSize="20" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Node
        </text>
        <text x={serverCx} y="176" textAnchor="middle" fontSize="16" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Express
        </text>

        <HArrow x1={resourceX1} x2={resourceX2} y={140} />
        <HArrow x1={resourceX2} x2={resourceX1} y={168} />

        <rect
          x={RESOURCE.x}
          y={BOX_Y}
          width={RESOURCE.w}
          height={BOX_H}
          rx="12"
          fill="#fafafa"
          stroke="#171717"
          strokeWidth="2.5"
        />
        <text x={resourceCx} y="72" textAnchor="middle" fontSize="16" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Resources
        </text>
        <rect x={RESOURCE.x + 17} y="92" width="130" height="48" rx="8" fill="#fee2e2" stroke="#171717" strokeWidth="2" />
        <text x={resourceCx} y="123" textAnchor="middle" fontSize="20" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Mongo
        </text>
        <text x={resourceCx} y="176" textAnchor="middle" fontSize="15" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Files · HTML · JSON
        </text>
      </svg>
    </DiagramFrame>
  );
}
