"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import {
  DIAGRAM_MAX_HEIGHT_OF_SLIDE,
  diagramFitScale,
  diagramMinFontPx,
  fontPxThatFits,
  isLectureIconSvg,
} from "@/lib/lectures/diagram-fit";

type Box = { x: number; y: number; width: number; height: number };

function raiseDiagramText(inner: HTMLElement, zoom: number, slideWidth: number) {
  if (zoom <= 0) return;
  const root = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const bulletPx = root * (slideWidth >= 1024 ? 3.15 : slideWidth >= 640 ? 2.75 : 2.25);
  const minVisual = diagramMinFontPx(slideWidth, bulletPx);
  const texts = [...inner.querySelectorAll("text")].filter(
    (node): node is SVGTextElement => node instanceof SVGTextElement,
  );
  const rects: Box[] = [...inner.querySelectorAll("rect")]
    .filter((node): node is SVGRectElement => node instanceof SVGRectElement)
    .map((rect) => ({
      x: Number.parseFloat(rect.getAttribute("x") || "0"),
      y: Number.parseFloat(rect.getAttribute("y") || "0"),
      width: Number.parseFloat(rect.getAttribute("width") || "0"),
      height: Number.parseFloat(rect.getAttribute("height") || "0"),
    }))
    .filter((rect) => rect.width > 0 && rect.height > 0);

  for (const text of texts) {
    if (!text.dataset.diagramFont) {
      text.dataset.diagramFont = text.getAttribute("font-size") || "16";
    }
    const base = Number.parseFloat(text.dataset.diagramFont);
    if (!Number.isFinite(base) || base <= 0) continue;
    const content = (text.textContent || "").replace(/\s+/g, " ").trim();
    if (!content) continue;
    const x = Number.parseFloat(text.getAttribute("x") || "0");
    const y = Number.parseFloat(text.getAttribute("y") || "0");
    let container: Box | null = null;
    let containerArea = Number.POSITIVE_INFINITY;
    for (const rect of rects) {
      const inside =
        x >= rect.x - 8 &&
        x <= rect.x + rect.width + 8 &&
        y >= rect.y - 4 &&
        y <= rect.y + rect.height + 12;
      if (!inside) continue;
      const area = rect.width * rect.height;
      if (area < containerArea) {
        container = rect;
        containerArea = area;
      }
    }
    let boxWidth = 0;
    let lineGap = 0;
    if (container) {
      boxWidth = container.width;
      const ys = texts
        .filter((other) => {
          const ox = Number.parseFloat(other.getAttribute("x") || "0");
          const oy = Number.parseFloat(other.getAttribute("y") || "0");
          return (
            ox >= container.x - 8 &&
            ox <= container.x + container.width + 8 &&
            oy >= container.y - 4 &&
            oy <= container.y + container.height + 12
          );
        })
        .map((other) => Number.parseFloat(other.getAttribute("y") || "0"))
        .sort((a, b) => a - b);
      const index = ys.indexOf(y);
      const gaps: number[] = [];
      if (index > 0) gaps.push(y - ys[index - 1]);
      if (index >= 0 && index < ys.length - 1) gaps.push(ys[index + 1] - y);
      lineGap = gaps.length > 0 ? Math.min(...gaps) : 0;
    } else {
      let left = Number.NEGATIVE_INFINITY;
      let right = Number.POSITIVE_INFINITY;
      for (const rect of rects) {
        const end = rect.x + rect.width;
        if (end <= x + 2) left = Math.max(left, end);
        else if (rect.x >= x - 2) right = Math.min(right, rect.x);
      }
      if (Number.isFinite(left) && Number.isFinite(right) && right > left) {
        boxWidth = right - left;
      }
    }
    const target = minVisual / zoom;
    let next = target;
    if (boxWidth > 0) {
      next = Math.min(next, fontPxThatFits(content, boxWidth, container ? 36 : 36));
    }
    if (lineGap > 0) next = Math.min(next, lineGap * 0.8);
    // Slide 9's labels are the ceiling. Oversized type shrinks down to them.
    next = Math.max(12, Math.min(next, target));
    text.setAttribute("font-size", String(Math.round(next * 10) / 10));
  }
}

/**
 * Shared slot for every lecture diagram. The graphic keeps its aspect ratio
 * and scales to fit the leftover slot, but not past the balanced height of
 * CRUD Users slide 2. Whitespace under a short row is fine. Labels, arrow
 * text, and box contents then grow toward the bullet size when the box allows.
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
      // Screen mocks fill the leftover slot. Flow drawings stay at the slide-2 cap.
      const screenDemo = Boolean(inner.querySelector("[data-screen-demo]"));
      const zoom = diagramFitScale(
        slotWidth,
        slotHeight,
        naturalWidth,
        naturalHeight,
        screenDemo ? Number.POSITIVE_INFINITY : slideHeight * DIAGRAM_MAX_HEIGHT_OF_SLIDE,
      );
      inner.style.zoom = String(zoom);
      raiseDiagramText(inner, zoom, slide instanceof HTMLElement ? slide.clientWidth : slotWidth);
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
