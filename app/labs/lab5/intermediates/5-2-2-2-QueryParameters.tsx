"use client";

import { useState } from "react";
import { httpServer } from "@/app/lib/httpServer";

export default function QueryParameters() {
  const HTTP_SERVER = httpServer();
  const [a, setA] = useState("34");
  const [b, setB] = useState("23");
  return (
    <div id="wd-query-parameters">
      <h3>Query Parameters</h3>
      <input
        id="wd-query-parameter-a"
        className="mb-2 mr-2 rounded border border-neutral-300 px-2 py-1"
        type="number"
        value={a}
        onChange={(e) => setA(e.target.value)}
      />
      <input
        id="wd-query-parameter-b"
        className="mb-2 rounded border border-neutral-300 px-2 py-1"
        type="number"
        value={b}
        onChange={(e) => setB(e.target.value)}
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <a
          id="wd-query-parameter-add"
          className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
          href={`${HTTP_SERVER}/lab5/calculator?operation=add&a=${a}&b=${b}`}
        >
          Add {a} + {b}
        </a>
        <a
          id="wd-query-parameter-subtract"
          className="rounded bg-red-600 px-3 py-1.5 text-sm text-white"
          href={`${HTTP_SERVER}/lab5/calculator?operation=subtract&a=${a}&b=${b}`}
        >
          Subtract {a} - {b}
        </a>
        <a
          id="wd-query-parameter-multiply"
          className="rounded bg-green-700 px-3 py-1.5 text-sm text-white"
          href={`${HTTP_SERVER}/lab5/calculator?operation=multiply&a=${a}&b=${b}`}
        >
          Multiply {a} × {b}
        </a>
        <a
          id="wd-query-parameter-divide"
          className="rounded bg-amber-600 px-3 py-1.5 text-sm text-white"
          href={`${HTTP_SERVER}/lab5/calculator?operation=divide&a=${a}&b=${b}`}
        >
          Divide {a} ÷ {b}
        </a>
      </div>
      <hr />
    </div>
  );
}
