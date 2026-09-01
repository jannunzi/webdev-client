import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import LocalUrl from "../../components/LocalUrl";
import { OnYourOwn, WithAI } from "../../components/Practice";
import ParentStateComponent from "@/app/labs/lab4/ParentStateComponent";
import PropDrilling from "@/app/labs/lab4/PropDrilling";
import UrlEncoding from "@/app/labs/lab4/UrlEncoding";

export default function SharingAndUrl() {
  return (
    <Section
      id="sec-4-3"
      title="4.3 Sharing State, Prop Drilling, and URLs"
    >
      <p>
        <code>useState</code>{" "}belongs to the component that calls it,
        so a sibling or a nested screen cannot read that value on its
        own. To share it you can move the value and its setter up to a
        parent both can reach and pass them down as props, encode the
        data in the URL of the next page, or keep it in a store that any
        Client Component can import. The exercises below work through the
        first two of those — sharing through a parent, and encoding in
        the URL — so that when Context and Zustand show up, you already
        know the problem they are meant to solve.
      </p>

      <Section
        level={3}
        id="sec-4-3-1"
        title="4.3.1 Sharing State Between Parent and Child"
      >
        <p>
          When two components need the same counter, declare it in the
          parent and pass both the value and the setter down as props.
          The child does not own the data; it only displays the number
          and calls the setter the parent provided:
        </p>
        <CodeBlock
          language="tsx"
          name="ParentStateComponent"
          file="app/labs/lab4/ParentStateComponent.tsx"
        >{`"use client";

import { useState } from "react";
import ChildStateComponent from "./ChildStateComponent";

export default function ParentStateComponent() {
  const [counter, setCounter] = useState(123);
  return (
    <div id="wd-parent-state">
      <h2>Counter {counter}</h2>
      <ChildStateComponent counter={counter} setCounter={setCounter} />
      <hr />
    </div>
  );
}`}</CodeBlock>
        <CodeBlock
          language="tsx"
          name="ChildStateComponent"
          file="app/labs/lab4/ChildStateComponent.tsx"
        >{`"use client";

export default function ChildStateComponent({
  counter,
  setCounter,
}: {
  counter: number;
  setCounter: (counter: number) => void;
}) {
  return (
    <div id="wd-child-state">
      <h3>Counter {counter}</h3>
      <button
        type="button"
        onClick={() => setCounter(counter + 1)}
        id="wd-increment-child-state-click"
        className="me-2 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Increment
      </button>
      <button
        type="button"
        onClick={() => setCounter(counter - 1)}
        id="wd-decrement-child-state-click"
        className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Decrement
      </button>
    </div>
  );
}`}</CodeBlock>
        <p>
          Click Increment in the child and confirm both headings update —
          parent and child are looking at the same counter:
        </p>
        <LiveDemo
          name="ParentStateComponent"
          file="app/labs/lab4/ParentStateComponent.tsx"
          mode="styled"
        >
          <ParentStateComponent />
        </LiveDemo>
        <OnYourOwn>
          Add a Reset button in the child that sets the counter back to
          123, still using the setter from the parent.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/ChildStateComponent.tsx, keep any extra button I added. After Decrement, add a sample button id="wd-reset-child-state-click" that calls setCounter(123). Do not rename my personal button.`}
        >
          Ask the assistant to add a sample Reset in the child:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-3-2"
        title="4.3.2 Prop Drilling"
      >
        <p>
          Passing state down as props works until a component in the
          middle does not care about the value and only forwards it. That
          forwarding is <strong>prop drilling</strong>. The child below
          never reads <code>count</code> — it only hands it to a
          grandchild:
        </p>
        <CodeBlock
          language="tsx"
          name="PropDrilling"
          file="app/labs/lab4/PropDrilling.tsx"
        >{`"use client";

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
}`}</CodeBlock>
        <LiveDemo
          name="PropDrilling"
          file="app/labs/lab4/PropDrilling.tsx"
          mode="styled"
        >
          <PropDrilling />
        </LiveDemo>
        <p>
          Two extra layers for a counter is already tedious; Dashboard,
          Home, Modules, and Assignments all changing the same courses
          array would be worse. Context will help when a stable value is
          needed deep in a subtree, and Zustand when many screens mutate
          a list. Neither is worth the extra machinery for a single
          counter in one file — that still belongs in{" "}
          <code>useState</code>.
        </p>
        <OnYourOwn>
          Insert one more middle component between Child and Grandchild
          that also only forwards <code>count</code>{" "}and{" "}
          <code>setCount</code>.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/PropDrilling.tsx, keep any extra layer I added. Insert a sample Middle component between Child and Grandchild that only forwards count and setCount and renders a heading "Middle". Do not rename my personal layer.`}
        >
          Ask the assistant to add one extra sample forwarding layer:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-3-3"
        title="4.3.3 Encoding State in the URL"
      >
        <p>
          Components pass data as props, but pages can also pass data by
          encoding it in the URL that opens the next screen. A URL has a
          protocol, a domain, a path, and an optional query string:
        </p>
        <p>
          <code>http://example.com/path/to/the/page?optional=data&amp;encoded=in-query</code>
        </p>
        <ul>
          <li>
            Query parameters after <code>?</code>{" "}are a good fit for
            optional filters, search terms, and other non-structural data.
          </li>
          <li>
            Path parameters in folders named <code>[a]</code>{" "}and{" "}
            <code>[b]</code>{" "}are a good fit for values that identify the
            resource — the same idea as <code>[cid]</code>{" "}in Kambaz.
          </li>
        </ul>
        <p>
          Create a query calculator at{" "}
          <code>app/labs/lab4/url-encoding/query-params/page.tsx</code>.
          Wrap <code>useSearchParams</code>{" "}in{" "}
          <code>Suspense</code>{" "}so Next.js can stream the page:
        </p>
        <CodeBlock
          language="tsx"
          name="QueryCalculator"
          file="app/labs/lab4/url-encoding/query-params/QueryCalculator.tsx"
        >{`"use client";

import { useSearchParams } from "next/navigation";

export default function QueryCalculator() {
  const searchParams = useSearchParams();
  const aRaw = searchParams.get("a") || "0";
  const bRaw = searchParams.get("b") || "0";
  const a = parseFloat(aRaw);
  const b = parseFloat(bRaw);
  const sum = a + b;
  return (
    <div id="wd-query-calculator">
      <h1>Calculator – Query Parameters</h1>
      <p>Raw query values (already decoded by Next.js):</p>
      <p>
        a = <code>{aRaw}</code>
      </p>
      <p>
        b = <code>{bRaw}</code>
      </p>
      <h2 className="text-green-700">Sum = {sum}</h2>
    </div>
  );
}`}</CodeBlock>
        <CodeBlock
          language="tsx"
          name="QueryCalculatorPage"
          file="app/labs/lab4/url-encoding/query-params/page.tsx"
        >{`import { Suspense } from "react";
import QueryCalculator from "./QueryCalculator";

export default function QueryCalculatorPage() {
  return (
    <Suspense fallback={<p>Loading calculator…</p>}>
      <QueryCalculator />
    </Suspense>
  );
}`}</CodeBlock>
        <p>
          The path version uses <code>useParams</code>{" "}and lives at{" "}
          <code>app/labs/lab4/url-encoding/path-params/[a]/[b]/page.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="PathCalculator"
          file="app/labs/lab4/url-encoding/path-params/[a]/[b]/page.tsx"
        >{`"use client";

import { useParams } from "next/navigation";

export default function PathCalculator() {
  const params = useParams();
  const aRaw = params.a as string;
  const bRaw = params.b as string;
  const a = parseFloat(aRaw);
  const b = parseFloat(bRaw);
  const sum = a + b;
  return (
    <div id="wd-path-calculator">
      <h1>Calculator – Path Parameters</h1>
      <p>Raw path segments (already decoded by Next.js):</p>
      <p>
        a = <code>{aRaw}</code>
      </p>
      <p>
        b = <code>{bRaw}</code>
      </p>
      <h2 className="text-green-700">Sum = {sum}</h2>
    </div>
  );
}`}</CodeBlock>
        <p>
          A parent form can navigate either way:{" "}
          <code>router.push</code>{" "}for a click handler, or{" "}
          <code>Link</code>{" "}for a declarative href. Import{" "}
          <code>UrlEncoding</code>{" "}into Lab 4:
        </p>
        <CodeBlock
          language="tsx"
          name="UrlEncoding"
          file="app/labs/lab4/UrlEncoding.tsx"
        >{`"use client";

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

  return (
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
}`}</CodeBlock>
        <LiveDemo
          name="UrlEncoding"
          file="app/labs/lab4/UrlEncoding.tsx"
          mode="styled"
        >
          <UrlEncoding />
        </LiveDemo>
        <p>
          Try{" "}
          <LocalUrl href="/labs/lab4/url-encoding/query-params?a=5&b=10" />{" "}
          and{" "}
          <LocalUrl href="/labs/lab4/url-encoding/path-params/5/10" />.
          Both should print a sum of 15. Course ids in Kambaz already use
          the path strategy from <SectionLink to="3.9.4" />; query strings
          will matter later for search and filters.
        </p>
        <OnYourOwn>
          Add a third number <code>c</code>{" "}to the form and include it in
          both the query URL and a new path segment{" "}
          <code>[c]</code>.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/UrlEncoding.tsx, keep any extra field I added. Add a sample third controlled input id="wd-url-c" with useState("2") and append c to the query string as c=. Do not rename my personal field or change my extra path segment.`}
        >
          Ask the assistant to add one extra sample query parameter:
        </WithAI>
      </Section>
    </Section>
  );
}
