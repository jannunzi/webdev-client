/**
 * A4 structure checks (Chapter 4: client state).
 *
 * The crawl reads each page as it first renders on the server, signed out.
 * Client Components still render their initial state there, so a counter
 * shows its starting count, a controlled input shows its starting value,
 * and the stores' seed lists are in the markup. Clicks, alerts,
 * document.title, and screens that need a signed-in user cannot be seen this
 * way and are not graded by the checker.
 *
 * Like A3, no check reads a wd-* id or fixed text (except the city property
 * the On your own step names). Messages never name an id.
 */
import { isDefiniteNotFound, type StructureContext, type StructureFallback, type StructureTarget, type StructureVerdict } from "./a1-structure";
import { isBoilerplatePage, a3GithubLinkStructurePassed, a3IdHasContent } from "./a3-structure";
import {
  attr,
  buttons,
  container,
  els,
  fields,
  headings,
  inside,
  links,
  rendered,
  samePath,
  textOf,
  type El,
} from "./structure-dom";

export { a3GithubLinkStructurePassed as a4GithubLinkStructurePassed, a3IdHasContent as a4IdHasContent };

/* ------------------------------------------------------------------ */
/* pages                                                               */
/* ------------------------------------------------------------------ */

type Lookup = { state: "ok"; html: string } | { state: "missing" } | { state: "unreachable" } | { state: "untried" };

export function lookup(ctx: StructureContext, path: string): Lookup {
  const page = ctx.pages.find((entry) => samePath(entry.path, path));
  if (page) return { state: "ok", html: page.html };
  const tried = (ctx.attempted ?? []).filter((entry) => samePath(entry.path, path));
  if (tried.length === 0) return { state: "untried" };
  if (tried.every((entry) => isDefiniteNotFound(entry))) return { state: "missing" };
  return { state: "unreachable" };
}

/* ------------------------------------------------------------------ */
/* Delivery                                                            */
/* ------------------------------------------------------------------ */

export const A4_LAB_PATHS = ["/labs/lab1", "/labs/lab2", "/labs/lab3", "/labs/lab4"] as const;

export function a4LabsNavStructurePassed(labsHtml: string, siteHost?: string): boolean {
  const paths = links(rendered(labsHtml), siteHost)
    .map((link) => link.path)
    .filter((path): path is string => Boolean(path));
  const labs = A4_LAB_PATHS.every((lab) => paths.some((path) => samePath(path, lab)));
  const kambaz = paths.some((path) => !/^\/labs(\/|$)/i.test(path));
  return labs && kambaz;
}

/* ------------------------------------------------------------------ */
/* Lab 4                                                               */
/* ------------------------------------------------------------------ */

export const A4_MIN_LAB_HEADINGS = 15;
export const A4_MIN_LAB_BUTTONS = 15;
export const A4_MIN_COUNTERS = 4;

/** The Lab 4 content: the page minus the Labs TOC column, when it is a table cell or nav. */
function labBody(html: string): string {
  return rendered(html);
}

export function lab4HasSections(html: string): boolean {
  if (isBoilerplatePage(html)) return false;
  const source = labBody(html);
  return headings(source).length >= A4_MIN_LAB_HEADINGS && buttons(source).length >= A4_MIN_LAB_BUTTONS;
}

const ENDS_IN_NUMBER = /(^|[^\w.])-?\d+\s*\)?\s*$/;

/** Headings or lines that end in a count, each with at least two buttons in its own box. */
export function lab4CounterCount(html: string): number {
  const source = labBody(html);
  const lines = [...headings(source), ...els(source, "p")].filter((el) => ENDS_IN_NUMBER.test(textOf(el.inner)));
  const boxes = new Map<number, El>();
  for (const line of lines) {
    const box = container(source, line, (outside) => buttons(outside).length >= 2);
    if (box) boxes.set(box.start, box);
  }
  // A box that holds another counter's box is a section or the page, not a counter.
  const all = [...boxes.values()];
  return all.filter((box) => !all.some((other) => other !== box && inside(box, other))).length;
}

export function lab4Counters(html: string): StructureVerdict {
  const count = lab4CounterCount(html);
  if (count >= A4_MIN_COUNTERS) return true;
  return count > 0 ? "review" : false;
}

export function lab4Boolean(html: string): StructureVerdict {
  const boxes = fields(labBody(html)).filter((field) => field.type === "checkbox");
  if (boxes.some((box) => !box.readOnly)) return true;
  return boxes.length > 0 ? "review" : false;
}

const TEXTISH = new Set(["text", "search", "email", "url", "tel", "textarea"]);

