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
    kind: "demo",
    bullets: [
      "Parent holds `count`. Grandchild increments it",
      "Child never uses `count` — it only lists it on `<Grandchild />`",
      "Rename the prop and every file in the chain has to change",
    ],
    code: `function Child({
  count,
  setCount,
}: {
  count: number;
  setCount: (n: number) => void;
}) {
  return (
    <div id="wd-prop-drill-child">
      <h4>Child</h4>
      <p>This component never uses count itself. It only forwards props.</p>
      <Grandchild count={count} setCount={setCount} />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/PropDrilling.tsx",
    codeHighlightLines: [[11, 12]],
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
    title: "A calculator that navigates",
    kind: "demo",
    bullets: [
      "Local `a` and `b` stay in `useState` until you leave",
      "`router.push` is programmatic. `<Link href>` is declarative",
      "`URLSearchParams` and `encodeURIComponent` keep the URL safe",
    ],
    code: `const goToQueryVersion = () => {
  const params = new URLSearchParams();
  params.set("a", a);
  params.set("b", b);
  router.push(\`\${baseUrl}/query-params?\${params.toString()}\`);
};

const goToPathVersion = () => {
  router.push(
    \`\${baseUrl}/path-params/\${encodeURIComponent(a)}/\${encodeURIComponent(b)}\`,
  );
};`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/UrlEncoding.tsx",
    codeHighlightLines: [[1, 6], [8, 11]],
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
