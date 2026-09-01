"use client";

import { useEffect, useState } from "react";

export default function GetHandler() {
  const [hello, setHello] = useState<{ message?: string }>({});
  useEffect(() => {
    fetch("/api/lab5/hello")
      .then((response) => response.json())
      .then(setHello);
  }, []);
  return (
    <div id="wd-lab5-get-handler">
      <h4>GET /api/lab5/hello</h4>
      <pre>{JSON.stringify(hello, null, 2)}</pre>
      <hr />
    </div>
  );
}