export function lab4String(html: string): boolean {
  const source = labBody(html);
  const text = textOf(source).toLowerCase();
  return fields(source).some(
    (field) => TEXTISH.has(field.type) && field.value.trim().length >= 2 && text.includes(field.value.trim().toLowerCase()),
  );
}

export function lab4Date(html: string): boolean {
  return fields(labBody(html)).some((field) => field.type === "date" && /^\d{4}-\d{2}-\d{2}$/.test(field.value.trim()));
}

function prettyObjects(source: string): Record<string, unknown>[] {
  return els(source, "pre").flatMap((pre) => {
    try {
      const value = JSON.parse(textOf(pre.inner.replace(/<[^>]+>/g, "")) || "null");
      return value && typeof value === "object" && !Array.isArray(value) ? [value as Record<string, unknown>] : [];
    } catch {
      return [];
    }
  });
}

/** Objects in a <pre> whose field values also show in inputs on the page. */
function boundObjects(html: string): { object: Record<string, unknown>; bound: Set<string> }[] {
  const source = labBody(html);
  const values = fields(source).map((field) => field.value.trim().toLowerCase());
  return prettyObjects(source)
    .filter((object) => Object.keys(object).length >= 2)
    .map((object) => ({
      object,
      bound: new Set(
        Object.entries(object)
          .filter(([, value]) => (typeof value === "string" || typeof value === "number") && String(value).trim() !== "")
          .filter(([, value]) => values.includes(String(value).trim().toLowerCase()))
          .map(([key]) => key.toLowerCase()),
      ),
    }));
}

export function lab4Object(html: string): boolean {
  return boundObjects(html).some((entry) => entry.bound.size >= 1);
}

/** On your own: the object gains a city property with its own input. */
export function lab4ObjectCity(html: string): StructureVerdict {
  const objects = boundObjects(html);
  if (objects.some((entry) => entry.bound.has("city"))) return true;
  // city printed but its input shows something else (or is empty): a TA can tell.
  if (objects.some((entry) => Object.keys(entry.object).some((key) => key.toLowerCase() === "city"))) return "review";
  return false;
}

/** Lists of at least 3 items that each carry a button. */
function actionLists(source: string): El[] {
  return ["ul", "ol"]
    .flatMap((tag) => els(source, tag))
    .filter((list) => {
      const items = els(list.inner, "li").filter((item) => !els(list.inner, "li").some((other) => inside(other, item)));
      return items.length >= 3 && items.every((item) => buttons(item.inner).length >= 1);
    });
}

type ListKind = "array" | "todo";

function listKinds(html: string): ListKind[] {
  const source = labBody(html);
  const found = actionLists(source);
  const lists = found.filter((list) => !found.some((other) => other !== list && inside(list, other)));
  return lists.flatMap((list): ListKind[] => {
    const box = container(source, list, (outside) => buttons(outside).length >= 1);
    if (!box) return [];
    const outside = source.slice(box.start, list.start) + source.slice(list.end, box.end);
    const hasTitleInput = fields(outside).some((field) => TEXTISH.has(field.type));
    return [hasTitleInput ? "todo" : "array"];
  });
}

export function lab4Array(html: string): boolean {
  return listKinds(html).includes("array");
}

export function lab4Todos(html: string): StructureVerdict {
  const todos = listKinds(html).filter((kind) => kind === "todo").length;
  if (todos >= 2) return true;
  return todos === 1 ? "review" : false;
}

/** Book route; the probes use other numbers than the book's 5 and 10. */
export const A4_PATH_PARAM_BASE = "/labs/lab4/url-encoding/path-params";
export const A4_PATH_PARAM_PROBES = [
  { a: 12, b: 30 },
  { a: 7, b: 8 },
] as const;

function showsNumber(html: string, n: number): boolean {
  return new RegExp(`(^|[^\\d.])${n}(?![\\d.])`).test(textOf(rendered(html)));
}

