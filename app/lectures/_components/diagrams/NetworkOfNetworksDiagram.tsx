import DiagramFrame from "./DiagramFrame";

export default function NetworkOfNetworksDiagram() {
  return (
    <DiagramFrame label="Diagram">
      <svg
        role="img"
        viewBox="0 0 960 280"
        className="mx-auto h-auto w-full max-w-5xl"
        aria-labelledby="network-of-networks-title"
      >
        <title id="network-of-networks-title">
          The Internet is independently operated networks that interconnect:
          home and campus clients on the left, the Internet in the middle, and
          a web server on the right
        </title>
        <defs>
          <marker
            id="net-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#171717" />
          </marker>
        </defs>

        <rect x="16" y="28" width="250" height="224" rx="14" fill="#fafafa" stroke="#171717" strokeWidth="2.5" />
        <text x="141" y="58" textAnchor="middle" fontSize="16" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Your networks
        </text>
        <rect x="36" y="76" width="210" height="72" rx="10" fill="#fff" stroke="#171717" strokeWidth="2" />
        <text x="141" y="106" textAnchor="middle" fontSize="20" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Home
        </text>
        <text x="141" y="132" textAnchor="middle" fontSize="16" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Laptop · client
        </text>
        <rect x="36" y="160" width="210" height="72" rx="10" fill="#fff" stroke="#171717" strokeWidth="2" />
        <text x="141" y="190" textAnchor="middle" fontSize="20" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Campus
        </text>
        <text x="141" y="216" textAnchor="middle" fontSize="16" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Phone · client
        </text>

        <line x1="266" y1="112" x2="318" y2="140" stroke="#171717" strokeWidth="3" markerEnd="url(#net-arrow)" />
        <line x1="266" y1="196" x2="318" y2="160" stroke="#171717" strokeWidth="3" markerEnd="url(#net-arrow)" />

        <rect x="328" y="56" width="304" height="168" rx="16" fill="#e0f2fe" stroke="#171717" strokeWidth="3" />
        <text x="480" y="118" textAnchor="middle" fontSize="28" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Internet
        </text>
        <text x="480" y="154" textAnchor="middle" fontSize="16" fontFamily="ui-sans-serif, system-ui, sans-serif">
          ISPs · routers · many networks
        </text>
        <text x="480" y="184" textAnchor="middle" fontSize="16" fontFamily="ui-sans-serif, system-ui, sans-serif">
          No one owner
        </text>

        <line x1="632" y1="140" x2="684" y2="140" stroke="#171717" strokeWidth="3" markerEnd="url(#net-arrow)" />

        <rect x="694" y="56" width="250" height="168" rx="14" fill="#fafafa" stroke="#171717" strokeWidth="2.5" />
        <text x="819" y="92" textAnchor="middle" fontSize="16" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Server network
        </text>
        <rect x="714" y="112" width="210" height="84" rx="10" fill="#fee2e2" stroke="#171717" strokeWidth="2" />
        <text x="819" y="148" textAnchor="middle" fontSize="22" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Web server
        </text>
        <text x="819" y="178" textAnchor="middle" fontSize="16" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Hosts the site
        </text>
      </svg>
      <p className="mb-0 mt-3 text-center font-sans text-lg text-neutral-700">
        Each hop is its own network. If one path fails, routing can take another.
      </p>
    </DiagramFrame>
  );
}
