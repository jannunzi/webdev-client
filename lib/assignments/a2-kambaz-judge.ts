/**
 * Judges the A2 Kambaz rows from page structure and compiled CSS, the same
 * way `judgeA2Labs` judges the labs: what the CSS does to the page, never
 * ids, class names or text.
 *
 * Kambaz screens are styled with Tailwind utilities (rules inside `@layer`),
 * so, unlike the §2.1 lab samples, any rule that reaches an element counts.
 * Each screen has a few "features" taken from the book's "The finished …
 * is expected to" lists (§2.4.1–§2.4.9). Tiers:
 *
 *   - pass:   the screen shows enough of its features;
 *   - review: some features, not enough to be sure (a student's own look):
 *             "Needs TA review", points kept;
 *   - fail:   nothing styled at all (or the page is a 404 / the starter).
 *
 * A page or stylesheet that couldn't be fetched is "Needs re-check", points
 * kept. Messages name the book section, never an id or class.
 */
import { isDefiniteNotFound, type AttemptedPage } from "./a1-structure";
import { needsReviewMessage } from "./check-status";
import type { AutoJudgeContext, AutoVerdict } from "./checker-types";
import { textOf, type DomNode } from "./dom-lite";
import {
  isTemplatePage,
  stylePage,
  stylesheetHrefs,
  type AppliedDecl,
  type StyledPage,
} from "./a2-structure";

const MAX_SHEETS = 12;
const RECHECK_TAIL = "so this wasn't checked. Not marked wrong; no points taken off.";

/* ------------------------------------------------------------------ */
/* Style helpers                                                       */
/* ------------------------------------------------------------------ */

/** Declarations that reach an element, custom properties (`--tw-*`) left out. */
function declsOf(page: StyledPage, node: DomNode): AppliedDecl[] {
  return (page.applied.get(node) ?? []).filter((decl) => !decl.prop.startsWith("--"));
}

function values(page: StyledPage, node: DomNode, props: RegExp): string[] {
  return declsOf(page, node)
    .filter((decl) => props.test(decl.prop))
    .map((decl) => decl.value.replace(/\s+/g, " ").trim().toLowerCase());
}

const INERT = /^(0|0px|0rem|0em|none|auto|initial|inherit|unset|normal|transparent|currentcolor|revert)$/;

/** A property that is set to something other than zero / none / auto. */
function has(page: StyledPage, node: DomNode, props: RegExp): boolean {
  return values(page, node, props).some((value) => !INERT.test(value) && !/^0(px|rem|em)?( 0(px|rem|em)?)*$/.test(value));
}

function hasValue(page: StyledPage, node: DomNode, prop: RegExp, test: RegExp): boolean {
  return values(page, node, prop).some((value) => test.test(value));
}

const BORDER_STYLE = /\b(solid|dashed|dotted|double|groove|ridge|inset|outset)\b/;

/** Any visible border (width, shorthand or style) on any side. */
function hasBorder(page: StyledPage, node: DomNode): boolean {
  return (
    has(page, node, /^border(-(top|right|bottom|left|block|inline)(-(start|end))?)?(-width)?$/) ||
    values(page, node, /^border(-(top|right|bottom|left))?-style$/).some((value) => BORDER_STYLE.test(value))
  );
}

/** A border on the left (or inline-start) side. */
function hasLeftBorder(page: StyledPage, node: DomNode): boolean {
  return has(page, node, /^border-(left|inline-start)(-width)?$/) || hasValue(page, node, /^border-(left|inline-start)$/, BORDER_STYLE);
}

const hasShadow = (page: StyledPage, node: DomNode) => has(page, node, /^box-shadow$/);
const hasRadius = (page: StyledPage, node: DomNode) => has(page, node, /^border(-[a-z]+)*-radius$/);
const hasPadding = (page: StyledPage, node: DomNode) => has(page, node, /^padding(-[a-z]+)*$/);
const hasMargin = (page: StyledPage, node: DomNode) => has(page, node, /^margin(-[a-z]+)*$/);
const hasWidth = (page: StyledPage, node: DomNode) => has(page, node, /^(width|min-width|max-width|flex-basis)$/);
const hasBackground = (page: StyledPage, node: DomNode) => has(page, node, /^background(-color)?$/);

