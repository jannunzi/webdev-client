"use client";

import { useState } from "react";
import { fetchLab6Status } from "../client";

export default function ConnectionStatus() {
  const [status, setStatus] = useState<string>("Click to read the store.");
  return (
    <div id="wd-lab6-connection">
      <h3>MongoDB connection</h3>
      <p>
        Students set <code>DATABASE_CONNECTION_STRING</code> on Express.
        This demo reports the same-origin Lab 6 store the book uses when
        Mongo is not configured.
      </p>
      <button
        type="button"
        id="wd-lab6-status"
        className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
        onClick={async () => {
          try {
            const data = await fetchLab6Status();
            setStatus(JSON.stringify(data, null, 2));
          } catch (err) {
            setStatus(err instanceof Error ? err.message : "Request failed");
          }
        }}
      >
        Read connection status
      </button>
      <pre id="wd-lab6-status-output" className="mt-2 overflow-x-auto text-sm">
        {status}
      </pre>
      <hr />
    </div>
  );
}
