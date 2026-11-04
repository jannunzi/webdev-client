import type { LectureSlide } from "../types";

export const NEXT_ROUTES_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: "#171717",
      icon: "server",
      headline: "Next.js Server Routes",
    },
    bullets: [
      "Chapter 5 · Next.js Server Routes",
      "Route Handlers, not a replacement",
    ],
  },
  {
    id: "purpose",
    title: "Implementing Next.js Route Handlers",
    kind: "content",
    bullets: [
      "Express is this chapter’s spine — sibling process, port 4000",
      "`app/api/.../route.ts` is a same-app alternative",
      "Export `GET`, `POST`, … — the file becomes the endpoint",
      "Same origin as the page: no CORS. Only `npm run dev`",
    ],
  },
  {
    id: "hello",
    title: "Implementing GET /api/lab5/hello",
    kind: "demo",
    bullets: [
      "Not Express `/lab5/welcome`. Next.js serves this on 3000",
      "`Response.json` sets `Content-Type` and serializes",
    ],
    code: `export async function GET() {
  return Response.json({ message: "Hello from Lab 5 API!" });
}`,
    codeLanguage: "ts",
    codeFile: "app/api/lab5/hello/route.ts",
    codeHighlightLines: [[1, 3]],
  },
  {
    id: "hello-ui-intro",
    title: "Calling a Route Handler from React",
    kind: "demo",
    bullets: [
      "Goal: show the route’s JSON message on the page",
      "Relative `/api/...` URL — same origin, no `HTTP_SERVER`",
    ],
  },
  {
    id: "hello-ui",
    title: "Fetching the Hello Route on Load",
    kind: "demo",
    code: "\"use client\";\n\nimport { useEffect, useState } from \"react\";\n\nexport default function HelloRoute() {\n  const [hello, setHello] = useState<{ message?: string }>({});\n  useEffect(() => {\n    fetch(\"/api/lab5/hello\")\n      .then((response) => response.json())\n      .then(setHello);\n  }, []);",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/HelloRoute.tsx",
  },
  {
    id: "hello-ui-part-2",
    title: "Rendering the Hello JSON Message",
    kind: "demo",
    code: "  return (\n    <div id=\"wd-lab5-next-hello\">\n      <h4>GET /api/lab5/hello (Next.js Route Handler)</h4>\n      <pre>{JSON.stringify(hello, null, 2)}</pre>\n      <hr />\n    </div>\n  );\n}",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/HelloRoute.tsx",
    codeStartLine: 12,
  },
  {
    id: "hello-ui-live",
    title: "HelloRoute Live Demo",
    kind: "demo",
    bullets: [
      "The JSON message renders on load",
      "Only `npm run dev` \u2014 Express can be stopped",
    ],
    embed: "lab5-hello",
  },
  {
    id: "calculator-intro",
    title: "Parsing Query Parameters in a Handler",
    kind: "demo",
    bullets: [
      "Read `a`, `b`, and `operation` from `request.nextUrl.searchParams`",
      "400 for bad numbers or an unknown operation",
      "`?a=10&b=5&operation=add` → `{ result: 15 }`",
    ],
  },
  {
    id: "calculator",
    title: "Implementing the Calculator Handler",
    kind: "demo",
    code: `export async function GET(request: NextRequest) {
  const a = parseFloat(request.nextUrl.searchParams.get("a") ?? "");
  const b = parseFloat(request.nextUrl.searchParams.get("b") ?? "");
  const operation = request.nextUrl.searchParams.get("operation");
  if (Number.isNaN(a) || Number.isNaN(b)) {
    return Response.json({ error: "Invalid numbers" }, { status: 400 });
  }
  let result: number;
  switch (operation) {
    case "add":
      result = a + b;
      break;
    case "subtract":
      result = a - b;
      break;
    case "multiply":
      result = a * b;
      break;
    case "divide":
      result = b === 0 ? Number.NaN : a / b;
      break;
    default:
      return Response.json({ error: "Invalid operation" }, { status: 400 });
  }
  if (Number.isNaN(result)) {
    return Response.json({ error: "Invalid operation" }, { status: 400 });
  }
  return Response.json({ a, b, operation, result });
}`,
    codeLanguage: "ts",
    codeFile: "app/api/lab5/calculator/route.ts",
    codeHighlightLines: [[2, 4], [9, 21], 28],
  },
  {
    id: "client-intro",
    title: "Designing the Calculator UI",
    kind: "demo",
    bullets: [
      "Goal: two number inputs, an operation, and a Calculate button",
      "Call `/api/lab5/calculator` and show `3 + 5 = 8` or the error",
      "Express does not need to be running for this demo",
    ],
  },
  {
    id: "client",
    title: "Declaring the Calculator State",
    kind: "demo",
    code: "\"use client\";\n\nimport { useState } from \"react\";\n\nconst OPERATIONS = [\n  { label: \"+\", value: \"add\" },\n  { label: \"-\", value: \"subtract\" },\n  { label: \"\u00d7\", value: \"multiply\" },\n  { label: \"\u00f7\", value: \"divide\" },\n];\n\nexport default function CalculatorNextWebApiClient() {\n  const [a, setA] = useState(\"\");\n  const [b, setB] = useState(\"\");\n  const [operation, setOperation] = useState(\"add\");\n  const [result, setResult] = useState<number | null>(null);\n  const [error, setError] = useState<string | null>(null);\n  const [loading, setLoading] = useState(false);",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/Calculator.tsx",
  },
  {
    id: "client-part-2",
    title: "Calling the Calculator Route",
    kind: "demo",
    code: "  const calculate = async (op?: string) => {\n    const nextOp = op ?? operation;\n    setOperation(nextOp);\n    setResult(null);\n    setError(null);\n    setLoading(true);\n    try {\n      const res = await fetch(\n        `/api/lab5/calculator?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}&operation=${nextOp}`,\n      );\n      const data = await res.json();",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/Calculator.tsx",
    codeStartLine: 19,
  },
  {
    id: "client-part-3",
    title: "Handling the Calculator Response",
    kind: "demo",
    code: "      if (!res.ok) {\n        setError(data.error ?? \"Unknown error\");\n      } else {\n        setResult(data.result);\n      }\n    } catch {\n      setError(\"Failed to reach the server\");\n    } finally {\n      setLoading(false);\n    }\n  };\n  const operationSymbol =\n    OPERATIONS.find((op) => op.value === operation)?.label ?? \"\";",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/Calculator.tsx",
    codeStartLine: 30,
  },
  {
    id: "client-part-4",
    title: "Binding the Input for A",
    kind: "demo",
    code: "  return (\n    <div id=\"wd-lab5-next-calculator\" className=\"p-2\">\n      <h3>Calculator (Next.js Web API)</h3>\n      <label htmlFor=\"a-input\" className=\"mr-2\">\n        A:\n      </label>\n      <input\n        type=\"number\"\n        value={a}\n        placeholder=\"A\"\n        id=\"a-input\"\n        className=\"mb-2 rounded border border-neutral-300 px-2 py-1\"\n        onChange={(e) => setA(e.target.value)}\n      />\n      <br />",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/Calculator.tsx",
    codeStartLine: 43,
  },
  {
    id: "client-part-5",
    title: "Binding the Input for B",
    kind: "demo",
    code: "      <label htmlFor=\"b-input\" className=\"mr-2\">\n        B:\n      </label>\n      <input\n        type=\"number\"\n        value={b}\n        placeholder=\"B\"\n        id=\"b-input\"\n        className=\"mb-2 rounded border border-neutral-300 px-2 py-1\"\n        onChange={(e) => setB(e.target.value)}\n      />\n      <br />",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/Calculator.tsx",
    codeStartLine: 58,
  },
  {
    id: "client-part-6",
    title: "Selecting the Operation",
    kind: "demo",
    code: "      <label htmlFor=\"operation-select\" className=\"mr-2\">\n        Operation:\n      </label>\n      <select\n        id=\"operation-select\"\n        value={operation}\n        className=\"mb-2 rounded border border-neutral-300 px-2 py-1\"\n        onChange={(e) => {\n          calculate(e.target.value);\n        }}\n      >",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/Calculator.tsx",
    codeStartLine: 70,
  },
  {
    id: "client-part-7",
    title: "Adding Options and a Calculate Button",
    kind: "demo",
    code: "        {OPERATIONS.map((op) => (\n          <option key={op.value} value={op.value}>\n            {op.label}\n          </option>\n        ))}\n      </select>\n      <br />\n      <button\n        type=\"button\"\n        className=\"mt-2 rounded bg-blue-600 px-4 py-1.5 text-white disabled:opacity-50\"\n        disabled={loading || a === \"\" || b === \"\"}\n        onClick={() => calculate(operation)}\n      >\n        {loading ? \"Calculating...\" : \"Calculate\"}\n      </button>\n      <br />",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/Calculator.tsx",
    codeStartLine: 81,
  },
  {
    id: "client-part-8",
    title: "Showing the Result or the Error",
    kind: "demo",
    code: "      {result !== null ? (\n        <p className=\"mt-2\">\n          Result: {a} {operationSymbol} {b} = {result}\n        </p>\n      ) : null}\n      {error ? <p className=\"mt-2 text-red-700\">{error}</p> : null}\n      <hr />\n    </div>\n  );\n}",
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/Calculator.tsx",
    codeStartLine: 97,
  },
  {
    id: "client-live",
    title: "Calculator Live Demo",
    kind: "demo",
    bullets: [
      "Enter A and B, pick an operation, Calculate",
      "Divide by 0 to see the 400 error message",
    ],
    embed: "lab5-calculator",
  },
  {
    id: "recap",
    title: "Recap: Next.js Route Handlers",
    kind: "content",
    bullets: [
      "`app/api/.../route.ts` exports the HTTP method",
      "Same-origin `/api` — no CORS, no port 4000",
      "Lab 5 and Kambaz still talk to Express",
    ],
  },
  {
    id: "next-up",
    title: "Next: Check Your Understanding",
    kind: "title",
    bullets: [
      "A 10-item self-check before Kambaz moves onto Express",
      "CORS, axios, and the calculator",
    ],
  },
];
