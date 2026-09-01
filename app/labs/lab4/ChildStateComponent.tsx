"use client";

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
}
