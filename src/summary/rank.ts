import type { Category, Offender, ProductReport } from "../aggregator/aggregate.js";
import { categoryOf } from "../aggregator/aggregate.js";
import type { AccessibilityFinding } from "../accessibility/types.js";
import type { ExtractedElement, ExtractedPage, Position } from "../extractor/types.js";

export type RankedFindingKind = "deviation" | "accessibility";

/**
 * One finding selected for the one-page summary, already carrying
 * everything the renderer needs — it never has to re-derive `score`,
 * re-look-up which category this came from, or decide an accent color.
 * `colorKey` reuses the same four deviation-category colors plus the
 * accessibility amber the overlay already defines (see report/overlay.ts),
 * so the summary page's small color accents stay visually consistent with
 * every other artifact this project produces. `position` is the bounding
 * box of one representative occurrence (undefined when the source data has
 * no captured positions, e.g. fixture-based extraction), used for the
 * screenshot-crop thumbnail; its absence just means no thumbnail.
 */
export interface RankedFinding {
  kind: RankedFindingKind;
  colorKey: Category | "accessibility";
  page: string;
  component: string;
  instanceId: string;
  humanReadable: string;
  score: number;
  position?: Position;
}

/**
 * Cross-category priority multiplier applied to accessibility findings
 * after each category's own impact score is computed on the same 0-1
 * severity scale (see deviationSeverity/accessibilitySeverity) and boosted
 * by the same prominence formula (see prominenceBoost) — so this is the
 * *only* place accessibility gets an edge, and it's a clean, documented
 * one: a WCAG contrast failure is checked against an external, objective
 * standard, not the site's own choice of spec, so a borderline
 * accessibility failure is judged worth surfacing over a similarly-ranked
 * token deviation, which is "off from what this company itself decided" —
 * a lower-stakes miss. 1.5x means a same-severity, same-prominence
 * accessibility finding always outranks the matching deviation, without
 * letting it drown out a deviation that's genuinely far more severe or
 * prominent.
 */
const ACCESSIBILITY_PRIORITY_MULTIPLIER = 1.5;

/**
 * Occurrence count / page spread / bounding-box area beyond these stop
 * adding more weight — a deviation repeated 20+ times, spread across 5+
 * pages, or covering a 224x224px+ area is already "clearly a big deal";
 * scoring it even higher wouldn't change the ranking decision, just the
 * exact number, so these are caps, not the actual expected maximums.
 */
const MAX_OCCURRENCE_FOR_BOOST = 20;
const MAX_PAGE_SPREAD_FOR_BOOST = 5;
const AREA_BOOST_REFERENCE_PX2 = 50_000; // roughly a 224x224px box

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

/**
 * Looks up the live sampled element (positions, occurrence count) an
 * `Offender`/`AccessibilityFinding` refers to — both only carry a `page` +
 * `instanceId`, not the full captured element, so every prominence-boosted
 * ranking needs this same lookup. Exported alongside the boost primitives
 * below so a caller with its own list of offenders/findings (e.g. a
 * worst-offenders table sorting the *full* list, not just top-3) can reuse
 * the exact same lookup rather than re-deriving it.
 */
export function findElement(extractedByUrl: Map<string, ExtractedPage>, page: string, instanceId: string): ExtractedElement | undefined {
  return extractedByUrl.get(page)?.elements.find((e) => e.instanceId === instanceId);
}

export function occurrenceCountOf(el: ExtractedElement | undefined): number {
  return el?.count ?? el?.positions?.length ?? 1;
}

export function avgAreaOf(el: ExtractedElement | undefined): number {
  if (!el?.positions || el.positions.length === 0) return 0;
  const total = el.positions.reduce((sum, p) => sum + p.width * p.height, 0);
  return total / el.positions.length;
}

/**
 * Picks the first position with a plausible page-relative origin (x/y >= 0)
 * to crop the summary thumbnail from — real observed data includes at
 * least one `position: fixed` element whose captured "page-relative"
 * coordinates go negative (a scroll-offset correction that doesn't apply
 * to a fixed element, a pre-existing capture quirk out of scope for this
 * feature to fix). A bogus position produces a blank/misleading crop, not
 * an error, so it's worth skipping rather than trusting positions[0]
 * blindly — no thumbnail is better than a wrong one.
 */
