import type { LectureSlide } from "../types";

export const PROP_DRILLING_AND_URL_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 4 · Prop Drilling and URLs",
      "§4.3.2–4.3.3 · forward props, or put data in the address",
    ],
  },
  {
    id: "purpose",
    title: "Three ways to share past a parent",
    kind: "content",
    bullets: [
      "Lift to a parent and pass props — works until the tree is deep",
      "Encode the value in the next page’s URL — query or path",
      "Keep it in Context or Zustand so any Client Component can import it",
    ],
  },
  {
    id: "drilling",
    title: "Child only forwards the props",
    kind: "content",
    code: `"use client";

import { useState } from "react";

function Grandchild({
  count,
  setCount,
}: {
  count: number;
  setCount: (n: number) => void;
}) {
  return (
    <div id="wd-prop-drill-grandchild" className="rounded border border-neutral-200 p-3">
      <h4>Grandchild</h4>
      <p>Count: {count}</p>
      <button
        type="button"
        onClick={() => setCount(count + 1)}
        className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Increment in grandchild
      </button>
    </div>
  );
}

function Child({
  count,
  setCount,
}: {
  count: number;
  setCount: (n: number) => void;
}) {
  return (
    <div id="wd-prop-drill-child" className="mb-2 rounded border border-neutral-200 p-3">
      <h4>Child</h4>
      <p>This component never uses count itself. It only forwards props.</p>
      <Grandchild count={count} setCount={setCount} />
    </div>
  );
}

export default function PropDrilling() {
  const [count, setCount] = useState(0);
  return (
    <div id="wd-prop-drilling">
      <h2>Prop Drilling</h2>
      <p>Parent count: {count}</p>
      <Child count={count} setCount={setCount} />
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/PropDrilling.tsx",
    codeHighlightLines: [37, 38],
  },
  {
    id: "drilling-live",
    title: "PropDrilling: live demo",
    kind: "demo",
    bullets: [
      "Parent holds `count`. Grandchild increments it",
      "Child never uses `count` — it only lists it on `<Grandchild />`",
      "Rename the prop and every file in the chain has to change",
    ],
    embed: "prop-drilling",
  },
  {
    id: "url-idea",
    title: "The URL can carry the next state",
    kind: "content",
    bullets: [
      "Query parameters: `/query-params?a=5&b=10` — optional pairs",
      "Path parameters: `/path-params/5/10` — structural segments",
      "The next page reads them. No parent has to stay mounted",
    ],
  },
  {
    id: "url-form",
    title: "A calculator that navigates (1/2)",
    kind: "content",
    code: `"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UrlEncoding() {
  const [a, setA] = useState("5");
  const [b, setB] = useState("10");
  const router = useRouter();
  const baseUrl = "/labs/lab4/url-encoding";

  const goToQueryVersion = () => {
    const params = new URLSearchParams();
    params.set("a", a);
    params.set("b", b);
    router.push(\`\${baseUrl}/query-params?\${params.toString()}\`);
  };

  const goToPathVersion = () => {
    const safeA = encodeURIComponent(a);
    const safeB = encodeURIComponent(b);
    router.push(\`\${baseUrl}/path-params/\${safeA}/\${safeB}\`);
  };
`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/UrlEncoding.tsx",
    codeHighlightLines: [13, 14, 15, 16, 17, 18, 20],
  },
  {
    id: "url-form-part-2",
    title: "A calculator that navigates (2/2)",
    kind: "content",
    code: `  return (
    <div id="wd-url-encoding" className="max-w-xl">
      <h2>Addition Calculator</h2>
      <p>
        Enter two numbers and navigate using either buttons (programmatic) or
        links (declarative):
      </p>
      <input
        type="number"
        value={a}
        onChange={(e) => setA(e.target.value)}
        className="mb-2 block w-full rounded border border-neutral-300 px-3 py-1.5"
        id="wd-url-a"
      />
      <input
        type="number"
        value={b}
        onChange={(e) => setB(e.target.value)}
        className="mb-3 block w-full rounded border border-neutral-300 px-3 py-1.5"
        id="wd-url-b"
      />
      <h4>Programmatic navigation (using router.push):</h4>
      <button
        type="button"
        onClick={goToQueryVersion}
        className="mb-2 w-full rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
        id="wd-url-query-programmatic"
      >
        {a} + {b} → Query Params (programmatic)
      </button>
      <button
        type="button"
        onClick={goToPathVersion}
        className="mb-3 w-full rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
        id="wd-url-path-programmatic"
      >
        {a} + {b} → Path Params (programmatic)
      </button>
      <h4>Declarative navigation (using Link):</h4>
      <Link
        href={\`\${baseUrl}/query-params?a=\${encodeURIComponent(a)}&b=\${encodeURIComponent(b)}\`}
        className="mb-2 block w-full rounded bg-blue-600 px-3 py-1.5 text-center text-sm font-medium text-white no-underline"
        id="wd-url-query-link"
      >
        {a} + {b} → Query Params (Link)
      </Link>
      <Link
        href={\`\${baseUrl}/path-params/\${encodeURIComponent(a)}/\${encodeURIComponent(b)}\`}
        className="mb-2 block w-full rounded bg-blue-600 px-3 py-1.5 text-center text-sm font-medium text-white no-underline"
        id="wd-url-path-link"
      >
        {a} + {b} → Path Params (Link)
      </Link>
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/UrlEncoding.tsx",
    codeStartLine: 26,
    codeHighlightLines: [56],
  },
  {
    id: "url-form-live",
    title: "UrlEncoding: live demo",
    kind: "demo",
    bullets: [
      "Local `a` and `b` stay in `useState` until you leave",
      "`router.push` is programmatic. `<Link href>` is declarative",
      "`URLSearchParams` and `encodeURIComponent` keep the URL safe",
    ],
    embed: "url-encoding",
  },
  {
    id: "query-read",
    title: "The next page reads the query",
    kind: "content",
    bullets: [
      "`useSearchParams()` returns the decoded `a` and `b`",
      "Parse floats, then print the sum — no store required",
      "Path params use `useParams()` the same way Lab 3 did",
    ],
    code: `const searchParams = useSearchParams();
const aRaw = searchParams.get("a") || "0";
const bRaw = searchParams.get("b") || "0";
const sum = parseFloat(aRaw) + parseFloat(bRaw);`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/url-encoding/query-params/QueryCalculator.tsx",
    codeHighlightLines: [[1, 4]],
  },
  {
    id: "recap",
    title: "Drilling and URLs recap",
    kind: "content",
    bullets: [
      "A middle file that only forwards props is prop drilling",
      "Query = optional pairs. Path = required segments",
      "Context and Zustand exist because this chain does not scale",
    ],
  },
  {
    id: "next-up",
    title: "Next: React Context",
    kind: "title",
    bullets: [
      "A provider publishes a value any descendant can read",
      "§4.4: the same counter, no props through the middle",
    ],
  },
];
