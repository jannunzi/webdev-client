import DiagramFrame from "./DiagramFrame";

export default function BoxModelDiagram() {
  return (
    <DiagramFrame label="Box model — four layers">
      <svg
        viewBox="0 0 640 280"
        role="img"
        aria-label="Concentric margin, border, padding, and content boxes"
        className="mx-auto h-auto w-full max-w-3xl"
      >
        <rect width="640" height="280" fill="#FEF2F2" rx="8" />
        <text x="24" y="36" fill="#9F1239" fontSize="18" fontWeight="700">
          margin
        </text>
        <rect
          x="56"
          y="52"
          width="528"
          height="196"
          fill="#FEF9C3"
          stroke="#A16207"
          strokeWidth="14"
          rx="6"
        />
        <text x="76" y="88" fill="#854D0E" fontSize="16" fontWeight="700">
          border
        </text>
        <rect x="108" y="100" width="424" height="120" fill="#DBEAFE" rx="4" />
        <text x="124" y="128" fill="#1E3A8A" fontSize="16" fontWeight="700">
          padding
        </text>
        <rect x="168" y="140" width="304" height="56" fill="#D1FAE5" rx="4" />
        <text
          x="320"
          y="174"
          textAnchor="middle"
          fill="#14532D"
          fontSize="18"
          fontWeight="800"
        >
          content
        </text>
      </svg>
    </DiagramFrame>
  );
}
