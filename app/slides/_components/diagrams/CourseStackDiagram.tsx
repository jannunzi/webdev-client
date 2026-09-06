import DiagramFrame from "./DiagramFrame";

const LAYERS = [
  { title: "Browser", body: "HTML · CSS · JavaScript", accent: false },
  { title: "React + Next.js", body: "UI · App Router · Vercel", accent: true },
  { title: "Node + Express", body: "HTTP API", accent: true },
  { title: "MongoDB", body: "Documents · later chapters", accent: true },
] as const;

export default function CourseStackDiagram() {
  return (
    <DiagramFrame label="Diagram">
      <svg
        role="img"
        viewBox="0 0 720 280"
        className="mx-auto h-auto w-full max-w-3xl"
        aria-labelledby="course-stack-title"
      >
        <title id="course-stack-title">
          Course stack: React and Next.js in the browser, Node and Express as
          the API, MongoDB for data
        </title>
        {LAYERS.map((layer, index) => {
          const y = 16 + index * 64;
          return (
            <g key={layer.title}>
              <rect
                x="40"
                y={y}
                width="640"
                height="54"
                rx="10"
                fill={layer.accent ? "#fee2e2" : "#fafafa"}
                stroke="#171717"
                strokeWidth="2.5"
              />
              <text
                x="360"
                y={y + 24}
                textAnchor="middle"
                fontSize="20"
                fontWeight="700"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
              >
                {layer.title}
              </text>
              <text
                x="360"
                y={y + 44}
                textAnchor="middle"
                fontSize="15"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
              >
                {layer.body}
              </text>
            </g>
          );
        })}
      </svg>
    </DiagramFrame>
  );
}
