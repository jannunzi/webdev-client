import { useEffect, useState } from "react";

export default function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  useEffect(() => {
    const first = requestAnimationFrame(() => {
      const saved = window.localStorage.getItem(key);
      if (saved !== null) setValue(JSON.parse(saved) as T);
    });
    return () => cancelAnimationFrame(first);
  }, [key]);
  const save = (next: T) => {
    setValue(next);
    window.localStorage.setItem(key, JSON.stringify(next));
  };
  return [value, save] as const;
}