function hasDisplay(page: StyledPage, node: DomNode, test: RegExp): boolean {
  return hasValue(page, node, /^display$/, test);
}

const isFlex = (page: StyledPage, node: DomNode) => hasDisplay(page, node, /(^|\s)(inline-)?flex\b/);
const isGrid = (page: StyledPage, node: DomNode) => hasDisplay(page, node, /(^|\s)(inline-)?grid\b/);
const isFlexOrGrid = (page: StyledPage, node: DomNode) => isFlex(page, node) || isGrid(page, node);
const isFloated = (page: StyledPage, node: DomNode) => hasValue(page, node, /^float$/, /^(left|right|inline-start|inline-end)$/);

/** The element as laid out as a fixed / sticky column. */
const isPinned = (page: StyledPage, node: DomNode) => hasValue(page, node, /^position$/, /^(fixed|sticky)$/);

/* ------------------------------------------------------------------ */
/* Colors                                                              */
/* ------------------------------------------------------------------ */

type Tone = "dark" | "light" | "gray" | "green" | "red" | "other";

const GRAYS = new Set(["gray", "slate", "zinc", "neutral", "stone"]);
const GREENS = new Set(["green", "emerald", "lime", "teal"]);
const REDS = new Set(["red", "rose"]);
const NAMED: Record<string, Tone> = {
  black: "dark",
  white: "light",
  gray: "gray",
  grey: "gray",
  silver: "gray",
  lightgray: "gray",
  lightgrey: "gray",
  gainsboro: "gray",
  whitesmoke: "light",
  green: "green",
  lime: "green",
  limegreen: "green",
  seagreen: "green",
  forestgreen: "green",
  darkgreen: "green",
  red: "red",
  crimson: "red",
  firebrick: "red",
  darkred: "red",
};

function rgbTone(r: number, g: number, b: number): Tone {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const spread = (max - min) / 255;
  if (spread > 0.2) {
    if (g === max && g - Math.max(r, b) > 20) return "green";
    if (r === max && r - Math.max(g, b) > 60 && g < 120) return "red";
    return "other";
  }
  if (lum < 0.3) return "dark";
  if (lum > 0.96) return "light";
  return "gray";
}

/** Rough classification of a CSS color value. */
export function colorTone(raw: string): Tone {
  const value = raw.trim().toLowerCase();
  const tw = /var\(--color-([a-z]+)(?:-(\d+))?\)/.exec(value);
  if (tw) {
    const [, family, shade] = tw;
    if (family === "black") return "dark";
    if (family === "white") return "light";
    const n = shade ? Number(shade) : 500;
    if (GRAYS.has(family)) return n >= 700 ? "dark" : n <= 50 ? "light" : "gray";
    if (GREENS.has(family)) return "green";
    if (REDS.has(family)) return "red";
    return "other";
  }
  const hex = /#([0-9a-f]{3}|[0-9a-f]{6})\b/.exec(value);
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].replace(/./g, "$&$&") : hex[1];
    return rgbTone(parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16));
  }
  const rgb = /rgba?\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)/.exec(value);
  if (rgb) return rgbTone(Number(rgb[1]), Number(rgb[2]), Number(rgb[3]));
  const oklch = /oklch\(\s*([\d.]+%?)[ ,]+([\d.]+)[ ,]+([\d.]+)/.exec(value);
  if (oklch) {
    const l = oklch[1].endsWith("%") ? Number(oklch[1].slice(0, -1)) / 100 : Number(oklch[1]);
    const c = Number(oklch[2]);
    const hue = Number(oklch[3]);
    if (c < 0.03) return l < 0.35 ? "dark" : l > 0.97 ? "light" : "gray";
    if (hue >= 100 && hue <= 180) return "green";
    if (hue >= 10 && hue <= 40) return "red";
    return "other";
  }
  for (const word of value.split(/[\s,()]+/)) if (NAMED[word]) return NAMED[word];
  return "other";
}

