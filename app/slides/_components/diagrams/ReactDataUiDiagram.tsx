import DiagramFrame from "./DiagramFrame";

function Arrow({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  const head = 12;
  const base = x2 - head;
  return (
    <g>
      <line x1={x1} y1={y} x2={base} y2={y} stroke="#171717" strokeWidth="3" />
      <polygon
        points={`${x2},${y} ${base},${y - 6} ${base},${y + 6}`}
        fill="#171717"
      />
    </g>
  );
}

export default function ReactDataUiDiagram() {
  return (
    <DiagramFrame label="Diagram">
      <svg
        role="img"
        viewBox="0 0 960 280"
        className="mx-auto h-auto w-full max-w-5xl"
        aria-labelledby="react-data-ui-title"
      >
        <title id="react-data-ui-title">
          A user JSON object flows through a React component and becomes a
          browser UI
        </title>

        <rect x="16" y="28" width="250" height="224" rx="14" fill="#fafafa" stroke="#171717" strokeWidth="2.5" />
        <text x="141" y="58" textAnchor="middle" fontSize="16" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Data
        </text>
        <text x="36" y="96" fontSize="18" fontFamily="ui-monospace, SFMono-Regular, monospace">
          {"{"}
        </text>
        <text x="52" y="126" fontSize="18" fontFamily="ui-monospace, SFMono-Regular, monospace">
          username: &apos;alice&apos;,
        </text>
        <text x="52" y="156" fontSize="18" fontFamily="ui-monospace, SFMono-Regular, monospace">
          first: &apos;Alice&apos;,
        </text>
        <text x="52" y="186" fontSize="18" fontFamily="ui-monospace, SFMono-Regular, monospace">
          last: &apos;Wonderland&apos;
        </text>
        <text x="36" y="216" fontSize="18" fontFamily="ui-monospace, SFMono-Regular, monospace">
          {"}"}
        </text>

        <Arrow x1="276" x2="368" y="140" />
        <text x="322" y="126" textAnchor="middle" fontSize="14" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          React
        </text>

        <rect x="378" y="86" width="196" height="108" rx="12" fill="#fee2e2" stroke="#171717" strokeWidth="2.5" />
        <text x="476" y="132" textAnchor="middle" fontSize="22" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          User()
        </text>
        <text x="476" y="164" textAnchor="middle" fontSize="16" fontFamily="ui-sans-serif, system-ui, sans-serif">
          data → JSX
        </text>

        <Arrow x1="584" x2="676" y="140" />

        <rect x="686" y="28" width="258" height="224" rx="14" fill="#e0f2fe" stroke="#171717" strokeWidth="2.5" />
        <text x="815" y="58" textAnchor="middle" fontSize="16" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Browser
        </text>
        <text x="815" y="112" textAnchor="middle" fontSize="20" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Username: alice
        </text>
        <text x="815" y="154" textAnchor="middle" fontSize="20" fontFamily="ui-sans-serif, system-ui, sans-serif">
          First: Alice
        </text>
        <text x="815" y="196" textAnchor="middle" fontSize="20" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Last: Wonderland
        </text>
      </svg>
    </DiagramFrame>
  );
}
