import DiagramFrame from "./DiagramFrame";

export default function DomTreeDiagram() {
  return (
    <DiagramFrame label="Diagram">
      <svg
        role="img"
        viewBox="0 0 560 340"
        className="mx-auto h-auto w-full max-w-xl"
        aria-labelledby="dom-tree-title"
      >
        <title id="dom-tree-title">
          The browser parses HTML into a DOM tree: html branches into head and
          body; body contains a Lab 1 div and an h2
        </title>
        <line x1="280" y1="66" x2="140" y2="110" stroke="#171717" strokeWidth="3" />
        <line x1="280" y1="66" x2="420" y2="110" stroke="#171717" strokeWidth="3" />
        <line x1="420" y1="166" x2="420" y2="194" stroke="#171717" strokeWidth="3" />
        <line x1="420" y1="250" x2="420" y2="278" stroke="#171717" strokeWidth="3" />

        <rect x="170" y="16" width="220" height="50" rx="8" fill="#fafafa" stroke="#171717" strokeWidth="2.5" />
        <text x="280" y="48" textAnchor="middle" fontSize="20" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          html
        </text>

        <rect x="30" y="110" width="220" height="50" rx="8" fill="#fafafa" stroke="#171717" strokeWidth="2.5" />
        <text x="140" y="142" textAnchor="middle" fontSize="20" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          head
        </text>

        <rect x="310" y="110" width="220" height="50" rx="8" fill="#fafafa" stroke="#171717" strokeWidth="2.5" />
        <text x="420" y="142" textAnchor="middle" fontSize="20" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          body
        </text>

        <rect x="310" y="194" width="220" height="56" rx="8" fill="#fafafa" stroke="#171717" strokeWidth="2.5" />
        <text x="420" y="230" textAnchor="middle" fontSize="20" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          #wd-lab1
        </text>

        <rect x="310" y="278" width="220" height="50" rx="8" fill="#fee2e2" stroke="#171717" strokeWidth="2.5" />
        <text x="420" y="310" textAnchor="middle" fontSize="20" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          h2 Lab 1
        </text>
      </svg>
      <p className="mb-0 mt-3 text-center font-sans text-lg text-neutral-700">
        Elements → Inspect. The highlighted node is what React rendered.
      </p>
    </DiagramFrame>
  );
}
