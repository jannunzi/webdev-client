import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/lectures/thumbs",
);
mkdirSync(outDir, { recursive: true });

const HTML5 = `
  <g transform="translate(80 90)">
    <path d="M36 12h248l-22 248-102 28-102-28L36 12z" fill="#E44D26"/>
    <path d="M160 32v236l82-22 18-202H160z" fill="#F16529"/>
    <path d="M160 118H92l4 44h64V118zm0 148-56-16-4-40H80l6 72 74 20V266z" fill="#EBEBEB"/>
    <path d="M160 118v44h62l-6 64-56 16v46l74-20 8-92 2-58H160z" fill="#fff"/>
  </g>`;

const NODE = `
  <g transform="translate(70 70)">
    <path d="M180 28 48 104v152l132 76 132-76V104L180 28z" fill="#3C873A"/>
    <path d="M180 52 78 112v128l102 58 102-58V112L180 52z" fill="#68A063"/>
    <text x="180" y="200" text-anchor="middle" fill="#fff" font-family="ui-sans-serif, system-ui, sans-serif" font-size="72" font-weight="800">JS</text>
  </g>`;

const REACT_NEXT = `
  <g transform="translate(70 80)">
    <circle cx="150" cy="180" r="28" fill="#61DAFB"/>
    <ellipse cx="150" cy="180" rx="120" ry="46" fill="none" stroke="#61DAFB" stroke-width="12"/>
    <ellipse cx="150" cy="180" rx="120" ry="46" fill="none" stroke="#61DAFB" stroke-width="12" transform="rotate(60 150 180)"/>
    <ellipse cx="150" cy="180" rx="120" ry="46" fill="none" stroke="#61DAFB" stroke-width="12" transform="rotate(-60 150 180)"/>
    <g transform="translate(300 70)">
      <circle cx="90" cy="90" r="90" fill="#000"/>
      <text x="90" y="118" text-anchor="middle" fill="#fff" font-family="ui-sans-serif, system-ui, sans-serif" font-size="72" font-weight="800">N</text>
    </g>
  </g>`;

const GITHUB = `
  <g transform="translate(90 70)">
    <circle cx="180" cy="180" r="160" fill="#24292F"/>
    <path fill="#fff" d="M180 70c-62 0-112 50-112 112 0 49 32 91 77 106 5 1 8-2 8-6v-22c-31 7-38-13-38-13-5-13-12-16-12-16-10-7 1-7 1-7 11 1 17 12 17 12 10 17 26 12 32 9 1-7 4-12 7-15-25-3-51-12-51-55 0-12 4-22 12-30-1-3-5-16 1-32 0 0 10-3 33 12a114 114 0 0 1 60 0c23-15 33-12 33-12 6 16 2 29 1 32 8 8 12 18 12 30 0 43-26 52-51 55 4 3 8 10 8 21v31c0 4 3 7 8 6 45-15 77-57 77-106 0-62-50-112-112-112z"/>
  </g>`;

const VERCEL = `
  <g transform="translate(90 80)">
    <rect width="360" height="360" rx="48" fill="#000"/>
    <path d="M180 92 292 300H68L180 92z" fill="#fff"/>
  </g>`;

const HEADINGS = `
  <g transform="translate(70 90)" font-family="ui-sans-serif, system-ui, sans-serif" fill="#0F172A">
    <text x="20" y="90" font-size="92" font-weight="800">H1</text>
    <text x="20" y="175" font-size="64" font-weight="700">H2</text>
    <text x="20" y="245" font-size="48" font-weight="700">H3</text>
    <rect x="220" y="48" width="280" height="22" rx="6" fill="#0F172A"/>
    <rect x="220" y="92" width="240" height="16" rx="6" fill="#64748B"/>
    <rect x="220" y="128" width="260" height="16" rx="6" fill="#94A3B8"/>
    <rect x="220" y="188" width="280" height="16" rx="6" fill="#CBD5E1"/>
    <rect x="220" y="224" width="200" height="16" rx="6" fill="#CBD5E1"/>
  </g>`;

