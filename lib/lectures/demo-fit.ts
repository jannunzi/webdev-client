/**
 * Demo-only slides grow the live embed to the space the slide has.
 * The scale multiplies the demo body's font size (em). It never goes
 * below DEMO_FIT_MIN, the fixed demo-stage size used before, so a tall
 * demo (House) keeps today's size and the slide scrolls instead of
 * clipping the frame.
 */
export const DEMO_FIT_MIN = 1.3;
export const DEMO_FIT_MAX = 3.2;
const STEP = 0.05;

/** Largest scale in [min, max] (to `STEP`) for which `overflows` is false. */
export function fitDemoScale(
  overflows: (scale: number) => boolean,
  min = DEMO_FIT_MIN,
  max = DEMO_FIT_MAX,
): number {
  if (overflows(min)) return min;
  if (!overflows(max)) return max;
  let lo = min;
  let hi = max;
  while (hi - lo > STEP) {
    const mid = (lo + hi) / 2;
    if (overflows(mid)) hi = mid;
    else lo = mid;
  }
  return Math.round(Math.floor(lo / STEP) * STEP * 100) / 100;
}

/** True when the slide or the demo body would scroll or clip. */
export function demoStageOverflows(stage: HTMLElement, body: HTMLElement): boolean {
  const slack = 2;
  return (
    stage.scrollHeight > stage.clientHeight + slack ||
    body.scrollWidth > body.clientWidth + slack ||
    body.scrollHeight > body.clientHeight + slack
  );
}

/** Write the fitted scale: the body's em scale, and the matching factor for rem text utilities. */
export function setDemoScale(stage: HTMLElement, scale: number): void {
  stage.style.setProperty("--demo-fit-scale", String(scale));
  stage.style.setProperty("--demo-fit-text", String(scale / DEMO_FIT_MIN));
}
