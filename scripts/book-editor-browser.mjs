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
await page.getByRole("link", { name: "Internet" }).first().waitFor();
const embed = page.locator("[data-book-embed='HeadingTags']");
await embed.scrollIntoViewIfNeeded();
await embed.getByText("Heading Tags").waitFor();
await page.screenshot({ path: "/opt/cursor/artifacts/chapter1-editor-demo.png" });
await page.locator("h1").first().scrollIntoViewIfNeeded();
await page.screenshot({ path: "/opt/cursor/artifacts/chapter1-editor-desktop.png" });

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

await page.setViewportSize({ width: 390, height: 800 });
await page.locator(".book-editor-toolbar").scrollIntoViewIfNeeded();
const toolbar = await page.getByRole("toolbar").boundingBox();
const heading = await page.locator("h1").first().boundingBox();
assert(toolbar && heading && toolbar.y + toolbar.height <= heading.y + 2, "toolbar overlaps the heading");
await page.screenshot({ path: "/opt/cursor/artifacts/chapter1-editor-narrow.png" });
await page.screenshot({ path: "/opt/cursor/artifacts/chapter1-editor-saved.png", fullPage: false });
await browser.close();
console.log("browser checks passed");
