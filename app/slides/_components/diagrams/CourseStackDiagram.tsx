import DiagramFrame from "./DiagramFrame";

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
  const base = goingRight ? x2 - 12 : x2 + 12;
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

export default function CourseStackDiagram() {
  return (
    <DiagramFrame label="Diagram">
      <svg
        role="img"
        viewBox="0 0 960 280"
        className="mx-auto h-auto w-full max-w-5xl"
        aria-labelledby="course-stack-title"
      >
        <title id="course-stack-title">
          Course environment: a Next.js React client talks HTTP to an Express
          Node server that reads MongoDB and files
        </title>

        <rect x="16" y="28" width="250" height="224" rx="14" fill="#fafafa" stroke="#171717" strokeWidth="2.5" />
        <text x="141" y="56" textAnchor="middle" fontSize="16" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          CLIENTS
        </text>
        <rect x="36" y="72" width="210" height="52" rx="8" fill="#fee2e2" stroke="#171717" strokeWidth="2" />
        <text x="141" y="105" textAnchor="middle" fontSize="20" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          React + Next.js
        </text>
        <text x="141" y="154" textAnchor="middle" fontSize="16" fontFamily="ui-sans-serif, system-ui, sans-serif">
          HTML · CSS · JavaScript
        </text>
        <text x="141" y="184" textAnchor="middle" fontSize="16" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Browser UI
        </text>
        <text x="141" y="226" textAnchor="middle" fontSize="18" fontWeight="800" fill="#b91c1c" fontFamily="ui-sans-serif, system-ui, sans-serif">
          1st
        </text>

        <HArrow x1={276} x2={368} y={118} />
        <text x="322" y="104" textAnchor="middle" fontSize="13" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          HTTP REQUEST
        </text>
        <HArrow x1={368} x2={276} y={202} />
        <text x="322" y="188" textAnchor="middle" fontSize="13" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          HTTP RESPONSE
        </text>

        <rect x="378" y="28" width="230" height="224" rx="14" fill="#e0f2fe" stroke="#171717" strokeWidth="2.5" />
        <text x="493" y="56" textAnchor="middle" fontSize="16" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          SERVERS
        </text>
        <rect x="398" y="72" width="190" height="52" rx="8" fill="#fee2e2" stroke="#171717" strokeWidth="2" />
        <text x="493" y="105" textAnchor="middle" fontSize="20" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Express + Node
        </text>
        <text x="493" y="168" textAnchor="middle" fontSize="16" fontFamily="ui-sans-serif, system-ui, sans-serif">
          HTTP · Ajax · REST
        </text>

        <HArrow x1={618} x2={700} y={140} />
        <HArrow x1={700} x2={618} y={168} />

        <rect x="710" y="28" width="234" height="224" rx="14" fill="#fafafa" stroke="#171717" strokeWidth="2.5" />
        <text x="827" y="56" textAnchor="middle" fontSize="16" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          RESOURCES
        </text>
        <rect x="730" y="72" width="194" height="52" rx="8" fill="#fee2e2" stroke="#171717" strokeWidth="2" />
        <text x="827" y="105" textAnchor="middle" fontSize="20" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          MongoDB
        </text>
        <text x="827" y="168" textAnchor="middle" fontSize="16" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Mongoose · files
        </text>
      </svg>
    </DiagramFrame>
  );
}
