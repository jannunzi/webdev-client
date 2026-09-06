import DiagramFrame from "./DiagramFrame";

const STEPS = [
  { who: "You", detail: "Ask for a URL", accent: false },
  { who: "Server", detail: "Send JS + shell", accent: false },
  { who: "Browser", detail: "Run React", accent: true },
  { who: "Server", detail: "JSON data", accent: false },
  { who: "Browser", detail: "Update the DOM", accent: true },
] as const;

const VIEW_W = 1080;
const BOX_W = 152;
const BOX_H = 132;
const BOX_Y = 38;
const GAP = 58;
const START_X =
  (VIEW_W - (STEPS.length * BOX_W + (STEPS.length - 1) * GAP)) / 2;
const ARROW_HEAD = 12;
const ARROW_PAD = 14;

function Arrow({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  const base = x2 - ARROW_HEAD;
  return (
    <g>
      <line
        x1={x1}
        y1={y}
        x2={base}
        y2={y}
        stroke="#171717"
        strokeWidth="3"
      />
      <polygon
        points={`${x2},${y} ${base},${y - 6} ${base},${y + 6}`}
        fill="#171717"
      />
    </g>
  );
}

export default function CsrDiagram() {
  return (
    <DiagramFrame label="Diagram">
      <svg
        role="img"
        viewBox={`0 0 ${VIEW_W} 220`}
        className="mx-auto h-auto w-full max-w-5xl"
        aria-labelledby="csr-title"
      >
        <title id="csr-title">
          Client-side rendering: the browser runs JavaScript, fetches JSON, and
          updates the DOM
        </title>
        {STEPS.map((step, index) => {
          const x = START_X + index * (BOX_W + GAP);
          const prevRight = x - GAP;
          const arrowY = BOX_Y + BOX_H / 2;
          return (
            <g key={`${step.who}-${step.detail}`}>
              {index > 0 ? (
                <Arrow
                  x1={prevRight + ARROW_PAD}
                  x2={x - ARROW_PAD}
                  y={arrowY}
                />
              ) : null}
              <rect
                x={x}
                y={BOX_Y}
                width={BOX_W}
                height={BOX_H}
                rx="12"
                fill={step.accent ? "#fee2e2" : "#fafafa"}
                stroke="#171717"
                strokeWidth={step.accent ? 3 : 2.5}
              />
              <text
                x={x + BOX_W / 2}
                y={BOX_Y + 46}
                textAnchor="middle"
                fontSize="18"
                fontWeight="700"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
              >
                {step.who}
              </text>
              <text
                x={x + BOX_W / 2}
                y={BOX_Y + 86}
                textAnchor="middle"
                fontSize="15"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
              >
                {step.detail}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mb-0 mt-3 text-center font-sans text-lg text-neutral-700">
        The first response can be a thin shell. React in the browser builds the UI.
      </p>
    </DiagramFrame>
  );
}
