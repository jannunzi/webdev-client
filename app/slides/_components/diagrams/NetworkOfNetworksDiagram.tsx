import DiagramFrame from "./DiagramFrame";

function NetworkCluster({
  x,
  label,
}: {
  x: number;
  label: string;
}) {
  const clients = [0, 1, 2].map((i) => ({
    cx: x + 36 + (i % 2) * 70,
    cy: 92 + Math.floor(i / 2) * 48,
  }));
  return (
    <g>
      <rect
        x={x}
        y="64"
        width="176"
        height="188"
        rx="14"
        fill="#fafafa"
        stroke="#171717"
        strokeWidth="2.5"
      />
      <text
        x={x + 88}
        y="88"
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        {label}
      </text>
      {clients.map((c) => (
        <g key={`${c.cx}-${c.cy}`}>
          <rect
            x={c.cx}
            y={c.cy}
            width="56"
            height="36"
            rx="6"
            fill="#fff"
            stroke="#171717"
            strokeWidth="2"
          />
          <text
            x={c.cx + 28}
            y={c.cy + 24}
            textAnchor="middle"
            fontSize="12"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            Client
          </text>
        </g>
      ))}
      <rect
        x={x + 50}
        y="196"
        width="76"
        height="38"
        rx="6"
        fill="#fee2e2"
        stroke="#171717"
        strokeWidth="2"
      />
      <text
        x={x + 88}
        y="221"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        Server
      </text>
    </g>
  );
}

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
          The Internet is a network of networks. Each network has clients and a
          server
        </title>
        <rect
          x="10"
          y="10"
          width="940"
          height="260"
          rx="18"
          fill="#e0f2fe"
          stroke="#171717"
          strokeWidth="3"
        />
        <text
          x="480"
          y="42"
          textAnchor="middle"
          fontSize="26"
          fontWeight="800"
          letterSpacing="2"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          THE INTERNET
        </text>
        <NetworkCluster x="36" label="Network" />
        <NetworkCluster x="274" label="Network" />
        <NetworkCluster x="512" label="Network" />
        <NetworkCluster x="750" label="Network" />
      </svg>
    </DiagramFrame>
  );
}
