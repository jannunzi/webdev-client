import type { LectureSlide } from "../types";

export const NEXT_ROUTES_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 5 · Next.js Server Routes",
      "§5.3 · Route Handlers, not a replacement",
    ],
  },
  {
    id: "purpose",
    title: "Route Handlers live in /api",
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
    title: "GET /api/lab5/hello",
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
    embed: "lab5-hello",
  },
  {
    id: "calculator",
    title: "Calculator query parameters",
    kind: "demo",
    bullets: [
      "Read `a`, `b`, and `operation` from `request.nextUrl.searchParams`",
      "400 for bad numbers or an unknown operation",
      "`?a=10&b=5&operation=add` → `{ result: 15 }`",
    ],
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
    id: "client",
    title: "A client calculator UI",
    kind: "demo",
    bullets: [
      "`\"use client\"` plus `fetch` to `/api/lab5/calculator`",
      "Encode operands as query params. Print `3 + 5 = 8`",
      "Express does not need to be running for this demo",
    ],
    code: `const res = await fetch(
  \`/api/lab5/calculator?a=\${encodeURIComponent(a)}&b=\${encodeURIComponent(b)}&operation=\${nextOp}\`,
);
const data = await res.json();
if (!res.ok) {
  setError(data.error ?? "Unknown error");
} else {
  setResult(data.result);
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab5/intermediates/5-3-1-Calculator.tsx",
    codeHighlightLines: [[1, 3]],
    embed: "lab5-calculator",
  },
  {
    id: "recap",
    title: "Next.js routes recap",
    kind: "content",
    bullets: [
      "`app/api/.../route.ts` exports the HTTP method",
      "Same-origin `/api` — no CORS, no port 4000",
      "Lab 5 and Kambaz still talk to Express",
    ],
  },
  {
    id: "next-up",
    title: "Next: check your understanding",
    kind: "title",
    bullets: [
      "A 10-item self-check before Kambaz moves onto Express",
      "§5-check: CORS, axios, and the calculator",
    ],
  },
];
