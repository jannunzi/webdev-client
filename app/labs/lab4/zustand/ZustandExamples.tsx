"use client";

import ZustandCounter from "./ZustandCounter";
import ZustandTodoList from "./ZustandTodoList";

export default function ZustandExamples() {
  return (
    <div id="wd-zustand-examples">
      <h2>Zustand</h2>
      <ZustandCounter />
      <ZustandTodoList />
      <hr />
    </div>
  );
}