export function lab4UrlEncoding(html: string, ctx: StructureContext): StructureVerdict {
  const source = labBody(html);
  const urls = links(source, ctx.siteHost).filter((link) => link.url);
  const isNum = (value: string | null) => value !== null && /^-?\d+(\.\d+)?$/.test(value.trim());
  const query = urls.some((link) => isNum(link.url!.searchParams.get("a")) && isNum(link.url!.searchParams.get("b")));
  const pathLinks = urls.filter((link) => /^\/labs\/lab4\/.+\/-?\d+(\.\d+)?\/-?\d+(\.\d+)?$/i.test(link.path ?? ""));
  if (!query || pathLinks.length === 0) return false;
  const states: Lookup["state"][] = [];
  for (const probe of A4_PATH_PARAM_PROBES) {
    const page = lookup(ctx, `${A4_PATH_PARAM_BASE}/${probe.a}/${probe.b}`);
    if (page.state !== "ok") {
      states.push(page.state);
      continue;
    }
    if (!showsNumber(page.html, probe.a + probe.b)) return false;
  }
  if (states.length === 0) return true;
  // The book route is missing but the student's own path link exists: a TA opens it.
  const onBookRoute = pathLinks.some((link) => link.path!.toLowerCase().startsWith(A4_PATH_PARAM_BASE));
  if (states.includes("unreachable")) return "unreachable";
  if (states.includes("missing") && onBookRoute) return false;
  return "review";
}

/* ------------------------------------------------------------------ */
/* Kambaz                                                              */
/* ------------------------------------------------------------------ */

const COURSE_HOME = /^\/courses\/[^/]+\/home$/i;

function courseLinks(source: string, siteHost?: string) {
  return links(source, siteHost).filter((link) => link.path && COURSE_HOME.test(link.path));
}

/** Form fields and buttons above the first course card. */
function dashboardForm(html: string, siteHost?: string): { fields: ReturnType<typeof fields>; buttons: number } | null {
  const source = rendered(html);
  const first = courseLinks(source, siteHost)[0];
  const top = first ? source.slice(0, first.el.start) : source;
  // Leave the Kambaz sidebar out: it sits in its own nav.
  const withoutNav = els(top, "nav").reduce((out, nav) => out.replace(top.slice(nav.start, nav.end), ""), top);
  return {
    fields: fields(withoutNav).filter((field) => field.type !== "checkbox" && field.type !== "radio" && field.type !== "hidden"),
    buttons: buttons(withoutNav).length,
  };
}

export function dashboardHasForm(html: string, ctx: StructureContext): StructureVerdict {
  if (courseLinks(rendered(html), ctx.siteHost).length === 0) return false;
  const form = dashboardForm(html, ctx.siteHost);
  if (!form) return false;
  const filled = form.fields.filter((field) => field.value.trim() !== "");
  return filled.length >= 2 && form.buttons >= 2;
}

const DATE_VALUE = /^\d{4}-\d{2}-\d{2}/;

export function dashboardHasNumberAndDate(html: string, ctx: StructureContext): StructureVerdict {
  const form = dashboardForm(html, ctx.siteHost);
  if (!form || courseLinks(rendered(html), ctx.siteHost).length === 0) return false;
  const dated = form.fields.some((field) => field.type === "date" || DATE_VALUE.test(field.value.trim()));
  return form.fields.length >= 4 && dated;
}

export const A4_MIN_CARDS = 3;

/** Buttons that belong to one card: inside its link, or in the card box around it. */
export function cardsWithEditDelete(html: string, ctx: StructureContext): StructureVerdict {
  const source = rendered(html);
  const cards = courseLinks(source, ctx.siteHost);
  const seen = new Set<string>();
  const unique = cards.filter((card) => !seen.has(card.path!.toLowerCase()) && seen.add(card.path!.toLowerCase()));
  if (unique.length < A4_MIN_CARDS) return false;
  const counts = unique.map((card) => {
    const own = buttons(card.el.inner).length;
    if (own >= 2) return own;
    const box = container(source, card.el, () => true, ["div", "li", "article", "section"]);
    if (!box) return own;
    // The box must hold only this card.
    if (courseLinks(source.slice(box.start, box.end), ctx.siteHost).filter((l) => l.path!.toLowerCase() !== card.path!.toLowerCase()).length > 0) return own;
    return buttons(source.slice(box.start, box.end)).length;
  });
  return counts.every((count) => count >= 2);
}

/** Module rows: list items that hold a nested lesson list. Controls: buttons and icons in the row's title part. */
export function modulesHaveControls(html: string): StructureVerdict {
  const source = rendered(html);
  const lists = ["ul", "ol"].flatMap((tag) => els(source, tag));
  const rows = els(source, "li").filter((item) => lists.some((list) => inside(item, list)) && els(item.inner, "li").length > 0);
  const top = rows.filter((row) => !rows.some((other) => other !== row && inside(other, row)));
  if (top.length === 0) return false;
  const titleControls = top.map((row) => {
    const nested = ["ul", "ol"].flatMap((tag) => els(row.inner, tag))[0];
    const title = nested ? row.inner.slice(0, nested.start) : row.inner;
    return els(title, "svg").length + buttons(title).length + els(title, "input").length;
  });
  const outside = top.reduce((out, row) => out.replace(source.slice(row.start, row.end), ""), source);
  const addButton = buttons(els(outside, "nav").reduce((out, nav) => out.replace(outside.slice(nav.start, nav.end), ""), outside)).length >= 1;
  const rowsOk = titleControls.every((count) => count >= 4);
  if (rowsOk && addButton) return true;
  // Rows render with fewer controls than the book's pencil + trash + icons, or no
  // + Module button: alternative widgets are possible, so a TA looks.
  return titleControls.some((count) => count >= 2) ? "review" : false;
}

