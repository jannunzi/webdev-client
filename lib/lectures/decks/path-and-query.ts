import type { LectureSlide } from "../types";

export const PATH_AND_QUERY_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: "#339933",
      icon: "link",
      headline: "Sending Data to the Server",
    },
    bullets: [
      "Chapter 5 · Sending Data to the Server",
      "Path, query, and JSON body",
    ],
  },
  {
    id: "three-ways",
    title: "Three Ways to Send Data to a Server",
    kind: "content",
    bullets: [
      "**Path parameters** — `/lab5/add/2/5` as URL segments",
      "**Query parameters** — `/lab5/add?a=2&b=5` after `?`",
      "**JSON request body** — `{a: 2, b: 5}` with POST/PUT",
      "Today: path and query. JSON bodies: Async HTTP and JSON deck",
    ],
  },
  {
    id: "path-how",
    title: "Matching Path Parameters",
    kind: "content",
    bullets: [
      "Route pattern: `/lab5/add/:a/:b` — `:a` and `:b` are placeholders",
      "Browser asks for URL `/lab5/add/2/5`",
      "Express compares the URL with the pattern, one `/` segment at a time",
      "It builds `req.params = { a: \"2\", b: \"5\" }` and calls the handler",
      "Values are strings: `parseInt` turns `\"2\" + \"5\"` into `2 + 5`",
      "The handler sends back `7` as text",
    ],
  },
  {
    id: "path-server-intro",
    title: "Implementing the Add Route",
    kind: "demo",
    bullets: [
      "`req.params` are strings. `parseInt`, then `.toString()`",
      "A bare `res.send(6)` can look like HTTP status 6",
    ],
  },
  {
    id: "path-server",
    links: ["http://localhost:4000/lab5/add/6/4", "http://localhost:4000/lab5/subtract/6/4"],
    title: "Path params live in the URL (code)",
    kind: "demo",
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
    codeLanguage: "ts",
    codeFile: "webdev-server/Lab5/PathParameters.ts",
    codeHighlightLines: [3, 5, [11, 12]],
  },
  {
    id: "path-import",
    links: ["http://localhost:4000/lab5/welcome"],
    title: "Import PathParameters into Lab5",
    kind: "demo",
    bullets: [
      "Confirm `/lab5/add/6/4` is 10 and `/lab5/subtract/6/4` is 2",
      "On your own: `/lab5/multiply/:a/:b` and `/lab5/divide/:a/:b`",
    ],
    code: `import PathParameters from "./PathParameters";
export default function Lab5(app) {
  app.get("/lab5/welcome", (req, res) => {
    res.send("Welcome to Lab 5");
  });
  PathParameters(app);
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Lab5/index.ts",
    codeAddedLines: [1, 6],
  },
  {
    id: "path-click",
    title: "Parsing Path Parameters",
    kind: "content",
    bullets: [
      "Example state: `a = 34`, `b = 23`",
      "The link becomes `http://localhost:4000/lab5/add/34/23`",
      "Click: the browser sends `GET` for that URL to Express",
      "The add route sees `req.params = { a: \"34\", b: \"23\" }`",
      "It responds with `57`, and the browser shows it",
    ],
  },
  {
    id: "path-client",
    title: "Calling the Add Route from React",
    kind: "demo",
    bullets: [
      "State holds the operands. The link is the request",
      "Clicking navigates to Express — later axios stays on the page",
      "Path IDs start with `wd-path-parameter-`",
    ],
    code: `const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const [a, setA] = useState("34");
const [b, setB] = useState("23");
<a id="wd-path-parameter-add"
  href={\`\${HTTP_SERVER}/lab5/add/\${a}/\${b}\`}>
  Add {a} + {b}
</a>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/PathParameters.tsx",
    codeHighlightLines: [4],
  },
  {
    id: "path-client-live",
    title: "PathParameters Live Demo",
    kind: "demo",
    bullets: [
      "Change a and b, then click Add or Subtract",
      "Start Express on port 4000 first (`npm start` in webdev-server)",
      "The browser navigates to the Express response",
    ],
    embed: "lab5-path",
  },
  {
    id: "query-how",
    title: "Matching Query Parameters",
    kind: "content",
    bullets: [
      "Route pattern: `/lab5/calculator` — no placeholders",
      "URL: `/lab5/calculator?operation=add&a=2&b=5`",
      "Express matches the path before `?`, then splits the rest on `&` and `=`",
      "It builds `req.query = { operation: \"add\", a: \"2\", b: \"5\" }`",
      "Strings again: `parseInt` before the math, then send `7`",
      "Order doesn’t matter, and missing names are `undefined`",
    ],
  },
  {
    id: "query-server-intro",
    title: "Implementing the Calculator Route",
    kind: "demo",
    bullets: [
      "`req.query` is `{ a, b, operation }` — still strings",
      "One `/lab5/calculator` route, a `switch` on `operation`",
    ],
  },
  {
    id: "query-server",
    links: ["http://localhost:4000/lab5/calculator?operation=add&a=2&b=4"],
    title: "Query params after the ? (code)",
    kind: "demo",
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
    codeLanguage: "ts",
    codeFile: "webdev-server/Lab5/QueryParameters.ts",
    codeHighlightLines: [3, [5, 13], 17],
  },
  {
    id: "query-click",
    title: "Parsing Query Parameters",
    kind: "content",
    bullets: [
      "Example state: `a = 34`, `b = 23`, operation `add`",
      "Link: `http://localhost:4000/lab5/calculator?operation=add&a=34&b=23`",
      "Express sees `req.query = { operation: \"add\", a: \"34\", b: \"23\" }`",
      "The calculator responds with `57`",
    ],
  },
  {
    id: "query-client",
    title: "Calling the Calculator from React",
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
    codeFile: "app/labs/lab5/QueryParameters.tsx",
    codeHighlightLines: [2],
  },
  {
    id: "query-client-live",
    title: "QueryParameters Live Demo",
    kind: "demo",
    bullets: [
      "Same operands, now sent as `?a=\u2026&b=\u2026&operation=\u2026`",
      "Start Express on port 4000 first (`npm start` in webdev-server)",
    ],
    embed: "lab5-query",
  },
  {
    id: "recap",
    title: "Recap: Sending Data to the Server",
    kind: "content",
    bullets: [
      "`req.params` vs `req.query` — both arrive as strings",
      "Send results with `.toString()` so the body is not a status",
      "Implement × and ÷ on both encodings",
      "JSON bodies (`req.body`) arrive in Async HTTP and JSON",
    ],
  },
  {
    id: "next-up",
    title: "Next: Remote Objects",
    kind: "title",
    bullets: [
      "`res.json` for an assignment object that survives until reboot",
      "GET the object, then mutate title via the path",
    ],
  },
];
