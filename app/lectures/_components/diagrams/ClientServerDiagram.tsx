import DiagramFrame from "./DiagramFrame";

export default function ClientServerDiagram() {
  return (
    <DiagramFrame label="Diagram">
      <svg
        role="img"
        viewBox="0 0 880 280"
        className="mx-auto h-auto w-full max-w-5xl"
        aria-labelledby="client-server-title"
      >
        <title id="client-server-title">
          A React browser client sends an HTTP request to a Node server, which
          reads files or MongoDB and returns an HTTP response
        </title>
        <rect x="20" y="36" width="230" height="208" rx="12" fill="#fafafa" stroke="#171717" strokeWidth="2.5" />
        <text x="135" y="72" textAnchor="middle" fontSize="16" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Clients
        </text>
        <rect x="44" y="92" width="182" height="48" rx="8" fill="#fee2e2" stroke="#171717" strokeWidth="2" />
        <text x="135" y="123" textAnchor="middle" fontSize="20" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          React
        </text>
        <text x="135" y="168" textAnchor="middle" fontSize="16" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Browser · HTML · CSS · JS
        </text>
        <text x="135" y="196" textAnchor="middle" fontSize="16" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Next.js UI
        </text>

        <text x="440" y="92" textAnchor="middle" fontSize="16" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          HTTP request
        </text>
        <line x1="268" y1="110" x2="412" y2="110" stroke="#171717" strokeWidth="3" markerEnd="url(#cs-arrow)" />
        <text x="440" y="186" textAnchor="middle" fontSize="16" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          HTTP response
        </text>
        <line x1="412" y1="204" x2="268" y2="204" stroke="#171717" strokeWidth="3" markerEnd="url(#cs-arrow)" />

        <rect x="430" y="36" width="200" height="208" rx="12" fill="#e0f2fe" stroke="#171717" strokeWidth="2.5" />
        <text x="530" y="72" textAnchor="middle" fontSize="16" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Servers
        </text>
        <rect x="452" y="92" width="156" height="48" rx="8" fill="#fee2e2" stroke="#171717" strokeWidth="2" />
        <text x="530" y="123" textAnchor="middle" fontSize="20" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Node
        </text>
        <text x="530" y="176" textAnchor="middle" fontSize="16" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Express
        </text>

        <line x1="648" y1="140" x2="678" y2="140" stroke="#171717" strokeWidth="3" markerEnd="url(#cs-arrow)" />
        <line x1="678" y1="168" x2="648" y2="168" stroke="#171717" strokeWidth="3" markerEnd="url(#cs-arrow)" />

        <rect x="690" y="36" width="170" height="208" rx="12" fill="#fafafa" stroke="#171717" strokeWidth="2.5" />
        <text x="775" y="72" textAnchor="middle" fontSize="16" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Resources
        </text>
        <rect x="710" y="92" width="130" height="48" rx="8" fill="#fee2e2" stroke="#171717" strokeWidth="2" />
        <text x="775" y="123" textAnchor="middle" fontSize="20" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Mongo
        </text>
        <text x="775" y="176" textAnchor="middle" fontSize="16" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Files · HTML · JSON
        </text>
        <defs>
          <marker id="cs-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#171717" />
          </marker>
        </defs>
      </svg>
    </DiagramFrame>
  );
}
