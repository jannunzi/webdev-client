import type { LectureSlide } from "../types";

export const DYNAMIC_STYLING_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · Dynamic Styling",
      "§3.5 · classes and styles that follow the data",
    ],
  },
  {
    id: "purpose",
    title: "Look follows the data",
    kind: "content",
    bullets: [
      "Chapter 2 styled with CSS files and Tailwind classes",
      "React can also **build** a class name or a style object in JavaScript",
      "Start static, then interpolate a variable, then pick with a ternary",
      "Create `Classes.css` plus `Classes.tsx` under Lab 3",
    ],
  },
  {
    id: "css",
    title: "Four backgrounds, one padding",
    kind: "content",
    bullets: [
      "Import `./Classes.css` from the component so the rules load",
      "Same idea as Lab 2 — a class is just a name until you apply it",
    ],
    code: `.wd-bg-yellow {
  background-color: lightyellow;
}
.wd-bg-blue {
  background-color: lightblue;
}
.wd-bg-red {
  background-color: lightcoral;
}
.wd-bg-green {
  background-color: lightgreen;
}
.wd-fg-black {
  color: black;
}
.wd-padding-10px {
  padding: 10px;
}`,
    codeLanguage: "css",
    codeFile: "app/labs/lab3/Classes.css",
    codeHighlightLines: [[1, 3], [13, 18]],
  },
  {
    id: "classes",
    title: "Build className from a variable",
    kind: "demo",
    bullets: [
      "The fourth box is `` wd-bg-${color} `` — `color` is `\"blue\"`",
      "The fifth box picks red or green from `dangerous`",
      "Flip the flag and the background changes",
    ],
    code: `import "./Classes.css";

export default function Classes() {
  const color = "blue";
  const dangerous = true;
  return (
    <div id="wd-classes">
      <h2>Classes</h2>
      <div className="wd-bg-yellow wd-fg-black wd-padding-10px">
        Yellow background
      </div>
      <div className="wd-bg-blue wd-fg-black wd-padding-10px">
        Blue background
      </div>
      <div className="wd-bg-red wd-fg-black wd-padding-10px">
        Red background
      </div>
      <div className={\`wd-bg-\${color} wd-fg-black wd-padding-10px\`}>
        Dynamic Blue background
      </div>
      <div
        className={\`\${dangerous ? "wd-bg-red" : "wd-bg-green"} wd-fg-black wd-padding-10px\`}
      >
        Dangerous background
      </div>
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/Classes.tsx",
    codeHighlightLines: [18, [21, 23]],
    embed: "js-classes",
  },
  {
    id: "styles",
    title: "style takes a camelCase object",
    kind: "demo",
    bullets: [
      "React `style` is a JS object — `backgroundColor`, not `background-color`",
      "Spread smaller objects so padding and color are reused",
      "Double braces on yellow: JSX `{…}` plus an object literal `{…}`",
    ],
    code: `export default function Styles() {
  const colorBlack = { color: "black" };
  const padding10px = { padding: "10px" };
  const bgBlue = {
    backgroundColor: "lightblue",
    color: "black",
    ...padding10px,
  };
  const bgRed = {
    backgroundColor: "lightcoral",
    ...colorBlack,
    ...padding10px,
  };
  return (
    <div id="wd-styles">
      <h2>Styles</h2>
      <div
        style={{
          backgroundColor: "lightyellow",
          color: "black",
          padding: "10px",
        }}
      >
        Yellow background
      </div>
      <div style={bgRed}>Red background</div>
      <div style={bgBlue}>Blue background</div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/Styles.tsx",
    codeHighlightLines: [[4, 13], [17, 22], 26],
    embed: "js-styles",
  },
  {
    id: "recap",
    title: "Dynamic styling recap",
    kind: "content",
    bullets: [
      "`className={\`wd-bg-${color}\`}` concatenates a class from data",
      "A ternary picks `wd-bg-red` vs `wd-bg-green`",
      "`style={bgBlue}` — camelCase objects, spread for reuse",
    ],
  },
  {
    id: "next-up",
    title: "Next: client vs server",
    kind: "title",
    bullets: [
      "Next.js components run on the server unless you opt into the browser",
      "§3.6: `\"use client\"` vs `fs` and `process`",
    ],
  },
];