/** Tones of the background colors set on an element. */
function backgroundTones(page: StyledPage, node: DomNode): Tone[] {
  return values(page, node, /^background(-color)?$/).map(colorTone);
}

/** Tones of the left border color (longhand, shorthand, or `border-color`). */
function leftBorderTones(page: StyledPage, node: DomNode): Tone[] {
  return values(page, node, /^border(-(left|inline-start))?(-color)?$/).map(colorTone);
}

/* ------------------------------------------------------------------ */
/* Structure helpers                                                   */
/* ------------------------------------------------------------------ */

function anchorsIn(node: DomNode): DomNode[] {
  const out: DomNode[] = [];
  const walk = (n: DomNode) => {
    if (n.tag === "a" && n.attrs.has("href")) out.push(n);
    for (const child of n.children) walk(child);
  };
  walk(node);
  return out;
}

function descendantsOf(node: DomNode): DomNode[] {
  return node.children.flatMap((child) => [child, ...descendantsOf(child)]);
}

function ancestorsOf(node: DomNode): DomNode[] {
  const out: DomNode[] = [];
  for (let p = node.parent; p; p = p.parent) out.push(p);
  return out;
}

function hrefPath(node: DomNode): string {
  const href = (node.attrs.get("href") ?? "").trim();
  try {
    return new URL(href, "https://x.invalid").pathname.replace(/\/+$/, "") || "/";
  } catch {
    return href;
  }
}

const isButtonLike = (node: DomNode) => node.tag === "button" || (node.tag === "a" && node.attrs.get("role") === "button") || (node.tag === "input" && /^(submit|button)$/i.test(node.attrs.get("type") ?? ""));

/** A control that looks like a button: a fill or a border, and some padding. */
function styledButton(page: StyledPage, node: DomNode): boolean {
  return (hasBackground(page, node) || hasBorder(page, node)) && (hasPadding(page, node) || hasWidth(page, node));
}

/** The smallest element that contains all of `nodes`. */
function commonAncestor(nodes: DomNode[]): DomNode | null {
  if (nodes.length === 0) return null;
  const chain = [nodes[0], ...ancestorsOf(nodes[0])];
  return chain.find((candidate) => nodes.every((node) => node === candidate || ancestorsOf(node).includes(candidate))) ?? null;
}

/* ------------------------------------------------------------------ */
/* Screen evidence                                                     */
/* ------------------------------------------------------------------ */

type Feature = { name: string; ok: boolean };
type Screen = { features: Feature[]; pass: number };

const COURSE_LINK = /^\/courses\/[^/]+\/(home|modules|assignments|people|grades|piazza|zoom|quizzes)\b/;

/** A column of links: the nav sidebar. */
function navColumns(page: StyledPage): DomNode[] {
  return page.elements.filter((node) => {
    if (node.tag === "a") return false;
    const links = anchorsIn(node);
    return links.length >= 4 && links.length <= 14;
  });
}

