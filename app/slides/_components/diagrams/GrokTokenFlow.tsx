import DiagramFrame from "./DiagramFrame";

function Arrow({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  const tip = x2;
  const base = x2 - 12;
  return (
    <g>
      <line x1={x1} y1={y} x2={base} y2={y} stroke="#171717" strokeWidth="3" />
      <polygon points={`${tip},${y} ${base},${y - 6} ${base},${y + 6}`} fill="#171717" />
    </g>
  );
}

export default function GrokTokenFlow() {
  return (
    <DiagramFrame label="Tokenizer">
      <svg
        role="img"
        viewBox="0 0 960 240"
        className="mx-auto h-auto w-full max-w-5xl"
        aria-labelledby="grok-token-title"
      >
        <title id="grok-token-title">
          A prompt is split into tokens, the model infers completion tokens, then a response is assembled
        </title>
        {[
          { x: 16, label: "Prompt", sub: "Flint, Michigan" },
          { x: 252, label: "Tokenizer", sub: "Flint → 2 · Michigan → 1" },
          { x: 488, label: "Inference", sub: "completion tokens" },
          { x: 724, label: "Response", sub: "aggregated text" },
        ].map((box) => (
          <g key={box.label}>
            <rect
              x={box.x}
              y="50"
              width="210"
              height="120"
              rx="12"
              fill="#fafafa"
              stroke="#171717"
              strokeWidth="2.5"
            />
            <text
              x={box.x + 105}
              y="100"
              textAnchor="middle"
              fontSize="20"
              fontWeight="700"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {box.label}
            </text>
            <text
              x={box.x + 105}
              y="136"
              textAnchor="middle"
              fontSize="14"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {box.sub}
            </text>
          </g>
        ))}
        <Arrow x1={230} x2={250} y={110} />
        <Arrow x1={466} x2={486} y={110} />
        <Arrow x1={702} x2={722} y={110} />
      </svg>
    </DiagramFrame>
  );
}
