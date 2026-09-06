import type { LectureSlide } from "../types";

export const CSS_BOX_MODEL_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 2 · Box Model",
      "Chapter 2 §2.1.9–2.1.11 · borders, padding, margin, corners",
    ],
  },
  {
    id: "layers",
    title: "Four layers of every box",
    kind: "content",
    bullets: [
      "**Content** — the text or children",
      "**Padding** — space between content and border (background fills this too)",
      "**Border** — the edge: width, style, color",
      "**Margin** — transparent space outside the border, pushing neighbors away",
    ],
    diagram: "box-model",
  },
  {
    id: "borders-mix",
    title: "Mix width, style, and color",
    kind: "content",
    bullets: [
      "Three properties: `border-width`, `border-style`, `border-color`",
      "Lab 2 splits them into small classes so you can remix: fat + red + solid",
      "Styles: `solid`, `dashed`, `dotted`, `double`, …",
    ],
    code: `.wd-border-fat { border-width: 20px 30px 20px 30px; }
.wd-border-thin { border-width: 4px; }
.wd-border-solid { border-style: solid; }
.wd-border-dashed { border-style: dashed; }
.wd-border-yellow { border-color: #ffff07; }
.wd-border-red { border-color: #ff7070; }
.wd-border-blue { border-color: #7070ff; }`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
  },
  {
    id: "borders-demo",
    title: "Borders.tsx",
    kind: "demo",
    bullets: [
      "First paragraph: fat, red, solid. Second: thin, blue, dashed",
      "No combined “fat-red-solid” rule — composition is the point",
    ],
    code: `export default function Borders() {
  return (
    <div id="wd-css-borders">
      <h2>Borders</h2>
      <p className="wd-border-fat wd-border-red wd-border-solid">
        Solid fat red border
      </p>
      <p className="wd-border-thin wd-border-blue wd-border-dashed">
        Dashed thin blue border
      </p>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/Borders.tsx",
    embed: "css-borders",
  },
  {
    id: "padding",
    title: "Padding is inside the border",
    kind: "demo",
    bullets: [
      "`padding-top` / `-right` / `-bottom` / `-left`, or one `padding` for all sides",
      "Keep a fat border and a yellow fill so you can *see* the gap",
    ],
    code: `.wd-padded-top-left {
  padding-top: 50px;
  padding-left: 50px;
}
.wd-padded-bottom-right {
  padding-bottom: 50px;
  padding-right: 50px;
}
.wd-padding-fat {
  padding: 50px;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
    embed: "css-padding",
  },
  {
    id: "margins",
    title: "Margin is outside the border",
    kind: "demo",
    bullets: [
      "Same pattern as padding — but the gap sits **between** boxes",
      "Margin is transparent. You see whatever is behind the hole",
    ],
    code: `.wd-margin-bottom {
  margin-bottom: 50px;
}
.wd-margin-right-left {
  margin-left: 50px;
  margin-right: 50px;
}
.wd-margin-all-around {
  margin: 30px;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
    embed: "css-margins",
  },
  {
    id: "box-sizing",
    title: "content-box vs border-box",
    kind: "content",
    bullets: [
      "Default `content-box`: `width: 200px` sizes **only** the content. Padding and border add extra pixels",
      "`border-box`: 200px **includes** padding and border. The painted box stays 200px",
      "Layout math is easier with `border-box`. Tailwind later sets it globally",
    ],
    code: `.wd-box-sizing-content,
.wd-box-sizing-border {
  width: 200px;
  padding: 20px;
  border: 10px solid #c41e3a;
  background-color: #ffff07;
}
.wd-box-sizing-content { box-sizing: content-box; }
.wd-box-sizing-border { box-sizing: border-box; }`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
  },
  {
    id: "box-model-demo",
    title: "BoxModel.tsx — layers and width",
    kind: "demo",
    bullets: [
      "Nested labels walk outward: content → padding → border → margin",
      "Both yellow boxes declare 200px + 20px padding + 10px border",
      "`content-box` paints 260px wide. `border-box` stays 200px",
    ],
    code: `<div className="wd-box-sizing-content">
  content-box: width 200px plus padding and border
</div>
<div className="wd-box-sizing-border">
  border-box: width 200px includes padding and border
</div>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab2/BoxModel.tsx",
    embed: "css-box-model",
  },
  {
    id: "corners",
    title: "border-radius rounds corners",
    kind: "demo",
    bullets: [
      "One value rounds all four. Four values go TL, TR, BR, BL",
      "Or target one corner: `border-top-left-radius`",
    ],
    code: `.wd-rounded-corners-top {
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
}
.wd-rounded-corners-all-around {
  border-radius: 50px;
}
.wd-rounded-corners-inline {
  border-radius: 30px 0px 20px 50px;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab2/index.css",
    embed: "css-corners",
  },
  {
    id: "next-up",
    title: "Next: size and position",
    kind: "title",
    bullets: [
      "You can pad, space, border, and choose how width is measured",
      "Deck 4: `width` / `height`, `display`, then relative / absolute / fixed / z-index",
    ],
  },
];
