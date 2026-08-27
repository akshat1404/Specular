import { readFileSync } from "node:fs";
import path from "node:path";
import type { ProductReport } from "../aggregator/aggregate.js";
import type { CrawlTarget } from "../targets/types.js";
import type { ExtractedPage } from "../extractor/types.js";
import { CATEGORY_COLORS, ACCESSIBILITY_COLOR, escapeHtml } from "../report/overlay.js";
import type { RankedFinding } from "./rank.js";

/** Fixed thumbnail viewport — small enough to stay a supporting visual, not a second overlay. */
const THUMB_WIDTH = 220;
const THUMB_HEIGHT = 140;

function colorFor(finding: RankedFinding): string {
  return finding.colorKey === "accessibility" ? ACCESSIBILITY_COLOR : CATEGORY_COLORS[finding.colorKey];
}

/**
 * A small cropped/zoomed view of the finding's element, built entirely in
 * CSS from the *same full-page screenshot* the overlay already embeds —
 * translating a fixed-size, overflow-hidden viewport so the element's
 * bounding box (in the same page-relative CSS px `Position` the overlay
 * positions its boxes with — see extractor/types.ts) sits centered in it.
 * No image-cropping library, no new dependency: just the CSS positioning
 * trick the overlay already relies on for 1:1 screenshot/Position
 * alignment, applied through a small window instead of the full image.
 * Returns "" (no thumbnail) rather than forcing one when there's no
 * position or no screenshot to crop from — a missing thumbnail is fine, a
 * blank/misleading one isn't.
 */
function renderThumbnail(finding: RankedFinding, screenshotDataUri: string | undefined): string {
  if (!finding.position || !screenshotDataUri) return "";
  const { x, y, width, height } = finding.position;
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const left = -(centerX - THUMB_WIDTH / 2);
  const top = -(centerY - THUMB_HEIGHT / 2);

  return `<div class="thumb" style="border-color:${colorFor(finding)}">
  <div class="thumb-mask">
    <img src="${screenshotDataUri}" style="left:${left}px;top:${top}px;" alt="">
  </div>
</div>`;
}

function findingRow(finding: RankedFinding, index: number, screenshotDataUri: string | undefined): string {
  const thumb = renderThumbnail(finding, screenshotDataUri);
  return `<div class="finding">
  <div class="finding-marker" style="background:${colorFor(finding)}">${index + 1}</div>
  <div class="finding-body">
    <p class="finding-text">${escapeHtml(finding.humanReadable)}</p>
    <p class="finding-meta">${escapeHtml(finding.component)} on ${escapeHtml(finding.page)}</p>
  </div>
  ${thumb}
</div>`;
}

