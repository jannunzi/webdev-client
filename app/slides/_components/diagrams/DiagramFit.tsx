"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { diagramFitScale } from "@/lib/lectures/diagram-fit";

/**
 * Shared slot for every lecture diagram. The slot is the slide height left
 * under the copy. The graphic keeps its aspect ratio and scales — up or
 * down — to the largest size that still sits inside the slot.
 */
export default function DiagramFit({ children }: { children: ReactNode }) {
  const slotRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const slot = slotRef.current;
    const inner = innerRef.current;
    if (!slot || !inner) return;

    const fit = () => {
      const slotWidth = slot.clientWidth;
      const slotHeight = slot.clientHeight;
      if (slotWidth < 2 || slotHeight < 2) return;

      inner.style.zoom = "1";
      if (inner.querySelector("[data-diagram-stretch]")) {
        inner.style.width = "100%";
        inner.style.height = "100%";
        return;
      }

      const svg = inner.querySelector("svg");
      const img = inner.querySelector("img");
      if (svg instanceof SVGSVGElement && svg.viewBox.baseVal.width > 0) {
        const box = svg.viewBox.baseVal;
        svg.style.width = `${box.width}px`;
        svg.style.height = `${box.height}px`;
        svg.style.maxWidth = "none";
        svg.style.maxHeight = "none";
      } else if (img instanceof HTMLImageElement) {
        if (img.naturalWidth < 1 || img.naturalHeight < 1) return;
        img.style.width = `${img.naturalWidth}px`;
        img.style.height = `${img.naturalHeight}px`;
        img.style.maxWidth = "none";
        img.style.maxHeight = "none";
      }

      for (const figure of inner.querySelectorAll("figure")) {
        if (!(figure instanceof HTMLElement)) continue;
        figure.style.width = "max-content";
        figure.style.maxWidth = "none";
        figure.style.height = "auto";
        figure.style.margin = "0";
      }

      const naturalWidth = inner.offsetWidth;
      const naturalHeight = inner.offsetHeight;
      if (naturalWidth < 1 || naturalHeight < 1) return;
      inner.style.zoom = String(
        diagramFitScale(slotWidth, slotHeight, naturalWidth, naturalHeight),
      );
    };

    const img = inner.querySelector("img");
    img?.addEventListener("load", fit);
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(slot);
    return () => {
      observer.disconnect();
      img?.removeEventListener("load", fit);
    };
  }, []);

  return (
    <div ref={slotRef} className="lecture-diagram-fit">
      <div ref={innerRef} className="lecture-diagram-fit-inner">
        {children}
      </div>
    </div>
  );
}
