/**
 * Browser check for the staff inline editor. The model is mocked.
 * Run with the dev server already up:
 *   INLINE_EDIT_HARNESS=1 npx next dev -p 3456
 *   NODE_PATH=/tmp/pw/node_modules node scripts/inline-edit-browser.mjs
 */
import { mkdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const playwrightPath =
  process.env.PLAYWRIGHT_CORE ?? "/tmp/pw/node_modules/playwright-core/index.js";
const playwright = await import(pathToFileURL(playwrightPath).href);
const chromium = playwright.chromium ?? playwright.default.chromium;

const base = process.env.HARNESS_URL ?? "http://localhost:3456/inline-edit/harness";
const outDir = "/opt/cursor/artifacts";
const chrome = process.env.CHROME_PATH ?? "/usr/bin/google-chrome";

const terms = {
  ok: true,
  mode: "instruct",
  blocks: [
    {
      kind: "ul",
      items: [
        "<strong>Internet</strong> — a global network of networks.",
        "<strong>HTML</strong> — the markup language.",
      ],
    },
  ],
};

const termsRetry = {
  ok: true,
  mode: "instruct",
  blocks: [
    {
      kind: "ul",
      items: [
        "<strong>Internet</strong> — the public network.",
        "<code>HTML</code> — markup for pages.",
      ],
    },
  ],
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function start(page) {
  await page.goto(base, { waitUntil: "networkidle" });
  const paragraph = page.locator("[data-src-hash]").first();
  await paragraph.hover();
  await page.getByRole("button", { name: "Edit text" }).click();
  return paragraph;
}

const browser = await chromium.launch({
  executablePath: chrome,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
await mkdir(outDir, { recursive: true });
const context = await browser.newContext({
  viewport: { width: 1100, height: 800 },
});
const page = await context.newPage();
const failures = [];
page.on("pageerror", (error) => failures.push(String(error)));

let instructCalls = 0;
await page.route("**/api/staff/ai-suggest", async (route) => {
  const body = route.request().postDataJSON();
  if (body.mode !== "instruct") {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        mode: body.mode,
        text: body.mode === "continue" ? " Browsers paint the page." : body.text,
      }),
    });
    return;
  }
  instructCalls += 1;
  assert(
    body.instruction === "Create a list of terms introduced in this section",
    "instruction text was not sent",
  );
  assert(String(body.section).includes("Internet"), "section context missing");
  const payload = instructCalls === 1 ? terms : termsRetry;
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(payload),
  });
});

const saves = [];
await page.route("**/api/staff/edit-text", async (route) => {
  if (route.request().method() !== "POST") {
    await route.continue();
    return;
  }
  const body = route.request().postDataJSON();
  saves.push(body);
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ ok: true, mode: "commit", branch: "main" }),
  });
});

