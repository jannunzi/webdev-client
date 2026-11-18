import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { fitBulletScale } from "./bullet-fit.ts";
import { listLectureSlugs } from "./catalog.ts";

describe("bullet fit scale", () => {
  it("stays at the standard size when the slide already fits", () => {
    assert.equal(fitBulletScale(() => false), 1);
  });

  it("shrinks only until the slide fits", () => {
    const scale = fitBulletScale((value) => value > 0.8);
    assert.ok(scale <= 0.8, String(scale));
    assert.ok(scale > 0.7, String(scale));
  });

  it("stops at the floor when even the smallest size overflows", () => {
    assert.equal(fitBulletScale(() => true), 0.7);
  });
});

const base = process.env.BULLET_FONT_URL;

describe("bullet font size at 1280x800", { skip: !base }, () => {
  it("uses the standard size unless code or a diagram needs the room", async () => {
    const puppeteer = await import("puppeteer-core");
    const browser = await puppeteer.default.launch({
      executablePath: "/usr/local/bin/google-chrome",
      headless: true,
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });
    const shrunk: { slide: string; scale: string; reason: string; px: number }[] = [];
    const offenders: string[] = [];
    let standardPx = 0;
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });
      const measure = async (slug: string, index: number) => {
        return page.evaluate(
          (slideIndex) => {
            const article = document.querySelector("article");
            const bullets = article?.querySelector(".lecture-slide-bullets");
            if (!(article instanceof HTMLElement) || !(bullets instanceof HTMLElement)) {
              return null;
            }
            const px = Number.parseFloat(getComputedStyle(bullets).fontSize);
            return {
              px,
              scale: article.dataset.bulletFit ?? "",
              reason: article.dataset.bulletFitReason ?? "",
              overflow: article.scrollHeight - article.clientHeight,
              id: slideIndex,
            };
          },
          index,
        );
      };

      await page.goto(`${base}/2026/fall/webdev/slides/intro-to-web-development#slide-2`, {
        waitUntil: "networkidle0",
      });
      await page.waitForSelector(".lecture-slide-bullets");
      const standard = await measure("intro-to-web-development", 1);
      assert.ok(standard, "standard slide has bullets");
      assert.equal(standard.reason, "standard");
      standardPx = standard.px;

      for (const slug of listLectureSlugs()) {
        await page.goto(`${base}/2026/fall/webdev/slides/${slug}#slide-1`, {
          waitUntil: "domcontentloaded",
        });
        await page.waitForSelector('nav[aria-label="Slides"] button');
        await page.waitForFunction(() =>
          Boolean(document.querySelector("article")?.getAttribute("data-bullet-fit")),
        );
        const count = await page.evaluate(
          () => document.querySelectorAll('nav[aria-label="Slides"] button').length,
        );
        for (let n = 1; n <= count; n += 1) {
          if (n > 1) {
            await page.click(`button[aria-label^="Go to slide ${n}:"]`);
            await page.waitForFunction(
              (slideNumber) => {
                const live = document.querySelector("[aria-live='polite']");
                return live?.textContent?.trim().startsWith(`${slideNumber} /`) ?? false;
              },
              {},
              n,
            );
          }
          await page.waitForFunction(() => {
            const article = document.querySelector("article");
            if (!(article instanceof HTMLElement) || !article.dataset.bulletFit) return false;
            const scale = Number(article.dataset.bulletFit);
            const overflow = article.scrollHeight - article.clientHeight;
            if (article.dataset.bulletFitReason === "standard") return true;
            return overflow <= 2 || scale <= 0.7;
          });
          const row = await measure(slug, n);
          if (!row) continue;
          const label = `${slug}#slide-${n}`;
          if (row.reason === "standard") {
            if (Math.abs(row.px - standardPx) > 1) {
              offenders.push(`${label} is ${row.px}px, standard is ${standardPx}px`);
            }
          } else {
            if (!(row.px < standardPx - 0.5)) {
              offenders.push(`${label} is marked ${row.reason} but stays at ${row.px}px`);
            }
            if (row.overflow > 2 && Number(row.scale) > 0.7) {
              offenders.push(`${label} shrank to ${row.scale} and still overflows by ${row.overflow}px`);
            }
            shrunk.push({ slide: label, scale: row.scale, reason: row.reason, px: row.px });
          }
        }
      }

      await page.goto(`${base}/2026/fall/webdev/slides/mongoose?fullscreen=1#slide-7`, {
        waitUntil: "networkidle0",
      });
      await page.waitForFunction(() => document.body.innerText.includes("required: true"));
      const present = await measure("mongoose", 7);
      assert.ok(present);
      assert.equal(present.reason, "standard", "mongoose slide 7 has no code or diagram");
      assert.ok(Math.abs(present.px - standardPx) <= 1);
    } finally {
      await browser.close();
    }

    console.log(JSON.stringify({ standardPx, shrunk }, null, 2));
    assert.deepEqual(offenders, []);
    console.log("SLIDES_THAT_SHRINK");
    for (const row of shrunk) {
      console.log(`${row.slide}\t${row.scale}\t${row.reason}\t${row.px}`);
    }
  });
});
