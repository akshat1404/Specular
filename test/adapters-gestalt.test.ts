import { describe, it, expect } from "vitest";
import { gestaltAdapter } from "../src/adapters/gestalt.js";

describe("gestaltAdapter", () => {
  it("produces a spec that satisfies the internal TokenSpec shape", () => {
    expect(() => gestaltAdapter()).not.toThrow();
  });

  it("includes a non-trivial color palette for both the light and dark themes", () => {
    const spec = gestaltAdapter();
    expect(Object.keys(spec.colors).length).toBeGreaterThan(100);
    expect(spec.themes?.dark).toBeDefined();
    expect(Object.keys(spec.themes!.dark).length).toBeGreaterThan(100);
  });

  it("collapses rgba() wash/overlay tokens to 6-digit hex", () => {
    const spec = gestaltAdapter();
    for (const hex of Object.values(spec.colors)) {
      expect(hex).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it("includes Pinterest's known brand red exactly, not an approximation", () => {
    const spec = gestaltAdapter();
    expect(Object.values(spec.colors)).toContain("#e60023");
  });

  it("reads the already-px spacing/radius scales directly, no rem conversion needed", () => {
    const spec = gestaltAdapter();
    expect(spec.spacing).toEqual(expect.arrayContaining([4, 8, 12, 16, 20, 24]));
    expect(spec.radius).toEqual(expect.arrayContaining([0, 4, 8, 12, 16]));
  });

  it("includes negative spacing tokens (legitimate negative-margin values), not just positive ones", () => {
    const spec = gestaltAdapter();
    expect(spec.spacing.some((n) => n < 0)).toBe(true);
  });

  it("excludes non-px rounding shapes (percentages, multi-value shorthand) from the radius scale", () => {
    const spec = gestaltAdapter();
    for (const r of spec.radius) {
      expect(Number.isFinite(r)).toBe(true);
    }
    // rounding-circle (50%) and rounding-pill (999px) exist in the raw
    // tokens; only the latter is a valid single px value.
    expect(spec.radius).toContain(999);
  });

  it("extracts font-size/weight/family from the flat font-* token map", () => {
    const spec = gestaltAdapter();
    expect(spec.fontSize).toEqual(expect.arrayContaining([12, 14, 16, 20, 28, 36]));
    expect(spec.fontWeight).toEqual(expect.arrayContaining([400, 600, 700]));
    expect(spec.fontFamily.length).toBeGreaterThan(0);
  });
});
