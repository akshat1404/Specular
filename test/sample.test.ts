import { describe, it, expect } from "vitest";
import { buildCorrections, dedupe, type RawSample } from "../src/extractor/sample.js";
import { validateTokenSpec, type TokenSpec } from "../src/schema/tokenSpec.js";
import type { CapturedStyles, ExtractedElement, Position } from "../src/extractor/types.js";

const BUTTON_STYLES: CapturedStyles = {
  color: "rgb(255, 255, 255)",
  backgroundColor: "rgb(51, 102, 255)",
  borderTopColor: "rgba(0, 0, 0, 0)",
  borderTopWidth: "0px",
  borderTopStyle: "none",
  borderTopLeftRadius: "8px",
  fontSize: "16px",
  fontFamily: "Arial, sans-serif",
  fontWeight: "700",
  paddingTop: "8px",
  paddingRight: "16px",
  paddingBottom: "8px",
  paddingLeft: "16px",
  marginTop: "0px",
  marginRight: "0px",
  marginBottom: "0px",
  marginLeft: "0px",
};

const DEFAULT_POSITION: Position = { x: 0, y: 0, width: 100, height: 40 };

function sample(overrides: Partial<RawSample> = {}): RawSample {
  return { tag: "button", isText: false, styles: BUTTON_STYLES, position: DEFAULT_POSITION, ...overrides };
}

describe("dedupe", () => {
  it("collapses identical style signatures into one instance with a count", () => {
    const result = dedupe([sample(), sample(), sample()]);
    expect(result).toHaveLength(1);
    expect(result[0].component).toBe("button");
    expect(result[0].count).toBe(3);
  });

  it("keeps distinct style signatures as separate instances", () => {
    const result = dedupe([sample(), sample({ styles: { ...BUTTON_STYLES, fontWeight: "400" } })]);
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.count)).toEqual([1, 1]);
  });

  it('suffixes the component with "/text" for text-leaf samples', () => {
    const result = dedupe([sample({ tag: "p", isText: true })]);
    expect(result[0].component).toBe("p/text");
  });

  it("assigns a stable instanceId derived from the style signature", () => {
    const a = dedupe([sample()]);
    const b = dedupe([sample()]);
    expect(a[0].instanceId).toBe(b[0].instanceId);
  });

  it("gives different components the same styles distinct instances", () => {
    const result = dedupe([sample({ tag: "button" }), sample({ tag: "a" })]);
    expect(result).toHaveLength(2);
    expect(new Set(result.map((r) => r.component))).toEqual(new Set(["button", "a"]));
  });

  describe("position capture", () => {
    it("carries one position per occurrence when styles are identical", () => {
      const positions: Position[] = [
        { x: 0, y: 0, width: 100, height: 40 },
        { x: 0, y: 200, width: 100, height: 40 },
        { x: 0, y: 400, width: 100, height: 40 },
      ];
      const result = dedupe(positions.map((position) => sample({ position })));
      expect(result).toHaveLength(1);
      expect(result[0].positions).toEqual(positions);
      expect(result[0].count).toBe(3);
    });

    it("does not lose or duplicate positions when distinct styles interleave with duplicates", () => {
      const posA1: Position = { x: 0, y: 0, width: 100, height: 40 };
      const posA2: Position = { x: 0, y: 300, width: 100, height: 40 };
      const posB1: Position = { x: 50, y: 100, width: 60, height: 20 };

      const result = dedupe([
        sample({ position: posA1 }),
        sample({ styles: { ...BUTTON_STYLES, fontWeight: "400" }, position: posB1 }),
        sample({ position: posA2 }),
      ]);

      expect(result).toHaveLength(2);
      const a = result.find((r) => r.count === 2)!;
      const b = result.find((r) => r.count === 1)!;
      expect(a.positions).toEqual([posA1, posA2]);
      expect(b.positions).toEqual([posB1]);
    });

    it("keeps count equal to positions.length", () => {
      const result = dedupe([sample(), sample(), sample(), sample()]);
      expect(result[0].positions).toHaveLength(4);
      expect(result[0].count).toBe(result[0].positions!.length);
    });
  });
});

