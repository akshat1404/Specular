# Pinterest Gestalt (gestalt.pinterest.systems) (on-spec)

[**View the full report**](./report.html) — one self-contained file with the score, plain-English breakdown, and screenshots; opens directly in a browser from anywhere, no other files needed.

**Score: 3.7 / 100** — 0 is fully on-spec, 100 is maximally deviant.

_This is the company's own design-system site — it should score near zero. If it doesn't, treat that as a matcher bug, not real drift._

Pages scored: 5

## Visual diagnostics

Per page: an overlay of the captured screenshot with flagged deviations boxed and color-coded by category, and a corrected render — the same page with every color/background-color/border-color/border-radius/font-family deviation patched to its nearest spec value in place (spacing, font-size, and font-weight are left alone since correcting them can reflow the layout).

- https://gestalt.pinterest.systems/v1/foundations/overview — [overlay](./gestalt-pinterest-systems-v1-foundations-overview-f6a615a8-overlay.html) · [as it should have looked](./gestalt-pinterest-systems-v1-foundations-overview-f6a615a8-corrected.png)
- https://gestalt.pinterest.systems/v1/foundations/color/palette — [overlay](./gestalt-pinterest-systems-v1-foundations-color-palette-36107582-overlay.html) · [as it should have looked](./gestalt-pinterest-systems-v1-foundations-color-palette-36107582-corrected.png)
- https://gestalt.pinterest.systems/v1/foundations/typography — [overlay](./gestalt-pinterest-systems-v1-foundations-typography-79c61dfc-overlay.html) · [as it should have looked](./gestalt-pinterest-systems-v1-foundations-typography-79c61dfc-corrected.png)
- https://gestalt.pinterest.systems/v1/foundations/design_tokens/overview — [overlay](./gestalt-pinterest-systems-v1-foundations-design-tokens-overv-2cb3e71f-overlay.html) · [as it should have looked](./gestalt-pinterest-systems-v1-foundations-design-tokens-overv-2cb3e71f-corrected.png)
- https://gestalt.pinterest.systems/v1/get_started/about_us — [overlay](./gestalt-pinterest-systems-v1-get-started-about-us-ad978d12-overlay.html) · [as it should have looked](./gestalt-pinterest-systems-v1-get-started-about-us-ad978d12-corrected.png)

## Breakdown by property

| property | mean deviation | n |
|---|---|---|
| font-family | 0.52 | 656 |
| spacing | 0.00 | 5248 |
| font-size | 0.00 | 656 |
| border-radius | 0.00 | 655 |
| border-color | 0.00 | 67 |
| background-color | 0.00 | 256 |
| color | 0.00 | 656 |
| font-weight | 0.00 | 656 |

## Worst offenders

_Ordered by occurrence/spread/area-boosted score, not raw normalized distance — a deviation repeated widely across the product outranks a one-off more severe one. `normalized` itself is still the raw, unboosted severity._

| what's wrong | page | component | instance | raw value | nearest token | normalized |
|---|---|---|---|---|---|---|
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/overview | div | ca190e70 | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/overview | div | 194eeafc | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/color/palette | div | 420fe205 | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/color/palette | div | fab65161 | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/overview | div | d7d791b7 | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/color/palette | div | d7d791b7 | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/overview | div | eeed7616 | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/overview | div | 884de69a | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/color/palette | div | eeed7616 | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/color/palette | div | 884de69a | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/color/palette | div | 103d88c6 | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/color/palette | div | b59fc717 | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/overview | nav | 5b434460 | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/color/palette | div | 7f8d0684 | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/color/palette | div | 5478ebed | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/color/palette | div | 24fa464a | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/color/palette | div | 9cf80e13 | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/color/palette | div | 75e6c610 | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/color/palette | div | d6363a38 | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/color/palette | div | 79aa59ca | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/color/palette | div | b380ad89 | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/color/palette | div | 90c17386 | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/color/palette | div | 36f54613 | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/color/palette | div | d6a43779 | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/color/palette | div | f3daebd3 | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/color/palette | div | 7e6ad0e1 | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/color/palette | div | e1352bb5 | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/color/palette | div | c4614abd | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/color/palette | div | a6f47c96 | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |
| using "Times New Roman" instead of "-apple-system" | https://gestalt.pinterest.systems/v1/foundations/color/palette | div | 7588032d | font-family: "Times New Roman" | font-family:-apple-system | 1.00 |

