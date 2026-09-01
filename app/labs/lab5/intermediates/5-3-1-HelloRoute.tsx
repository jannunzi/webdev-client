"use client";

import { useEffect, useState } from "react";

export default function HelloRoute() {
  const [hello, setHello] = useState<{ message?: string }>({});
  useEffect(() => {
    fetch("/api/lab5/hello")
      .then((response) => response.json())
      .then(setHello);
  }, []);
  return (
    <div id="wd-lab5-next-hello">
      <h4>GET /api/lab5/hello (Next.js Route Handler)</h4>
      <pre>{JSON.stringify(hello, null, 2)}</pre>
      <hr />
    </div>
  );
}
