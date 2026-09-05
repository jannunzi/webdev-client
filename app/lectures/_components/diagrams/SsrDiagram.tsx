import DiagramFrame from "./DiagramFrame";

const STEPS = [
  { who: "You", detail: "Ask for a URL", accent: false },
  { who: "Browser", detail: "HTTP request", accent: false },
  { who: "Server", detail: "Build finished HTML", accent: true },
  { who: "Browser", detail: "Paint the page", accent: false },
] as const;

const VIEW_W = 960;
const BOX_W = 186;
const BOX_H = 132;
const BOX_Y = 38;
const GAP = 54;
const START_X =
  (VIEW_W - (STEPS.length * BOX_W + (STEPS.length - 1) * GAP)) / 2;

export default function SsrDiagram() {
  return (
    <DiagramFrame label="Diagram">
      <svg
        role="img"
        viewBox={`0 0 ${VIEW_W} 220`}
        className="mx-auto h-auto w-full max-w-5xl"
        aria-labelledby="ssr-title"
      >
        <title id="ssr-title">
          Server-side rendering: the server builds HTML and the browser paints a
          finished page
        </title>
        <defs>
          <marker
            id="ssr-arrow"
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
        {STEPS.map((step, index) => {
          const x = START_X + index * (BOX_W + GAP);
          const prevRight = x - GAP;
          const arrowY = BOX_Y + BOX_H / 2;
          return (
            <g key={`${step.who}-${step.detail}`}>
              {index > 0 ? (
                <line
                  x1={prevRight + 8}
                  y1={arrowY}
                  x2={x}
                  y2={arrowY}
                  stroke="#171717"
                  strokeWidth="3"
                  markerEnd="url(#ssr-arrow)"
                />
              ) : null}
              <rect
                x={x}
                y={BOX_Y}
                width={BOX_W}
                height={BOX_H}
                rx="12"
                fill={step.accent ? "#e0f2fe" : "#fafafa"}
                stroke="#171717"
                strokeWidth={step.accent ? 3 : 2.5}
              />
              <text
                x={x + BOX_W / 2}
                y={BOX_Y + 46}
                textAnchor="middle"
                fontSize="20"
                fontWeight="700"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
              >
                {step.who}
              </text>
              <text
                x={x + BOX_W / 2}
                y={BOX_Y + 86}
                textAnchor="middle"
                fontSize="16"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
              >
                {step.detail}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mb-0 mt-3 text-center font-sans text-lg text-neutral-700">
        HTML is ready on the first response. Next.js Server Components work this way.
      </p>
    </DiagramFrame>
  );
}
