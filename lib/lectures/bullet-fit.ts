/**
 * Bullet type starts at the standard deck size (scale 1). When code or a
 * diagram sits on the same slide and the standard size overflows, shrink
 * only until the slide fits, and never below BULLET_FIT_MIN.
 */
export const BULLET_FIT_MIN = 0.7;
export const BULLET_FIT_MAX = 1;
const STEP = 0.02;

/** Largest scale in [min, max] (to `STEP`) for which `overflows` is false. */
export function fitBulletScale(
  overflows: (scale: number) => boolean,
  min = BULLET_FIT_MIN,
  max = BULLET_FIT_MAX,
): number {
  const floor = Math.min(min, max);
  const top = Math.max(min, max);
  if (!overflows(top)) return top;
  if (overflows(floor)) return floor;
  let lo = floor;
  let hi = top;
  while (hi - lo > STEP) {
    const mid = (lo + hi) / 2;
    if (overflows(mid)) hi = mid;
    else lo = mid;
  }
  const stepped = Math.floor(lo / STEP + 1e-9) * STEP;
  return Math.round(stepped * 100) / 100;
}
