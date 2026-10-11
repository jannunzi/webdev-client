/**
 * Kambaz screens for the A2 checker tests: small server-rendered pages and a
 * compiled stylesheet shaped like the book's §2.4 build (Tailwind utilities
 * inside `@layer utilities`, the way Next ships them). The pages are
 * hand-written for the tests; they hold no student work.
 *
 * `kambazPages(true)` is the styled build; `kambazPages(false)` is the same
 * markup with every class removed (Chapter 1's plain prototype, `table`
 * layout included), which must fail.
 */

export const KAMBAZ_CSS_FILE = "kambaz-fixture.css";

export const KAMBAZ_CSS = `@layer utilities{
.fixed{position:fixed}
.top-0{top:0}
.bottom-0{bottom:0}
.z-20{z-index:20}
.w-\\[120px\\]{width:120px}
.w-\\[300px\\]{width:300px}
.w-full{width:100%}
.block{display:block}
.grid{display:grid}
.flex{display:flex}
.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}
.gap-8{gap:calc(var(--spacing)*8)}
.gap-2{gap:calc(var(--spacing)*2)}
.bg-black{background-color:var(--color-black)}
.bg-white{background-color:var(--color-white)}
.bg-gray-200{background-color:var(--color-gray-200)}
.bg-red-600{background-color:var(--color-red-600)}
.text-white{color:var(--color-white)}
.text-red-600{color:var(--color-red-600)}
.text-center{text-align:center}
.no-underline{text-decoration-line:none}
.list-none{list-style-type:none}
.p-2{padding:calc(var(--spacing)*2)}
.p-3{padding:calc(var(--spacing)*3)}
.p-4{padding:calc(var(--spacing)*4)}
.py-3{padding-block:calc(var(--spacing)*3)}
.px-3{padding-inline:calc(var(--spacing)*3)}
.mb-3{margin-bottom:calc(var(--spacing)*3)}
.ml-auto{margin-left:auto}
.float-right{float:right}
.border{border-style:var(--tw-border-style);border-width:1px}
.border-l-4{border-left-style:var(--tw-border-style);border-left-width:4px}
.border-green-600{border-color:var(--color-green-600)}
.border-collapse{border-collapse:collapse}
.rounded-lg{border-radius:var(--radius-lg)}
.shadow{box-shadow:0 1px 3px 0 rgb(0 0 0 / .1)}
}`;

const head = `<!DOCTYPE html><html><head><link rel="stylesheet" href="/_next/static/chunks/${KAMBAZ_CSS_FILE}"/></head><body>`;

/** Replace each `{c:"…"}` marker with a class attribute, or nothing when plain. */
function cls(styled: boolean) {
  return (classes: string) => (styled ? ` class="${classes}"` : "");
}

function shell(styled: boolean, body: string): string {
  const c = cls(styled);
  const link = (href: string, label: string, on = false) =>
    `<a href="${href}"${c(`block py-3 text-center no-underline ${on ? "bg-white text-red-600" : "bg-black text-white"}`)}>${label}</a>`;
  return `${head}<div><nav${c("fixed top-0 bottom-0 z-20 w-[120px] bg-black")}>${link("/account", "Account")}${link("/dashboard", "Dashboard", true)}${link("/dashboard", "Courses")}${link("/calendar", "Calendar")}${link("/inbox", "Inbox")}${link("/labs", "Labs")}</nav><div>${body}</div></div></body></html>`;
}

function courseNav(styled: boolean): string {
  const c = cls(styled);
  const item = (seg: string, label: string, on = false) =>
    `<li${c("p-2 border")}><a href="/courses/1234/${seg}"${c(on ? "text-red-600 no-underline" : "text-white no-underline")}>${label}</a></li>`;
  return `<ul${c("list-none w-[120px]")}>${item("home", "Home", true)}${item("modules", "Modules")}${item("piazza", "Piazza")}${item("zoom", "Zoom")}${item("quizzes", "Quizzes")}${item("grades", "Grades")}${item("people/table", "People")}</ul>`;
}

function modules(styled: boolean): string {
  const c = cls(styled);
  const buttons = ["Collapse All", "View Progress", "Publish All", "Module"]
    .map((label) => `<button${c("bg-gray-200 border px-3 p-2")}>${label}</button>`)
    .join("");
  const mod = (title: string) =>
    `<li${c("mb-3")}><div${c("bg-gray-200 p-3")}>${title}</div><ul><li${c("border-l-4 border-green-600 p-3")}>Lesson one</li><li${c("border-l-4 border-green-600 p-3")}>Lesson two</li></ul></li>`;
  return `<div${c("flex gap-2 p-3")}>${buttons}</div><ul${c("list-none")}>${mod("Week 1")}${mod("Week 2")}</ul>`;
}