function navScreen(page: StyledPage): Screen {
  // The tightest container holding most of the sidebar links.
  const candidates = navColumns(page).filter((node) => {
    const own = [...node.children.flatMap((child) => anchorsIn(child))];
    return own.length >= 4 && !descendantsOf(node).some((child) => child.tag !== "a" && anchorsIn(child).length >= own.length);
  });
  const nav = candidates.find((node) => node.tag === "nav") ?? candidates[0];
  if (!nav) {
    return { pass: 3, features: [{ name: "a column of links", ok: false }] };
  }
  const links = anchorsIn(nav);
  const scope = [nav, ...ancestorsOf(nav).filter((p) => p.tag !== "body" && p.tag !== "html")];
  const dark = scope.some((node) => backgroundTones(page, node).includes("dark")) || links.filter((l) => backgroundTones(page, l).includes("dark")).length >= Math.ceil(links.length / 2);
  const pinned = scope.some((node) => isPinned(page, node));
  const layout = scope.some((node) => isFlexOrGrid(page, node) || isPinned(page, node)) || links.some((link) => hasDisplay(page, link, /\b(block|flex|inline-block)\b/));
  const sized = scope.some((node) => hasWidth(page, node));
  const centered =
    [...scope, ...links].some((node) => hasValue(page, node, /^text-align$/, /^center$/)) ||
    scope.some((node) => hasValue(page, node, /^(align-items|justify-content)$/, /^center$/));
  const redIcons = descendantsOf(nav).some((node) => node.tag === "svg" && ([...ancestorsOf(node), node].some((n) => values(page, n, /^(color|fill)$/).map(colorTone).includes("red"))));
  const highlight = links.some((link) => backgroundTones(page, link).includes("light")) || links.some((link) => backgroundTones(page, link).includes("light"));
  return {
    pass: 3,
    features: [
      { name: "a dark sidebar", ok: dark },
      { name: "a fixed or flex layout", ok: pinned || (layout && sized) },
      { name: "a set width", ok: sized },
      { name: "centered tiles", ok: centered },
      { name: "a highlighted link", ok: highlight || redIcons },
    ],
  };
}

function dashboardScreen(page: StyledPage): Screen {
  const links = page.elements.filter((node) => node.tag === "a" && node.attrs.has("href") && COURSE_LINK.test(hrefPath(node)));
  const cardOf = (link: DomNode): DomNode => {
    // The card is the link itself or the closest ancestor with box styling.
    return [link, ...ancestorsOf(link)].find((n) => n.tag !== "body" && hasCardBox(page, n)) ?? link;
  };
  const cards = [...new Set(links.map(cardOf))];
  const styledCards = cards.filter((card) => hasCardBox(page, card) || descendantsOf(card).some((n) => hasCardBox(page, n)));
  // The container that holds the cards (styled or not).
  const parents = [
    ...new Set(
      links.flatMap((link) => [link, ...ancestorsOf(link)].slice(1, 4)).filter((p) => p.tag !== "body" && p.tag !== "html"),
    ),
  ];
  const gridded = parents.some((parent) => isFlexOrGrid(page, parent) || isFloated(page, parent)) || cards.some((card) => isFloated(page, card) || hasDisplay(page, card, /inline-(block|flex)/));
  const sized = styledCards.some((card) => hasWidth(page, card)) || parents.some((parent) => isGrid(page, parent));
  const gap = parents.some((parent) => has(page, parent, /^(gap|row-gap|column-gap)$/)) || styledCards.some((card) => hasMargin(page, card));
  return {
    pass: 3,
    features: [
      { name: "at least three styled course cards", ok: styledCards.length >= 3 },
      { name: "cards in a grid or row", ok: gridded },
      { name: "card width and spacing", ok: sized && gap },
    ],
  };
}

function hasCardBox(page: StyledPage, node: DomNode): boolean {
  return (hasBorder(page, node) || hasShadow(page, node) || hasRadius(page, node) || hasBackground(page, node)) && (hasWidth(page, node) || hasPadding(page, node) || hasRadius(page, node));
}