export function signinHasForm(html: string): boolean {
  const all = fields(rendered(html));
  const password = all.some((field) => field.type === "password");
  const user = all.some((field) => TEXTISH.has(field.type));
  return password && user && buttons(rendered(html)).length >= 1;
}

const ACCOUNT = (name: string) => new RegExp(`^/account/${name}$`, "i");

export function accountNavSignedOut(html: string, ctx: StructureContext): StructureVerdict {
  const paths = links(rendered(html), ctx.siteHost).map((link) => link.path ?? "");
  const signin = paths.some((path) => ACCOUNT("signin").test(path));
  const signup = paths.some((path) => ACCOUNT("signup").test(path));
  const profile = paths.some((path) => ACCOUNT("profile").test(path));
  return signin && signup && !profile;
}

/** Signed out, Profile must not show a user's fields (empty fields, a redirect, or nothing). */
export function profileGuarded(_html: string, ctx: StructureContext): StructureVerdict {
  const page = lookup(ctx, "/account/profile");
  const signin = lookup(ctx, "/account/signin");
  if (page.state === "ok") {
    // An empty or template page shows no user either: Profile must still be a Kambaz screen (its navigation links).
    const shell = links(rendered(page.html), ctx.siteHost).filter((link) => link.path && link.path !== "/").length >= 3;
    if (!shell || isBoilerplatePage(page.html)) return false;
    const filled = fields(rendered(page.html)).filter((field) => !["checkbox", "radio", "password", "select"].includes(field.type) && field.value.trim() !== "");
    return filled.length === 0;
  }
  // A server redirect lands on the Sign in screen; the crawl records it there.
  if (page.state === "untried" && signin.state === "ok") return "review";
  if (page.state === "missing") return false;
  return page.state === "unreachable" ? "unreachable" : "review";
}

/* ------------------------------------------------------------------ */
/* fallbacks by A4 criterion                                           */
/* ------------------------------------------------------------------ */

const LAB4: StructureTarget = { kind: "path", path: "/labs/lab4", name: "the Lab 4 page" };
const DASHBOARD: StructureTarget = { kind: "path", path: "/dashboard", name: "the Dashboard" };
const SIGNIN: StructureTarget = { kind: "path", path: "/account/signin", name: "the Sign in screen" };
const MODULES: StructureTarget = { kind: "screen", pattern: /^\/courses\/[^/]+\/modules$/i, name: "the Modules screens", example: "/courses/RS101/modules" };

function fallback(entry: Omit<StructureFallback, "structureOnly" | "onMiss">): StructureFallback {
  return { onMiss: "fail", ...entry, structureOnly: true };
}

