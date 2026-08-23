import { describe, it, expect } from "vitest";
import { selectTopFindings } from "../src/summary/rank.js";
import type { ProductReport, Offender } from "../src/aggregator/aggregate.js";
import type { AccessibilityFinding } from "../src/accessibility/types.js";
import type { ExtractedElement, ExtractedPage, Position } from "../src/extractor/types.js";

function offender(overrides: Partial<Offender> = {}): Offender {
  return {
    page: "https://example.com/",
    component: "Button/primary",
    instanceId: "inst1",
    property: "color",
    rawValue: "rgb(0, 200, 80)",
    nearestToken: "colors.brand-primary",
    distance: 20,
    normalized: 0.5,
    humanReadable: "color is a different shade than the brand palette",
    ...overrides,
  };
}

function a11yFinding(overrides: Partial<AccessibilityFinding> = {}): AccessibilityFinding {
  return {
    page: "https://example.com/",
    component: "p/text",
    instanceId: "a11y1",
    ratio: 3.0,
    level: "fail",
    isLargeText: false,
    fontSize: 16,
    fontWeight: 400,
    color: "rgb(150, 150, 150)",
    effectiveBackground: "rgb(255, 255, 255)",
    backgroundResolved: true,
    humanReadable: "text here is barely readable against its background",
    ...overrides,
  };
}

function report(worstOffenders: Offender[], accessibilityOffenders: AccessibilityFinding[] = []): ProductReport {
  return {
    product: "test",
    pages: [],
    score: 0,
    breakdown: [],
    worstOffenders,
    unstablePages: [],
    accessibility: {
      totalChecked: accessibilityOffenders.length,
      passCount: accessibilityOffenders.filter((f) => f.level !== "fail").length,
      failCount: accessibilityOffenders.filter((f) => f.level === "fail").length,
      worstOffenders: accessibilityOffenders,
    },
  };
}

function element(instanceId: string, positions: Position[] = []): ExtractedElement {
  return { component: "x", instanceId, styles: {} as ExtractedElement["styles"], positions, count: positions.length || undefined };
}

function extractedByUrl(page: string, elements: ExtractedElement[]): Map<string, ExtractedPage> {
  return new Map([[page, { page, elements }]]);
}

const NO_ELEMENTS = new Map<string, ExtractedPage>();

