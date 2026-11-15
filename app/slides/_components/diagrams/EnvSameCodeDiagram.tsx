const YELLOW = { outer: "#ffe59a", outerStroke: "#e09038", inner: "#fff8dc", innerStroke: "#d97706" };
const BLUE = { outer: "#a4c2f4", outerStroke: "#2f6fd0", inner: "#e8f0fe", innerStroke: "#3b82f6" };
const RED = { outer: "#f8c8c8", outerStroke: "#dc2626", inner: "#fff1f2", innerStroke: "#dc2626" };

const ENVS = [
  {
    title: "Development",
    db: "DB_URL=mongodb://localhost/kambaz",
    key: "API_KEY=dev-key",
    tone: YELLOW,
  },
  {
    title: "QA",
    db: "DB_URL=mongodb://qa-server/kambaz",
    key: "API_KEY=qa-key",
    tone: BLUE,
  },
  {
    title: "Production",
    db: "DB_URL=mongodb://prod-server/kambaz",
    key: "API_KEY=prod-key",
    tone: RED,
  },
] as const;

export default function EnvSameCodeDiagram() {
  return (
    <div
      className="env-same-code"
      data-diagram-stretch=""
      role="img"
      aria-label="The same process.env.DB_URL and process.env.API_KEY reads resolve to different values in development, QA, and production"
    >
      <div className="env-same-code-source">
        <strong>Same code</strong>
        <code>process.env.DB_URL</code>
        <code>process.env.API_KEY</code>
      </div>
      <svg
        className="env-same-code-arrows"
        viewBox="0 0 1480 160"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {ENVS.map((env, index) => {
          const x2 = 246 + index * 494;
          const x1 = 740;
          const y1 = 4;
          const y2 = 150;
          const dx = x2 - x1;
          const dy = y2 - y1;
          const len = Math.hypot(dx, dy) || 1;
          const ux = dx / len;
          const uy = dy / len;
          const head = 18;
          const baseX = x2 - ux * head;
          const baseY = y2 - uy * head;
          const wing = 9;
          return (
            <g key={env.title}>
              <line
                x1={x1}
                y1={y1}
                x2={baseX}
                y2={baseY}
                stroke={env.tone.outerStroke}
                strokeWidth={5}
              />
              <polygon
                points={`${x2},${y2} ${baseX - uy * wing},${baseY + ux * wing} ${baseX + uy * wing},${baseY - ux * wing}`}
                fill={env.tone.outerStroke}
              />
            </g>
          );
        })}
      </svg>
      <div className="env-same-code-row">
        {ENVS.map((env) => (
          <section
            key={env.title}
            className="env-panel"
            style={{ background: env.tone.outer, borderColor: env.tone.outerStroke }}
          >
            <h3>{env.title}</h3>
            <div
              className="env-panel-body"
              style={{ background: env.tone.inner, borderColor: env.tone.innerStroke }}
            >
              <code>{env.db}</code>
              <code>{env.key}</code>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
