import type { PageReport } from "../aggregator/aggregate.js";
import type { CrawlTarget } from "../targets/types.js";
import type { TokenSpec } from "../schema/tokenSpec.js";
import { escapeHtml, OVERLAY_CSS, OVERLAY_SCORE_THRESHOLD, renderOverlayLegend, renderOverlayStage, type OverlayBox } from "../report/overlay.js";
import { humanizeDeviation } from "../report/humanize.js";
import { resolveToken } from "../matchers/resolve.js";

export interface PageFinding {
  kind: "deviation" | "accessibility";
  component: string;
  instanceId: string;
  text: string;
}

/**
 * This page's own findings, gated the same way `buildOverlayBoxes` gates
 * which boxes get drawn (instance score > threshold for deviations,
 * `level === "fail"` for accessibility) — so the findings list on the page
 * and the boxes drawn over the screenshot always agree on what's flagged.
 * Uses the same `humanizeDeviation`/`resolveToken` pairing as the overlay
 * tooltip and the worst-offenders table, just scoped to one page's own
 * instances instead of a product-wide top-N.
 */
export function buildPageFindings(pageReport: PageReport, spec: TokenSpec, threshold = OVERLAY_SCORE_THRESHOLD): PageFinding[] {
  const findings: PageFinding[] = [];

  for (const component of pageReport.components) {
    for (const instance of component.instances) {
      if (instance.score <= threshold) continue;
      for (const deviation of instance.deviations) {
        findings.push({
          kind: "deviation",
          component: instance.component,
          instanceId: instance.instanceId,
          text: humanizeDeviation(deviation, resolveToken(deviation.nearestToken, spec)),
        });
      }
    }
  }

  for (const finding of pageReport.accessibility ?? []) {
    if (finding.level !== "fail") continue;
    findings.push({
      kind: "accessibility",
      component: finding.component,
      instanceId: finding.instanceId,
      text: finding.tieIn ? `${finding.humanReadable} — ${finding.tieIn.humanReadable}` : finding.humanReadable,
    });
  }

  return findings;
}

function findingsList(kind: PageFinding["kind"], findings: PageFinding[]): string {
  const rows = findings.filter((f) => f.kind === kind);
  if (rows.length === 0) {
    return `<p class="empty">No ${kind === "deviation" ? "flagged deviations" : "contrast failures"} on this page.</p>`;
  }
  return `<ul>
${rows.map((f) => `<li><strong>${escapeHtml(f.component)}</strong> #${escapeHtml(f.instanceId)} — ${escapeHtml(f.text)}</li>`).join("\n")}
</ul>`;
}

const TAB_SCRIPT = `
document.querySelectorAll(".tab-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.remove("active"); });
    document.querySelectorAll(".tab-panel").forEach(function (p) { p.classList.remove("active"); });
    btn.classList.add("active");
    document.getElementById("tab-" + btn.getAttribute("data-tab")).classList.add("active");
  });
});
`;

/**
 * Renders docs/reports/<target-key>/<page-slug>/index.html: a tabbed
 * comparison ("what it looks like" — the original screenshot with overlay
 * boxes drawn on top, reusing the same overlay data/rendering as
 * report.html — versus "what it should have been" — the corrected render,
 * plain) plus this page's own findings list, scoped to just this page
 * instead of concatenated across the whole target. Both `original.png` and
 * `corrected.png` are plain relative `<img src>` references to real files
 * sitting alongside this HTML file (see buildSite.ts), not embedded data
 * URIs — unlike report.html/the standalone overlay, this output lives
 * permanently on the hosted site rather than needing to be a single
 * portable file.
 */
export function renderPageDetailHtml(target: CrawlTarget, pageReport: PageReport, boxes: OverlayBox[], findings: PageFinding[], spec: TokenSpec, hasCorrected: boolean): string {
  const deviationCount = findings.filter((f) => f.kind === "deviation").length;
  const accessibilityCount = findings.filter((f) => f.kind === "accessibility").length;

  const correctedTab = hasCorrected
    ? `<img src="corrected.png" alt="corrected render of ${escapeHtml(pageReport.page)}">`
    : `<p class="empty">No corrected render was captured for this page.</p>`;

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${escapeHtml(pageReport.page)} - ${escapeHtml(target.label)}</title>
<style>
  body { margin: 0; font-family: system-ui, sans-serif; background: #1a1a1a; color: #eee; }
  nav { padding: 12px 24px; font-size: 13px; color: #999; border-bottom: 1px solid #333; }
  nav a { color: #7aa2f7; text-decoration: none; }
  nav a:hover { text-decoration: underline; }
  header { padding: 16px 24px; }
  h1 { margin: 0 0 4px; font-size: 1.2em; word-break: break-all; }
  .score { color: #ccc; font-size: 14px; }
  .tabs { display: flex; gap: 4px; padding: 0 24px; border-bottom: 1px solid #333; }
  .tab-btn { background: none; border: none; color: #999; padding: 10px 16px; cursor: pointer; font-size: 14px; border-bottom: 2px solid transparent; }
  .tab-btn.active { color: #eee; border-bottom-color: #7aa2f7; }
  .tab-panel { display: none; padding: 24px; overflow: auto; }
  .tab-panel.active { display: block; }
  .tab-panel img { max-width: 100%; display: block; }
  .findings { padding: 0 24px 32px; }
  .findings h2 { font-size: 1em; color: #ccc; }
  .findings ul { padding-left: 20px; margin: 0 0 24px; }
  .findings li { margin-bottom: 8px; font-size: 14px; }
  .empty { color: #999; font-style: italic; }
${OVERLAY_CSS}
</style>
</head>
<body>
<nav><a href="../../../index.html">Specular</a> / <a href="../index.html">${escapeHtml(target.label)}</a> / this page</nav>
<header>
<h1>${escapeHtml(pageReport.page)}</h1>
<div class="score">page score: ${pageReport.score.toFixed(1)} — ${deviationCount} flagged deviation${deviationCount === 1 ? "" : "s"}, ${accessibilityCount} contrast failure${accessibilityCount === 1 ? "" : "s"}</div>
</header>
<div class="tabs">
  <button class="tab-btn active" data-tab="looks" type="button">What it looks like</button>
  <button class="tab-btn" data-tab="should" type="button">What it should have been</button>
</div>
<div id="tab-looks" class="tab-panel active">
${renderOverlayLegend(pageReport.page, boxes)}
${renderOverlayStage("original.png", boxes, spec)}
</div>
<div id="tab-should" class="tab-panel">
${correctedTab}
</div>
<main class="findings">
<h2>Flagged deviations on this page</h2>
${findingsList("deviation", findings)}
<h2>Contrast failures on this page</h2>
${findingsList("accessibility", findings)}
</main>
<script>${TAB_SCRIPT}</script>
</body>
</html>
`;
}