try {
  const paragraph = await start(page);
  await page.getByRole("button", { name: "Insert AI instruction" }).click();
  await page.getByRole("group", { name: "AI instruction" }).waitFor();
  assert(
    await page.getByText("AI instruction — not saved").isVisible(),
    "instruction chrome missing",
  );
  await page.getByRole("button", { name: "Generate" }).click();
  await page.locator("[data-ai-output] ul li").nth(1).waitFor();
  const listTag = await page.locator("[data-ai-output] ul").evaluate((node) => node.tagName);
  assert(listTag === "UL", "terms were not a ul");
  assert(
    (await page.locator("[data-ai-output] li strong").first().textContent()) === "Internet",
    "term was not a strong element",
  );
  assert(
    !(await page.locator("[data-ai-output]").innerText()).includes("- **"),
    "markdown bullets were shown as prose",
  );

  await page.getByRole("button", { name: "Retry" }).click();
  await page.getByText("the public network").waitFor();
  const firstItem = page.locator("[data-ai-output] li").first();
  await firstItem.click();
  await page.keyboard.press("Control+A");
  await page.keyboard.type("Internet — a network edited before save.");
  await page.screenshot({ path: `${outDir}/inline-ai-terms-list.png` });

  await page.getByRole("button", { name: "Remove instruction" }).click();
  assert((await page.locator("[data-ai-instruction]").count()) === 0, "instruction remained");
  assert((await page.locator("[data-ai-output] ul li").count()) === 2, "generated list was removed");
  await page.getByRole("button", { name: "Save edit" }).click();
  await page.getByText("committed").waitFor();
  const saved = saves.at(-1);
  const savedJson = JSON.stringify(saved);
  assert(!savedJson.includes("Create a list of terms"), "instruction was serialized");
  assert(!savedJson.includes("AI instruction"), "instruction chrome was serialized");
  assert(!savedJson.includes("data-ai-instruction"), "instruction attribute was serialized");
  assert(saved.remove !== true, "paragraph was removed");
  assert(saved.insertsAfter?.[0]?.kind === "ul", "list was not saved");
  assert(
    saved.insertsAfter[0].items[0].includes("edited before save"),
    "edited term was not saved",
  );
  assert(saved.insertsAfter[0].items[1].includes("<code>HTML</code>"), "code span was dropped");
  assert(/href="\/book\/terms\/internet\/?"/.test(saved.html), "glossary link was dropped");
  assert(saved.html.includes("<code>HTML</code>"), "code in the paragraph was dropped");
  assert(
    (await page.getByText("A following paragraph stays in place.").count()) === 1,
    "neighbor paragraph changed",
  );

  await page.goto(base, { waitUntil: "networkidle" });
  await start(page);
  await page.getByRole("button", { name: "Insert paragraph below" }).click();
  const draft = page.locator("[data-draft-kind='p'] [contenteditable='true']");
  await draft.click();
  await page.keyboard.type("Browsers request pages from servers.");
  await page.screenshot({ path: `${outDir}/inline-insert-paragraph.png` });
  await page.getByRole("button", { name: "Save edit" }).click();
  await page.getByText("committed").waitFor();
  const inserted = saves.at(-1);
  assert(inserted.insertsAfter?.[0]?.kind === "p", "new paragraph was not in the save");
  assert(
    inserted.insertsAfter[0].html.includes("Browsers request pages from servers."),
    "new paragraph text was not saved",
  );
  assert(!JSON.stringify(inserted).includes("Create a list of terms"), "instruction leaked");
  assert(/href="\/book\/terms\/internet\/?"/.test(inserted.html), "link lost while inserting a paragraph");
  assert(
    (await page.getByText("A following paragraph stays in place.").count()) === 1,
    "neighbor missing after insert",
  );

  await page.goto(base, { waitUntil: "networkidle" });
  const removable = await start(page);
  await page.getByRole("button", { name: "Remove paragraph" }).click();
  await page.locator("[data-inline-removed]").waitFor();
  await page.screenshot({ path: `${outDir}/inline-remove-paragraph.png` });
  await page.keyboard.press("Escape");
  assert((await page.locator("[data-inline-removed]").count()) === 0, "cancel did not restore");
  assert(
    (await removable.innerText()).includes("Internet"),
    "cancel dropped the paragraph",
  );

  await start(page);
  await page.getByRole("button", { name: "Remove paragraph" }).click();
  await page.keyboard.press("Control+z");
  assert((await page.locator("[data-inline-removed]").count()) === 0, "undo did not restore");

  await page.getByRole("button", { name: "Remove paragraph" }).click();
  await page.locator("[data-inline-removed]").waitFor();
  await page.getByRole("button", { name: "Save edit" }).click();
  await page.getByText("committed").waitFor();
  const removed = saves.at(-1);
  assert(removed.remove === true, "remove was not saved");
  assert(!JSON.stringify(removed).includes("Create a list of terms"), "instruction leaked on remove");
  assert(
    (await page.getByText("A following paragraph stays in place.").count()) === 1,
    "neighbor removed",
  );

  await page.unroute("**/api/staff/ai-suggest");
  await page.route("**/api/staff/ai-suggest", async (route) => {
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ ok: false, error: "AI suggestions are unavailable: mock" }),
    });
  });
  await page.goto(base, { waitUntil: "networkidle" });
  const safe = await start(page);
  const before = await safe.innerText();
  await page.getByRole("button", { name: "Insert AI instruction" }).click();
  await page.getByRole("button", { name: "Generate" }).click();
  await page.getByText("AI suggestions are unavailable: mock").waitFor();
  assert((await page.locator("[data-ai-output]").count()) === 0, "failed generation inserted content");
  assert((await safe.innerText()) === before, "failed generation changed the paragraph");
  await page.keyboard.press("Escape");
  assert((await page.locator("[data-ai-instruction]").count()) === 0, "cancel left the instruction");
  assert((await safe.innerText()).includes("Internet"), "cancel lost the paragraph");

  await page.goto(base, { waitUntil: "networkidle" });
  const callsBefore = instructCalls;
  await start(page);
  await page.keyboard.type(" Create a list of terms introduced in this section");
  await page.waitForTimeout(800);
  assert(instructCalls === callsBefore, "typing prose called the instruction API");
  await page.getByRole("button", { name: "Save edit" }).click();
  await page.getByText("committed").waitFor();
  const prose = saves.at(-1);
  assert(
    prose.html.includes("Create a list of terms introduced in this section"),
    "typed sentence was not kept as prose",
  );
  assert(!prose.insertsAfter?.length, "prose became a generated list");
  assert(/href="\/book\/terms\/internet\/?"/.test(prose.html), "link lost while typing");

  const unauthSuggest = await page.request.post("http://localhost:3456/api/staff/ai-suggest", {
    data: {
      mode: "instruct",
      instruction: "Create a list of terms introduced in this section",
    },
  });
  assert(unauthSuggest.status() === 401 || unauthSuggest.status() === 403, "suggest allowed anonymous");
  const unauthSave = await page.request.post("http://localhost:3456/api/staff/edit-text", {
    data: {
      file: "app/book/ch1/sections/IntroAndSetup.tsx",
      hash: "aaaaaaaaaaaaaaaaaaaaaaaa",
      html: "Hi",
      remove: true,
    },
  });
  assert(unauthSave.status() === 401 || unauthSave.status() === 403, "save allowed anonymous");

  if (failures.length) throw new Error(failures.join("\n"));
  console.log("browser checks passed");
  console.log("saves", saves.length, "instruct calls", instructCalls);
} finally {
  await context.close();
  await browser.close();
}
