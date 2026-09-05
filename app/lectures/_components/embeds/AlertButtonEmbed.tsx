"use client";

import LectureDemoFrame from "./LectureDemoFrame";

export default function AlertButtonEmbed() {
  return (
    <LectureDemoFrame label="type=button + onClick">
      <button
        type="button"
        id="wd-alert-demo"
        className="rounded border border-neutral-800 bg-white px-3 py-2 font-sans text-lg"
        onClick={() => {
          window.alert("Hello from a button");
        }}
      >
        Say hello
      </button>
    </LectureDemoFrame>
  );
}
