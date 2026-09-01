"use client";

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
    router.push(`${baseUrl}/query-params?${params.toString()}`);
  };

  const goToPathVersion = () => {
    const safeA = encodeURIComponent(a);
    const safeB = encodeURIComponent(b);
    router.push(`${baseUrl}/path-params/${safeA}/${safeB}`);
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
        href={`${baseUrl}/query-params?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`}
        className="mb-2 block w-full rounded bg-blue-600 px-3 py-1.5 text-center text-sm font-medium text-white no-underline"
        id="wd-url-query-link"
      >
        {a} + {b} → Query Params (Link)
      </Link>
      <Link
        href={`${baseUrl}/path-params/${encodeURIComponent(a)}/${encodeURIComponent(b)}`}
        className="mb-2 block w-full rounded bg-blue-600 px-3 py-1.5 text-center text-sm font-medium text-white no-underline"
        id="wd-url-path-link"
      >
        {a} + {b} → Path Params (Link)
      </Link>
      <hr />
    </div>
  );
}