function representativePosition(el: ExtractedElement | undefined): Position | undefined {
  return el?.positions?.find((p) => p.x >= 0 && p.y >= 0);
}

/**
 * How many distinct pages carry this exact deviation (same component,
 * property, detail, and nearest token) — a signal `Offender` doesn't carry
 * on its own since `worstOffenders` is already flattened to one entry per
 * page/instance/property. A deviation repeated identically across several
 * pages is more of a systemic issue than the same normalized distance on
 * one page.
 */
export function pageSpreadOf(offender: Offender, allOffenders: Offender[]): number {
  const signature = `${offender.component}|${offender.property}|${offender.detail ?? ""}|${offender.nearestToken}`;
  const pages = new Set(
    allOffenders
      .filter((o) => `${o.component}|${o.property}|${o.detail ?? ""}|${o.nearestToken}` === signature)
      .map((o) => o.page)
  );
  return pages.size;
}

/**
 * Occurrence count, page spread, and bounding-box area all boost a
 * finding's base severity multiplicatively (1x-8x combined) rather than as
 * separate additive terms — additive terms could let a trivial deviation
 * that merely appears often outrank a severe one that appears once, which
 * defeats the point of leading with `normalized`/severity as the primary
 * signal. `pageSpread` defaults to 1 (neutral) for callers that don't
 * track it (accessibility findings, currently).
 */
export function prominenceBoost(occurrenceCount: number, avgArea: number, pageSpread: number): number {
  const occurrenceBoost = 1 + Math.min(occurrenceCount, MAX_OCCURRENCE_FOR_BOOST) / MAX_OCCURRENCE_FOR_BOOST;
  const spreadBoost = 1 + Math.min(Math.max(pageSpread - 1, 0), MAX_PAGE_SPREAD_FOR_BOOST) / MAX_PAGE_SPREAD_FOR_BOOST;
  const areaBoost = avgArea > 0 ? 1 + Math.min(avgArea, AREA_BOOST_REFERENCE_PX2) / AREA_BOOST_REFERENCE_PX2 : 1;
  return occurrenceBoost * spreadBoost * areaBoost;
}

/**
 * An accessibility finding's severity on the same 0-1 scale a deviation's
 * `normalized` already is — how far below the applicable AA threshold the
 * captured ratio falls, clamped so a ratio already at/above threshold (an
 * AA/AAA pass slipping in some other way) never goes negative. Extracted
 * out of `selectTopFindings` so a caller ranking the *full* accessibility
 * worst-offenders list (not just top-3) can compute the same severity
 * without re-deriving the threshold logic.
 */
export function accessibilitySeverity(finding: AccessibilityFinding): number {
  const threshold = finding.isLargeText ? 3 : 4.5; // AA threshold — same split classifyContrast uses
  return clamp01((threshold - finding.ratio) / threshold);
}

/**
 * Selects the top `limit` findings across both categories for the one-page
 * summary. Deviations and accessibility failures don't share a scale (a
 * `normalized` distance and a contrast ratio aren't directly comparable
 * numbers), so each is first reduced to a 0-1 severity score on its own
 * terms — `normalized` as-is for deviations (already 0-1 by construction),
 * and how far below the applicable AA threshold for accessibility — then
 * boosted by the same prominence formula, then accessibility gets its
 * documented priority multiplier (see ACCESSIBILITY_PRIORITY_MULTIPLIER).
 * Only that final, comparable `score` is sorted on.
 *
 * Only `level === "fail"` accessibility findings are eligible — an AA/AAA
 * pass isn't a finding worth surfacing to someone deciding whether to
 * care, same reasoning the overlay uses for which boxes to draw.
 */
