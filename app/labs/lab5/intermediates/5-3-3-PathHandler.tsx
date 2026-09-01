"use client";

import { useEffect, useState } from "react";

export default function PathHandler() {
  const [sum, setSum] = useState<{ a?: number; b?: number; sum?: number }>(
    {},
  );
  useEffect(() => {
    fetch("/api/lab5/add/3/4")
      .then((response) => response.json())
      .then(setSum);
  }, []);
  return (
    <div id="wd-lab5-path-handler">
      <h4>GET /api/lab5/add/3/4</h4>
      <pre>{JSON.stringify(sum, null, 2)}</pre>
      <hr />
    </div>
  );
}
