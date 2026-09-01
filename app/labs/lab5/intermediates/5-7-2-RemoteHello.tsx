"use client";

import { useEffect, useState } from "react";
import { apiBaseLabel, apiUrl } from "@/app/lib/apiUrl";

export default function RemoteHello() {
  const [hello, setHello] = useState<{ message?: string }>({});
  const [error, setError] = useState("");
  const url = apiUrl("/api/lab5/hello");
  useEffect(() => {
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(setHello)
      .catch((err: Error) => setError(err.message));
  }, [url]);
  return (
    <div id="wd-lab5-remote-hello">
      <h4>fetch via apiUrl</h4>
      <p>
        GET <code>{url}</code>
        <br />
        {apiBaseLabel()}
      </p>
      {error ? <p id="wd-lab5-remote-hello-error">{error}</p> : null}
      <pre>{JSON.stringify(hello, null, 2)}</pre>
      <hr />
    </div>
  );
}
