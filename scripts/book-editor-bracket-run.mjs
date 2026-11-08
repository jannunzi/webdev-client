/**
 * Mobile bracket-run check. The model is mocked. Chrome viewports stand in
 * for a phone; this is not a physical device and not a live model call.
 */
import { pathToFileURL } from "node:url";
import { mkdir } from "node:fs/promises";
import fs from "node:fs";

const playwright = await import(
  pathToFileURL(process.env.PLAYWRIGHT_CORE ?? "/tmp/pw/node_modules/playwright-core/index.js").href
);
const chromium = playwright.chromium ?? playwright.default.chromium;
const base = process.env.HARNESS_URL ?? "http://localhost:3457";
const { createFileStore, localStoreDir, storagePlan } = await import("../lib/book-editor/store.ts");
const { handleChapterGet, handleChapterPut } = await import("../lib/book-editor/handle.ts");

const dir = localStoreDir();
fs.rmSync(dir, { recursive: true, force: true });
const store = createFileStore(dir);
const plan = storagePlan({ NODE_ENV: "development" });
const staff = { email: "jannunzi@gmail.com" };
let instructCalls = 0;
let continueCalls = 0;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
await mkdir("/opt/cursor/artifacts", { recursive: true });
const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });

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
  if (body.mode === "improve") {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, mode: "improve", text: "Clearer wording" }),
    });
    return;
  }
  if (body.mode === "continue") {
    continueCalls += 1;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, mode: "continue", text: " Browsers paint the page." }),
    });
    return;
  }
  instructCalls += 1;
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      ok: true,
      mode: "instruct",
      blocks: [
        { kind: "p", html: "<p>Pancakes start with a batter.</p>" },
        { kind: "ul", items: ["Mix the batter.", "Heat the pan."] },
      ],
    }),
  });
});

async function typeCommand() {
  const paragraph = page.locator(".book-editor-document p").first();
  await paragraph.click({ position: { x: 8, y: 8 } });
  await page.keyboard.press("Home");
  await page.keyboard.press("Enter");
  await page.keyboard.press("ArrowUp");
  await page.keyboard.type("[make a list of how to make pancakes]");
}

await page.goto(`${base}/book-editor/chapter-1/harness`, { waitUntil: "networkidle" });
await page.getByRole("toolbar", { name: "Formatting" }).waitFor();
assert((await page.getByRole("textbox", { name: "Instruction" }).count()) === 0, "instruction field is still present");
await page.getByText("Type [an instruction] in the text, then tap the checkmark.").waitFor();
await page.screenshot({ path: "/opt/cursor/artifacts/chapter1-no-instruction-field.png" });
const improveTarget = page.locator(".book-editor-document p").first();
await improveTarget.click({ position: { x: 12, y: 8 } });
await page.keyboard.press("Home");
await page.keyboard.down("Shift");
await page.keyboard.press("ArrowRight");
await page.keyboard.press("ArrowRight");
await page.keyboard.up("Shift");
await page.getByRole("button", { name: "Improve" }).click();
await page.getByRole("button", { name: "Accept suggestion" }).click();
await page.getByText("Clearer wording").waitFor();

for (const width of [1100, 390, 320]) {
  await page.setViewportSize({ width, height: 800 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await typeCommand();
  const run = page.getByRole("button", { name: "Run bracket instruction" });
  await run.waitFor();
  await page.waitForTimeout(900);
  assert((await page.locator("[data-book-ghost]").count()) === 0, `ghost appeared inside brackets at ${width}px`);
  const box = await run.boundingBox();
  assert(box && box.width >= 40 && box.height >= 40, `checkmark is too small at ${width}px`);
  const coversNextLine = await page.evaluate(({ x, y }) => {
    const below = document.elementFromPoint(x, y);
    return Boolean(below?.closest("[data-bracket-run]"));
  }, { x: box.x + 8, y: box.y + box.height + 8 });
  assert(!coversNextLine, `checkmark covers the next line at ${width}px`);
  if (width === 390 || width === 320) {
    await page.screenshot({ path: `/opt/cursor/artifacts/chapter1-bracket-checkmark-${width}.png` });
  }
  if (width !== 320) {
    await page.keyboard.press("Home");
    await page.keyboard.down("Shift");
    await page.keyboard.press("End");
    await page.keyboard.up("Shift");
    await page.keyboard.press("Backspace");
  }
}

await page.setViewportSize({ width: 390, height: 800 });
const before = continueCalls;
await page.getByRole("button", { name: "Run bracket instruction" }).click();
await page.getByText("Mix the batter.").waitFor({ timeout: 8000 });
await page.getByText("Heat the pan.").waitFor();
assert(instructCalls === 1, `checkmark ran ${instructCalls} times`);
await page.waitForTimeout(300);
assert(instructCalls === 1, "checkmark ran twice");
const saved = fs.readFileSync(`${dir}/chapter-1.json`, "utf8");
assert(!saved.includes("data-book-ghost") && !saved.includes("data-bracket-run"), "ghost or run control was saved");
assert(!saved.includes("Run bracket instruction"), "checkmark label was saved");

await page.getByText("Dr. Jose Annunziato").click();
await page.keyboard.type(" [1] ");
await page.waitForTimeout(400);
assert((await page.getByRole("button", { name: "Run bracket instruction" }).count()) === 0, "citation showed a run control");
await page.keyboard.press("End");
await page.keyboard.press("ArrowRight");
await page.keyboard.type(" Hello");
await page.waitForSelector("[data-book-ghost]", { timeout: 4000 });
assert(continueCalls > before, "autocomplete did not resume outside the command");

await browser.close();
console.log("bracket run checks passed", { instructCalls, continueCalls, mocked: true });
