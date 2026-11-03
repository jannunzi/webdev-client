/** Per-user window used by the suggestion route. One isolate, not a global quota. */
export function createRateLimit(limit: number, windowMs: number) {
  const buckets = new Map<string, number[]>();
  return function allow(key: string, now = Date.now()): boolean {
    const recent = (buckets.get(key) ?? []).filter((stamp) => now - stamp < windowMs);
    if (recent.length >= limit) {
      buckets.set(key, recent);
      return false;
    }
    recent.push(now);
    buckets.set(key, recent);
    return true;
  };
}

export const suggestRateLimit = createRateLimit(20, 60_000);
