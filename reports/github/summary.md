# GitHub (github.com) (real-app)

[**View the full report**](./report.html) — one self-contained file with the score, plain-English breakdown, and screenshots; opens directly in a browser from anywhere, no other files needed.

**Score: 5.3 / 100** — 0 is fully on-spec, 100 is maximally deviant.

Pages scored: 6

## Visual diagnostics

Per page: an overlay of the captured screenshot with flagged deviations boxed and color-coded by category, and a corrected render — the same page with every color/background-color/border-color/border-radius/font-family deviation patched to its nearest spec value in place (spacing, font-size, and font-weight are left alone since correcting them can reflow the layout).

- https://github.com/ — [overlay](./github-com-09a8b930-overlay.html) · [as it should have looked](./github-com-09a8b930-corrected.png)
- https://github.com/about — [overlay](./github-com-about-2d940023-overlay.html) · [as it should have looked](./github-com-about-2d940023-corrected.png)
- https://github.com/torvalds/linux — [overlay](./github-com-torvalds-linux-de967671-overlay.html) · [as it should have looked](./github-com-torvalds-linux-de967671-corrected.png)
- https://github.com/torvalds/linux/issues — [overlay](./github-com-torvalds-linux-issues-7cd892cb-overlay.html) · [as it should have looked](./github-com-torvalds-linux-issues-7cd892cb-corrected.png)
- https://github.com/torvalds/linux/pulls — [overlay](./github-com-torvalds-linux-pulls-12c68532-overlay.html) · [as it should have looked](./github-com-torvalds-linux-pulls-12c68532-corrected.png)
- https://github.com/torvalds — [overlay](./github-com-torvalds-8f7010b5-overlay.html) · [as it should have looked](./github-com-torvalds-8f7010b5-corrected.png)

## Breakdown by property

| property | mean deviation | n |
|---|---|---|
| font-family | 0.25 | 395 |
| font-size | 0.09 | 395 |
| border-color | 0.07 | 94 |
| border-radius | 0.06 | 384 |
| background-color | 0.04 | 144 |
| color | 0.04 | 395 |
| spacing | 0.03 | 3160 |
| font-weight | 0.01 | 395 |

## Worst offenders

_Ordered by occurrence/spread/area-boosted score, not raw normalized distance — a deviation repeated widely across the product outranks a one-off more severe one. `normalized` itself is still the raw, unboosted severity._