describe("selectTopFindings", () => {
  it("ranks a higher-normalized deviation above a lower-normalized one when prominence is equal", () => {
    const worst = offender({ instanceId: "worst", normalized: 0.9 });
    const mild = offender({ instanceId: "mild", normalized: 0.2 });
    const result = selectTopFindings(report([mild, worst]), NO_ELEMENTS);

    expect(result[0].instanceId).toBe("worst");
    expect(result[1].instanceId).toBe("mild");
  });

  it("boosts a deviation repeated across many occurrences over an equally-severe one-off", () => {
    const repeated = offender({ instanceId: "repeated", normalized: 0.5 });
    const oneOff = offender({ instanceId: "oneOff", normalized: 0.5, component: "Other" });
    const els = extractedByUrl("https://example.com/", [
      element("repeated", Array(15).fill({ x: 0, y: 0, width: 10, height: 10 })),
      element("oneOff", [{ x: 0, y: 0, width: 10, height: 10 }]),
    ]);

    const result = selectTopFindings(report([repeated, oneOff]), els);
    expect(result[0].instanceId).toBe("repeated");
  });

  it("boosts a deviation spread across more pages over one confined to a single page", () => {
    const spreadA = offender({ instanceId: "a", page: "https://example.com/page-a", normalized: 0.5, component: "Spread", property: "color", nearestToken: "colors.brand-primary" });
    const spreadB = offender({ instanceId: "b", page: "https://example.com/page-b", normalized: 0.5, component: "Spread", property: "color", nearestToken: "colors.brand-primary" });
    const spreadC = offender({ instanceId: "c", page: "https://example.com/page-c", normalized: 0.5, component: "Spread", property: "color", nearestToken: "colors.brand-primary" });
    const confined = offender({ instanceId: "confined", page: "https://example.com/page-a", normalized: 0.5, component: "Confined" });

    const result = selectTopFindings(report([spreadA, spreadB, spreadC, confined]), NO_ELEMENTS, 4);
    const confinedRank = result.findIndex((r) => r.instanceId === "confined");
    const spreadRank = result.findIndex((r) => r.instanceId === "a");
    expect(spreadRank).toBeLessThan(confinedRank);
  });

  it("excludes AA/AAA-passing accessibility findings even when they'd otherwise rank as 'worst'", () => {
    const passing = a11yFinding({ instanceId: "passing", level: "AA", ratio: 4.6 });
    const mildDeviation = offender({ normalized: 0.1 });

    const result = selectTopFindings(report([mildDeviation], [passing]), NO_ELEMENTS);
    expect(result.some((r) => r.kind === "accessibility")).toBe(false);
  });

  it("ranks a similarly-severe, similarly-prominent accessibility failure above a token deviation", () => {
    // deviation: normalized 0.4, no prominence data -> score = 0.4 * 1 = 0.4
    const deviation = offender({ instanceId: "dev", normalized: 0.4 });
    // a11y: ratio 2.7 vs AA threshold 4.5 -> severity = (4.5-2.7)/4.5 = 0.4, same base severity, no prominence data
    const finding = a11yFinding({ instanceId: "a11y", ratio: 2.7, isLargeText: false });

    const result = selectTopFindings(report([deviation], [finding]), NO_ELEMENTS, 2);
    expect(result[0].kind).toBe("accessibility");
    expect(result[0].instanceId).toBe("a11y");
    expect(result[1].instanceId).toBe("dev");
  });

  it("still lets a far more severe deviation outrank a mild accessibility failure despite the priority multiplier", () => {
    const severeDeviation = offender({ instanceId: "severe", normalized: 1.0 });
    const barelyFailingA11y = a11yFinding({ instanceId: "barely", ratio: 4.4, isLargeText: false }); // severity ~= (4.5-4.4)/4.5 = 0.022

    const result = selectTopFindings(report([severeDeviation], [barelyFailingA11y]), NO_ELEMENTS, 2);
    expect(result[0].instanceId).toBe("severe");
  });

  it("uses the large-text AA threshold (3:1) rather than the normal-text one (4.5:1) for severity", () => {
    // ratio 2.9 fails both thresholds, but severity differs: (3-2.9)/3 = 0.033 (large) vs (4.5-2.9)/4.5 = 0.356 (normal)
    const large = a11yFinding({ instanceId: "large", ratio: 2.9, isLargeText: true });
    const normal = a11yFinding({ instanceId: "normal", ratio: 2.9, isLargeText: false });

    const result = selectTopFindings(report([], [large, normal]), NO_ELEMENTS, 2);
    expect(result[0].instanceId).toBe("normal");
    expect(result[1].instanceId).toBe("large");
  });

  it("caps the result at `limit`", () => {
    const offenders = [0.9, 0.8, 0.7, 0.6].map((n, i) => offender({ instanceId: `o${i}`, normalized: n }));
    expect(selectTopFindings(report(offenders), NO_ELEMENTS, 3)).toHaveLength(3);
    expect(selectTopFindings(report(offenders), NO_ELEMENTS, 3)[0].instanceId).toBe("o0");
  });

  it("does not throw and falls back to no prominence boost / no position when extractedByUrl has no matching entry", () => {
    const result = selectTopFindings(report([offender()]), NO_ELEMENTS);
    expect(result).toHaveLength(1);
    expect(result[0].position).toBeUndefined();
  });

  it("carries a representative position through for the thumbnail crop when one is available", () => {
    const position: Position = { x: 10, y: 20, width: 100, height: 40 };
    const els = extractedByUrl("https://example.com/", [element("inst1", [position])]);
    const result = selectTopFindings(report([offender()]), els);
    expect(result[0].position).toEqual(position);
  });
});
