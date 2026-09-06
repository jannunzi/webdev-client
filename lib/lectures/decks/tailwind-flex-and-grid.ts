import type { LectureSlide } from "../types";

export const TAILWIND_FLEX_AND_GRID_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 2 · Flex and Grid",
      "§2.3.6 · Tailwind layout utilities — not a second float lecture",
    ],
  },
  {
    id: "purpose",
    title: "Same CSS, shorter class names",
    kind: "content",
    bullets: [
      "§2.1 already taught `display: flex` and percentage float columns",
      "This deck is the **utility** spelling — skip the raw CSS redo",
      "`flex` → `display: flex`. `grow` → `flex-grow: 1`. `shrink-0` → `flex-shrink: 0`",
      "Grid: `grid grid-cols-4 gap-4`, then `col-span-*` to span",
    ],
  },
  {
    id: "flex-map",
    title: "Flex.tsx → Tailwind classes",
    kind: "content",
    bullets: [
      "Pinned column + growing column — same Lab 2 Flex story",
      "`w-[110px] shrink-0` pins column 1. `grow` stretches column 3",
    ],
    code: `<div className="flex flex-row">
  <div className="w-[110px] shrink-0 bg-yellow-300 p-2.5">Column 1</div>
  <div className="bg-blue-400 p-2.5 text-white">Column 2</div>
  <div className="grow bg-red-400 p-2.5 text-white">Column 3</div>
</div>`,
    codeLanguage: "tsx",
    codeHighlightLines: [1, 2, 4],
  },
  {
    id: "flex-demo",
    title: "Live Tailwind flex row",
    kind: "demo",
    bullets: [
      "Column 1 stays ~110px. Column 3 eats the leftover width",
      "Kambaz Home later: `flex gap-4` plus `min-w-0 flex-1` on the main column",
    ],
    embed: "tw-flex",
  },
  {
    id: "grid-four",
    title: "grid-cols-4 wraps children",
    kind: "content",
    bullets: [
      "`grid grid-cols-4 gap-4` — four columns, consistent gutters",
      "Nine cells wrap onto a third row. No manual row break",
    ],
    code: `export default function TailwindGrids() {
  return (
    <div>
      <h3 className="mt-6 text-3xl font-bold">4 Columns Grid</h3>
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="text-center bg-blue-300 p-3">
            {String(i + 1).padStart(2, "0")}
          </div>
        ))}
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/tailwind/TailwindGrids.tsx",
  },
  {
    id: "col-span",
    title: "col-span on a 12-column grid",
    kind: "content",
    bullets: [
      "Twelve divides by 2, 3, 4, and 6 — that is why page layouts use 12",
      "`col-span-4` + `col-span-8` = one third / two thirds",
      "Sidebar / content / sidebar = `2 / 8 / 2`",
    ],
    code: `<div id="wd-tailwind-grid-system" className="mt-6">
  <h2>Grid system</h2>
  <div className="grid grid-cols-2 gap-2">
    <div className="bg-red-500 text-white"><h3>Left half</h3></div>
    <div className="bg-blue-500 text-white"><h3>Right half</h3></div>
  </div>
  <div className="grid grid-cols-12 gap-2 mt-2">
    <div className="col-span-4 bg-yellow-500"><h3>One third</h3></div>
    <div className="col-span-8 bg-green-500 text-white"><h3>Two thirds</h3></div>
  </div>
  <div className="grid grid-cols-12 gap-2 mt-2">
    <div className="col-span-2 bg-black text-white"><h3>Sidebar</h3></div>
    <div className="col-span-8 bg-gray-500 text-white"><h3>Main content</h3></div>
    <div className="col-span-2 bg-blue-400"><h3>Sidebar</h3></div>
  </div>
</div>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/tailwind/TailwindGrids.tsx",
  },
  {
    id: "grid-demo",
    title: "Live Tailwind grids",
    kind: "demo",
    bullets: [
      "Four-column wrap, then the 12-column page splits",
      "§2.1’s float “grid” was percentages. This is CSS Grid",
    ],
    embed: "tw-grids",
  },
  {
    id: "next-up",
    title: "Next: responsive prefixes",
    kind: "title",
    bullets: [
      "You can pin a flex column and span grid tracks with utilities",
      "§2.3.4: mobile-first `md:` / `lg:` — the Tailwind spelling of `@media`",
    ],
  },
];
