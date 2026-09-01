"use client";

import { useEffect, useState } from "react";

export default function QueryHandler() {
  const [name, setName] = useState("Jose");
  const [welcome, setWelcome] = useState<{ message?: string }>({});
  useEffect(() => {
    fetch(`/api/lab5/welcome?name=${encodeURIComponent(name)}`)
      .then((response) => response.json())
      .then(setWelcome);
  }, [name]);
  return (
    <div id="wd-lab5-query-handler">
      <h4>GET /api/lab5/welcome?name=</h4>
      <input
        id="wd-lab5-welcome-name"
        className="mb-2 block rounded border border-neutral-300 px-2 py-1"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <pre>{JSON.stringify(welcome, null, 2)}</pre>
      <hr />
    </div>
  );
}
