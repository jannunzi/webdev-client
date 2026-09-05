import DiagramFrame from "./DiagramFrame";

const STEPS = [
  { who: "You", detail: "Ask for a URL", accent: false },
  { who: "Browser", detail: "HTTP request", accent: false },
  { who: "Server", detail: "Build finished HTML", accent: true },
  { who: "Browser", detail: "Paint the page", accent: false },
] as const;

export default function SsrDiagram() {
  return (
    <DiagramFrame label="Diagram">
      <svg
        role="img"
        viewBox="0 0 880 220"
        className="mx-auto h-auto w-full max-w-5xl"
        aria-labelledby="ssr-title"
      >
        <title id="ssr-title">
          Server-side rendering: the server builds HTML and the browser paints a
          finished page
        </title>
        {STEPS.map((step, index) => {
          const x = 24 + index * 214;
          return (
            <g key={`${step.who}-${step.detail}`}>
              {index > 0 ? (
                <line
                  x1={x - 28}
                  y1={96}
                  x2={x + 4}
                  y2={96}
                  stroke="#171717"
                  strokeWidth="3"
                  markerEnd="url(#ssr-arrow)"
                />
              ) : null}
              <rect
                x={x}
                y={36}
                width="186"
                height="136"
                rx="12"
                fill={step.accent ? "#e0f2fe" : "#fafafa"}
                stroke="#171717"
                strokeWidth={step.accent ? 3 : 2.5}
              />
              <text
                x={x + 93}
                y="82"
                textAnchor="middle"
                fontSize="20"
                fontWeight="700"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
              >
                {step.who}
              </text>
              <text
                x={x + 93}
                y="122"
                textAnchor="middle"
                fontSize="16"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
              >
                {step.detail}
              </text>
            </g>
          );
        })}
        <defs>
          <marker id="ssr-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#171717" />
          </marker>
        </defs>
      </svg>
      <p className="mb-0 mt-3 text-center font-sans text-lg text-neutral-700">
        HTML is ready on the first response. Next.js Server Components work this way.
      </p>
    </DiagramFrame>
  );
}
