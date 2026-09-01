"use client";

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
}
