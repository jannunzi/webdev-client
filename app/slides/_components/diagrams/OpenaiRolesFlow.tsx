import DiagramFrame from "./DiagramFrame";

export default function OpenaiRolesFlow() {
  return (
    <DiagramFrame label="Message roles">
      <svg
        role="img"
        viewBox="0 0 960 220"
        className="mx-auto h-auto w-full max-w-5xl"
        aria-labelledby="openai-roles-title"
      >
        <title id="openai-roles-title">
          Developer instructions outrank the user prompt; assistant turns are prior model replies
        </title>
        {[
          { x: 20, fill: "#fef3c7", label: "developer", sub: "instructions / policy" },
          { x: 340, fill: "#e0f2fe", label: "user", sub: "the human prompt" },
          { x: 660, fill: "#dcfce7", label: "assistant", sub: "prior model replies" },
        ].map((box, index) => (
          <g key={box.label}>
            <rect
              x={box.x}
              y="36"
              width="280"
              height="130"
              rx="12"
              fill={box.fill}
              stroke="#171717"
              strokeWidth="2.5"
            />
            <text
              x={box.x + 140}
              y="88"
              textAnchor="middle"
              fontSize="24"
              fontWeight="700"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {box.label}
            </text>
            <text
              x={box.x + 140}
              y="128"
              textAnchor="middle"
              fontSize="16"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {box.sub}
            </text>
            {index < 2 ? (
              <polygon
                points={`${box.x + 292},101 ${box.x + 328},101 ${box.x + 328},93 ${box.x + 348},109 ${box.x + 328},125 ${box.x + 328},117 ${box.x + 292},117`}
                fill="#171717"
              />
            ) : null}
          </g>
        ))}
      </svg>
    </DiagramFrame>
  );
}
