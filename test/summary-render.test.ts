import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { chromium, type Browser } from "playwright";
import { renderSummaryHtml, THUMB_WIDTH, THUMB_HEIGHT } from "../src/summary/render.js";
import type { RankedFinding } from "../src/summary/rank.js";
import type { ProductReport } from "../src/aggregator/aggregate.js";
import type { CrawlTarget } from "../src/targets/types.js";

/**
 * Real-browser verification that the crop thumbnail's edge mask actually
 * softens *text* specifically, not just a solid-color/shape proxy (the two
 * behave very differently — see render.ts's own comment on the mask CSS
 * for the investigation that found this: a plain lime-background probe
 * confirmed the mask mechanism fades *something*, but text sitting a few
 * px inside the fade band was still measured at full, unfaded contrast).
 * Renders the real `renderSummaryHtml` output (not a hand-rolled markup
 * fragment) so the actual shipped CSS is what's under test.
 */

const TARGET: CrawlTarget = { key: "t", label: "Test Target", kind: "real-app", urls: [] };
const EMPTY_REPORT: ProductReport = { product: "t", pages: [], score: 0, breakdown: [], worstOffenders: [], unstablePages: [] };
const PAGE_URL = "https://example.com/";

// Vertical center (in the *source* screenshot's own coordinates) of one
// line of real rendered text — see beforeAll.
const SOURCE_TEXT_CENTER_Y = 100;

function finding(position: { x: number; y: number; width: number; height: number }): RankedFinding {
  return {
    kind: "deviation",
    colorKey: "color",
    page: PAGE_URL,
    component: "text",
    instanceId: "inst1",
    humanReadable: "off-brand text color",
    score: 1,
    position,
  };
}

/**
 * A `position` whose center, once run through the same
 * center-in-the-thumbnail crop math `renderThumbnail` uses, places
 * `SOURCE_TEXT_CENTER_Y` at `desiredThumbY` in the rendered thumbnail.
 * Inverse of `cropOffsetFor` (src/summary/render.ts) — kept independent
 * here (not imported) so the test isn't just asserting the implementation
 * agrees with itself; both are simple enough to verify by hand
 * (`thumbY = sourceY + top`, `top = -(centerY - THUMB_HEIGHT/2)`).
 */
function positionForThumbY(desiredThumbY: number): { x: number; y: number; width: number; height: number } {
  const height = 10;
  const centerY = SOURCE_TEXT_CENTER_Y + THUMB_HEIGHT / 2 - desiredThumbY;
  return { x: 0, y: centerY - height / 2, width: 10, height };
}

/** Darkest pixel (lowest r+g+b average) anywhere in a rendered PNG buffer. */
async function darkestPixel(browser: Browser, pngBuffer: Buffer): Promise<number> {
  const page = await browser.newPage();
  await page.setContent(`<img id="s" src="data:image/png;base64,${pngBuffer.toString("base64")}">`);
  const minLum = await page.evaluate(async () => {
    const img = document.getElementById("s") as HTMLImageElement;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let min = 255;
    for (let i = 0; i < data.length; i += 4) {
      const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (lum < min) min = lum;
    }
    return min;
  });
  await page.close();
  return minLum;
}

describe("thumbnail crop mask on real text (not a solid-color proxy)", () => {
  let browser: Browser;
  let sourceDataUri: string;

  beforeAll(async () => {
    browser = await chromium.launch();
    // One line of real black text on white, rendered by an actual browser
    // (not synthesized) so glyph antialiasing is genuine, not simulated.
    const srcPage = await browser.newPage({ viewport: { width: 1000, height: 300 } });
    await srcPage.setContent(
      `<!doctype html><html><body style="margin:0;background:white;">` +
        `<div style="position:absolute;left:0;top:${SOURCE_TEXT_CENTER_Y - 16}px;font:32px/1 Arial, sans-serif;color:black;white-space:nowrap;">Some genuinely real text here</div>` +
        `</body></html>`,
      { waitUntil: "load" }
    );
    const buf = await srcPage.screenshot();
    sourceDataUri = `data:image/png;base64,${buf.toString("base64")}`;
    await srcPage.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  async function renderThumbBuffer(position: { x: number; y: number; width: number; height: number }): Promise<Buffer> {
    const html = renderSummaryHtml(TARGET, EMPTY_REPORT, [finding(position)], new Map([[PAGE_URL, sourceDataUri]]));
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    const buf = await page.locator(".thumb").screenshot();
    await page.close();
    return buf;
  }

  it(
    "lightens real text ink sitting inside the edge fade band, compared to the same ink safely in the opaque center",
    async () => {
      // Text cropped near the thumbnail's top edge (inside the fade band) vs.
      // the same text cropped so it lands in the fully-opaque middle instead.
      const nearEdgeBuf = await renderThumbBuffer(positionForThumbY(15));
      const centeredBuf = await renderThumbBuffer(positionForThumbY(THUMB_HEIGHT / 2));

      // The darkest pixel anywhere in each render is genuinely the text's
      // own ink, not background/border noise: the thumb's border color (a
      // saturated category accent, e.g. #e53e3e) never reads anywhere near
      // as dark as real black text does.
      const nearEdgeDarkest = await darkestPixel(browser, nearEdgeBuf);
      const centeredDarkest = await darkestPixel(browser, centeredBuf);

      // The centered control should show real, essentially-unfaded ink
      // (dark, close to true black) - confirms the fixture itself is sound.
      expect(centeredDarkest).toBeLessThan(30);

      // The near-edge case's darkest ink pixel should read measurably
      // lighter than the centered control's - not just nonzero, a real,
      // visible lift toward the background. This is the exact case the
      // original bug report was about: a plain-linear, narrow fade band
      // left real text pixels within it still reading as full-strength,
      // unfaded ink (see render.ts's mask-CSS comment).
      expect(nearEdgeDarkest).toBeGreaterThan(centeredDarkest + 25);
    }
  );
});
