/**
 * Back-navigation must remount and measure a diagram. Run against a local
 * production server:
 *   DIAGRAM_NAV_URL=http://127.0.0.1:3460 npx tsx --test lib/lectures/diagram-navigation.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

const base = process.env.DIAGRAM_NAV_URL;

async function box(page: { evaluate: (fn: () => unknown) => Promise<unknown> }) {
  return page.evaluate(() => {
    const svg = document.querySelector("article svg");
    if (!(svg instanceof SVGSVGElement)) return null;
    const rect = svg.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }) as Promise<{ width: number; height: number } | null>;
}

describe("diagram back navigation", () => {
  it("shows slide 2's diagram after 1 → 2 → 3 → 2", { skip: !base }, async () => {
    const puppeteer = await import("puppeteer-core");
    const browser = await puppeteer.default.launch({
      executablePath: "/usr/local/bin/google-chrome",
      headless: true,
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });
      const root = `${base}/2026/fall/webdev/slides/local-mongo`;
      await page.goto(`${root}#slide-1`, { waitUntil: "networkidle0" });
      await page.waitForSelector("article", { timeout: 20000 });
      const next = "button[title='Next slide (→)']";
      const prev = "button[title='Previous slide (←)']";
      await page.click(next);
      await page.waitForFunction(() => location.hash === "#slide-2");
      const forward = await box(page);
      assert.ok(forward && forward.width > 20 && forward.height > 20, JSON.stringify(forward));
      await page.click(next);
      await page.waitForFunction(() => location.hash === "#slide-3");
      await page.click(prev);
      await page.waitForFunction(() => location.hash === "#slide-2");
      const back = await box(page);
      assert.ok(back && back.width > 20 && back.height > 20, JSON.stringify(back));
    } finally {
      await browser.close();
    }
  });
});
