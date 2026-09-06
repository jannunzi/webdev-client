import type { LectureSlide } from "../types";

export const CSS_ROTATION_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Lecture 4 · Deck 8 — Rotation and Gradients",
      "Optional extras. Not required for Lab 2 checklists",
    ],
  },
  {
    id: "purpose",
    title: "Paint tricks after the layout",
    kind: "content",
    bullets: [
      "Lab 2’s graded path stopped at flex and media queries",
      "`transform: rotate` turns a box without changing document flow the way float does",
      "`linear-gradient` and `radial-gradient` paint a fill that is not a flat color",
      "Useful for emphasis. Do not rotate body copy as a layout strategy",
    ],
  },
  {
    id: "rotate",
    title: "transform: rotate turns a box",
    kind: "demo",
    bullets: [
      "`rotate(12deg)` tips a card. `rotate(90deg)` stands a square on its side",
      "The element’s layout box often stays; the paint is what spins — leave extra room",
    ],
    code: `.wd-rotate-card {
  width: 160px;
  height: 100px;
  transform: rotate(12deg);
  background-color: #7070ff;
  color: white;
}`,
    codeLanguage: "css",
    embed: "css-rotate",
  },
  {
    id: "gradient",
    title: "linear- and radial-gradient",
    kind: "demo",
    bullets: [
      "`background: linear-gradient(yellow, red)` blends top to bottom",
      "`radial-gradient(yellow, green)` blends from the center out",
      "Still a `background` — stack it like any other fill, not like a second element",
    ],
    code: `.wd-gradient-linear {
  background: linear-gradient(yellow, red);
  width: 200px;
  height: 140px;
}
.wd-gradient-radial {
  background: radial-gradient(yellow, green);
  width: 200px;
  height: 140px;
}`,
    codeLanguage: "css",
    embed: "css-gradient",
  },
  {
    id: "recap",
    title: "Lecture 4 recap",
    kind: "content",
    bullets: [
      "Selectors: tag, `#id`, `.class`, descendant, child — then the cascade",
      "Box model: padding inside, margin outside, `border-box` for honest widths",
      "Position: relative nudge, absolute vs a parent, fixed vs the viewport, `z-index`",
      "Layout: float + clear (historical), flex for rows, `@media` for viewports",
    ],
  },
  {
    id: "next-up",
    title: "After Lecture 4",
    kind: "title",
    bullets: [
      "Open Chapter 2 in the book and finish Lab 2 §2.1",
      "Tailwind utilities and Kambaz styling come later — CSS first so those classes make sense",
    ],
  },
];
