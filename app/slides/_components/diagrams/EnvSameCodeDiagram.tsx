"use client";

import { useLayoutEffect, useRef } from "react";
import DiagramFrame from "./DiagramFrame";

const FONT = "ui-sans-serif, system-ui, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const DB = "#1d4ed8";
const KEY = "#ea580c";
const GREEN = "#339933";
const INK = "#171717";

const BOX_W = 460;
const GAP = 16;
const MARGIN = 6;
const TOP_W = 320;
const TOP_H = 56;
const BOX_H = 60;
const ARROW = 18;

const boxX = (index: number) => MARGIN + index * (BOX_W + GAP);
const boxCenter = (index: number) => boxX(index) + BOX_W / 2;
const WIDTH = MARGIN * 2 + BOX_W * 3 + GAP * 2;
const MID = boxCenter(1);
const TOP_X = MID - TOP_W / 2;
const TOP_Y = 4;
const TOP_BOTTOM = TOP_Y + TOP_H;
const BOT_Y = TOP_BOTTOM + ARROW;
const HEIGHT = BOT_Y + BOX_H + 6;

const ENVS = [
  {
    title: "🧪 Development",
    db: "DB_URL=mongodb://localhost/kambaz",
    key: "API_KEY=dev-key",
  },
  {
    title: "🔍 QA",
    db: "DB_URL=mongodb://qa-server/kambaz",
    key: "API_KEY=qa-key",
  },
  {
    title: "🚀 Production",
    db: "DB_URL=mongodb://prod-server/kambaz",
    key: "API_KEY=prod-key",
  },
] as const;

function BranchArrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const head = 13;
  const baseX = x2 - ux * head;
  const baseY = y2 - uy * head;
  const wing = 6.5;
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={baseX}
        y2={baseY}
        stroke={GREEN}
        strokeWidth={3.5}
      />
      <polygon
        points={`${x2},${y2} ${baseX - uy * wing},${baseY + ux * wing} ${baseX + uy * wing},${baseY - ux * wing}`}
        fill={GREEN}
      />
    </g>
  );
}

export default function EnvSameCodeDiagram() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    const article = node?.closest("article");
    const svg = node?.querySelector("svg");
    if (!node || !svg || !(article instanceof HTMLElement)) return;

    const fit = () => {
      svg.style.height = "";
      const overflow = article.scrollHeight - article.clientHeight;
      if (overflow <= 1) return;
      const height = svg.getBoundingClientRect().height;
      // Shrink only the drawing so the bullets stay full size and the
      // whole diagram, including the three environment boxes, stays on the slide.
      svg.style.height = `${Math.max(64, height - overflow - 6)}px`;
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(article);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
    <DiagramFrame label="" compact>
      <svg
        role="img"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mx-auto block h-auto w-full"
        aria-labelledby="env-same-code-title"
      >
        <title id="env-same-code-title">
          The same process.env.DB_URL and process.env.API_KEY reads resolve to different values in
          development, QA, and production
        </title>

        <rect
          x={TOP_X}
          y={TOP_Y}
          width={TOP_W}
          height={TOP_H}
          rx={12}
          fill="#ffffff"
          stroke={INK}
          strokeWidth={2.5}
        />
        <text
          x={MID}
          y={TOP_Y + 18}
          textAnchor="middle"
          fontFamily={FONT}
          fontSize={15}
          fontWeight={800}
          fill={INK}
        >
          📄 Same Code
        </text>
        <text
          x={TOP_X + 12}
          y={TOP_Y + 36}
          textAnchor="start"
          fontFamily={MONO}
          fontSize={13}
          fontWeight={700}
          fill={DB}
        >
          process.env.DB_URL
        </text>
        <text
          x={TOP_X + 12}
          y={TOP_Y + 50}
          textAnchor="start"
          fontFamily={MONO}
          fontSize={13}
          fontWeight={700}
          fill={KEY}
        >
          process.env.API_KEY
        </text>

        {ENVS.map((env, index) => {
          const x = boxX(index);
          return (
            <g key={env.title}>
              <rect
                x={x}
                y={BOT_Y}
                width={BOX_W}
                height={BOX_H}
                rx={12}
                fill="#ffffff"
                stroke={INK}
                strokeWidth={2.5}
              />
              <text
                x={boxCenter(index)}
                y={BOT_Y + 18}
                textAnchor="middle"
                fontFamily={FONT}
                fontSize={15}
                fontWeight={800}
                fill={INK}
              >
                {env.title}
              </text>
              <text
                x={x + 10}
                y={BOT_Y + 38}
                textAnchor="start"
                fontFamily={MONO}
                fontSize={13}
                fontWeight={700}
                fill={DB}
              >
                {env.db}
              </text>
              <text
                x={x + 10}
                y={BOT_Y + 52}
                textAnchor="start"
                fontFamily={MONO}
                fontSize={13}
                fontWeight={700}
                fill={KEY}
              >
                {env.key}
              </text>
            </g>
          );
        })}

        {ENVS.map((env, index) => (
          <BranchArrow
            key={`${env.title}-arrow`}
            x1={MID}
            y1={TOP_BOTTOM}
            x2={boxCenter(index)}
            y2={BOT_Y}
          />
        ))}
      </svg>
    </DiagramFrame>
    </div>
  );
}
