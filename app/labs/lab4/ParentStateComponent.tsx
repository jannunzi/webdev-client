"use client";

import { useState } from "react";
import ChildStateComponent from "./ChildStateComponent";

export default function ParentStateComponent() {
  const [counter, setCounter] = useState(123);
  return (
    <div id="wd-parent-state">
      <h2>Counter {counter}</h2>
      <ChildStateComponent counter={counter} setCounter={setCounter} />
      <hr />
    </div>
  );
}
