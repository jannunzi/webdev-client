"use client";

import { useEffect, useState } from "react";

export default function ClientTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString());
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, []);
  return <p>Browser time: {time ?? "(waiting for the browser...)"}</p>;
}
