/**
 * Small markup helpers shared by the structure-only checkers (A4, A5).
 * Same parsing rules as the A3 helpers: scripts, styles, and comments are
 * removed first, and elements are matched by balanced tags. Positions are
 * offsets into the rendered markup, so containment can be computed.
 */
import { renderedMarkup, startTagAttr } from "./html";
import { decodeEntities, textOf } from "./a3-structure";

export { decodeEntities, textOf };

export type El = { tag: string; open: string; inner: string; start: number; end: number };

const VOID_TAGS = new Set(["area", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);

/** Rendered markup once; pass the result to `els` with rendered = true. */
export function rendered(html: string): string {
  return renderedMarkup(html);
}

/** Elements of one tag. `start`/`end` bound the whole element in `source`. */
export function els(source: string, tag: string): El[] {
  const out: El[] = [];
  const openRe = new RegExp(`<${tag}\\b[^>]*>`, "gi");
  let match: RegExpExecArray | null;
  while ((match = openRe.exec(source))) {
    const open = match[0];
    if (VOID_TAGS.has(tag) || /\/\s*>$/.test(open)) {
      out.push({ tag, open, inner: "", start: match.index, end: match.index + open.length });
      continue;
    }
    const innerStart = match.index + open.length;
    const tagRe = new RegExp(`<(/?)${tag}\\b[^>]*>`, "gi");
    tagRe.lastIndex = innerStart;
    let depth = 1;
    let innerEnd = source.length;
    let end = source.length;
    let closer: RegExpExecArray | null;
    while ((closer = tagRe.exec(source))) {
      if (!closer[1] && /\/\s*>$/.test(closer[0])) continue;
      depth += closer[1] ? -1 : 1;
      if (depth === 0) {
        innerEnd = closer.index;
        end = closer.index + closer[0].length;
        break;
      }
    }
    out.push({ tag, open, inner: source.slice(innerStart, innerEnd), start: match.index, end });
  }
  return out;
}

export function attr(open: string, name: string): string {
  return decodeEntities(startTagAttr(open, name) ?? "");
}

export function hasAttr(open: string, name: string): boolean {
  return new RegExp(`\\s${name}(\\s|=|/?>)`, "i").test(open);
}

export const HEADINGS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

export function headings(source: string): El[] {
  return HEADINGS.flatMap((tag) => els(source, tag))
    .filter((el) => textOf(el.inner).length > 0)
    .sort((a, b) => a.start - b.start);
}

/** Buttons and elements that act like one (role="button"). */
export function buttons(source: string): El[] {
  const real = els(source, "button");
  const roles = ["div", "span", "a"].flatMap((tag) => els(source, tag)).filter((el) => /^button$/i.test(attr(el.open, "role")));
  return [...real, ...roles].sort((a, b) => a.start - b.start);
}

export type Field = { type: string; value: string; readOnly: boolean; checked: boolean; el: El };

/** Inputs, textareas, and selects with their shown value. */
export function fields(source: string): Field[] {
  const inputs = els(source, "input").map((el) => ({
    type: (attr(el.open, "type") || "text").toLowerCase(),
    value: attr(el.open, "value"),
    readOnly: hasAttr(el.open, "readonly") || hasAttr(el.open, "disabled"),
    checked: hasAttr(el.open, "checked"),
    el,
  }));
  const areas = els(source, "textarea").map((el) => ({ type: "textarea", value: decodeEntities(el.inner), readOnly: false, checked: false, el }));
  const selects = els(source, "select").map((el) => ({ type: "select", value: "", readOnly: false, checked: false, el }));
  return [...inputs, ...areas, ...selects].filter((field) => field.type !== "hidden").sort((a, b) => a.el.start - b.el.start);
}

export const inside = (outer: { start: number; end: number }, inner: { start: number; end: number }) =>
  inner.start >= outer.start && inner.end <= outer.end && !(inner.start === outer.start && inner.end === outer.end);

/**
 * The smallest element of the given tags that contains `target` and also
 * holds something outside it matching `extra` (a container, not a wrapper).
 */
export function container(source: string, target: El, extra: (outside: string) => boolean, tags = ["div", "section", "li", "form", "td", "main", "article"]): El | null {
  const candidates = tags
    .flatMap((tag) => els(source, tag))
    .filter((el) => inside(el, target))
    .sort((a, b) => a.end - a.start - (b.end - b.start));
  for (const el of candidates) {
    const outside = source.slice(el.start, target.start) + source.slice(target.end, el.end);
    if (extra(outside)) return el;
  }
  return null;
}

/** A same-site link's pathname and search, or null. */
export function localUrl(href: string, siteHost?: string): URL | null {
  const raw = decodeEntities(href.trim());
  if (!raw || raw.startsWith("#") || /^(mailto|tel|javascript):/i.test(raw)) return null;
  try {
    const url = new URL(raw, "https://deploy.invalid");
    if (url.hostname !== "deploy.invalid" && (!siteHost || url.hostname.toLowerCase() !== siteHost.toLowerCase())) return null;
    return url;
  } catch {
    return null;
  }
}

export function links(source: string, siteHost?: string): { el: El; href: string; url: URL | null; path: string | null }[] {
  return els(source, "a").map((el) => {
    const href = attr(el.open, "href");
    const url = localUrl(href, siteHost);
    return { el, href, url, path: url ? decodeURIComponent(url.pathname).replace(/\/+$/, "") || "/" : null };
  });
}

export function samePath(a: string, b: string): boolean {
  return a.replace(/\/+$/, "").toLowerCase() === b.replace(/\/+$/, "").toLowerCase();
}
