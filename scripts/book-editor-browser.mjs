import { pathToFileURL } from "node:url";
import { mkdir } from "node:fs/promises";
import fs from "node:fs";

const playwright = await import(
  pathToFileURL(process.env.PLAYWRIGHT_CORE ?? "/tmp/pw/node_modules/playwright-core/index.js").href
);
const chromium = playwright.chromium ?? playwright.default.chromium;
const base = process.env.HARNESS_URL ?? "http://localhost:3457";
const { createFileStore, localStoreDir } = await import("../lib/book-editor/store.ts");
const { handleChapterGet, handleChapterPut } = await import("../lib/book-editor/handle.ts");
const { storagePlan } = await import("../lib/book-editor/store.ts");

const dir = localStoreDir();
fs.rmSync(dir, { recursive: true, force: true });
const store = createFileStore(dir);
const plan = storagePlan({ NODE_ENV: "development" });
const staff = { email: "jannunzi@gmail.com" };

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
await mkdir("/opt/cursor/artifacts", { recursive: true });
const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });

const anonymous = await page.request.put(`${base}/api/book-editor/chapter-1`, {
  data: { expectedRevision: 0, doc: { type: "doc", content: [] } },
});
assert(anonymous.status() === 401 || anonymous.status() === 403, `anonymous save returned ${anonymous.status()}`);

await page.route("**/api/book-editor/chapter-1", async (route) => {
  const request = route.request();
  const incoming = new Request(request.url(), {
    method: request.method(),
    headers: { "content-type": "application/json" },
    body: request.method() === "GET" ? undefined : request.postData() ?? "",
  });
  const response =
    request.method() === "PUT"
      ? await handleChapterPut(incoming, { staff, store, plan })
      : await handleChapterGet({ staff, store, plan });
  await route.fulfill({
    status: response.status,
    contentType: "application/json",
    body: await response.text(),
  });
});
await page.route("**/api/staff/ai-suggest", async (route) => {
  const body = route.request().postDataJSON();
  if (body.mode === "continue") {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, mode: "continue", text: " Browsers paint the page." }),
    });
    return;
  }
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      ok: true,
      mode: "instruct",
      blocks: [
        { kind: "p", html: "<p>The software development cycle is the sequence of work.</p>" },
        { kind: "ol", items: ["<strong>Requirements</strong> — name the work.", "<strong>Design</strong> — choose the structure."] },
      ],
    }),
  });
});

await page.goto(`${base}/book-editor/chapter-1/harness`, { waitUntil: "networkidle" });
await page.getByRole("toolbar", { name: "Formatting" }).waitFor();
const iconLabels = await page.evaluate(() =>
  [...document.querySelectorAll(".book-editor-tool")].map((button) => {
    const label = button.querySelector(".book-editor-tool-label");
    const style = label ? getComputedStyle(label) : null;
    return {
      name: button.getAttribute("aria-label"),
      title: button.getAttribute("title"),
      hidden: Boolean(style && style.position === "absolute" && style.width === "1px"),
    };
  }),
);
for (const name of ["Bold", "Italic", "Bullets", "Numbers"]) {
  const item = iconLabels.find((entry) => entry.name === name);
  assert(item?.hidden, `${name} word is still visible`);
  assert(item.title, `${name} tooltip is missing`);
}
for (const name of ["Code", "Heading", "Link", "Restore"]) {
  const item = iconLabels.find((entry) => entry.name === name);
  assert(item && !item.hidden, `${name} label was removed`);
}
await page.screenshot({ path: "/opt/cursor/artifacts/chapter1-toolbar-icons.png" });
await page.getByRole("link", { name: "Internet" }).first().waitFor();
const embed = page.locator("[data-book-embed='HeadingTags']");
await embed.scrollIntoViewIfNeeded();
await embed.getByText("Heading Tags").waitFor();
await page.screenshot({ path: "/opt/cursor/artifacts/chapter1-toolbar-demo.png" });
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: "/opt/cursor/artifacts/chapter1-toolbar-top.png" });