function courseNavScreen(page: StyledPage): Screen {
  // The list of course links (Home, Modules, Piazza, …), on the course home.
  const groups = page.elements.filter((node) => {
    if (node.tag === "a") return false;
    const links = anchorsIn(node).filter((link) => COURSE_LINK.test(hrefPath(link)));
    return links.length >= 4 && !descendantsOf(node).some((child) => child.tag !== "a" && anchorsIn(child).filter((l) => COURSE_LINK.test(hrefPath(l))).length === links.length);
  });
  const nav = groups[0];
  if (!nav) return { pass: 3, features: [{ name: "a list of course links", ok: false }] };
  const links = anchorsIn(nav).filter((link) => COURSE_LINK.test(hrefPath(link)));
  const scope = [nav, ...ancestorsOf(nav).filter((p) => p.tag !== "body" && p.tag !== "html").slice(0, 3)];
  const items = [...links, ...links.map((link) => link.parent).filter((p): p is DomNode => Boolean(p) && p !== nav)];
  const noBullets = [...scope, ...items].some((node) => hasValue(page, node, /^list-style(-type)?$/, /^none$/));
  const itemBorders = items.filter((node) => hasBorder(page, node) || hasBackground(page, node)).length >= 2;
  const spaced = items.filter((node) => hasPadding(page, node) || hasMargin(page, node)).length >= 2;
  const colored = links.some((link) => has(page, link, /^color$/)) || links.some((link) => hasValue(page, link, /^text-decoration(-line)?$/, /^none$/));
  const active = items.some((node) => hasBorder(page, node) && hasLeftBorder(page, node)) || links.some((link) => values(page, link, /^(border-left-color|color)$/).map(colorTone).includes("red")) || links.some((link) => has(page, link, /^font-weight$/));
  const sidebarLayout = scope.some((node) => has(page, node, /^(width|min-width|max-width|flex-basis)$/));
  return {
    pass: 3,
    features: [
      { name: "list bullets removed", ok: noBullets },
      { name: "bordered or filled links", ok: itemBorders },
      { name: "spacing around links", ok: spaced },
      { name: "link colors", ok: colored },
      { name: "a highlighted link", ok: active },
      { name: "a sidebar width", ok: sidebarLayout },
    ],
  };
}

/** Elements with a light-gray background that hold text: module title bars. */
function grayBars(page: StyledPage): DomNode[] {
  return page.elements.filter((node) => backgroundTones(page, node).some((tone) => tone === "gray") && textOf(node).length > 0);
}

function leftBorders(page: StyledPage): DomNode[] {
  return page.elements.filter((node) => hasLeftBorder(page, node) && textOf(node).length > 0);
}

function modulesFeatures(page: StyledPage): Feature[] {
  const buttons = page.elements.filter((node) => isButtonLike(node) && styledButton(page, node));
  const bars = grayBars(page);
  const borders = leftBorders(page);
  const greenBorders = borders.filter((node) => leftBorderTones(page, node).includes("green"));
  const row = commonAncestor(page.elements.filter((node) => isButtonLike(node)).slice(0, 4));
  const rowLaid = row ? isFlexOrGrid(page, row) || page.elements.filter((n) => isButtonLike(n) && (isFloated(page, n) || hasMargin(page, n))).length >= 2 : false;
  return [
    { name: "styled module controls", ok: buttons.length >= 3 || (buttons.length >= 1 && rowLaid) },
    { name: "gray module title bars", ok: bars.length >= 1 },
    { name: "green lesson borders", ok: greenBorders.length >= 1 || (borders.length >= 2 && bars.length >= 1) },
  ];
}

function modulesScreen(page: StyledPage): Screen {
  return { pass: 2, features: modulesFeatures(page) };
}

function homeScreen(page: StyledPage): Screen {
  // Modules plus a Course Status column beside them.
  const rows = page.elements.filter((node) => {
    const kids = node.children.filter((child) => page.elements.includes(child));
    return kids.length >= 2 && (isFlex(page, node) || isGrid(page, node));
  });
  const sideBySide = rows.length > 0 || page.elements.some((node) => isFloated(page, node) && textOf(node).length > 0);
  const buttons = page.elements.filter((node) => isButtonLike(node) && styledButton(page, node));
  const modules = modulesFeatures(page).filter((feature) => feature.ok).length >= 2;
  return {
    pass: 2,
    features: [
      { name: "modules and course status side by side", ok: sideBySide },
      { name: "styled status buttons", ok: buttons.length >= 2 },
      { name: "styled modules", ok: modules },
    ],
  };
}

