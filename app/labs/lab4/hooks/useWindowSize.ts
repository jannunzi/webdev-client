import { useEffect, useState } from "react";

export type WindowSize = { width: number; height: number };

export default function useWindowSize() {
  const [size, setSize] = useState<WindowSize | null>(null);
  useEffect(() => {
    const update = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    const first = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("resize", update);
    };
  }, []);
  return size;
}