describe("buildCorrections", () => {
  const spec: TokenSpec = validateTokenSpec({
    colors: { "brand-primary": "#3366FF", "brand-text": "#111111", "brand-bg": "#F5F5F5" },
    spacing: [4, 8, 16, 24, 32],
    radius: [4, 8, 16],
    fontSize: [12, 14, 16, 20, 24],
    fontFamily: ["Arial", "sans-serif"],
    fontWeight: [400, 700],
  });

  const DEVIANT_STYLES: CapturedStyles = {
    color: "rgb(0, 200, 80)", // off-brand green
    backgroundColor: "rgb(10, 10, 10)", // off from brand-bg
    borderTopColor: "rgb(0, 200, 80)",
    borderTopWidth: "2px",
    borderTopStyle: "solid",
    borderTopLeftRadius: "20px", // off-scale, nearest is 16
    fontSize: "22px", // off-scale — must NOT be corrected (reflow risk)
    fontFamily: "Comic Sans MS", // not an allowed family
    fontWeight: "900", // off-scale — must NOT be corrected (reflow risk)
    paddingTop: "10px", // off-scale — must NOT be corrected (reflow risk)
    paddingRight: "10px",
    paddingBottom: "10px",
    paddingLeft: "10px",
    marginTop: "0px",
    marginRight: "0px",
    marginBottom: "0px",
    marginLeft: "0px",
  };

  function element(overrides: Partial<CapturedStyles> = {}, positions: Position[] = [{ x: 0, y: 0, width: 10, height: 10 }]): ExtractedElement {
    return { component: "button", instanceId: "inst1", styles: { ...DEVIANT_STYLES, ...overrides }, positions };
  }

  it("resolves each deviant correctable property to its nearest token's real CSS value", () => {
    const el = element();
    const corrections = buildCorrections([el], spec);
    const fix = corrections[`${el.component}|${JSON.stringify(el.styles)}`];

    expect(fix).toBeDefined();
    expect(fix.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(fix["background-color"]).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(fix["border-color"]).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(fix["border-radius"]).toBe("16px");
    expect(fix["font-family"]).toBe('"Arial"');
  });

  it("never sets a reflow-risk property (spacing/font-size/font-weight), even when that property is deviant on the same instance", () => {
    const el = element();
    const corrections = buildCorrections([el], spec);
    const fix = corrections[`${el.component}|${JSON.stringify(el.styles)}`];

    expect(Object.keys(fix).sort()).toEqual(["background-color", "border-color", "border-radius", "color", "font-family"]);
    expect(fix).not.toHaveProperty("font-size");
    expect(fix).not.toHaveProperty("font-weight");
    expect(fix).not.toHaveProperty("padding-top");
    expect(fix).not.toHaveProperty("spacing");
  });

  it("produces no correction entry for a fully compliant element", () => {
    const compliant = element({
      color: "rgb(17, 17, 17)", // brand-text, exact
      backgroundColor: "rgb(245, 245, 245)", // brand-bg, exact
      borderTopColor: "rgb(51, 102, 255)", // brand-primary, exact
      borderTopLeftRadius: "16px",
      fontFamily: "Arial, sans-serif",
      fontWeight: "400",
      paddingTop: "8px",
      paddingRight: "8px",
      paddingBottom: "8px",
      paddingLeft: "8px",
    });
    const corrections = buildCorrections([compliant], spec);
    expect(Object.keys(corrections)).toHaveLength(0);
  });

  it("keys each correction by the same component|styleSignature dedupe groups elements by", () => {
    const el = element();
    const corrections = buildCorrections([el], spec);
    expect(Object.keys(corrections)).toEqual([`${el.component}|${JSON.stringify(el.styles)}`]);
  });

  it("keys corrections independent of position count — one map entry covers every occurrence sharing that signature during the in-page walk, no position tracking needed", () => {
    const many = element(
      {},
      [
        { x: 0, y: 0, width: 10, height: 10 },
        { x: 20, y: 0, width: 10, height: 10 },
        { x: 40, y: 0, width: 10, height: 10 },
      ]
    );
    const corrections = buildCorrections([many], spec);
    expect(Object.keys(corrections)).toHaveLength(1);
  });

  describe("contrast-aware color correction", () => {
    const CONTRAST_STYLES: CapturedStyles = {
      color: "rgb(200, 200, 200)",
      backgroundColor: "rgba(0, 0, 0, 0)",
      borderTopColor: "rgba(0, 0, 0, 0)",
      borderTopWidth: "0px",
      borderTopStyle: "none",
      borderTopLeftRadius: "0px",
      fontSize: "16px",
      fontFamily: "Arial",
      fontWeight: "400",
      paddingTop: "0px",
      paddingRight: "0px",
      paddingBottom: "0px",
      paddingLeft: "0px",
      marginTop: "0px",
      marginRight: "0px",
      marginBottom: "0px",
      marginLeft: "0px",
      effectiveBackgroundColor: "rgb(255, 255, 255)",
      effectiveBackgroundResolved: true,
    };

    function textElement(overrides: Partial<CapturedStyles> = {}): ExtractedElement {
      return { component: "span/text", instanceId: "a11y-inst", styles: { ...CONTRAST_STYLES, ...overrides }, positions: [{ x: 0, y: 0, width: 10, height: 10 }] };
    }

    it("skips a color correction whose nearest token still fails the same accessibility contrast check the captured color already failed, rather than silently presenting a broken fix", () => {
      // rgb(200,200,200) on white already fails AA; the spec's only color is
      // another light gray, so the matcher's Delta-E-nearest pick still fails.
      const lowContrastSpec: TokenSpec = validateTokenSpec({
        colors: { "brand-light-gray": "#CCCCCC" },
        spacing: [0],
        radius: [0],
        fontSize: [16],
        fontFamily: ["Arial"],
        fontWeight: [400],
      });

      const el = textElement();
      const corrections = buildCorrections([el], lowContrastSpec);
      const fix = corrections[`${el.component}|${JSON.stringify(el.styles)}`];

      expect(fix?.color).toBeUndefined();
    });

    it("still applies a color correction whose nearest token actually resolves the contrast failure", () => {
      // Same captured light-gray-on-white failure, but this spec's nearest
      // color is a near-black — a genuine fix, not just a Delta-E-nearest
      // pick that happens to also be unreadable.
      const fixingSpec: TokenSpec = validateTokenSpec({
        colors: { "brand-dark": "#111111" },
        spacing: [0],
        radius: [0],
        fontSize: [16],
        fontFamily: ["Arial"],
        fontWeight: [400],
      });

      const el = textElement();
      const corrections = buildCorrections([el], fixingSpec);
      const fix = corrections[`${el.component}|${JSON.stringify(el.styles)}`];

      expect(fix?.color).toBe("#111111");
    });

    it("does not gate on contrast at all for an element with no effectiveBackgroundColor (nothing the accessibility pass checked)", () => {
      const lowContrastSpec: TokenSpec = validateTokenSpec({
        colors: { "brand-light-gray": "#CCCCCC" },
        spacing: [0],
        radius: [0],
        fontSize: [16],
        fontFamily: ["Arial"],
        fontWeight: [400],
      });

      const el = textElement({ effectiveBackgroundColor: undefined, effectiveBackgroundResolved: undefined });
      const corrections = buildCorrections([el], lowContrastSpec);
      const fix = corrections[`${el.component}|${JSON.stringify(el.styles)}`];

      expect(fix?.color).toBe("#CCCCCC");
    });
  });
});