function peopleScreen(page: StyledPage): Screen {
  const tables = page.elements.filter((node) => node.tag === "table");
  if (tables.length === 0) return { pass: 2, features: [{ name: "a table of people", ok: false }] };
  const cells = page.elements.filter((node) => node.tag === "td" || node.tag === "th");
  const some = (test: (node: DomNode) => boolean) => cells.filter(test).length >= 2;
  const rows = page.elements.filter((node) => node.tag === "tr");
  return {
    pass: 2,
    features: [
      { name: "table borders or dividers", ok: tables.some((t) => hasBorder(page, t) || hasValue(page, t, /^border-collapse$/, /^collapse$/)) || some((n) => hasBorder(page, n)) || rows.some((n) => hasBorder(page, n)) },
      { name: "cell padding", ok: some((n) => hasPadding(page, n)) || tables.some((t) => hasPadding(page, t)) },
      { name: "a table width", ok: tables.some((t) => hasWidth(page, t)) },
      { name: "striping or header colors", ok: rows.some((n) => hasBackground(page, n)) || some((n) => hasBackground(page, n)) },
    ],
  };
}

function assignmentsScreen(page: StyledPage): Screen {
  const inputs = page.elements.filter((node) => node.tag === "input" && !/^(hidden|checkbox|radio|submit|button)$/i.test(node.attrs.get("type") ?? ""));
  const buttons = page.elements.filter((node) => isButtonLike(node) && styledButton(page, node));
  const links = page.elements.filter((node) => node.tag === "a" && /\/assignments\/[^/]+$/.test(hrefPath(node)));
  const rows = [...new Set(links.flatMap((link) => [link, ...ancestorsOf(link)].filter((n) => n.tag !== "body" && n.tag !== "html").slice(0, 4)))];
  const greenLeft = rows.some((node) => hasLeftBorder(page, node) && leftBorderTones(page, node).includes("green"));
  const anyLeft = rows.some((node) => hasLeftBorder(page, node));
  const right = page.elements.some((node) => isFloated(page, node) && textOf(node).length > 0) || page.elements.some((node) => hasValue(page, node, /^justify-content$/, /^(space-between|flex-end|end)$/)) || page.elements.some((node) => hasValue(page, node, /^margin-(left|inline-start)$/, /^auto$/));
  const spaced = rows.filter((node) => hasPadding(page, node) || hasMargin(page, node)).length >= 2;
  return {
    pass: 2,
    features: [
      { name: "a styled search field", ok: inputs.some((n) => hasBorder(page, n) || hasPadding(page, n) || hasWidth(page, n)) },
      { name: "styled buttons on the right", ok: buttons.length >= 1 && right },
      { name: "a green left border on each assignment", ok: greenLeft || anyLeft },
      { name: "spacing around assignments", ok: spaced },
    ],
  };
}

function formControls(page: StyledPage): DomNode[] {
  return page.elements.filter((node) => ["input", "textarea", "select"].includes(node.tag) && !/^(hidden|checkbox|radio)$/i.test(node.attrs.get("type") ?? ""));
}

function editorScreen(page: StyledPage): Screen {
  const controls = formControls(page).filter((n) => !isButtonLike(n));
  const styled = controls.filter((n) => hasBorder(page, n) || hasPadding(page, n) || hasWidth(page, n) || hasRadius(page, n));
  const buttons = page.elements.filter((node) => isButtonLike(node) && styledButton(page, node));
  const layout = page.elements.some((node) => isFlexOrGrid(page, node) && node.children.length >= 2) || page.elements.some((node) => hasMargin(page, node) && ["div", "form", "label", "section"].includes(node.tag));
  return {
    pass: 2,
    features: [
      { name: "styled form fields", ok: styled.length >= 3 || (controls.length > 0 && styled.length >= Math.ceil(controls.length / 2)) },
      { name: "styled Save and Cancel buttons", ok: buttons.length >= 1 },
      { name: "a laid-out form", ok: layout },
    ],
  };
}