const STYLE = `
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: #ffffff;
    color: #1a1a2e;
    font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
  }
  .page { padding: 48px 56px; }
  .kicker { font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: #8a8fa3; margin: 0 0 4px; }
  h1 { font-size: 28px; margin: 0 0 32px; color: #1a1a2e; }
  .headline-row { display: flex; gap: 40px; margin-bottom: 8px; }
  .headline { flex: 1; }
  .headline-number { font-size: 56px; font-weight: 700; line-height: 1; margin: 0; }
  .headline-label { font-size: 14px; color: #5a5f73; margin: 8px 0 0; }
  .headline-context { font-size: 12px; color: #8a8fa3; margin: 40px 0 32px; max-width: 640px; }
  h2 { font-size: 15px; text-transform: uppercase; letter-spacing: 0.06em; color: #5a5f73; margin: 0 0 16px; border-top: 1px solid #e6e8f0; padding-top: 24px; }
  .finding { display: flex; align-items: flex-start; gap: 16px; padding: 16px 0; border-bottom: 1px solid #eef0f6; }
  .finding:last-child { border-bottom: none; }
  .finding-marker { flex: none; width: 28px; height: 28px; border-radius: 50%; color: #fff; font-weight: 700; font-size: 14px; display: flex; align-items: center; justify-content: center; }
  .finding-body { flex: 1; min-width: 0; }
  .finding-text { font-size: 15px; line-height: 1.5; margin: 0; color: #1a1a2e; }
  .finding-meta { font-size: 12px; color: #8a8fa3; margin: 6px 0 0; word-break: break-all; }
  .thumb { flex: none; width: ${THUMB_WIDTH}px; height: ${THUMB_HEIGHT}px; overflow: hidden; position: relative; border-radius: 6px; border: 2px solid; background: #f4f5f9; }
  /*
   * The crop is centered on the flagged element's own bounding box, which
   * is very often wider/taller than this fixed-size window (a nav bar, a
   * paragraph) — so the visible slice routinely cuts text off mid-word at
   * an edge. That's an inherent cost of a small, legible-at-1:1-scale
   * thumbnail, not something worth a smarter crop algorithm to fully avoid.
   * A soft mask on all four edges is the cheap fix: it turns "the render
   * looks broken/clipped" into "this is deliberately a small zoomed-in
   * preview," without touching the centering math itself. The mask sits on
   * its own inner wrapper, not .thumb itself, so the border stays crisp —
   * mask-image would otherwise fade the border pixels out too, since the
   * default mask-origin is the border box.
   */
  .thumb-mask {
    width: 100%; height: 100%; position: relative;
    -webkit-mask-image: linear-gradient(to right, transparent, black 14%, black 86%, transparent), linear-gradient(to bottom, transparent, black 14%, black 86%, transparent);
    -webkit-mask-composite: source-in;
    mask-image: linear-gradient(to right, transparent, black 14%, black 86%, transparent), linear-gradient(to bottom, transparent, black 14%, black 86%, transparent);
    mask-composite: intersect;
  }
  .thumb img { position: absolute; max-width: none; }
  .empty-note { font-size: 14px; color: #8a8fa3; padding: 8px 0; }
  .footer { margin-top: 32px; font-size: 11px; color: #b0b4c3; }
`;

/**
 * Renders the one-page summary as standalone HTML — no external file
 * dependencies (screenshot goes in as a `data:` URI, same convention the
 * overlay/report.html already use), ready to hand to Playwright's
 * `page.setContent()` + `page.pdf()`.
 */
export function renderSummaryHtml(target: CrawlTarget, report: ProductReport, findings: RankedFinding[], screenshotsByPage: Map<string, string>): string {
  const scoreLabel = report.pages.length === 0 ? "N/A" : report.score.toFixed(1);
  const a11y = report.accessibility;
  const a11yLabel = a11y && a11y.totalChecked > 0 ? `${a11y.passCount} / ${a11y.totalChecked}` : "N/A";

  const findingsHtml =
    findings.length > 0
      ? findings.map((f, i) => findingRow(f, i, screenshotsByPage.get(f.page))).join("\n")
      : `<p class="empty-note">No significant findings — this target is at or near fully on-spec, with no failing contrast checks.</p>`;

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${escapeHtml(target.label)} — design audit summary</title>
<style>${STYLE}</style>
</head>
<body>
<div class="page">
  <p class="kicker">Specular design audit</p>
  <h1>${escapeHtml(target.label)}</h1>

  <div class="headline-row">
    <div class="headline">
      <p class="headline-number">${scoreLabel}${scoreLabel !== "N/A" ? "<span style=\"font-size:22px;color:#8a8fa3\">/100</span>" : ""}</p>
      <p class="headline-label">Brand deviation score</p>
    </div>
    <div class="headline">
      <p class="headline-number">${escapeHtml(a11yLabel)}</p>
      <p class="headline-label">Passing WCAG contrast checks</p>
    </div>
  </div>
  <p class="headline-context">Deviation score: 0 is fully on-spec, 100 is maximally drifted from the brand's own token spec. Contrast checks: independent of the score above — WCAG 2.1 is an external, objective standard, not this brand's own choice.</p>

  <h2>Top findings</h2>
  ${findingsHtml}

  <p class="footer">Generated by Specular · full detail at reports/${escapeHtml(target.key)}/report.html</p>
</div>
</body>
</html>
`;
}

/** Reads a cached PNG screenshot and returns it as a `data:` URI, or undefined if the file isn't there (e.g. a fixture-based/no-screenshot page). */
export function screenshotDataUriFor(extracted: ExtractedPage | undefined): string | undefined {
  if (!extracted?.screenshotPath) return undefined;
  const abs = path.resolve(process.cwd(), extracted.screenshotPath);
  try {
    return `data:image/png;base64,${readFileSync(abs).toString("base64")}`;
  } catch {
    return undefined;
  }
}