export function selectTopFindings(report: ProductReport, extractedByUrl: Map<string, ExtractedPage>, limit = 3): RankedFinding[] {
  const deviationOffenders = report.worstOffenders;
  const accessibilityFindings = (report.accessibility?.worstOffenders ?? []).filter((f) => f.level === "fail");

  const ranked: RankedFinding[] = [];

  for (const offender of deviationOffenders) {
    const el = findElement(extractedByUrl, offender.page, offender.instanceId);
    const boost = prominenceBoost(occurrenceCountOf(el), avgAreaOf(el), pageSpreadOf(offender, deviationOffenders));
    ranked.push({
      kind: "deviation",
      colorKey: categoryOf(offender.property),
      page: offender.page,
      component: offender.component,
      instanceId: offender.instanceId,
      humanReadable: offender.humanReadable,
      score: offender.normalized * boost,
      position: representativePosition(el),
    });
  }

  for (const finding of accessibilityFindings) {
    const el = findElement(extractedByUrl, finding.page, finding.instanceId);
    const severity = accessibilitySeverity(finding);
    const boost = prominenceBoost(occurrenceCountOf(el), avgAreaOf(el), 1);
    ranked.push({
      kind: "accessibility",
      colorKey: "accessibility",
      page: finding.page,
      component: finding.component,
      instanceId: finding.instanceId,
      humanReadable: finding.humanReadable,
      score: severity * boost * ACCESSIBILITY_PRIORITY_MULTIPLIER,
      position: representativePosition(el),
    });
  }

  return ranked.sort((a, b) => b.score - a.score).slice(0, limit);
}

/**
 * Re-sorts a same-category deviation offenders list by the same
 * occurrence/spread/area-boosted score `selectTopFindings` uses for its
 * deviation half — a widely-repeated moderate deviation should outrank a
 * one-off severe one, the same argument that already justified the boost
 * for the cross-category top-3. Deliberately not routed through
 * `selectTopFindings`/`RankedFinding`: this is one category sorting against
 * itself, so there's nothing to weigh accessibility against and no reason
 * to apply `ACCESSIBILITY_PRIORITY_MULTIPLIER`. Returns a new array (the
 * input isn't mutated) with every field the caller already had — only the
 * order changes, `normalized` stays on each entry so the raw severity is
 * still visible in the table.
 */
export function rankedDeviationOffenders(offenders: Offender[], extractedByUrl: Map<string, ExtractedPage>): Offender[] {
  return [...offenders].sort((a, b) => {
    const elA = findElement(extractedByUrl, a.page, a.instanceId);
    const elB = findElement(extractedByUrl, b.page, b.instanceId);
    const scoreA = a.normalized * prominenceBoost(occurrenceCountOf(elA), avgAreaOf(elA), pageSpreadOf(a, offenders));
    const scoreB = b.normalized * prominenceBoost(occurrenceCountOf(elB), avgAreaOf(elB), pageSpreadOf(b, offenders));
    return scoreB - scoreA;
  });
}

/**
 * Same idea as `rankedDeviationOffenders`, for the accessibility
 * worst-offenders list: boosted by the same `prominenceBoost` formula
 * (`pageSpread` defaulted to 1, same as `selectTopFindings`'s accessibility
 * half — a contrast failure isn't tracked as "the same failure repeated
 * across N pages" the way a deviation signature is), without the
 * cross-category priority multiplier. Doesn't filter by `level` — the
 * caller (report.html/summary.md) already decides which findings it wants
 * to list; this only changes their order.
 */
export function rankedAccessibilityOffenders(findings: AccessibilityFinding[], extractedByUrl: Map<string, ExtractedPage>): AccessibilityFinding[] {
  return [...findings].sort((a, b) => {
    const elA = findElement(extractedByUrl, a.page, a.instanceId);
    const elB = findElement(extractedByUrl, b.page, b.instanceId);
    const scoreA = accessibilitySeverity(a) * prominenceBoost(occurrenceCountOf(elA), avgAreaOf(elA), 1);
    const scoreB = accessibilitySeverity(b) * prominenceBoost(occurrenceCountOf(elB), avgAreaOf(elB), 1);
    return scoreB - scoreA;
  });
}