function accountScreen(page: StyledPage): Screen {
  const controls = formControls(page).filter((n) => !isButtonLike(n));
  const styled = controls.filter((n) => hasBorder(page, n) || hasPadding(page, n) || hasWidth(page, n) || hasRadius(page, n));
  const buttons = page.elements.filter((node) => isButtonLike(node) && styledButton(page, node));
  const layout = page.elements.some((node) => (isFlexOrGrid(page, node) || hasMargin(page, node) || hasWidth(page, node)) && ["form", "div", "main", "section"].includes(node.tag) && descendantsOf(node).some((n) => formControls(page).includes(n)));
  return {
    pass: 2,
    features: [
      { name: "styled form fields", ok: styled.length >= 2 || (controls.length > 0 && styled.length >= controls.length) },
      { name: "a styled button", ok: buttons.length >= 1 },
      { name: "a laid-out form", ok: layout },
    ],
  };
}

/* ------------------------------------------------------------------ */
/* Rows                                                                */
/* ------------------------------------------------------------------ */

type RowSpec = {
  id: string;
  /** Where the screen lives; the first matching crawled page is used. */
  path: RegExp;
  pathLabel: string;
  /** What the student built, for messages ("Kambaz Navigation"). */
  label: string;
  section: string;
  /**
   * What a page that isn't at the book's route means. People is the one
   * screen students route differently (/people instead of /people/table),
   * and the crawl only fetches the book's route, so a 404 there is TA review.
   */
  ifMissing?: "review";
  screen: (page: StyledPage) => Screen;
};

export const A2_KAMBAZ_ROWS: readonly RowSpec[] = [
  { id: "a2-kambaz-nav", path: /^\/(dashboard|courses\/[^/]+\/home)\/?$/, pathLabel: "/dashboard", label: "Kambaz Navigation", section: "§2.4.1", screen: navScreen },
  { id: "a2-kambaz-dashboard", path: /^\/dashboard\/?$/, pathLabel: "/dashboard", label: "Dashboard", section: "§2.4.2", screen: dashboardScreen },
  { id: "a2-kambaz-course-nav", path: /^\/courses\/[^/]+\/home\/?$/, pathLabel: "/courses/1234/home", label: "Course Navigation", section: "§2.4.3", screen: courseNavScreen },
  { id: "a2-kambaz-modules", path: /^\/courses\/[^/]+\/modules\/?$/, pathLabel: "/courses/1234/modules", label: "Modules", section: "§2.4.4", screen: modulesScreen },
  { id: "a2-kambaz-home", path: /^\/courses\/[^/]+\/home\/?$/, pathLabel: "/courses/1234/home", label: "Home", section: "§2.4.5", screen: homeScreen },
  { id: "a2-kambaz-people", path: /^\/courses\/[^/]+\/people(\/table)?\/?$/, pathLabel: "/courses/1234/people/table", label: "People table", section: "§2.4.6", ifMissing: "review", screen: peopleScreen },
  { id: "a2-kambaz-assignments", path: /^\/courses\/[^/]+\/assignments\/?$/, pathLabel: "/courses/1234/assignments", label: "Assignments", section: "§2.4.7", screen: assignmentsScreen },
  { id: "a2-kambaz-editor", path: /^\/courses\/[^/]+\/assignments\/[^/]+\/?$/, pathLabel: "/courses/1234/assignments/123", label: "Assignment Editor", section: "§2.4.8", screen: editorScreen },
  { id: "a2-kambaz-account", path: /^\/account\/(signin|sign-in|login)\/?$/, pathLabel: "/account/signin", label: "Account screens", section: "§2.4.9", screen: accountScreen },
];

type Read =
  | { state: "ok"; page: StyledPage; cssUnreachable: string[] }
  | { state: "missing"; status?: number }
  | { state: "unreachable"; why: string }
  | { state: "template" };

