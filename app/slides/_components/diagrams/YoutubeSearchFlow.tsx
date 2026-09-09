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

export default function YoutubeSearchFlow() {
  return (
    <DiagramFrame label="Search sequence">
      <svg
        role="img"
        viewBox="0 0 960 260"
        className="mx-auto h-auto w-full max-w-5xl"
        aria-labelledby="yt-search-flow-title"
      >
        <title id="yt-search-flow-title">
          Search screen calls the axios client, which GETs YouTube search and returns items
        </title>
        {[
          { x: 20, label: "Search screen", sub: "query + Search" },
          { x: 340, label: "youtube/client.ts", sub: "axios GET" },
          { x: 660, label: "YouTube Data API", sub: "/search?part=snippet" },
        ].map((box) => (
          <g key={box.label}>
            <rect
              x={box.x}
              y="48"
              width="260"
              height="120"
              rx="12"
              fill="#fafafa"
              stroke="#171717"
              strokeWidth="2.5"
            />
            <text
              x={box.x + 130}
              y="98"
              textAnchor="middle"
              fontSize="20"
              fontWeight="700"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {box.label}
            </text>
            <text
              x={box.x + 130}
              y="132"
              textAnchor="middle"
              fontSize="16"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {box.sub}
            </text>
          </g>
        ))}
        <Arrow x1={286} x2={334} y={88} />
        <text x="310" y="76" textAnchor="middle" fontSize="14" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          search(q)
        </text>
        <Arrow x1={606} x2={654} y={88} />
        <text x="630" y="76" textAnchor="middle" fontSize="14" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          GET
        </text>
        <Arrow x1={654} x2={606} y={148} />
        <text x="630" y="176" textAnchor="middle" fontSize="14" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          items[]
        </text>
        <Arrow x1={334} x2={286} y={148} />
        <text x="310" y="176" textAnchor="middle" fontSize="14" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          setVideos
        </text>
      </svg>
    </DiagramFrame>
  );
}
