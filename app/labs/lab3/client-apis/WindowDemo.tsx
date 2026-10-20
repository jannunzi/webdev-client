"use client";

import { useEffect, useState } from "react";

type WindowInfo = {
  protocol: string;
  host: string;
  port: string;
  width: number;
  height: number;
};

export default function WindowDemo() {
  const [info, setInfo] = useState<WindowInfo | null>(null);
  useEffect(() => {
    const update = () =>
      setInfo({
        protocol: window.location.protocol,
        host: window.location.host,
        port: window.location.port || "(default)",
        width: window.innerWidth,
        height: window.innerHeight,
      });
    const first = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("resize", update);
    };
  }, []);
  return (
    <div id="wd-window-demo">
      <h3>The window object</h3>
      {info ? (
        <ul>
          <li>Protocol: {info.protocol}</li>
          <li>Host: {info.host}</li>
          <li>Port: {info.port}</li>
          <li>
            Window size: {info.width} x {info.height}
          </li>
        </ul>
      ) : (
        <p>Loading window info...</p>
      )}
    </div>
  );
}
