import DiagramFrame from "./DiagramFrame";

const STEPS = [
  { who: "You", detail: "Ask for a URL", accent: false },
  { who: "Server", detail: "Send JS + shell", accent: false },
  { who: "Browser", detail: "Run React", accent: true },
  { who: "Server", detail: "JSON data", accent: false },
  { who: "Browser", detail: "Update the DOM", accent: true },
] as const;

export default function CsrDiagram() {
  return (
    <DiagramFrame label="Diagram">
      <svg
        role="img"
        viewBox="0 0 920 220"
        className="mx-auto h-auto w-full max-w-5xl"
        aria-labelledby="csr-title"
      >
        <title id="csr-title">
          Client-side rendering: the browser runs JavaScript, fetches JSON, and
          updates the DOM
        </title>
        {STEPS.map((step, index) => {
          const x = 12 + index * 182;
          return (
            <g key={`${step.who}-${step.detail}`}>
              {index > 0 ? (
                <line
                  x1={x - 22}
                  y1={96}
                  x2={x + 4}
                  y2={96}
                  stroke="#171717"
                  strokeWidth="3"
                  markerEnd="url(#csr-arrow)"
                />
              ) : null}
              <rect
                x={x}
                y={36}
                width="164"
                height="136"
                rx="12"
                fill={step.accent ? "#fee2e2" : "#fafafa"}
                stroke="#171717"
                strokeWidth={step.accent ? 3 : 2.5}
              />
              <text
                x={x + 82}
                y="82"
                textAnchor="middle"
                fontSize="18"
                fontWeight="700"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
              >
                {step.who}
              </text>
              <text
                x={x + 82}
                y="122"
                textAnchor="middle"
                fontSize="15"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
              >
                {step.detail}
              </text>
            </g>
          );
        })}
        <defs>
          <marker id="csr-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#171717" />
          </marker>
        </defs>
      </svg>
      <p className="mb-0 mt-3 text-center font-sans text-lg text-neutral-700">
        The first response can be a thin shell. React in the browser builds the UI.
      </p>
    </DiagramFrame>
  );
}
