"use client";

import { useEffect, useState } from "react";

export default function ClientIpDemo() {
  const [ip, setIp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data: { ip: string }) => setIp(data.ip))
      .catch((err: Error) => setError(err.message));
  }, []);
  return (
    <div id="wd-client-ip-demo">
      <h3>Public IP address</h3>
      {error ? (
        <p>Could not look up your IP: {error}</p>
      ) : (
        <p>Your public IP: {ip ?? "Looking up..."}</p>
      )}
    </div>
  );
}
