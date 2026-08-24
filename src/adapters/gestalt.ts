import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import type { TokenSpec } from "../schema/tokenSpec.js";
import { validateTokenSpec } from "../schema/tokenSpec.js";
import { parseCssColor } from "../color/convert.js";

const require = createRequire(import.meta.url);
const PKG_ROOT = path.dirname(require.resolve("gestalt-design-tokens/package.json"));
/**
 * The package builds two theme families under dist/json: "classic" (its own
 * declared default — package.json "main" points at
 * dist/js/classic/constants.js) and "vr-theme"/"vr-theme-web-mapping" (a
 * newer, in-progress "visual refresh" not yet the package's default export).
 * Using "classic" here for the same reason every other adapter uses
 * whatever its package calls its primary theme, not a guess.
 *
 * Checked directly (live CSS custom property inspection, not assumed): the
 * gestalt.pinterest.systems docs site itself ships variable *names*
 * (`--base-*`/`--sema-*`/`--comp-*` three-tier naming) that match neither
 * published family exactly — their docs site evidently tracks their
 * monorepo continuously while npm publishing lags (the installed version
 * here is several months old per its own publish date). Exact token-name
 * parity with the live site couldn't be confirmed the way it could for
 * Carbon/Atlaskit/Polaris; "classic" is the real installed package's own
 * declared default, and its *values* (not variable names) are what the
 * matcher actually compares against captured computed styles.
 */
const DIST_JSON = path.join(PKG_ROOT, "dist", "json", "classic");

function readVariables(filename: string): Record<string, string> {
  return JSON.parse(readFileSync(path.join(DIST_JSON, filename), "utf-8"));
}

/** A handful of tokens (mostly wash/overlay colors) are rgba() with alpha, same rationale as every other adapter: collapse to 6-digit hex, alpha is informational to the color matcher, not part of the Delta-E distance. */
function toHex6(value: string): string | undefined {
  if (/^#[0-9a-fA-F]{6}$/.test(value)) return value;
  if (/^#[0-9a-fA-F]{3}$/.test(value)) return value;
  if (/^#[0-9a-fA-F]{8}$/.test(value)) return value.slice(0, 7);
  if (/^rgba?\(/.test(value)) {
    try {
      const { r, g, b } = parseCssColor(value);
      return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

function extractColors(vars: Record<string, string>): Record<string, string> {
  const colors: Record<string, string> = {};
  for (const [key, value] of Object.entries(vars)) {
    if (!key.startsWith("color-")) continue;
    const hex = toHex6(value);
    if (hex) colors[key] = hex;
  }
  return colors;
}

const PX_RE = /^(-?[\d.]+)px$/;

/**
 * Every gestalt-design-tokens dimension is already a plain px string (no
 * rem conversion needed, unlike Carbon/Primer/Atlaskit/Polaris). Matches
 * by key prefix rather than a fixed key list — `space-` also picks up the
 * package's own `space-negative-*` tokens (legitimate negative-margin
 * values), and `rounding-` naturally skips the handful of non-numeric
 * shapes (`50%`, multi-value shorthand like `50% 0px 0px 50%`) since those
 * don't match PX_RE.
 */
function extractPxScale(vars: Record<string, string>, prefix: string): number[] {
  const values: number[] = [];
  for (const [key, value] of Object.entries(vars)) {
    if (!key.startsWith(prefix)) continue;
    const match = value.match(PX_RE);
    if (match) values.push(Number(match[1]));
  }
  return values;
}

function firstFamily(stack: string): string {
  return stack.split(",")[0].trim().replace(/^['"]|['"]$/g, "");
}

/** Normalizes gestalt-design-tokens (Pinterest's Gestalt design system, "classic" theme) into the internal TokenSpec shape. */
export function gestaltAdapter(): TokenSpec {
  const light = readVariables("variables-light.json");
  const dark = readVariables("variables-dark.json");

  const fontWeight = Object.entries(light)
    .filter(([key]) => key.startsWith("font-weight-"))
    .map(([, value]) => Number(value))
    .filter((n) => Number.isFinite(n));

  const fontFamily = Object.entries(light)
    .filter(([key]) => key.startsWith("font-family-"))
    .map(([, value]) => firstFamily(value));

  return validateTokenSpec({
    colors: extractColors(light),
    themes: { dark: extractColors(dark) },
    spacing: [...new Set(extractPxScale(light, "space-"))],
    radius: [...new Set(extractPxScale(light, "rounding-"))],
    fontSize: [...new Set(extractPxScale(light, "font-size-"))],
    fontFamily: [...new Set(fontFamily)],
    fontWeight: [...new Set(fontWeight)],
  });
}