function dashboard(styled: boolean): string {
  const c = cls(styled);
  const card = (n: number) =>
    `<div${c("w-[300px] border rounded-lg shadow")}><a href="/courses/${n}/home"${c("block no-underline")}><div${c("p-4")}>CS${n} Web Development</div></a></div>`;
  return `<h1>Dashboard</h1><hr/><h2>Published Courses</h2><hr/><div${c("grid grid-cols-1 gap-8")}>${[1234, 2345, 3456, 4567].map(card).join("")}</div>`;
}

function home(styled: boolean): string {
  const c = cls(styled);
  const status = `<div${c("p-3")}><h3>Course Status</h3><button${c("bg-gray-200 border px-3 p-2")}>Unpublish</button><button${c("bg-red-600 text-white px-3 p-2 border")}>Publish</button></div>`;
  return `<div${c("flex gap-2")}>${courseNav(styled)}<div>${modules(styled)}</div>${status}</div>`;
}

function people(styled: boolean): string {
  const c = cls(styled);
  const row = (name: string, shaded = false) =>
    `<tr${c(shaded ? "bg-gray-200" : "")}><td${c("border p-2")}>${name}</td><td${c("border p-2")}>student</td><td${c("border p-2")}>Section 01</td></tr>`;
  return `<h2>People</h2><table${c("w-full border-collapse")}><thead><tr><th${c("border p-2")}>Name</th><th${c("border p-2")}>Role</th><th${c("border p-2")}>Section</th></tr></thead><tbody>${row("Ada Lovelace", true)}${row("Alan Turing")}${row("Grace Hopper", true)}</tbody></table>`;
}

function assignments(styled: boolean): string {
  const c = cls(styled);
  const item = (n: number) =>
    `<li${c("border-l-4 border-green-600 p-3 mb-3")}><a href="/courses/1234/assignments/${n}"${c("no-underline")}>A${n} Assignment</a><p>Due Sept ${n}</p></li>`;
  return `<input placeholder="Search for Assignments"${c("border p-2 w-full")}/><button${c("float-right bg-red-600 text-white px-3 p-2 border")}>+ Assignment</button><button${c("float-right bg-gray-200 px-3 p-2 border")}>+ Group</button><ul${c("list-none")}>${item(1)}${item(2)}${item(3)}</ul>`;
}

function editor(styled: boolean): string {
  const c = cls(styled);
  return `<form${c("p-3")}><label>Assignment Name</label><input value="A1"${c("border p-2 w-full")}/><textarea${c("border p-2 w-full")}>Description</textarea><div${c("flex gap-2 p-2")}><label>Points</label><input value="100"${c("border p-2")}/></div><div${c("flex gap-2")}><button${c("bg-gray-200 border px-3 p-2")}>Cancel</button><button${c("bg-red-600 text-white px-3 p-2 border")}>Save</button></div></form>`;
}

function signin(styled: boolean): string {
  const c = cls(styled);
  return `<div${c("w-[300px] p-4")}><h3>Sign in</h3><form${c("flex gap-2")}><input placeholder="username"${c("border p-2 w-full")}/><input placeholder="password" type="password"${c("border p-2 w-full")}/><button${c("bg-red-600 text-white px-3 p-2 border")}>Sign in</button></form></div>`;
}

/** The unstyled (Chapter 1) markup lays out with tables, as the book's plain prototype did. */
function plainShell(body: string): string {
  return `${head}<table><tr><td><nav><a href="/account">Account</a><a href="/dashboard">Dashboard</a><a href="/dashboard">Courses</a><a href="/calendar">Calendar</a><a href="/inbox">Inbox</a><a href="/labs">Labs</a></nav></td><td>${body}</td></tr></table></body></html>`;
}

/** Kambaz pages by pathname. */
export function kambazPages(styled: boolean): Record<string, string> {
  const wrap = (body: string) => (styled ? shell(true, body) : plainShell(body));
  return {
    "/dashboard": wrap(dashboard(styled)),
    "/courses/1234/home": wrap(home(styled)),
    "/courses/1234/modules": wrap(`<div${styled ? "" : ""}>${courseNav(styled)}</div>${modules(styled)}`),
    "/courses/1234/people/table": wrap(people(styled)),
    "/courses/1234/assignments": wrap(assignments(styled)),
    "/courses/1234/assignments/123": wrap(editor(styled)),
    "/account/signin": wrap(signin(styled)),
  };
}
