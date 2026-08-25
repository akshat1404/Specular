import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { registry } from "../targets/registry.js";
import { readCache } from "../cache/cache.js";
import { buildOverlayBoxes, pageSlug } from "../report/overlay.js";
import { buildPageFindings, renderPageDetailHtml } from "./pageDetail.js";
import { renderTargetOverviewHtml } from "./targetOverview.js";
import type { CrawlTarget } from "../targets/types.js";
import type { ProductReport } from "../aggregator/aggregate.js";
import type { TokenAdapter } from "../adapters/types.js";

const REPORTS_ROOT = path.resolve(process.cwd(), "reports");
const SITE_REPORTS_ROOT = path.resolve(process.cwd(), "docs", "reports");

interface ReportJson {
  target: CrawlTarget;
  report: ProductReport;
}

function loadReportJson(targetKey: string): ReportJson | undefined {
  const file = path.join(REPORTS_ROOT, targetKey, "report.json");
  if (!existsSync(file)) return undefined;
  return JSON.parse(readFileSync(file, "utf-8")) as ReportJson;
}

export interface BuildTargetSiteResult {
  pagesBuilt: number;
}

/**
 * Builds docs/reports/<target-key>/ — the hosted-site counterpart to
 * reports/<target-key>/report.html: a per-target overview page plus one
 * tabbed detail page per crawled page that actually has a cached
 * screenshot, all served as plain files (real .png assets copied out of
 * the cache, not embedded data URIs) so GitHub Pages can serve them
 * directly with no build step of its own. Reads what runCrawlTarget
 * already wrote (reports/<key>/report.json) and cached (cache/<key>/) —
 * same "no re-crawling" reasoning as summaryPdf.ts. Returns undefined
 * (rather than throwing) when there's no report.json yet for this target,
 * so the caller can skip it with a clear message instead of the whole run
 * failing because one target hasn't been validated yet.
 */
export async function buildTargetSite(targetKey: string, adapter: TokenAdapter): Promise<BuildTargetSiteResult | undefined> {
  const data = loadReportJson(targetKey);
  if (!data) return undefined;
  const { target, report } = data;
  const spec = await adapter();

  const targetDir = path.join(SITE_REPORTS_ROOT, targetKey);
  mkdirSync(targetDir, { recursive: true });

  const generatedSlugs = new Map<string, string>();
  for (const pageReport of report.pages) {
    const extracted = readCache(targetKey, pageReport.page);
    if (!extracted?.screenshotPath) continue;

    const screenshotAbsPath = path.resolve(process.cwd(), extracted.screenshotPath);
    if (!existsSync(screenshotAbsPath)) continue;

    const slug = pageSlug(pageReport.page);
    const pageDir = path.join(targetDir, slug);
    mkdirSync(pageDir, { recursive: true });

    copyFileSync(screenshotAbsPath, path.join(pageDir, "original.png"));

    const correctedAbsPath = extracted.correctedScreenshotPath ? path.resolve(process.cwd(), extracted.correctedScreenshotPath) : undefined;
    const hasCorrected = !!correctedAbsPath && existsSync(correctedAbsPath);
    if (hasCorrected) copyFileSync(correctedAbsPath!, path.join(pageDir, "corrected.png"));

    const boxes = buildOverlayBoxes(extracted, pageReport);
    const findings = buildPageFindings(pageReport, spec);
    writeFileSync(path.join(pageDir, "index.html"), renderPageDetailHtml(target, pageReport, boxes, findings, spec, hasCorrected), "utf-8");
    generatedSlugs.set(pageReport.page, slug);
  }

  writeFileSync(path.join(targetDir, "index.html"), renderTargetOverviewHtml(target, report, generatedSlugs), "utf-8");
  return { pagesBuilt: generatedSlugs.size };
}

/**
 * Deliberately its own step, not part of validate.ts's default path — same
 * reasoning as summary-pdf being opt-in: not every run needs the hosted
 * site rebuilt, and this reads report.json/cache/ that validate.ts must
 * already have produced for every target it touches.
 */
export async function buildSite(): Promise<void> {
  for (const { target, adapter } of registry) {
    console.log(`\n=== ${target.label} (${target.key}) ===`);
    const result = await buildTargetSite(target.key, adapter);
    if (!result) {
      console.log(`  skip: no reports/${target.key}/report.json — run "npm run validate -- --target=${target.key}" first`);
      continue;
    }
    console.log(`  built docs/reports/${target.key}/ (${result.pagesBuilt} page${result.pagesBuilt === 1 ? "" : "s"})`);
  }
}

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  buildSite().catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
