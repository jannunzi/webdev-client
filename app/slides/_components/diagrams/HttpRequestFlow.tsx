import DiagramFrame from "./DiagramFrame";

const FONT = "ui-sans-serif, system-ui, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const GREEN = "#339933";
const BLUE = "#2563EB";

function Arrow({
  x1,
  y1,
  x2,
  y2,
  color,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const head = 11;
  const baseX = x2 - ux * head;
  const baseY = y2 - uy * head;
  const wing = 6;
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={baseX}
        y2={baseY}
        stroke={color}
        strokeWidth={3.5}
        strokeLinecap="butt"
      />
      <polygon
        points={`${x2},${y2} ${baseX + -uy * wing},${baseY + ux * wing} ${baseX - -uy * wing},${baseY - ux * wing}`}
        fill={color}
      />
    </g>
  );
}

export default function HttpRequestFlow() {
  const browser = { x: 16, y: 32, w: 300, h: 80 };
  const server = { x: 430, y: 32, w: 340, h: 80 };
  const handler = { x: 884, y: 32, w: 300, h: 80 };
  const browserMid = browser.x + browser.w / 2;
  const handlerMid = handler.x + handler.w / 2;
  const boxBottom = browser.y + browser.h;
  const returnY = 152;

  return (
    <DiagramFrame label="Request flow" compact>
      <svg
        role="img"
        viewBox="0 0 1200 168"
        className="mx-auto block h-auto w-full"
        aria-labelledby="http-request-flow-title"
      >
        <title id="http-request-flow-title">
          The browser GETs /hello, Express matches app.get /hello and runs helloWorld, which sends
          Hello World back to the browser
        </title>

        <text
          x={(browser.x + browser.w + server.x) / 2}
          y={20}
          textAnchor="middle"
          fontFamily={FONT}
          fontSize={15}
          fontWeight={700}
          fill={BLUE}
        >
          1. GET /hello
        </text>
        <text
          x={(server.x + server.w + handler.x) / 2}
          y={20}
          textAnchor="middle"
          fontFamily={FONT}
          fontSize={15}
          fontWeight={700}
          fill={GREEN}
        >
          2. matches app.get(&quot;/hello&quot;)
        </text>

        <Arrow
          x1={browser.x + browser.w}
          y1={72}
          x2={server.x}
          y2={72}
          color={BLUE}
        />
        <Arrow
          x1={server.x + server.w}
          y1={72}
          x2={handler.x}
          y2={72}
          color={GREEN}
        />

        <rect
          x={browser.x}
          y={browser.y}
          width={browser.w}
          height={browser.h}
          rx={12}
          fill="#eff6ff"
          stroke={BLUE}
          strokeWidth={2.5}
        />
        <text
          x={browserMid}
          y={64}
          textAnchor="middle"
          fontFamily={FONT}
          fontSize={20}
          fontWeight={800}
          fill="#171717"
        >
          Browser
        </text>
        <text
          x={browserMid}
          y={90}
          textAnchor="middle"
          fontFamily={MONO}
          fontSize={14}
          fontWeight={700}
          fill={BLUE}
        >
          http://localhost:4000/hello
        </text>

        <rect
          x={server.x}
          y={server.y}
          width={server.w}
          height={server.h}
          rx={12}
          fill={GREEN}
          stroke="#166534"
          strokeWidth={2.5}
        />
        <text
          x={server.x + server.w / 2}
          y={64}
          textAnchor="middle"
          fontFamily={FONT}
          fontSize={18}
          fontWeight={800}
          fill="#ffffff"
        >
          Node.js / Express server
        </text>
        <text
          x={server.x + server.w / 2}
          y={90}
          textAnchor="middle"
          fontFamily={FONT}
          fontSize={16}
          fontWeight={700}
          fill="#ecfdf5"
        >
          (port 4000)
        </text>

        <rect
          x={handler.x}
          y={handler.y}
          width={handler.w}
          height={handler.h}
          rx={12}
          fill="#f0fdf4"
          stroke={GREEN}
          strokeWidth={2.5}
        />
        <text
          x={handlerMid}
          y={64}
          textAnchor="middle"
          fontFamily={MONO}
          fontSize={16}
          fontWeight={800}
          fill="#14532d"
        >
          helloWorld(req, res)
        </text>
        <text
          x={handlerMid}
          y={90}
          textAnchor="middle"
          fontFamily={MONO}
          fontSize={14}
          fontWeight={700}
          fill="#166534"
        >
          res.send(&quot;Hello World!&quot;)
        </text>

        <polyline
          points={`${handlerMid},${boxBottom} ${handlerMid},${returnY} ${browserMid},${returnY}`}
          fill="none"
          stroke={GREEN}
          strokeWidth={3.5}
          strokeLinejoin="round"
        />
        <Arrow x1={browserMid} y1={returnY} x2={browserMid} y2={boxBottom} color={GREEN} />
        <text
          x={(browserMid + handlerMid) / 2}
          y={144}
          textAnchor="middle"
          fontFamily={FONT}
          fontSize={15}
          fontWeight={700}
          fill={GREEN}
        >
          3. response: Hello World!
        </text>
      </svg>
    </DiagramFrame>
  );
}
