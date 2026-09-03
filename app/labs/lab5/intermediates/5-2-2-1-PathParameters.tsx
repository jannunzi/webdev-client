"use client";

import { useState } from "react";
import { httpServer } from "@/app/lib/httpServer";

export default function PathParameters() {
  const HTTP_SERVER = httpServer();
  const [a, setA] = useState("34");
  const [b, setB] = useState("23");
  return (
    <div id="wd-path-parameters">
      <h3>Path Parameters</h3>
      <input
        id="wd-path-parameter-a"
        className="mb-2 mr-2 rounded border border-neutral-300 px-2 py-1"
        type="number"
        value={a}
        onChange={(e) => setA(e.target.value)}
      />
      <input
        id="wd-path-parameter-b"
        className="mb-2 rounded border border-neutral-300 px-2 py-1"
        type="number"
        value={b}
        onChange={(e) => setB(e.target.value)}
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <a
          className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
          id="wd-path-parameter-add"
          href={`${HTTP_SERVER}/lab5/add/${a}/${b}`}
        >
          Add {a} + {b}
        </a>
        <a
          className="rounded bg-red-600 px-3 py-1.5 text-sm text-white"
          id="wd-path-parameter-subtract"
          href={`${HTTP_SERVER}/lab5/subtract/${a}/${b}`}
        >
          Subtract {a} - {b}
        </a>
        <a
          className="rounded bg-green-700 px-3 py-1.5 text-sm text-white"
          id="wd-path-parameter-multiply"
          href={`${HTTP_SERVER}/lab5/multiply/${a}/${b}`}
        >
          Multiply {a} × {b}
        </a>
        <a
          className="rounded bg-amber-600 px-3 py-1.5 text-sm text-white"
          id="wd-path-parameter-divide"
          href={`${HTTP_SERVER}/lab5/divide/${a}/${b}`}
        >
          Divide {a} ÷ {b}
        </a>
      </div>
      <hr />
    </div>
  );
}
