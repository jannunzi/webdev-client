import type { LectureSlide } from "../types";

export const PARAMETERIZING_COMPONENTS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · Parameterizing Components",
      "§3.8–3.8.1 · props and children",
    ],
  },
  {
    id: "purpose",
    title: "Implementing Component Props",
    kind: "content",
    bullets: [
      "HTML-style attributes become one object argument",
      "Destructure it in the parameter list — same as §3.4.15",
      "`a={3}` passes a **number**. `a=\"3\"` would pass a string",
      "Render `<Add a={3} b={4} />` from Lab 3 — the sum is `7`",
    ],
  },
  {
    id: "add",
    title: "Add reads a and b from props",
    kind: "content",
    code: `export default function Add({ a, b }: { a: number; b: number }) {
  return (
    <div id="wd-add">
      <h4>Add</h4>
      a = {a}
      b = {b} <br />
      a + b = {a + b}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/Add.tsx",
    codeHighlightLines: [1, 7],
  },
  {
    id: "add-live",
    title: "Add: live demo",
    kind: "demo",
    bullets: [
      "`{ a, b }: { a: number; b: number }` names and types the props",
      "Reuse the same component with different attributes",
      "Create `Add.tsx` and import it into Lab 3",
    ],
    embed: "js-add",
  },
  {
    id: "square",
    title: "children is the body",
    kind: "content",
    code: `import { ReactNode } from "react";

export default function Square({ children }: { children: ReactNode }) {
  const num = Number(children);
  return <span id="wd-square">{num * num}</span>;
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/Square.tsx",
    codeHighlightLines: [3, 5],
  },
  {
    id: "square-live",
    title: "Square: live demo",
    kind: "demo",
    bullets: [
      "Content between the tags arrives as `children`",
      "`<Square>4</Square>` — the child text `4` becomes `16`",
      "`Number(children)` turns that text into a number",
    ],
    embed: "js-square",
  },
  {
    id: "highlight",
    title: "Highlight formats its children",
    kind: "content",
    code: `import { ReactNode } from "react";

export default function Highlight({ children }: { children: ReactNode }) {
  return (
    <span
      id="wd-highlight"
      style={{ backgroundColor: "yellow", color: "red" }}
    >
      {children}
    </span>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/Highlight.tsx",
    codeHighlightLines: [3, 9],
  },
  {
    id: "highlight-live",
    title: "Highlight: live demo",
    kind: "demo",
    bullets: [
      "Same `children` prop — wrapping, not arithmetic",
      "A yellow span with red text around whatever you nest",
      "Create `Highlight.tsx` and wrap a sentence on Lab 3",
    ],
    embed: "js-highlight",
  },
  {
    id: "compose",
    title: "Composing styles with children",
    kind: "content",
    bullets: [
      "A **wrapper component** renders its `children` inside extra markup, such as a styled `div`, without knowing what they are",
      "A reading demo, not part of the graded lab: no need to add these files to your Lab 3 page",
      "The styling uses **inline style objects** (the `style` attribute): the values come from props, which a fixed CSS class cannot hold",
      "A plain number becomes pixels: `{ margin: 12 }` is `margin: 12px`",
    ],
  },
  {
    id: "box-intro",
    title: "One configurable Box",
    kind: "content",
    bullets: [
      "One prop per CSS property: `borderStyle`, `borderColor`, `borderWidth`, `width`, `height`, `position`, `padding`, `margin`, `borderRadius`, `boxShadow`",
      "A `?` after a name in the type, as in `borderColor?: string`, makes the prop **optional**: the caller may leave it out",
      "A **default value**, as in `borderColor = \"black\"`, is used when the caller leaves the prop out",
      "`position`: `static` (the default) and `relative` both keep the box in the normal flow. `boxShadow`: x-offset, y-offset, blur, color",
      "Shorthand: `{ borderStyle }` means `{ borderStyle: borderStyle }`",
    ],
  },
  {
    id: "box",
    title: "One configurable Box (code)",
    kind: "content",
    code: `import { ReactNode } from "react";

export default function Box({
  children,
  borderStyle = "solid",
  borderColor = "black",
  borderWidth = 1,
  width,
  height,
  position = "static",
  padding = 0,
  margin = 0,
  borderRadius = 0,
  boxShadow = "none",
}: {
  children: ReactNode;
  borderStyle?: string;
  borderColor?: string;
  borderWidth?: number;
  width?: number;
  height?: number;
  position?: "static" | "relative";
  padding?: number;
  margin?: number;
  borderRadius?: number;
  boxShadow?: string;
}) {
  return (
    <div
      style={{
        borderStyle,
        borderColor,
        borderWidth,
        width,
        height,
        position,
        padding,
        margin,
        borderRadius,
        boxShadow,
      }}
    >
      {children}
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/children/Box.tsx",
  },
  {
    id: "box-demo",
    title: "BoxDemo (code)",
    kind: "content",
    bullets: [
      "One `Box` with only defaults, and one with every prop set",
    ],
    code: `import Box from "./Box";

export default function BoxDemo() {
  return (
    <div id="wd-box-demo">
      <Box>Default box</Box>
      <Box
        borderStyle="dashed"
        borderColor="blue"
        borderWidth={4}
        width={220}
        height={80}
        position="relative"
        padding={16}
        margin={12}
        borderRadius={12}
        boxShadow="4px 4px 8px gray"
      >
        Configured box
      </Box>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/children/BoxDemo.tsx",
  },
  {
    id: "box-demo-live",
    title: "BoxDemo: live demo",
    kind: "demo",
    bullets: [
      "The default box: a thin solid black border, no padding or margin",
      "The configured box: dashed blue, rounded, padded, with a shadow",
    ],
    embed: "js-children-box",
  },
  {
    id: "layers-intro",
    title: "One component per box-model layer",
    kind: "content",
    bullets: [
      "Ten props get long. Instead, split `Box` into **single-purpose components**, each applying one kind of CSS around its `children`",
      "Wrappers can sit inside one another: **nesting**",
      "From the outside in, the box model gives `Margin`, `Border`, `Padding` and `Content`",
      "Each paints its layer in the DevTools box-model color: tan margin, yellow border, green padding, blue content. A real margin is transparent",
    ],
  },
  {
    id: "layers",
    title: "One component per box-model layer (code)",
    kind: "content",
    codeBlocks: [
      {
        file: "app/labs/lab3/children/Margin.tsx",
        language: "tsx",
        code: `import { ReactNode } from "react";

export default function Margin({
  children,
  margin,
}: {
  children: ReactNode;
  margin: number;
}) {
  return <div style={{ margin, backgroundColor: "#F9CC9D" }}>{children}</div>;
}`,
      },
      {
        file: "app/labs/lab3/children/Border.tsx",
        language: "tsx",
        code: `import { ReactNode } from "react";

export default function Border({
  children,
  width,
  style = "solid",
  color = "black",
  radius = 0,
}: {
  children: ReactNode;
  width: number;
  style?: string;
  color?: string;
  radius?: number;
}) {
  return (
    <div
      style={{
        borderWidth: width,
        borderStyle: style,
        borderColor: color,
        borderRadius: radius,
        backgroundColor: "#FDDD9B",
      }}
    >
      {children}
    </div>
  );
}`,
      },
      {
        file: "app/labs/lab3/children/Padding.tsx",
        language: "tsx",
        code: `import { ReactNode } from "react";

export default function Padding({
  children,
  padding,
}: {
  children: ReactNode;
  padding: number;
}) {
  return <div style={{ padding, backgroundColor: "#C3D08B" }}>{children}</div>;
}`,
      },
      {
        file: "app/labs/lab3/children/Content.tsx",
        language: "tsx",
        code: `import { ReactNode } from "react";

export default function Content({
  children,
  width,
  height,
}: {
  children: ReactNode;
  width: number;
  height: number;
}) {
  return (
    <div style={{ width, height, backgroundColor: "#8CB6C0" }}>{children}</div>
  );
}`,
      },
    ],
  },
  {
    id: "box-model",
    title: "BoxModelDemo (code)",
    kind: "content",
    code: `import Margin from "./Margin";
import Border from "./Border";
import Padding from "./Padding";
import Content from "./Content";

export default function BoxModelDemo() {
  return (
    <div id="wd-box-model-demo" style={{ backgroundColor: "white" }}>
      <Margin margin={20}>
        <Border width={6} color="black" radius={8}>
          <Padding padding={20}>
            <Content width={120} height={40}>
              Hello
            </Content>
          </Padding>
        </Border>
      </Margin>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/children/BoxModelDemo.tsx",
  },
  {
    id: "box-model-live",
    title: "BoxModelDemo: live demo",
    kind: "demo",
    bullets: [
      "Nesting rebuilds the DevTools diagram one ring at a time: the outermost component is the outermost ring",
      "`Hello` sits in the blue content box in the middle",
    ],
    embed: "js-children-box-model",
  },
  {
    id: "nesting-order-intro",
    title: "Nesting Order",
    kind: "content",
    bullets: [
      "`position` is not a box-model layer, so it stays a prop of the single `Box`",
      "Each component styles only the `div` it renders, so the order of nesting matters",
      "Swap `Padding` and `Border`: the green padding moves outside the border",
      "That is two separate elements, each with its own box, not one element's box model",
    ],
  },
  {
    id: "nesting-order",
    title: "Nesting Order (code)",
    kind: "content",
    code: `import Margin from "./Margin";
import Border from "./Border";
import Padding from "./Padding";
import Content from "./Content";

export default function NestingOrderDemo() {
  return (
    <div id="wd-nesting-order-demo" style={{ backgroundColor: "white" }}>
      <Margin margin={20}>
        <Padding padding={20}>
          <Border width={6} color="black" radius={8}>
            <Content width={120} height={40}>
              Hello
            </Content>
          </Border>
        </Padding>
      </Margin>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/children/NestingOrderDemo.tsx",
  },
  {
    id: "nesting-order-live",
    title: "NestingOrderDemo: live demo",
    kind: "demo",
    bullets: [
      "The border now hugs the content directly",
      "Compare with the previous demo: same four wrappers, different order",
    ],
    embed: "js-children-nesting-order",
  },
  {
    id: "card",
    title: "Arbitrary Children Content",
    kind: "content",
    bullets: [
      "`children` can be any mix of HTML tags and components",
      "A **card** is a bordered panel with a header strip and a body, built from three wrappers",
    ],
    codeBlocks: [
      {
        file: "app/labs/lab3/children/Card.tsx",
        language: "tsx",
        code: `import { ReactNode } from "react";

export default function Card({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: 260,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 8,
        boxShadow: "2px 2px 6px lightgray",
        margin: 8,
      }}
    >
      {children}
    </div>
  );
}`,
      },
      {
        file: "app/labs/lab3/children/CardHeader.tsx",
        language: "tsx",
        code: `import { ReactNode } from "react";

export default function CardHeader({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        padding: 8,
        fontWeight: "bold",
        backgroundColor: "whitesmoke",
        borderBottom: "1px solid lightgray",
      }}
    >
      {children}
    </div>
  );
}`,
      },
      {
        file: "app/labs/lab3/children/CardBody.tsx",
        language: "tsx",
        code: `import { ReactNode } from "react";

export default function CardBody({ children }: { children: ReactNode }) {
  return <div style={{ padding: 8 }}>{children}</div>;
}`,
      },
    ],
  },
  {
    id: "card-demo",
    title: "CardDemo (code)",
    kind: "content",
    bullets: [
      "One `CardBody` holds plain tags, `Highlight` and `Square` from earlier, and a button",
    ],
    code: `import Card from "./Card";
import CardHeader from "./CardHeader";
import CardBody from "./CardBody";
import Highlight from "../Highlight";
import Square from "../Square";

export default function CardDemo() {
  return (
    <div id="wd-card-demo">
      <Card>
        <CardHeader>Lab 3 Card</CardHeader>
        <CardBody>
          <p>
            Children can be <b>tags</b>, <Highlight>components</Highlight>,
            or both.
          </p>
          <p>
            The square of 3 is <Square>3</Square>.
          </p>
          <button>Got it</button>
        </CardBody>
      </Card>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/children/CardDemo.tsx",
  },
  {
    id: "card-demo-live",
    title: "CardDemo: live demo",
    kind: "demo",
    bullets: [
      "`Card` draws the panel, `CardHeader` the gray strip, `CardBody` the padded body",
      "None of the wrappers knows what its children are",
    ],
    embed: "js-children-card",
  },
  {
    id: "recap",
    title: "Props and children recap",
    kind: "content",
    bullets: [
      "`<Add a={3} b={4} />` — destructure `{ a, b }` from the props object",
      "`<Square>4</Square>` — the body is `children`",
      "`Highlight` is a wrapper: it returns `{children}` with a style",
    ],
  },
  {
    id: "next-up",
    title: "Next: encode data in the URL",
    kind: "title",
    bullets: [
      "`usePathname` highlights the TOC. `[a]/[b]` captures segments",
      "§3.8.2–3.8.4: path params (values in URL segments), then a JSON todo list",
    ],
  },
];