export const A4_STRUCTURE_FALLBACKS: Readonly<Record<string, StructureFallback>> = {
  "a4-lab-page": fallback({
    looksFor: `the Lab 4 page with its sections (at least ${A4_MIN_LAB_HEADINGS} headings and ${A4_MIN_LAB_BUTTONS} buttons)`,
    missMessage: `/labs/lab4 should show a titled section for each exercise in §4.2–§4.7 (we found fewer than ${A4_MIN_LAB_HEADINGS} section headings or ${A4_MIN_LAB_BUTTONS} buttons, or the starter page).`,
    target: LAB4,
    test: (html) => lab4HasSections(html),
  }),
  "a4-lab-counters": fallback({
    looksFor: `at least ${A4_MIN_COUNTERS} counters (a line ending in the count, with two buttons next to it)`,
    missMessage: `We found fewer than ${A4_MIN_COUNTERS} counters on /labs/lab4. Each counter shows its count at the end of a heading or line, with its Up and Down buttons in the same box.`,
    target: LAB4,
    test: (html) => lab4Counters(html),
  }),
  "a4-lab-boolean": fallback({
    looksFor: "a clickable checkbox bound to a boolean",
    missMessage: "We couldn't find a clickable checkbox on /labs/lab4 bound to a boolean state variable.",
    target: LAB4,
    test: (html) => lab4Boolean(html),
  }),
  "a4-lab-string": fallback({
    looksFor: "a text input whose value is also printed on the page",
    missMessage: "We couldn't find a text input on /labs/lab4 whose value is also printed on the page (a controlled string).",
    target: LAB4,
    test: (html) => lab4String(html),
  }),
  "a4-lab-date": fallback({
    looksFor: "a date input with a YYYY-MM-DD value",
    missMessage: "We couldn't find a date input (type=\"date\") on /labs/lab4 showing a date.",
    target: LAB4,
    test: (html) => lab4Date(html),
  }),
  "a4-lab-object": fallback({
    looksFor: "an object printed as JSON in a <pre>, with inputs showing its fields",
    missMessage: "We couldn't find a <pre> on /labs/lab4 that prints a state object as JSON with inputs showing its field values.",
    target: LAB4,
    test: (html) => lab4Object(html),
  }),
  "a4-lab-object-city": fallback({
    looksFor: "a city property on the printed object, with its own input",
    missMessage: "The object printed on /labs/lab4 should also have a city property, shown in its own input.",
    target: LAB4,
    test: (html) => lab4ObjectCity(html),
  }),
  "a4-lab-array": fallback({
    looksFor: "a list of at least 3 items with Delete buttons next to an Add button",
    missMessage: "We couldn't find the array list on /labs/lab4 (at least 3 items, each with its own button, next to an Add button).",
    target: LAB4,
    test: (html) => lab4Array(html),
  }),
  "a4-lab-todos": fallback({
    looksFor: "two todo lists, each with a title input, an Add button, and items with buttons",
    missMessage: "/labs/lab4 should show the Zustand and Redux todo lists: each with a title input and Add button, and at least 3 items with Edit/Delete buttons.",
    target: LAB4,
    test: (html) => lab4Todos(html),
  }),
  "a4-lab-url": fallback({
    looksFor: "query and path parameter links, and a path-parameter page that adds",
    missMessage: `/labs/lab4 should link to a query-parameter URL (?a=…&b=…) and a path-parameter URL, and ${A4_PATH_PARAM_BASE}/12/30 should show 42 (and …/7/8 show 15).`,
    target: LAB4,
    test: (html, ctx) => lab4UrlEncoding(html, ctx),
  }),
  "a4-kambaz-dashboard-form": fallback({
    looksFor: "the course form (2 filled fields) and Add/Update buttons above the cards",
    missMessage: "Above the course cards the Dashboard should have the course form (name and description fields) with Add and Update buttons.",
    target: DASHBOARD,
    test: (html, ctx) => dashboardHasForm(html, ctx),
  }),
  "a4-kambaz-dashboard-fields": fallback({
    looksFor: "at least 4 course form fields, one showing a date",
    missMessage: "The Dashboard course form should also have fields for the course number and the start date (at least 4 fields, one showing a date).",
    target: DASHBOARD,
    test: (html, ctx) => dashboardHasNumberAndDate(html, ctx),
  }),
  "a4-kambaz-card-buttons": fallback({
    looksFor: `at least ${A4_MIN_CARDS} course cards, each with two buttons (Edit and Delete)`,
    missMessage: `Every course card on the Dashboard (at least ${A4_MIN_CARDS}) should have Edit and Delete buttons.`,
    target: DASHBOARD,
    test: (html, ctx) => cardsWithEditDelete(html, ctx),
  }),
  "a4-kambaz-modules": fallback({
    looksFor: "a + Module button and edit/delete controls on each module row",
    missMessage: "The Modules screen should have a + Module button, and each module row should have edit (pencil) and delete (trash) controls next to its other icons.",
    target: MODULES,
    test: (html) => modulesHaveControls(html),
  }),
  "a4-kambaz-signin": fallback({
    looksFor: "a username field, a password field, and a button",
    missMessage: "/account/signin should show a username field, a password field, and a Sign in button.",
    target: SIGNIN,
    test: (html) => signinHasForm(html),
  }),
  "a4-kambaz-account-nav": fallback({
    looksFor: "Sign in and Sign up links, and no Profile link, while signed out",
    missMessage: "Signed out, Account Navigation should link to /account/signin and /account/signup, and should not show Profile.",
    target: SIGNIN,
    test: (html, ctx) => accountNavSignedOut(html, ctx),
  }),
  "a4-kambaz-profile-guard": fallback({
    looksFor: "no user details on Profile while signed out",
    missMessage: "Signed out, /account/profile should not show a user's details: redirect to Sign in or render nothing until someone signs in.",
    target: SIGNIN,
    test: (html, ctx) => profileGuarded(html, ctx),
  }),
};