const LISTS_TABLES = `
  <g transform="translate(70 90)">
    <circle cx="36" cy="56" r="12" fill="#0F172A"/>
    <rect x="64" y="46" width="200" height="20" rx="6" fill="#0F172A"/>
    <circle cx="36" cy="112" r="12" fill="#0F172A"/>
    <rect x="64" y="102" width="170" height="20" rx="6" fill="#334155"/>
    <circle cx="36" cy="168" r="12" fill="#0F172A"/>
    <rect x="64" y="158" width="190" height="20" rx="6" fill="#334155"/>
    <g transform="translate(300 30)">
      <rect width="280" height="200" rx="12" fill="#fff" stroke="#0F172A" stroke-width="8"/>
      <rect x="0" y="0" width="280" height="48" rx="12" fill="#0F172A"/>
      <rect x="0" y="40" width="280" height="8" fill="#0F172A"/>
      <line x1="93" y1="48" x2="93" y2="200" stroke="#94A3B8" stroke-width="4"/>
      <line x1="187" y1="48" x2="187" y2="200" stroke="#94A3B8" stroke-width="4"/>
      <line x1="0" y1="100" x2="280" y2="100" stroke="#CBD5E1" stroke-width="4"/>
      <line x1="0" y1="150" x2="280" y2="150" stroke="#CBD5E1" stroke-width="4"/>
    </g>
  </g>`;

const FORMS = `
  <g transform="translate(90 100)">
    <rect width="500" height="280" rx="24" fill="#fff" stroke="#0F172A" stroke-width="8"/>
    <rect x="36" y="40" width="160" height="18" rx="6" fill="#64748B"/>
    <rect x="36" y="70" width="428" height="48" rx="10" fill="#F1F5F9" stroke="#0F172A" stroke-width="4"/>
    <rect x="36" y="140" width="120" height="18" rx="6" fill="#64748B"/>
    <rect x="36" y="170" width="428" height="48" rx="10" fill="#F1F5F9" stroke="#0F172A" stroke-width="4"/>
  </g>`;

const ANCHORS = `
  <g transform="translate(120 90)" fill="none" stroke="#0F172A" stroke-width="22" stroke-linecap="round">
    <path d="M210 120c40-40 104-40 144 0s40 104 0 144l-52 52"/>
    <path d="M270 280c-40 40-104 40-144 0s-40-104 0-144l52-52"/>
  </g>`;

const KAMBAZ = `
  <g transform="translate(70 90)">
    <rect width="150" height="280" rx="18" fill="#111827"/>
    <rect x="22" y="28" width="106" height="14" rx="4" fill="#F8FAFC"/>
    <rect x="22" y="62" width="86" height="10" rx="4" fill="#94A3B8"/>
    <rect x="22" y="88" width="70" height="10" rx="4" fill="#64748B"/>
    <rect x="22" y="114" width="78" height="10" rx="4" fill="#64748B"/>
    <rect x="22" y="140" width="64" height="10" rx="4" fill="#475569"/>
    <rect x="180" y="0" width="430" height="280" rx="18" fill="#fff" stroke="#0F172A" stroke-width="8"/>
    <rect x="208" y="32" width="200" height="16" rx="6" fill="#0F172A"/>
    <rect x="208" y="68" width="370" height="12" rx="6" fill="#94A3B8"/>
    <rect x="208" y="96" width="330" height="12" rx="6" fill="#CBD5E1"/>
    <rect x="208" y="140" width="150" height="100" rx="12" fill="#E2E8F0"/>
    <rect x="372" y="140" width="150" height="100" rx="12" fill="#E2E8F0"/>
  </g>`;

const SPA = `
  <g transform="translate(80 110)">
    <rect width="240" height="200" rx="20" fill="#fff" stroke="#0F172A" stroke-width="8"/>
    <rect x="24" y="28" width="140" height="16" rx="6" fill="#0F172A"/>
    <rect x="24" y="64" width="190" height="12" rx="6" fill="#94A3B8"/>
    <rect x="24" y="92" width="160" height="12" rx="6" fill="#CBD5E1"/>
    <path d="M280 100h80" stroke="#0F172A" stroke-width="10" stroke-linecap="round"/>
    <polygon points="360,86 390,100 360,114" fill="#0F172A"/>
    <rect x="410" y="0" width="240" height="200" rx="20" fill="#111827" stroke="#0F172A" stroke-width="8"/>
    <rect x="434" y="28" width="140" height="16" rx="6" fill="#61DAFB"/>
    <rect x="434" y="64" width="190" height="12" rx="6" fill="#94A3B8"/>
    <rect x="434" y="92" width="160" height="12" rx="6" fill="#64748B"/>
  </g>`;

