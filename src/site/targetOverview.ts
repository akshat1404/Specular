import type { CrawlTarget } from "../targets/types.js";
import type { ProductReport } from "../aggregator/aggregate.js";
import type { ExtractedPage } from "../extractor/types.js";
import { escapeHtml } from "../report/overlay.js";
import { renderAccessibilitySection, renderBreakdownTable, renderUnverifiedBanner } from "../report/standalone.js";

function scoreLine(report: ProductReport): string {
  return report.pages.length === 0
    ? "Score: N/A — every crawled page was excluded as unstable, there is no data to score."
    : `Score: ${report.score.toFixed(1)} / 100 — 0 is fully on-spec, 100 is maximally deviant.`;
}

/**
 * `generatedSlugs` maps a page URL to the slug of its detail page directory
 * (see buildSite.ts) — only pages that actually got a detail page (i.e. had
 * a cached screenshot) get a link; the rest are still listed, just without
 * one, same as `writePageOverlays` skipping pages with no screenshot.
 */
function pageLinksList(report: ProductReport, generatedSlugs: Map<string, string>): string {
  const rows = report.pages.map((p) => {
    const slug = generatedSlugs.get(p.page);
    if (!slug) return `<li>${escapeHtml(p.page)} — <span class="empty">no visual capture available</span></li>`;
    return `<li><a href="${slug}/index.html">${escapeHtml(p.page)}</a> — score ${p.score.toFixed(1)}</li>`;
  });
  return `<ul>
${rows.join("\n")}
</ul>`;
}

/**
 * Renders docs/reports/<target-key>/index.html: the page someone lands on
 * first after following a link from the landing page — score, accessibility
 * pass/fail, the breakdown-by-property table (the same renderer report.html
 * already uses, reused as-is), and a link to every crawled page's tabbed
 * detail view. Deliberately short: this is the entry point, not another
 * wall of concatenated content.
 */
export function renderTargetOverviewHtml(
  target: CrawlTarget,
  report: ProductReport,
  generatedSlugs: Map<string, string>,
  extractedByUrl: Map<string, ExtractedPage>,
  hasSummaryPdf = false
): string {
  const summaryPdfLink = hasSummaryPdf ? `<a href="summary.pdf">executive summary (PDF)</a>` : "";
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${escapeHtml(target.label)} - design drift report</title>
<style>
  body { margin: 0; font-family: system-ui, sans-serif; background: #1a1a1a; color: #eee; }
  nav { padding: 12px 24px; font-size: 13px; color: #999; border-bottom: 1px solid #333; }
  nav a { color: #7aa2f7; text-decoration: none; }
  nav a:hover { text-decoration: underline; }
  header { padding: 24px; border-bottom: 1px solid #333; }
  h1 { margin: 0 0 8px; }
  .score { font-size: 1.2em; }
  main { padding: 24px; }
  table { border-collapse: collapse; width: 100%; margin-bottom: 32px; }
  th, td { border: 1px solid #333; padding: 6px 10px; text-align: left; font-size: 13px; vertical-align: top; }
  th { background: #222; }
  .unverified-banner { margin: 16px 24px 0; padding: 12px 16px; background: #4a2e00; border: 2px solid #d9822b; border-radius: 4px; color: #ffd8a8; font-size: 14px; }
  .a11y-note { color: #999; font-size: 13px; max-width: 70ch; }
  section.pages ul { padding-left: 20px; }
  section.pages li { margin-bottom: 6px; font-size: 14px; }
  .empty { color: #999; font-style: italic; }
  .pdf-link { margin-top: 12px; font-size: 13px; }
  .pdf-link a { color: #7aa2f7; }
</style>
</head>
<body>
<nav><a href="../../index.html">Specular</a> / ${escapeHtml(target.label)}</nav>
<header>
<h1>${escapeHtml(target.label)} (${escapeHtml(target.kind)})</h1>
<div class="score">${scoreLine(report)}</div>
${summaryPdfLink ? `<div class="pdf-link">${summaryPdfLink}</div>` : ""}
</header>
${renderUnverifiedBanner(target)}
<main>
${renderBreakdownTable(report)}
${renderAccessibilitySection(report, extractedByUrl)}
<section class="pages">
<h2>Pages</h2>
${pageLinksList(report, generatedSlugs)}
</section>
</main>
</body>
</html>
`;
}