## Accessibility — WCAG contrast

_Separate from the deviation score above: this checks captured text against WCAG 2.1's own contrast thresholds, independent of the brand spec — an element can be on-spec and still fail contrast, or off-spec and still pass._

Checked: 349, passing: 347, failing: 2

| finding | page | component | ratio | level | spec-token fix |
|---|---|---|---|---|---|
| text here is barely readable against its background — 2.1:1, needs at least 3:1 for AA | https://gestalt.pinterest.systems/v1/foundations/design_tokens/overview | div/text | 2.1:1 | fail | — |
| text here is barely readable against its background — 2.5:1, needs at least 3:1 for AA | https://gestalt.pinterest.systems/v1/foundations/design_tokens/overview | div/text | 2.5:1 | fail | — |
| text here passes AA at 3.9:1 but falls short of AAA (needs 4.5:1) | https://gestalt.pinterest.systems/v1/foundations/design_tokens/overview | div/text | 3.9:1 | AA | — |
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/overview | div/text | 4.5:1 | AA | — |
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 4.5:1 | AA | — |
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 4.5:1 | AA | — |
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/typography | div/text | 4.5:1 | AA | — |
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/design_tokens/overview | div/text | 4.5:1 | AA | — |
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/design_tokens/overview | span/text | 4.5:1 | AA | — |
| text here passes AAA at 4.5:1 | https://gestalt.pinterest.systems/v1/foundations/design_tokens/overview | div/text | 4.5:1 | AAA | — |
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/get_started/about_us | div/text | 4.5:1 | AA | — |
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 4.5:1 | AA | — |
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 4.5:1 | AA | — |
| text here passes AAA at 4.5:1 | https://gestalt.pinterest.systems/v1/foundations/design_tokens/overview | div/text | 4.5:1 | AAA | — |
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 4.5:1 | AA | — |
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 4.5:1 | AA | — |
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 4.5:1 | AA | — |
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 4.5:1 | AA | — |
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 4.5:1 | AA | — |
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 4.5:1 | AA | — |
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 4.5:1 | AA | — |
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 4.5:1 | AA | — |
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/design_tokens/overview | span/text | 4.5:1 | AA | — |
| text here passes AAA at 4.5:1 | https://gestalt.pinterest.systems/v1/foundations/design_tokens/overview | div/text | 4.5:1 | AAA | — |
| text here passes AA at 4.6:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 4.6:1 | AA | — |
| text here passes AA at 4.6:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 4.6:1 | AA | — |
| text here passes AA at 4.8:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/overview | div/text | 4.8:1 | AA | — |
| text here passes AA at 4.8:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 4.8:1 | AA | — |
| text here passes AA at 4.8:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 4.8:1 | AA | — |
| text here passes AA at 4.8:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/typography | div/text | 4.8:1 | AA | — |
| text here passes AA at 4.8:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/design_tokens/overview | div/text | 4.8:1 | AA | — |
| text here passes AAA at 4.8:1 | https://gestalt.pinterest.systems/v1/foundations/design_tokens/overview | div/text | 4.8:1 | AAA | — |
| text here passes AA at 4.8:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/get_started/about_us | div/text | 4.8:1 | AA | — |
| text here passes AA at 4.8:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 4.8:1 | AA | — |
| text here passes AA at 4.8:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 4.8:1 | AA | — |
| text here passes AA at 4.8:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 4.8:1 | AA | — |
| text here passes AA at 4.8:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 4.8:1 | AA | — |
| text here passes AA at 4.8:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 4.8:1 | AA | — |
| text here passes AA at 4.8:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 4.8:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 5.2:1 | AA | — |
| text here passes AA at 5.3:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 5.3:1 | AA | — |
| text here passes AA at 5.3:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 5.3:1 | AA | — |
| text here passes AA at 5.3:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 5.3:1 | AA | — |
| text here passes AA at 5.3:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 5.3:1 | AA | — |
| text here passes AA at 5.4:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 5.4:1 | AA | — |
| text here passes AA at 5.4:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 5.4:1 | AA | — |
| text here passes AA at 5.6:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 5.6:1 | AA | — |
| text here passes AA at 5.6:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 5.6:1 | AA | — |
| text here passes AA at 5.7:1 but falls short of AAA (needs 7:1) | https://gestalt.pinterest.systems/v1/foundations/color/palette | div/text | 5.7:1 | AA | — |
