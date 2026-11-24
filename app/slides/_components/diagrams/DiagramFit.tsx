"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import {
  DIAGRAM_MAX_HEIGHT_OF_SLIDE,
  diagramFitScale,
  isLectureIconSvg,
} from "@/lib/lectures/diagram-fit";

/**
 * Shared slot for every lecture diagram. The graphic keeps its aspect ratio
 * and scales to fit the leftover slot, but not past the balanced height of
 * CRUD Users slide 2. Whitespace under a short row is fine.
 */
export default function DiagramFit({ children }: { children: ReactNode }) {
  const slotRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const slot = slotRef.current;
    const inner = innerRef.current;
    if (!slot || !inner) return;

    let frame = 0;
    let tries = 0;

    const fit = () => {
      const slotWidth = slot.clientWidth;
      const slotHeight = slot.clientHeight;
      if (slotWidth < 2 || slotHeight < 2) {
        if (tries < 12) {
          tries += 1;
          frame = requestAnimationFrame(fit);
        }
        return;
      }

      inner.style.zoom = "1";
      if (inner.querySelector("[data-diagram-stretch]")) {
        inner.style.width = "100%";
        inner.style.height = "100%";
        return;
      }

      const svg = [...inner.querySelectorAll("svg")].find(
        (node): node is SVGSVGElement =>
          node instanceof SVGSVGElement &&
          !isLectureIconSvg(node.getAttribute("width"), node.getAttribute("height")) &&
          node.viewBox.baseVal.width > 0,
      );
      const img = inner.querySelector("img");
      if (svg instanceof SVGSVGElement && svg.viewBox.baseVal.width > 0) {
        const box = svg.viewBox.baseVal;
        svg.style.width = `${box.width}px`;
        svg.style.height = `${box.height}px`;
        svg.style.maxWidth = "none";
        svg.style.maxHeight = "none";
      } else if (img instanceof HTMLImageElement) {
        if (img.naturalWidth < 1 || img.naturalHeight < 1) {
          if (tries < 12) {
            tries += 1;
            frame = requestAnimationFrame(fit);
          }
          return;
        }
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
      if (naturalWidth < 1 || naturalHeight < 1) {
        if (tries < 12) {
          tries += 1;
          frame = requestAnimationFrame(fit);
        }
        return;
      }
      tries = 0;
      const slide = slot.closest("article");
      const slideHeight =
        slide instanceof HTMLElement && slide.clientHeight > 0
          ? slide.clientHeight
          : slotHeight;
      inner.style.zoom = String(
        diagramFitScale(
          slotWidth,
          slotHeight,
          naturalWidth,
          naturalHeight,
          slideHeight * DIAGRAM_MAX_HEIGHT_OF_SLIDE,
        ),
      );
    };

    const img = inner.querySelector("img");
    img?.addEventListener("load", fit);
    fit();
    const observer = new ResizeObserver(() => {
      tries = 0;
      fit();
    });
    observer.observe(slot);
    observer.observe(inner);
    const visible =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
              tries = 0;
              fit();
            }
          });
    visible?.observe(slot);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visible?.disconnect();
      img?.removeEventListener("load", fit);
    };
  }, [children]);

  return (
    <div ref={slotRef} className="lecture-diagram-fit">
      <div ref={innerRef} className="lecture-diagram-fit-inner">
        {children}
      </div>
    </div>
  );
}