async function readMatching(ctx: AutoJudgeContext, test: RegExp, label: string, cache: Map<string, Promise<string | null>>): Promise<Read> {
  const clean = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p).toLowerCase();
  const page = ctx.structure.pages.find((entry) => test.test(clean(entry.path)));
  if (!page) {
    const tried: AttemptedPage[] = ctx.attempted.filter((entry) => test.test(clean(entry.path)));
    if (tried.length > 0 && tried.every(isDefiniteNotFound)) return { state: "missing", status: tried.find((e) => e.status)?.status };
    if (tried.length === 0) return { state: "missing" };
    return { state: "unreachable", why: `${label} on your deploy couldn't be opened (timeout, server error, or login)` };
  }
  if (isTemplatePage(page.html)) return { state: "template" };
  const sheets: string[] = [];
  const cssUnreachable: string[] = [];
  for (const href of stylesheetHrefs(page.html).slice(0, MAX_SHEETS)) {
    let pending = cache.get(href);
    if (!pending) {
      pending = ctx.fetchText(href).then((fetched) => (fetched.ok ? fetched.text : null));
      cache.set(href, pending);
    }
    const text = await pending;
    if (text === null) cssUnreachable.push(href);
    else sheets.push(text);
  }
  return { state: "ok", page: stylePage(page.html, sheets), cssUnreachable };
}

function listNames(names: readonly string[]): string {
  if (names.length <= 1) return names.join("");
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

function judgeRow(spec: RowSpec, read: Read): AutoVerdict {
  if (read.state === "missing" && spec.ifMissing === "review") {
    return {
      kind: "review",
      message: needsReviewMessage(`${spec.label} (${spec.section}) at ${spec.pathLabel}, which wasn't found on your deploy`),
      missMessage: `Your ${spec.label} screen wasn't found at ${spec.pathLabel}${read.status ? ` (HTTP ${read.status})` : ""}. Put it at that route (§1.4.6) and style it as in ${spec.section}.`,
    };
  }
  if (read.state === "missing") {
    return {
      kind: "fail",
      message: `Your ${spec.label} screen wasn't found at ${spec.pathLabel}${read.status ? ` (HTTP ${read.status})` : ""}, so this item couldn't pass.`,
    };
  }
  if (read.state === "unreachable") return { kind: "unreachable", message: `Needs re-check: ${read.why}, ${RECHECK_TAIL}` };
  if (read.state === "template") {
    return { kind: "fail", message: `${spec.pathLabel} still shows the create-next-app starter page, so this item couldn't pass.` };
  }
  if (read.cssUnreachable.length > 0) {
    return { kind: "unreachable", message: `Needs re-check: the stylesheet for ${spec.pathLabel} couldn't be downloaded from your deploy, ${RECHECK_TAIL}` };
  }
  const screen = spec.screen(read.page);
  const found = screen.features.filter((feature) => feature.ok);
  const lacking = screen.features.filter((feature) => !feature.ok).map((feature) => feature.name);
  const book = `${spec.label} (${spec.section})`;
  if (found.length >= screen.pass && found.length >= 1) {
    return { kind: "pass", message: `Found the ${spec.label} styling on ${spec.pathLabel}: ${listNames(found.map((f) => f.name))}.` };
  }
  if (found.length === 0) {
    return {
      kind: "fail",
      message: `${spec.pathLabel} shows no ${spec.label} styling: we looked for ${listNames(lacking)}. Style it as in ${spec.section}; we read the CSS that reaches the page, not ids or class names.`,
    };
  }
  return {
    kind: "review",
    message: needsReviewMessage(`${book} on ${spec.pathLabel} (found ${listNames(found.map((f) => f.name))}, not ${listNames(lacking)})`),
    missMessage: `Couldn't confirm ${spec.label} styling on ${spec.pathLabel}: still missing ${listNames(lacking)}. Style it as in ${spec.section}.`,
  };
}

export async function judgeA2Kambaz(ctx: AutoJudgeContext): Promise<Record<string, AutoVerdict>> {
  const out: Record<string, AutoVerdict> = {};
  const cache = new Map<string, Promise<string | null>>();
  for (const spec of A2_KAMBAZ_ROWS) {
    const read = await readMatching(ctx, spec.path, spec.pathLabel, cache);
    out[spec.id] = judgeRow(spec, read);
  }
  return out;
}
