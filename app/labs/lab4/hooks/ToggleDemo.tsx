"use client";

import useToggle from "./useToggle";

export default function ToggleDemo() {
  const [shown, toggleShown] = useToggle();
  return (
    <div id="wd-toggle-demo">
      <h3>useToggle</h3>
      <button
        type="button"
        onClick={toggleShown}
        id="wd-toggle-demo-click"
        className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        {shown ? "Hide" : "Show"} details
      </button>
      {shown && <p>These details are visible because shown is true.</p>}
    </div>
  );
}