const document = page.locator(".book-editor-document");
const firstParagraph = document.locator("p").first();
await firstParagraph.click({ position: { x: 4, y: 4 } });
await page.keyboard.type("PILOT-SAVE-MARKER ");
await page.waitForSelector("[data-book-ghost]", { timeout: 5000 });
const ghost = await page.locator("[data-book-ghost]").innerText();
assert(ghost.includes("Browsers paint"), "ghost text missing");
await page.getByRole("status").filter({ hasText: "Saved" }).waitFor({ timeout: 8000 });
const beforeAccept = fs.readFileSync(`${dir}/chapter-1.json`, "utf8");
assert(beforeAccept.includes("PILOT-SAVE-MARKER"), "saved file missed the edit");
assert(!beforeAccept.includes("Browsers paint"), "unaccepted ghost was saved");

await page.keyboard.press("Tab");
await page.getByRole("status").filter({ hasText: "Saved" }).waitFor({ timeout: 8000 });
await page.reload({ waitUntil: "networkidle" });
await page.getByText("PILOT-SAVE-MARKER").waitFor();
await page.getByText("Browsers paint the page.").waitFor();
const outline = await document.evaluate((node) => getComputedStyle(node).outlineStyle);
assert(outline === "none", "editor document has an outline");

await firstParagraph.click({ position: { x: 4, y: 4 } });
await page.keyboard.press("End");
await page.keyboard.type(" [Name the software development cycle and list the steps.]");
await page.getByRole("button", { name: "Insert" }).click();
await page.getByText("The software development cycle is the sequence of work.").waitFor();
await page.getByText("name the work.").waitFor();
await page.getByRole("status").filter({ hasText: "Saved" }).waitFor({ timeout: 8000 });
const saved = fs.readFileSync(`${dir}/chapter-1.json`, "utf8");
assert(saved.includes("orderedList"), "generated list was not saved");
assert(!saved.includes("data-book-ghost"), "ghost marker was serialized");
assert(!saved.includes("data-ai-pending"), "draft marker was serialized");

async function assertStuck(label) {
  await page.evaluate(() => window.scrollTo(0, 1600));
  await page.waitForTimeout(150);
  const boxes = await page.evaluate(() => {
    const header = document.querySelector(".course-site-header")?.getBoundingClientRect();
    const toolbar = document.querySelector(".book-editor-toolbar")?.getBoundingClientRect();
    const covered = document.elementFromPoint((toolbar?.left ?? 0) + 20, (toolbar?.bottom ?? 0) - 6);
    const below = document.elementFromPoint((toolbar?.left ?? 0) + 20, (toolbar?.bottom ?? 0) + 10);
    return {
      headerBottom: header?.bottom ?? null,
      toolbarTop: toolbar?.top ?? null,
      coveredByToolbar: Boolean(covered?.closest(".book-editor-toolbar")),
      belowIsToolbar: Boolean(below?.closest(".book-editor-toolbar")),
    };
  });
  assert(boxes.headerBottom != null && boxes.toolbarTop != null, `${label} header or toolbar is missing`);
  assert(Math.abs(boxes.toolbarTop - boxes.headerBottom) < 3, `${label} toolbar is not under the site header`);
  assert(boxes.coveredByToolbar, `${label} toolbar does not receive hits on its bar`);
  assert(!boxes.belowIsToolbar, `${label} toolbar covers the text below it`);
}

await page.setViewportSize({ width: 1100, height: 800 });
await assertStuck("desktop");
await page.getByRole("button", { name: "Bold" }).focus();
const boldFocused = await page.evaluate(() => document.activeElement?.textContent?.includes("Bold"));
assert(boldFocused, "Bold did not take keyboard focus");
await page.keyboard.press("Tab");
const italicFocused = await page.evaluate(() => document.activeElement?.textContent?.includes("Italic"));
assert(italicFocused, "Tab did not move to Italic");
await page.screenshot({ path: "/opt/cursor/artifacts/chapter1-toolbar-desktop.png" });
await page.screenshot({ path: "/opt/cursor/artifacts/chapter1-toolbar-focus.png" });

await page.setViewportSize({ width: 390, height: 800 });
await assertStuck("narrow");
await page.locator("h1").first().scrollIntoViewIfNeeded();
const narrowHeading = await page.locator("h1").first().boundingBox();
const narrowToolbar = await page.getByRole("toolbar").boundingBox();
assert(
  narrowToolbar && narrowHeading && narrowToolbar.y + narrowToolbar.height <= narrowHeading.y + 2,
  "toolbar overlaps the heading",
);
await page.screenshot({ path: "/opt/cursor/artifacts/chapter1-toolbar-narrow.png" });
await browser.close();
console.log("browser checks passed");
