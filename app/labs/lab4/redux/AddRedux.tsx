"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { add } from "./addReducer";
import type { RootState } from "./store";

export default function AddRedux() {
  const [a, setA] = useState(12);
  const [b, setB] = useState(23);
  const { sum } = useSelector((state: RootState) => state.addReducer);
  const dispatch = useDispatch();
  return (
    <div id="wd-add-redux">
      <h3>Add Redux</h3>
      <input
        type="number"
        id="wd-add-redux-a"
        className="me-2 rounded border border-neutral-300 px-2 py-1"
        value={a}
        onChange={(e) => setA(Number(e.target.value))}
      />
      <input
        type="number"
        id="wd-add-redux-b"
        className="me-2 rounded border border-neutral-300 px-2 py-1"
        value={b}
        onChange={(e) => setB(Number(e.target.value))}
      />
      <button
        type="button"
        id="wd-add-redux-click"
        className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
        onClick={() => dispatch(add({ a, b }))}
      >
        Add Redux
      </button>
      <h4 id="wd-add-redux-sum">Sum: {sum}</h4>
    </div>
  );
}
