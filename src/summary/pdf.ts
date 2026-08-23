import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import path from "node:path";
import type { CrawlTarget } from "../targets/types.js";
import type { ProductReport } from "../aggregator/aggregate.js";
import type { ExtractedPage } from "../extractor/types.js";
import { selectTopFindings } from "./rank.js";
import { renderSummaryHtml, screenshotDataUriFor } from "./render.js";

/**
 * Renders the one-page HTML summary and exports it via Playwright's own
 * `page.pdf()` — Playwright's already a dependency for exactly this kind
 * of rendering, so this avoids pulling in a separate PDF library.
 *
 * A distinct, explicit step from the crawl/score/report pipeline
 * (runCrawlTarget.ts): takes an already-produced `report` and its
 * `extractedByUrl` cache data, does no crawling of its own. See
 * src/summaryPdf.ts for the CLI that wires this up as an on-demand,
 * separate command.
 */
export async function generateSummaryPdf(target: CrawlTarget, report: ProductReport, extractedByUrl: Map<string, ExtractedPage>, outPath: string): Promise<void> {
  const findings = selectTopFindings(report, extractedByUrl);

  const screenshotsByPage = new Map<string, string>();
  for (const [url, extracted] of extractedByUrl) {
    const dataUri = screenshotDataUriFor(extracted);
    if (dataUri) screenshotsByPage.set(url, dataUri);
  }

  const html = renderSummaryHtml(target, report, findings, screenshotsByPage);

  mkdirSync(path.dirname(outPath), { recursive: true });
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    await page.pdf({ path: outPath, format: "A4", printBackground: true, margin: { top: "0", bottom: "0", left: "0", right: "0" } });
  } finally {
    await browser.close();
  }
}
