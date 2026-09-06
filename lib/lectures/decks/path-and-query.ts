import type { LectureSlide } from "../types";

export const PATH_AND_QUERY_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 5 · Path and Query Parameters",
      "§5.2.2 · three ways to send data",
    ],
  },
  {
    id: "three-ways",
    title: "Three ways to send data",
    kind: "content",
    bullets: [
      "**Path parameters** — `/lab5/add/2/5` as URL segments",
      "**Query parameters** — `/lab5/add?a=2&b=5` after `?`",
      "**Request body** — JSON `{a: 2, b: 5}` in §5.2.6",
      "Today is path and query. Body waits for axios POST",
    ],
  },
  {
    id: "path-server",
    title: "Path params live in the URL",
    kind: "demo",
    bullets: [
      "`req.params` are strings. `parseInt`, then `.toString()`",
      "A bare `res.send(6)` can look like HTTP status 6",
    ],
    code: `export default function PathParameters(app) {
  const add = (req, res) => {
    const { a, b } = req.params;
    const sum = parseInt(a) + parseInt(b);
    res.send(sum.toString());
  };
  const subtract = (req, res) => {
    const { a, b } = req.params;
    res.send((parseInt(a) - parseInt(b)).toString());
  };
  app.get("/lab5/add/:a/:b", add);
  app.get("/lab5/subtract/:a/:b", subtract);
}`,
    codeLanguage: "js",
    codeFile: "webdev-server/Lab5/PathParameters.js",
    codeHighlightLines: [3, 5, [11, 12]],
  },
  {
    id: "path-import",
    title: "Import PathParameters into Lab5",
    kind: "demo",
    bullets: [
      "Confirm `/lab5/add/6/4` is 10 and `/lab5/subtract/6/4` is 2",
      "On your own: `/lab5/multiply/:a/:b` and `/lab5/divide/:a/:b`",
    ],
    code: `import PathParameters from "./PathParameters.js";
export default function Lab5(app) {
  app.get("/lab5/welcome", (req, res) => {
    res.send("Welcome to Lab 5");
  });
  PathParameters(app);
}`,
    codeLanguage: "js",
    codeFile: "webdev-server/Lab5/index.js",
    codeAddedLines: [1, 6],
  },
  {
    id: "path-client",
    title: "Encode a and b in the href",
    kind: "demo",
    bullets: [
      "State holds the operands. The link is the request",
      "Clicking navigates to Express — later axios stays on the page",
      "Path IDs start with `wd-path-parameter-`",
    ],
    code: `const HTTP_SERVER = httpServer();
const [a, setA] = useState("34");
const [b, setB] = useState("23");
<a id="wd-path-parameter-add"
  href={\`\${HTTP_SERVER}/lab5/add/\${a}/\${b}\`}>
  Add {a} + {b}
</a>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/intermediates/5-2-2-1-PathParameters.tsx",
    codeHighlightLines: [4],
  },
  {
    id: "query-server",
    title: "Query params after the ?",
    kind: "demo",
    bullets: [
      "`req.query` is `{ a, b, operation }` — still strings",
      "One `/lab5/calculator` route, a `switch` on `operation`",
    ],
    code: `export default function QueryParameters(app) {
  const calculator = (req, res) => {
    const { a, b, operation } = req.query;
    let result = 0;
    switch (operation) {
      case "add":
        result = parseInt(a) + parseInt(b);
        break;
      case "subtract":
        result = parseInt(a) - parseInt(b);
        break;
      default:
        result = "Invalid operation";
    }
    res.send(result.toString());
  };
  app.get("/lab5/calculator", calculator);
}`,
    codeLanguage: "js",
    codeFile: "webdev-server/Lab5/QueryParameters.js",
    codeHighlightLines: [3, [5, 13], 17],
  },
  {
    id: "query-client",
    title: "Name-value pairs in the href",
    kind: "demo",
    bullets: [
      "Add 34 and 23 → 57. Subtract → 11",
      "On your own: multiply and divide. IDs `wd-query-parameter-`",
    ],
    code: `<a id="wd-query-parameter-add"
  href={\`\${HTTP_SERVER}/lab5/calculator?operation=add&a=\${a}&b=\${b}\`}>
  Add {a} + {b}
</a>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/intermediates/5-2-2-2-QueryParameters.tsx",
    codeHighlightLines: [2],
  },
  {
    id: "recap",
    title: "Path and query recap",
    kind: "content",
    bullets: [
      "`req.params` vs `req.query` — both arrive as strings",
      "Send results with `.toString()` so the body is not a status",
      "Implement × and ÷ on both encodings",
    ],
  },
  {
    id: "next-up",
    title: "Next: remote objects",
    kind: "title",
    bullets: [
      "`res.json` for an assignment object that survives until reboot",
      "§5.2.3: GET the object, then mutate title via the path",
    ],
  },
];
