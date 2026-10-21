"use client";

import useToggle from "./useToggle";

function Lamp({ label }: { label: string }) {
  const [on, toggle] = useToggle();
  return (
    <button
      type="button"
      onClick={toggle}
      className={
        on
          ? "rounded bg-yellow-300 px-3 py-1.5 text-sm"
          : "rounded bg-neutral-700 px-3 py-1.5 text-sm text-white"
      }
    >
      {label}: {on ? "on" : "off"}
    </button>
  );
}

export default function IndependentToggles() {
  return (
    <div id="wd-independent-toggles">
      <h3>Each caller gets its own state</h3>
      <div className="flex gap-2">
        <Lamp label="Kitchen" />
        <Lamp label="Porch" />
      </div>
    </div>
  );
}
