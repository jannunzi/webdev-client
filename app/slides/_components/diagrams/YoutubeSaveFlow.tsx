import DiagramFrame from "./DiagramFrame";

function Arrow({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  const right = x2 > x1;
  const tip = x2;
  const base = right ? x2 - 12 : x2 + 12;
  return (
    <g>
      <line x1={x1} y1={y} x2={base} y2={y} stroke="#171717" strokeWidth="3" />
      <polygon points={`${tip},${y} ${base},${y - 6} ${base},${y + 6}`} fill="#171717" />
    </g>
  );
}

export default function YoutubeSaveFlow() {
  return (
    <DiagramFrame label="Save to lesson">
      <svg
        role="img"
        viewBox="0 0 960 260"
        className="mx-auto h-auto w-full max-w-5xl"
        aria-labelledby="yt-save-flow-title"
      >
        <title id="yt-save-flow-title">
          Details posts cid, mid, lid, and vid to Express, which writes youTubeId on the lesson
        </title>
        {[
          { x: 16, w: 220, label: "Details", sub: "Save to Lesson", fill: "#fee2e2" },
          { x: 300, w: 280, label: "Express POST", sub: "/lessons/:lid/youtube/:vid", fill: "#e0f2fe" },
          { x: 644, w: 300, label: "Mongo module", sub: "lesson.youTubeId = vid", fill: "#fafafa" },
        ].map((box) => (
          <g key={box.label}>
            <rect
              x={box.x}
              y="48"
              width={box.w}
              height="120"
              rx="12"
              fill={box.fill}
              stroke="#171717"
              strokeWidth="2.5"
            />
            <text
              x={box.x + box.w / 2}
              y="98"
              textAnchor="middle"
              fontSize="20"
              fontWeight="700"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {box.label}
            </text>
            <text
              x={box.x + box.w / 2}
              y="132"
              textAnchor="middle"
              fontSize="15"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {box.sub}
            </text>
          </g>
        ))}
        <Arrow x1={242} x2={294} y="88" />
        <text x="268" y="76" textAnchor="middle" fontSize="14" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          mid, lid, vid
        </text>
        <Arrow x1={586} x2={638} y="88" />
        <Arrow x1={638} x2={586} y="148" />
        <text x="612" y="176" textAnchor="middle" fontSize="14" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          saved lesson
        </text>
        <Arrow x1={294} x2={242} y="148" />
        <text x="268" y="176" textAnchor="middle" fontSize="14" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          back to Modules
        </text>
      </svg>
    </DiagramFrame>
  );
}
