"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import {
  DIAGRAM_MAX_HEIGHT_OF_SLIDE,
  diagramFitScale,
  diagramMinFontPx,
  fontPxThatFits,
  isLectureIconSvg,
  tableColumnWidth,
  type DiagramRule,
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
  const rules: DiagramRule[] = [...inner.querySelectorAll("line")]
    .filter((node): node is SVGLineElement => node instanceof SVGLineElement)
    .map((line) => ({
      x1: Number.parseFloat(line.getAttribute("x1") || "0"),
      y1: Number.parseFloat(line.getAttribute("y1") || "0"),
      x2: Number.parseFloat(line.getAttribute("x2") || "0"),
      y2: Number.parseFloat(line.getAttribute("y2") || "0"),
    }));

  const planned: {
    text: SVGTextElement;
    next: number;
    x: number;
    anchor: string;
    key: string;
    weight: string;
    column: boolean;
  }[] = [];
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
    const column =
      container == null ? null : tableColumnWidth(x, container, rules);
    if (column != null) {
      // A table cell is only as wide as its column. Measuring the whole
      // table lets "RS101" and "Rocket Propulsion" grow into each other.
      next = Math.min(next, fontPxThatFits(content, column, 12));
    } else if (boxWidth > 0) {
      const anchorNow = text.getAttribute("text-anchor") || "start";
      // Indented lines start to the right of the box edge. Fit them in the
      // room that is actually left, or a long JSON value runs out of the box.
      const room =
        container && anchorNow !== "middle"
          ? container.x + container.width - x
          : boxWidth;
      next = Math.min(next, fontPxThatFits(content, Math.max(room, 8), container ? 16 : 10));
    }
    if (lineGap > 0) next = Math.min(next, lineGap * 0.8);
    next = Math.max(12, Math.min(next, target));
    const anchor = text.getAttribute("text-anchor") || "start";
    const weight = text.getAttribute("font-weight") || "400";
    const key = container
      ? `${container.x},${container.y},${container.width}`
      : "gap";
    planned.push({ text, next, x, anchor, key, weight, column: column != null });
  }
  // A list shares one size: the size that fits its longest line. Shorter
  // lines do not grow past it.
  const lists = new Map<string, typeof planned>();
  for (const item of planned) {
    if (item.anchor !== "start") continue;
    const groupKey = `${item.key}:${Math.round(item.x)}`;
    const group = lists.get(groupKey) ?? [];
    group.push(item);
    lists.set(groupKey, group);
  }
  for (const group of lists.values()) {
    if (group.length < 2) continue;
    const uniform = Math.min(...group.map((item) => item.next));
    for (const item of group) item.next = uniform;
  }
  // Box titles share one size, so a long title cannot render smaller than "People".
  const titles = planned.filter((item) => item.anchor === "middle" && Number(item.weight) >= 700 && item.key !== "gap");
  if (titles.length > 1) {
    const uniform = Math.min(...titles.map((item) => item.next));
    for (const item of titles) item.next = uniform;
  }
  // Cells in one table share the size that fits the longest value, so a
  // short id cannot render larger than the name beside it.
  const tables = new Map<string, typeof planned>();
  for (const item of planned) {
    if (!item.column) continue;
    const group = tables.get(item.key) ?? [];
    group.push(item);
    tables.set(item.key, group);
  }
  for (const group of tables.values()) {
    const uniform = Math.min(...group.map((item) => item.next));
    for (const item of group) item.next = uniform;
  }
  for (const item of planned) {
    item.text.setAttribute("font-size", String(Math.round(item.next * 10) / 10));
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
      // Screen mocks and composed table/ER drawings fill the leftover slot.
      // Flow rows stay at the slide-2 cap so a stack does not stretch.
      const screenDemo = Boolean(inner.querySelector("[data-screen-demo]"));
      const composed = Boolean(inner.querySelector("[data-diagram-natural]"));
      const zoom = diagramFitScale(
        slotWidth,
        slotHeight,
        naturalWidth,
        naturalHeight,
        screenDemo || composed ? Number.POSITIVE_INFINITY : slideHeight * DIAGRAM_MAX_HEIGHT_OF_SLIDE,
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