function card({
  slug,
  title,
  lecture,
  bg,
  accent,
  art,
  titleFill = "#F8FAFC",
  subtitleFill = "#CBD5E1",
}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" role="img" aria-labelledby="title">
  <title id="title">${title}</title>
  <rect width="1280" height="720" fill="${bg}"/>
  <rect x="0" y="0" width="18" height="720" fill="${accent}"/>
  <text x="72" y="64" fill="${subtitleFill}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="28" font-weight="700" letter-spacing="4">WEB DEV · LECTURE ${lecture}</text>
  ${art}
  <text x="72" y="640" fill="${titleFill}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="56" font-weight="800">${title}</text>
</svg>
`;
}

const thumbs = [
  {
    slug: "intro-to-web-development",
    title: "Introduction to Web Development",
    lecture: 1,
    bg: "#1C1917",
    accent: "#E44D26",
    art: HTML5,
  },
  {
    slug: "installing-nodejs",
    title: "Installing Node.js",
    lecture: 1,
    bg: "#052E16",
    accent: "#68A063",
    art: NODE,
  },
  {
    slug: "creating-a-nextjs-react-application",
    title: "Creating a Next.js React App",
    lecture: 1,
    bg: "#0B1220",
    accent: "#61DAFB",
    art: REACT_NEXT,
  },
  {
    slug: "commit-to-github",
    title: "Commit to GitHub",
    lecture: 1,
    bg: "#0D1117",
    accent: "#F0F6FC",
    art: GITHUB,
  },
  {
    slug: "deploying-to-vercel",
    title: "Deploying to Vercel",
    lecture: 1,
    bg: "#111111",
    accent: "#FFFFFF",
    art: VERCEL,
  },
  {
    slug: "html-and-dom",
    title: "HTML and the DOM",
    lecture: 2,
    bg: "#1C1917",
    accent: "#E44D26",
    art: HTML5,
  },
  {
    slug: "headings-and-paragraphs",
    title: "Headings and Paragraphs",
    lecture: 2,
    bg: "#F8FAFC",
    accent: "#E44D26",
    art: HEADINGS,
    titleFill: "#0F172A",
    subtitleFill: "#64748B",
  },
  {
    slug: "lists-and-tables",
    title: "Lists and Tables",
    lecture: 2,
    bg: "#F1F5F9",
    accent: "#0F172A",
    art: LISTS_TABLES,
    titleFill: "#0F172A",
    subtitleFill: "#64748B",
  },
  {
    slug: "web-forms",
    title: "Web Forms",
    lecture: 2,
    bg: "#EEF2FF",
    accent: "#4F46E5",
    art: FORMS,
    titleFill: "#1E1B4B",
    subtitleFill: "#6366F1",
  },
  {
    slug: "anchors",
    title: "Anchors",
    lecture: 2,
    bg: "#FFF7ED",
    accent: "#EA580C",
    art: ANCHORS,
    titleFill: "#7C2D12",
    subtitleFill: "#C2410C",
  },
  {
    slug: "single-page-navigation",
    title: "Single-page Navigation",
    lecture: 2,
    bg: "#ECFEFF",
    accent: "#0891B2",
    art: SPA,
    titleFill: "#164E63",
    subtitleFill: "#0E7490",
  },
  {
    slug: "kambaz-overview",
    title: "Kambaz Overview",
    lecture: 3,
    bg: "#1C1917",
    accent: "#F59E0B",
    art: KAMBAZ,
  },
  {
    slug: "kambaz-account",
    title: "Kambaz Account",
    lecture: 3,
    bg: "#0F172A",
    accent: "#38BDF8",
    art: KAMBAZ,
  },
  {
    slug: "kambaz-dashboard",
    title: "Kambaz Dashboard",
    lecture: 3,
    bg: "#14532D",
    accent: "#86EFAC",
    art: KAMBAZ,
  },
  {
    slug: "kambaz-navigation",
    title: "Kambaz Navigation",
    lecture: 3,
    bg: "#1E1B4B",
    accent: "#A78BFA",
    art: KAMBAZ,
  },
  {
    slug: "kambaz-courses",
    title: "Kambaz Courses",
    lecture: 3,
    bg: "#7C2D12",
    accent: "#FDBA74",
    art: KAMBAZ,
  },
  {
    slug: "kambaz-modules",
    title: "Kambaz Modules",
    lecture: 3,
    bg: "#134E4A",
    accent: "#5EEAD4",
    art: KAMBAZ,
  },
  {
    slug: "kambaz-assignments",
    title: "Kambaz Assignments",
    lecture: 3,
    bg: "#4C0519",
    accent: "#FB7185",
    art: KAMBAZ,
  },
];

for (const thumb of thumbs) {
  writeFileSync(join(outDir, `${thumb.slug}.svg`), card(thumb));
}

console.log(`Wrote ${thumbs.length} lecture thumbs to ${outDir}`);
