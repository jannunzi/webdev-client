"use client";

import { useDispatch, useSelector } from "react-redux";
import { down, up } from "./counterReducer";
import type { RootState } from "./store";

export default function CounterRedux() {
  const { count } = useSelector((state: RootState) => state.counterReducer);
  const dispatch = useDispatch();
  return (
    <div id="wd-redux-counter">
      <h3>Redux Counter: {count}</h3>
      <button
        type="button"
        onClick={() => dispatch(up())}
        id="wd-redux-up-click"
        className="me-2 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Up
      </button>
      <button
        type="button"
        onClick={() => dispatch(down())}
        id="wd-redux-down-click"
        className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Down
      </button>
    </div>
  );
}
