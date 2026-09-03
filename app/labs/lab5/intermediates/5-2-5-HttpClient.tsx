"use client";

import { useEffect, useState } from "react";
import * as client from "../client";

export default function HttpClient() {
  const [welcomeOnClick, setWelcomeOnClick] = useState("");
  const [welcomeOnLoad, setWelcomeOnLoad] = useState("");
  const [error, setError] = useState("");
  const fetchWelcomeOnClick = async () => {
    try {
      setWelcomeOnClick(await client.fetchWelcomeMessage());
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "fetch failed");
    }
  };
  const fetchWelcomeOnLoad = async () => {
    try {
      setWelcomeOnLoad(await client.fetchWelcomeMessage());
    } catch (err) {
      setError(err instanceof Error ? err.message : "fetch failed");
    }
  };
  useEffect(() => {
    fetchWelcomeOnLoad();
  }, []);
  return (
    <div id="wd-http-client">
      <h3>HTTP Client</h3>
      <h4>Requesting on Click</h4>
      <button
        type="button"
        className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
        onClick={fetchWelcomeOnClick}
      >
        Fetch Welcome
      </button>
      <p>
        Response from server: <b>{welcomeOnClick}</b>
      </p>
      <h4>Requesting on Load</h4>
      <p>
        Response from server: <b>{welcomeOnLoad}</b>
      </p>
      {error ? <p className="text-red-700">{error}</p> : null}
      <hr />
    </div>
  );
}
