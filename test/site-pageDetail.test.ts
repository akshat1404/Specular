import { describe, it, expect } from "vitest";
import { buildPageFindings, renderPageDetailHtml } from "../src/site/pageDetail.js";
import { OVERLAY_SCORE_THRESHOLD } from "../src/report/overlay.js";
import { validateTokenSpec, type TokenSpec } from "../src/schema/tokenSpec.js";
import type { CrawlTarget } from "../src/targets/types.js";
import type { ComponentReport, InstanceReport, PageReport } from "../src/aggregator/aggregate.js";
import type { PropertyDeviation } from "../src/matchers/types.js";
import type { AccessibilityFinding } from "../src/accessibility/types.js";

const spec: TokenSpec = validateTokenSpec({
  colors: { "brand-primary": "#3366FF" },
  spacing: [4, 8, 16],
  radius: [4, 8],
  fontSize: [12, 16, 24],
  fontFamily: ["Arial", "sans-serif"],
  fontWeight: [400, 700],
});

const target: CrawlTarget = { key: "test-site-target", label: "Test Target", kind: "real-app", urls: ["https://example.com/"] };

function deviation(overrides: Partial<PropertyDeviation> = {}): PropertyDeviation {
  return { property: "color", rawValue: "rgb(0, 0, 0)", nearestToken: "colors.brand-primary", distance: 10, normalized: 0.5, ...overrides };
}

function instance(overrides: Partial<InstanceReport> = {}): InstanceReport {
  return { component: "button", instanceId: "inst1", deviations: [deviation()], score: 50, ...overrides };
}

function accessibilityFinding(overrides: Partial<AccessibilityFinding> = {}): AccessibilityFinding {
  return {
    page: "https://example.com/",
    component: "p/text",
    instanceId: "a11y1",
    ratio: 1.2,
    level: "fail",
    isLargeText: false,
    fontSize: 16,
    fontWeight: 400,
    color: "rgb(255, 255, 255)",
    effectiveBackground: "rgb(255, 255, 255)",
    backgroundResolved: true,
    humanReadable: "text here is barely readable against its background — 1.2:1, needs at least 4.5:1 for AA",
    ...overrides,
  };
}

function pageReport(instances: InstanceReport[], accessibility: AccessibilityFinding[] = []): PageReport {
  const component: ComponentReport = { component: "button", instances, score: 0 };
  return { page: "https://example.com/", components: [component], score: 0, breakdown: [], accessibility };
}

describe("buildPageFindings", () => {
  it("includes a humanized entry for every deviation on an above-threshold instance", () => {
    const inst = instance({
      score: 50,
      deviations: [deviation({ property: "color" }), deviation({ property: "spacing", nearestToken: "spacing:8", detail: "padding-top" })],
    });
    const findings = buildPageFindings(pageReport([inst]), spec);

    const deviationFindings = findings.filter((f) => f.kind === "deviation");
    expect(deviationFindings).toHaveLength(2);
    expect(deviationFindings.every((f) => f.component === "button" && f.instanceId === "inst1")).toBe(true);
    expect(deviationFindings[0].text).toMatch(/shade/);
    expect(deviationFindings[1].text).toMatch(/px/);
  });

  it("excludes instances at or below the threshold, matching what the overlay would box", () => {
    const atThreshold = instance({ instanceId: "at", score: OVERLAY_SCORE_THRESHOLD });
    const findings = buildPageFindings(pageReport([atThreshold]), spec);
    expect(findings).toHaveLength(0);
  });

  it("includes fail-level accessibility findings using the finding's own humanReadable sentence", () => {
    const finding = accessibilityFinding({ level: "fail" });
    const findings = buildPageFindings(pageReport([], [finding]), spec);

    const a11yFindings = findings.filter((f) => f.kind === "accessibility");
    expect(a11yFindings).toHaveLength(1);
    expect(a11yFindings[0].text).toContain(finding.humanReadable);
  });

  it("excludes AA/AAA passing accessibility findings, only fail-level", () => {
    const findings = buildPageFindings(pageReport([], [accessibilityFinding({ level: "AA" }), accessibilityFinding({ level: "AAA" })]), spec);
    expect(findings.filter((f) => f.kind === "accessibility")).toHaveLength(0);
  });

  it("appends the tie-in sentence when a failing accessibility finding has one", () => {
    const finding = accessibilityFinding({
      tieIn: { correctedRatio: 4.6, correctedLevel: "AA", humanReadable: "currently 1.2:1 (fails AA) — the spec token would give you 4.6:1 (passes AA)" },
    });
    const findings = buildPageFindings(pageReport([], [finding]), spec);
    expect(findings[0].text).toContain("the spec token would give you 4.6:1");
  });

  it("returns both categories together when a page has both kinds of finding", () => {
    const inst = instance({ score: 40 });
    const finding = accessibilityFinding();
    const findings = buildPageFindings(pageReport([inst], [finding]), spec);
    expect(findings.map((f) => f.kind).sort()).toEqual(["accessibility", "deviation"]);
  });
});

describe("renderPageDetailHtml", () => {
  it("includes both categories' findings in the rendered output", () => {
    const inst = instance({ score: 40 });
    const finding = accessibilityFinding();
    const page = pageReport([inst], [finding]);
    const findings = buildPageFindings(page, spec);

    const html = renderPageDetailHtml(target, page, [], findings, spec, true);
    expect(html).toContain(findings.find((f) => f.kind === "deviation")!.text);
    expect(html).toContain(finding.humanReadable);
  });

  it("references the real relative image files, not a data URI, for both tabs", () => {
    const page = pageReport([]);
    const html = renderPageDetailHtml(target, page, [], [], spec, true);
    expect(html).toContain('src="original.png"');
    expect(html).toContain('src="corrected.png"');
    expect(html).not.toContain("data:image");
  });

  it("shows a plain notice instead of a broken image reference when there is no corrected render", () => {
    const page = pageReport([]);
    const html = renderPageDetailHtml(target, page, [], [], spec, false);
    expect(html).not.toContain('src="corrected.png"');
    expect(html).toMatch(/no corrected render/i);
  });
});
