import { describe, it, expect, afterEach } from "vitest";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { buildTargetSite } from "../src/site/buildSite.js";
import { writeCache } from "../src/cache/cache.js";
import { pageSlug } from "../src/report/overlay.js";
import { validateTokenSpec, type TokenSpec } from "../src/schema/tokenSpec.js";
import type { CrawlTarget } from "../src/targets/types.js";
import type { PageReport, ProductReport } from "../src/aggregator/aggregate.js";
import type { ExtractedPage } from "../src/extractor/types.js";

const TEST_KEY = "test-buildsite-target";
const PAGE_URL = "https://example.com/";

const TEST_SPEC: TokenSpec = validateTokenSpec({
  colors: { "brand-primary": "#3366FF" },
  spacing: [4, 8, 16],
  radius: [4, 8],
  fontSize: [12, 16, 24],
  fontFamily: ["Arial", "sans-serif"],
  fontWeight: [400, 700],
});

// Smallest possible valid PNG (1x1, transparent).
const FAKE_PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64");

const REPORTS_ROOT = path.resolve(process.cwd(), "reports", TEST_KEY);
const CACHE_ROOT = path.resolve(process.cwd(), "cache", TEST_KEY);
const SITE_ROOT = path.resolve(process.cwd(), "docs", "reports", TEST_KEY);

afterEach(() => {
  rmSync(REPORTS_ROOT, { recursive: true, force: true });
  rmSync(CACHE_ROOT, { recursive: true, force: true });
  rmSync(SITE_ROOT, { recursive: true, force: true });
});

const target: CrawlTarget = { key: TEST_KEY, label: "Test Buildsite Target", kind: "real-app", urls: [PAGE_URL] };

function writeFixtureReport(pages: PageReport[]): void {
  mkdirSync(REPORTS_ROOT, { recursive: true });
  const report: ProductReport = {
    product: target.label,
    pages,
    score: pages.length > 0 ? pages[0].score : 0,
    breakdown: [],
    worstOffenders: [],
    unstablePages: [],
  };
  writeFileSync(path.join(REPORTS_ROOT, "report.json"), JSON.stringify({ target, report }, null, 2), "utf-8");
}

function writeFixtureCache(extracted: ExtractedPage): void {
  writeCache(TEST_KEY, PAGE_URL, extracted);
}

const scoredPage: PageReport = {
  page: PAGE_URL,
  components: [{ component: "button", instances: [{ component: "button", instanceId: "inst1", score: 40, deviations: [{ property: "color", rawValue: "rgb(0,0,0)", nearestToken: "colors.brand-primary", distance: 10, normalized: 0.5 }] }], score: 40 }],
  score: 40,
  breakdown: [],
  accessibility: [],
};

describe("buildTargetSite", () => {
  it("returns undefined when there's no report.json for this target yet", async () => {
    const result = await buildTargetSite("no-such-target-at-all", () => TEST_SPEC);
    expect(result).toBeUndefined();
  });

  it("copies the original and corrected screenshots as real, readable PNG files (not paths that don't exist)", async () => {
    writeFixtureReport([scoredPage]);
    const cacheDir = CACHE_ROOT;
    mkdirSync(cacheDir, { recursive: true });
    const originalAbs = path.join(cacheDir, "original-fixture.png");
    const correctedAbs = path.join(cacheDir, "corrected-fixture.png");
    writeFileSync(originalAbs, FAKE_PNG);
    writeFileSync(correctedAbs, FAKE_PNG);

    writeFixtureCache({
      page: PAGE_URL,
      elements: [],
      screenshotPath: path.relative(process.cwd(), originalAbs),
      correctedScreenshotPath: path.relative(process.cwd(), correctedAbs),
    });

    await buildTargetSite(TEST_KEY, () => TEST_SPEC);

    const slug = pageSlug(PAGE_URL);
    const originalOut = path.join(SITE_ROOT, slug, "original.png");
    const correctedOut = path.join(SITE_ROOT, slug, "corrected.png");

    expect(existsSync(originalOut)).toBe(true);
    expect(existsSync(correctedOut)).toBe(true);
    expect(readFileSync(originalOut)).toEqual(FAKE_PNG);
    expect(readFileSync(correctedOut)).toEqual(FAKE_PNG);
  });

  it("writes a per-page detail file whose img src actually resolves to a copied file on disk", async () => {
    writeFixtureReport([scoredPage]);
    const cacheDir = CACHE_ROOT;
    mkdirSync(cacheDir, { recursive: true });
    const originalAbs = path.join(cacheDir, "original-fixture.png");
    writeFileSync(originalAbs, FAKE_PNG);
    writeFixtureCache({ page: PAGE_URL, elements: [], screenshotPath: path.relative(process.cwd(), originalAbs) });

    await buildTargetSite(TEST_KEY, () => TEST_SPEC);

    const slug = pageSlug(PAGE_URL);
    const detailDir = path.join(SITE_ROOT, slug);
    const detailHtml = readFileSync(path.join(detailDir, "index.html"), "utf-8");

    expect(detailHtml).toContain('src="original.png"');
    expect(existsSync(path.join(detailDir, "original.png"))).toBe(true);
  });

  it("skips generating a detail page for a scored page with no cached screenshot, and links it as unavailable on the overview", async () => {
    writeFixtureReport([scoredPage]);
    // No cache entry written at all for PAGE_URL.

    const result = await buildTargetSite(TEST_KEY, () => TEST_SPEC);
    expect(result?.pagesBuilt).toBe(0);

    const overviewHtml = readFileSync(path.join(SITE_ROOT, "index.html"), "utf-8");
    expect(overviewHtml).toContain("no visual capture available");
  });

  it("the per-target overview links resolve to real generated page-detail files", async () => {
    writeFixtureReport([scoredPage]);
    const cacheDir = CACHE_ROOT;
    mkdirSync(cacheDir, { recursive: true });
    const originalAbs = path.join(cacheDir, "original-fixture.png");
    writeFileSync(originalAbs, FAKE_PNG);
    writeFixtureCache({ page: PAGE_URL, elements: [], screenshotPath: path.relative(process.cwd(), originalAbs) });

    await buildTargetSite(TEST_KEY, () => TEST_SPEC);

    const overviewHtml = readFileSync(path.join(SITE_ROOT, "index.html"), "utf-8");
    const hrefs = [...overviewHtml.matchAll(/href="([^"]+\/index\.html)"/g)].map((m) => m[1]);
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      const resolved = path.resolve(SITE_ROOT, href);
      expect(existsSync(resolved)).toBe(true);
    }
  });
});