| what's wrong | page | component | instance | raw value | nearest token | normalized |
|---|---|---|---|---|---|---|
| font size is 18px, should be 16px | https://github.com/ | span/text | 512d0512 | font-size: 18 | font-size:16 | 1.00 |
| using "Mona Sans" instead of "ui-monospace" | https://github.com/ | span/text | 512d0512 | font-family: "Mona Sans", MonaSansFallback, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" | font-family:ui-monospace | 1.00 |
| font size is 22px, should be 20px | https://github.com/ | span/text | c438683e | font-size: 22 | font-size:20 | 1.00 |
| using "Mona Sans" instead of "ui-monospace" | https://github.com/ | span/text | c438683e | font-family: "Mona Sans", MonaSansFallback, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" | font-family:ui-monospace | 1.00 |
| using "Mona Sans" instead of "ui-monospace" | https://github.com/ | h2/text | 92c55e51 | font-family: "Mona Sans", MonaSansFallback, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" | font-family:ui-monospace | 1.00 |
| font size is 18px, should be 16px | https://github.com/ | span/text | 957e173a | font-size: 18 | font-size:16 | 1.00 |
| using "Mona Sans" instead of "ui-monospace" | https://github.com/ | span/text | 957e173a | font-family: "Mona Sans", MonaSansFallback, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" | font-family:ui-monospace | 1.00 |
| font size is 22px, should be 20px | https://github.com/ | span/text | c67ab197 | font-size: 22 | font-size:20 | 1.00 |
| using "Mona Sans" instead of "ui-monospace" | https://github.com/ | span/text | c67ab197 | font-family: "Mona Sans", MonaSansFallback, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" | font-family:ui-monospace | 1.00 |
| font size is 22px, should be 20px | https://github.com/ | span/text | f176b065 | font-size: 22 | font-size:20 | 1.00 |
| using "Mona Sans" instead of "ui-monospace" | https://github.com/ | span/text | f176b065 | font-family: "Mona Sans", MonaSansFallback, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" | font-family:ui-monospace | 1.00 |
| font size is 48px, should be 40px | https://github.com/ | span/text | ecd2e54d | font-size: 48 | font-size:40 | 1.00 |
| using "Mona Sans" instead of "ui-monospace" | https://github.com/ | span/text | ecd2e54d | font-family: "Mona Sans", MonaSansFallback, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" | font-family:ui-monospace | 1.00 |
| font weight is 800, should be 600 (lighter than what's used) | https://github.com/ | span/text | ecd2e54d | font-weight: 800 | font-weight:600 | 1.00 |
| using "Mona Sans" instead of "ui-monospace" | https://github.com/ | span/text | 2495d3da | font-family: "Mona Sans", MonaSansFallback, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" | font-family:ui-monospace | 1.00 |
| top-left corner radius is 60px, should be 12px | https://github.com/ | button | 7882110f | border-radius (border-top-left-radius): 60 | border-radius:12 | 1.00 |
| using "Mona Sans" instead of "ui-monospace" | https://github.com/ | span/text | e3f1664d | font-family: "Mona Sans", MonaSansFallback, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" | font-family:ui-monospace | 1.00 |
| using "Mona Sans" instead of "ui-monospace" | https://github.com/ | button/text | 84284725 | font-family: "Mona Sans", MonaSansFallback, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" | font-family:ui-monospace | 1.00 |
| padding-top is 6px, should be 4px | https://github.com/ | a | 78ff1dc8 | spacing (padding-top): 6 | spacing:4 | 1.00 |
| padding-right is 20px, should be 16px | https://github.com/ | a | 78ff1dc8 | spacing (padding-right): 20 | spacing:16 | 1.00 |
| padding-bottom is 6px, should be 4px | https://github.com/ | a | 78ff1dc8 | spacing (padding-bottom): 6 | spacing:4 | 1.00 |
| padding-left is 20px, should be 16px | https://github.com/ | a | 78ff1dc8 | spacing (padding-left): 20 | spacing:16 | 1.00 |
| using "Mona Sans" instead of "ui-monospace" | https://github.com/ | button | 7e815292 | font-family: "Mona Sans", MonaSansFallback, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" | font-family:ui-monospace | 1.00 |
| padding-top is 6px, should be 4px | https://github.com/ | button | 7e815292 | spacing (padding-top): 6 | spacing:4 | 1.00 |
| padding-right is 20px, should be 16px | https://github.com/ | button | 7e815292 | spacing (padding-right): 20 | spacing:16 | 1.00 |
| padding-bottom is 6px, should be 4px | https://github.com/ | button | 7e815292 | spacing (padding-bottom): 6 | spacing:4 | 1.00 |
| padding-left is 20px, should be 16px | https://github.com/ | button | 7e815292 | spacing (padding-left): 20 | spacing:16 | 1.00 |
| font size is 18px, should be 16px | https://github.com/ | span/text | 0dece52d | font-size: 18 | font-size:16 | 1.00 |
| using "Mona Sans" instead of "ui-monospace" | https://github.com/ | span/text | 0dece52d | font-family: "Mona Sans", MonaSansFallback, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" | font-family:ui-monospace | 1.00 |
| font size is 22px, should be 20px | https://github.com/ | span/text | 53a0795a | font-size: 22 | font-size:20 | 1.00 |

## Accessibility — WCAG contrast

_Separate from the deviation score above: this checks captured text against WCAG 2.1's own contrast thresholds, independent of the brand spec — an element can be on-spec and still fail contrast, or off-spec and still pass._

Checked: 251, passing: 234, failing: 17

| finding | page | component | ratio | level | spec-token fix |
|---|---|---|---|---|---|
| text here is barely readable against its background — 1.0:1, needs at least 4.5:1 for AA | https://github.com/ | span/text | 1.0:1 | fail | — |
| text here is barely readable against its background — 1.0:1, needs at least 4.5:1 for AA | https://github.com/about | span/text | 1.0:1 | fail | — |
| text here is barely readable against its background — 1.0:1, needs at least 4.5:1 for AA | https://github.com/torvalds/linux | span/text | 1.0:1 | fail | — |
| text here is barely readable against its background — 1.0:1, needs at least 4.5:1 for AA | https://github.com/torvalds/linux/issues | span/text | 1.0:1 | fail | — |
| text here is barely readable against its background — 1.0:1, needs at least 4.5:1 for AA | https://github.com/torvalds/linux/pulls | span/text | 1.0:1 | fail | — |
| text here is barely readable against its background — 1.0:1, needs at least 4.5:1 for AA | https://github.com/torvalds | span/text | 1.0:1 | fail | — |
| text here is barely readable against its background — 1.0:1, needs at least 4.5:1 for AA | https://github.com/ | div/text | 1.0:1 | fail | — |
| text here is barely readable against its background — 1.0:1, needs at least 4.5:1 for AA | https://github.com/ | div/text | 1.0:1 | fail | — |
| text here is barely readable against its background — 1.4:1, needs at least 4.5:1 for AA | https://github.com/ | label/text | 1.4:1 | fail | — |
| text here is barely readable against its background — 1.2:1, needs at least 4.5:1 for AA | https://github.com/torvalds | span/text | 1.2:1 | fail | — |
| text here is barely readable against its background — 1.7:1, needs at least 4.5:1 for AA | https://github.com/torvalds/linux/pulls | span/text | 1.7:1 | fail | — |
| text here is barely readable against its background — 1.9:1, needs at least 4.5:1 for AA | https://github.com/torvalds | span/text | 1.9:1 | fail | — |
| text here is barely readable against its background — 2.7:1, needs at least 4.5:1 for AA | https://github.com/torvalds | span/text | 2.7:1 | fail | — |
| text here is barely readable against its background — 4.2:1, needs at least 4.5:1 for AA | https://github.com/torvalds/linux/issues | div/text | 4.2:1 | fail | — |
| text here is barely readable against its background — 4.2:1, needs at least 4.5:1 for AA | https://github.com/torvalds/linux | span/text | 4.2:1 | fail | — |
| text here is barely readable against its background — 4.2:1, needs at least 4.5:1 for AA | https://github.com/torvalds/linux/issues | span/text | 4.2:1 | fail | — |
| text here is barely readable against its background — 4.2:1, needs at least 4.5:1 for AA | https://github.com/torvalds/linux/pulls | span/text | 4.2:1 | fail | — |
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://github.com/torvalds/linux | span/text | 4.5:1 | AA | — |
| text here passes AA at 4.6:1 but falls short of AAA (needs 7:1) | https://github.com/torvalds/linux/issues | span/text | 4.6:1 | AA | — |
| text here passes AA at 4.6:1 but falls short of AAA (needs 7:1) | https://github.com/torvalds | span/text | 4.6:1 | AA | — |
| text here passes AA at 4.6:1 but falls short of AAA (needs 7:1) | https://github.com/torvalds/linux | span/text | 4.6:1 | AA | — |
| text here passes AA at 4.6:1 but falls short of AAA (needs 7:1) | https://github.com/torvalds/linux/issues | span/text | 4.6:1 | AA | — |
| text here passes AA at 4.6:1 but falls short of AAA (needs 7:1) | https://github.com/torvalds/linux/pulls | span/text | 4.6:1 | AA | — |
| text here passes AA at 4.6:1 but falls short of AAA (needs 7:1) | https://github.com/torvalds | span/text | 4.6:1 | AA | — |
| text here passes AA at 4.6:1 but falls short of AAA (needs 7:1) | https://github.com/ | a/text | 4.6:1 | AA | — |
| text here passes AA at 4.6:1 but falls short of AAA (needs 7:1) | https://github.com/about | a/text | 4.6:1 | AA | — |
| text here passes AA at 4.7:1 but falls short of AAA (needs 7:1) | https://github.com/ | span/text | 4.7:1 | AA | — |
| text here passes AA at 4.7:1 but falls short of AAA (needs 7:1) | https://github.com/ | span/text | 4.7:1 | AA | — |
| text here passes AA at 4.7:1 but falls short of AAA (needs 7:1) | https://github.com/about | span/text | 4.7:1 | AA | — |
| text here passes AA at 4.9:1 but falls short of AAA (needs 7:1) | https://github.com/torvalds/linux | a/text | 4.9:1 | AA | — |
| text here passes AA at 4.9:1 but falls short of AAA (needs 7:1) | https://github.com/torvalds/linux | a/text | 4.9:1 | AA | — |
| text here passes AA at 4.9:1 but falls short of AAA (needs 7:1) | https://github.com/torvalds/linux/issues | a/text | 4.9:1 | AA | — |
| text here passes AA at 4.9:1 but falls short of AAA (needs 7:1) | https://github.com/torvalds/linux/issues | a/text | 4.9:1 | AA | — |
| text here passes AA at 4.9:1 but falls short of AAA (needs 7:1) | https://github.com/torvalds/linux/pulls | a/text | 4.9:1 | AA | — |
| text here passes AA at 4.9:1 but falls short of AAA (needs 7:1) | https://github.com/torvalds/linux/pulls | a/text | 4.9:1 | AA | — |
| text here passes AA at 5.1:1 but falls short of AAA (needs 7:1) | https://github.com/torvalds/linux/issues | span/text | 5.1:1 | AA | — |
| text here passes AA at 5.1:1 but falls short of AAA (needs 7:1) | https://github.com/torvalds/linux/issues | span/text | 5.1:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://github.com/torvalds/linux | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://github.com/torvalds/linux | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://github.com/torvalds/linux | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://github.com/torvalds/linux | span/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://github.com/torvalds/linux/issues | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://github.com/torvalds/linux/pulls | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://github.com/torvalds/linux/pulls | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://github.com/torvalds/linux/pulls | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://github.com/torvalds | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://github.com/torvalds | span/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://github.com/torvalds | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://github.com/torvalds | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://github.com/torvalds | button/text | 5.2:1 | AA | — |
