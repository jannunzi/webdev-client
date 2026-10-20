/**
 * Demo-only slides grow the live embed to the space the slide has.
 * The scale is reported relative to the old fixed demo-stage size (1.3em):
 * the frame body gets CSS `zoom: scale / 1.3`, which grows text, form
 * controls and fixed px boxes together. It never goes below DEMO_FIT_MIN,
 * so a tall demo (House) keeps today's size and the slide scrolls instead
 * of clipping the frame.
 */
export const DEMO_FIT_MIN = 1.3;
export const DEMO_FIT_MAX = 3.2;
const STEP = 0.05;
const SLACK_PX = 2;

/**
 * Fallback caps for demos that still misbehave when grown, keyed by
 * `deck#slideId`. Empty when every demo passes the overflow check.
 */
export const DEMO_FIT_CAPS: Record<string, number> = {};

/** Largest scale in [min, max] (to `STEP`) for which `overflows` is false. */
export function fitDemoScale(
  overflows: (scale: number) => boolean,
  min = DEMO_FIT_MIN,
  max = DEMO_FIT_MAX,
): number {
  const top = Math.max(min, max);
  if (overflows(min)) return min;
  if (!overflows(top)) return top;
  let lo = min;
  let hi = top;
  while (hi - lo > STEP) {
    const mid = (lo + hi) / 2;
    if (overflows(mid)) hi = mid;
    else lo = mid;
  }
  return Math.round(Math.floor(lo / STEP + 1e-9) * STEP * 100) / 100;
}

export type DemoRect = { top: number; right: number; bottom: number; left: number };

/** One measured element inside the demo frame. */
export type DemoElementBox = {
  scrollWidth: number;
  scrollHeight: number;
  clientWidth: number;
  clientHeight: number;
  overflowX: string;
  overflowY: string;
  position: string;
  rect: DemoRect;
  /** Union of the element's own text line boxes, when it has direct text. */
  textRect?: DemoRect;
};

const past = (inner: DemoRect, outer: DemoRect) =>
  inner.left < outer.left - SLACK_PX ||
  inner.top < outer.top - SLACK_PX ||
  inner.right > outer.right + SLACK_PX ||
  inner.bottom > outer.bottom + SLACK_PX;

/**
 * True when an element clips or spills: it scrolls or hides content
 * (overflow not visible), its own text runs outside its box, or a
 * fixed/absolute element sits outside the stage.
 */
export function demoElementOverflows(box: DemoElementBox, stage: DemoRect): boolean {
  const clipsX = box.overflowX !== "visible" && box.scrollWidth > box.clientWidth + SLACK_PX;
  const clipsY = box.overflowY !== "visible" && box.scrollHeight > box.clientHeight + SLACK_PX;
  if ((clipsX || clipsY) && box.clientWidth > 0 && box.clientHeight > 0) return true;
  if (box.textRect && box.rect.right > box.rect.left && past(box.textRect, box.rect)) return true;
  if ((box.position === "fixed" || box.position === "absolute") && past(box.rect, stage)) return true;
  return false;
}

/** True when the slide scrolls or anything inside the demo clips or spills. */
export function demoStageOverflows(stage: HTMLElement, body: HTMLElement): boolean {
  if (stage.scrollHeight > stage.clientHeight + SLACK_PX) return true;
  if (stage.scrollWidth > stage.clientWidth + SLACK_PX) return true;
  const stageRect = stage.getBoundingClientRect();
  // Form controls scroll their own value by design (a textarea's text), so
  // they count only through their box, not their inner scroll.
  const elements = [body, ...Array.from(body.querySelectorAll<HTMLElement>("*"))];
  return elements.some((el) => demoElementOverflows(measureDemoElement(el), stageRect));
}

const FORM_CONTROL = /^(TEXTAREA|SELECT|INPUT)$/;

function measureDemoElement(el: HTMLElement): DemoElementBox {
  const style = getComputedStyle(el);
  const control = FORM_CONTROL.test(el.tagName);
  let textRect: DemoRect | undefined;
  // Text spill only matters for boxes that cannot grow with it.
  const sized = /px$/.test(style.width) || /px$/.test(style.height);
  if (sized && style.overflow === "visible") {
    for (const node of Array.from(el.childNodes)) {
      if (node.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      const r = range.getBoundingClientRect();
      textRect = textRect
        ? {
            top: Math.min(textRect.top, r.top),
            right: Math.max(textRect.right, r.right),
            bottom: Math.max(textRect.bottom, r.bottom),
            left: Math.min(textRect.left, r.left),
          }
        : { top: r.top, right: r.right, bottom: r.bottom, left: r.left };
    }
  }
  return {
    scrollWidth: el.scrollWidth,
    scrollHeight: el.scrollHeight,
    clientWidth: el.clientWidth,
    clientHeight: el.clientHeight,
    overflowX: control ? "visible" : style.overflowX,
    overflowY: control ? "visible" : style.overflowY,
    position: style.position,
    rect: el.getBoundingClientRect(),
    textRect,
  };
}

/** Write the fitted scale: CSS zoom on the demo body relative to the old 1.3em size. */
export function setDemoScale(stage: HTMLElement, scale: number): void {
  stage.style.setProperty("--demo-fit-scale", String(scale));
  stage.style.setProperty("--demo-zoom", String(scale / DEMO_FIT_MIN));
}
