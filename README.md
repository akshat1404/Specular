# A Lint Check For Design

Deviation-detection engine for software products: diffs a running app's
*resolved* styles against a company's own brand token spec, and reports how
far they've drifted. Closer in spirit to Lighthouse/Sentry/a linter-as-a-
service than to a design tool: access it [here](https://akshat1404.github.io/Specular/)

## Approach

Headlessly drives the real app (Playwright) and reads `getComputedStyle()`
per element: the exact value the rendering engine used to paint the pixel,
after cascade/inheritance/theming/runtime JS have resolved. Not pixel
estimation (CV is parked as a fallback for the canvas/SVG/raster long tail).

- **Color**: Delta-E (CIEDE2000) in Lab space against the spec's palette,
  alpha- and theme-variant aware (an opacity or dark-mode variant of a token
  resolves back to that token instead of scoring as unrelated drift).
- **Spacing / radius / font-size**: distance to the nearest value on the
  spec's defined scale.
- **Font family / weight**: categorical family match, weight as a
  secondary numeric check.
- **Aggregation**: instance → component → page → product rollup into a
  0–100 deviation score.
- **Accessibility (WCAG contrast)**: a second, separate finding category,
  not blended into the score above: for every text-containing sampled
  element, walks up the DOM to resolve the actual (non-transparent)
  background it renders against, then checks the color/background pair
  against WCAG 2.1's own AA/AAA contrast thresholds. An element can be
  perfectly on-spec and still fail contrast, or off-spec and still pass;
  these are answering different questions, so they're reported side by
  side rather than folded together. Failing/borderline findings that are
  also a flagged color deviation get a tie-in note: what the contrast ratio
  would be if corrected to the nearest spec token, when that correction
  would actually cross a pass threshold.

## Project layout

```
src/
  schema/tokenSpec.ts       token spec shape + validator (the diff target)
  color/convert.ts          sRGB -> Lab, CIEDE2000, WCAG relative luminance + contrast ratio
  matchers/                 color / scale / font matchers -> PropertyDeviation
  accessibility/contrast.ts WCAG contrast checking -> AccessibilityFinding (separate from PropertyDeviation)
  extractor/
    extract.ts               tag-based extraction (data-component), used by fixtures
    sample.ts                 generic visible-element sampling for real pages, incl. effective-background resolution
    stabilize.ts               animation-disable, cookie-banner dismissal, lazy-load trigger
  aggregator/aggregate.ts    instance -> component -> page -> product rollup, worst-offenders, breakdown, accessibility
  adapters/                  per-company token-package -> TokenSpec normalizers (Level 2)
  targets/                   per-company crawl target definitions + registry (Level 2)
  cache/cache.ts             content-addressed extraction cache (Level 2, gitignored)
  report/report.ts           JSON + markdown report writer (Level 2, gitignored output)
  report/overlay.ts          deviation + accessibility box overlay: humanized tooltips, per-finding-kind color coding
  runCrawlTarget.ts          shared crawl -> score -> report driver, used by both validate.ts and audit.ts
  summary/rank.ts            cross-category top-3 finding selection for the one-page PDF summary
  summary/render.ts          one-page summary HTML template + CSS-cropped screenshot thumbnails
  summary/pdf.ts             renders + exports the summary via Playwright's page.pdf()
  pipeline.ts                Level 1 orchestrator: spec -> extract -> match -> aggregate
  validate.ts                Level 2 CLI: registry target (spec via adapter) -> crawl -> match -> aggregate -> report
  audit.ts                   generic CLI: your own TokenSpec + URLs, no registry entry required: see "Try it on your own site" below
  summaryPdf.ts               CLI: reports/<key>/report.json -> one-page PDF, see "One-page PDF summary" below
  cli.ts                     Level 1 CLI: runs pipeline against the synthetic fixtures
fixtures/                    synthetic compliant/deviant HTML + token spec
test/                        unit tests + end-to-end pipeline test
```

## Running

```
npm install
npx playwright install chromium
npm test
npm run report                          # Level 1: run against synthetic fixtures
npm run validate -- --target=github     # Level 2: run against a real company (see targets/registry.ts)
npm run validate -- --target=all        # Level 2: run against every registered target
```

## Try it on your own site

Every target above is hardwired into `targets/registry.ts`, but the pipeline itself
doesn't need a registry entry: that machinery only exists to translate a specific
company's npm token package into a `TokenSpec`. If you already have (or hand-write) a
`TokenSpec`-shaped JSON file (see `fixtures/token-spec.json` for the shape: `colors`,
optional `themes`, `spacing`/`radius`/`fontSize`/`fontWeight` scales, `fontFamily`), you
can point Specular at your own site directly, no adapter, no fork, no registry entry:

```
npm run audit -- --spec=./my-tokens.json --urls=https://example.com,https://example.com/about --label="My Company" --key=my-company
```

`--label` and `--key` are optional (derived from the first URL and from the label,
respectively, if omitted); `--urls-file=<path>` accepts a longer list, one URL per line,
as an alternative to `--urls`; `--kind=on-spec` opts a target into the "should score
near-zero" baseline framing (defaults to `real-app`, since an arbitrary site has no
guarantee of being a clean baseline the way this project's four hand-verified on-spec
targets are); `--refresh` bypasses the cache, same as `validate`. Output lands in
`reports/<key>/`: the same `report.json`/`summary.md`/`report.html`, overlay, and
accessibility findings every registered target gets, from the exact same pipeline.

## One-page PDF summary

`report.html` is diagnostic tooling: dark theme, tables, raw counts, built for someone
about to go fix code. A one-page PDF is a different deliverable for a different reader:
someone deciding whether to care in the first place. It's a deliberately separate,
explicit step, not something every `validate`/`audit` run produces automatically:

```
npm run summary-pdf -- --target=<key>
```

Reads the already-written `reports/<key>/report.json` and cached screenshots (works
identically whether that target came from the registry or from `audit`; run `validate`
or `audit` for that target first if `report.json` doesn't exist yet) and writes
`reports/<key>/summary.pdf`: the two headline numbers (deviation score, passing WCAG
contrast checks), and the top 3 findings ranked across *both* categories by a documented
impact heuristic (severity boosted by occurrence count/page spread/bounding-box area,
with accessibility findings weighted higher than a similarly-ranked deviation — see
`summary/rank.ts`), each as one plain-English sentence with a small cropped-screenshot
thumbnail where position data allows it. Rendered via Playwright's own `page.pdf()`, no
separate PDF library.

## Status

**Level 1 (core pipeline)**: schema, color/scale/font matchers, extractor,
aggregator; built and validated against synthetic fixtures (a compliant
component set and a deviant one with known, hand-computed injected
deviations).

**Level 2 (public design-system validation)**: one token adapter + crawl
target per company, validated against real, publicly reachable pages
(URL lists checked against each site's robots.txt, cached locally, capped
at a handful of pages per site):

| Target | Report | Kind | Score | Contrast (WCAG) | Notable finding |
|---|---|---|---|---|---|
| GitHub (github.com) | [view](https://htmlpreview.github.io/?https://github.com/akshat1404/Specular/blob/main/reports/github/report.html) | real-app | 5.3/100 | 17 fail / 251 checked | Font-family is the largest contributor, resolving to "Mona Sans" in places instead of the token's "Mona Sans VF", a marketing-vs-app font naming inconsistency |
| Carbon (carbondesignsystem.com) | [view](https://htmlpreview.github.io/?https://github.com/akshat1404/Specular/blob/main/reports/carbon-onspec/report.html) | on-spec | 1.8/100 | 0 fail / 233 checked | Residual noise is doc-site-shell CSS resets, not component drift |
| IBM (ibm.com) | [view](https://htmlpreview.github.io/?https://github.com/akshat1404/Specular/blob/main/reports/ibm-real-app/report.html) | real-app | 2.0/100 | 7 fail / 189 checked | Helvetica fallback where Plex is expected; marketing-hero type/spacing/radius beyond the core component scale |
| Atlassian Design (atlassian.design) | [view](https://htmlpreview.github.io/?https://github.com/akshat1404/Specular/blob/main/reports/atlassian-onspec/report.html) | on-spec | 1.9/100 | 10 fail / 190 checked | Near-zero; residual noise is oversized marketing headings |
| Jira (jira.atlassian.com) | [view](https://htmlpreview.github.io/?https://github.com/akshat1404/Specular/blob/main/reports/jira-real-app/report.html) | real-app | 18.3/100 | 0 fail / 73 checked | Legacy /projects/<KEY>/summary pages resolve to a generic OS font stack, not "Atlassian Sans"; drift concentrates in older, unmigrated UI, not the homepage |
| Shopify Polaris (shopify.dev) | [view](https://htmlpreview.github.io/?https://github.com/akshat1404/Specular/blob/main/reports/polaris-onspec/report.html) | on-spec, **unverified** | 15.5/100 | 3 fail / 71 checked | Not a matcher bug, but not a trustworthy baseline either: confirmed via DOM inspection that neither page (nor any other publicly reachable shopify.dev/polaris.shopify.com/storybook URL) renders actual Polaris components (no Polaris- classes, no Polaris custom elements). This is a generic docs-shell score, not comparable to the other three companies' on-spec numbers |
| Pinterest Gestalt (gestalt.pinterest.systems) | [view](https://htmlpreview.github.io/?https://github.com/akshat1404/Specular/blob/main/reports/pinterest-onspec/report.html) | on-spec | 3.7/100 | 2 fail / 349 checked | Near-zero; entire deviation signal is unstyled prose text falling back to "Times New Roman" instead of the token's "-apple-system" stack, doc-site-shell noise, not component drift |
| Pinterest Business (business.pinterest.com) | [view](https://htmlpreview.github.io/?https://github.com/akshat1404/Specular/blob/main/reports/pinterest-real-app/report.html) | real-app | 12.3/100 | 4 fail / 146 checked | Pinterest's proprietary "PinterestSansPro"/"PinterestUI" brand fonts used everywhere instead of the token's generic default; oversized hero typography (up to 78px) beyond the component scale |

Contrast counts are independent of the Score column (see Approach): e.g.
Jira scores worst on deviation (18.3) but has zero contrast failures, while
Atlassian's own on-spec site scores near-zero on deviation but still has 10
real contrast failures. Most captured failures are near-1:1 (e.g. white text
over a translucent white overlay): the effective-background resolver takes
the first non-transparent ancestor color as-is, so a semi-transparent
overlay's own faint color is used rather than what visually composites
underneath it or through a `backdrop-filter`; worth keeping in mind when
reading ratios near 1:1 on frosted-glass/overlay UI.

A related caveat, found investigating one of Pinterest's worst
contrast offenders (`business.pinterest.com/en-in/how-pinterest-works/`,
a "640M" stat card): 25 controlled Specular captures landed on the same
gray-on-gray (1.0:1) rendering every single time, yet a manual browser
visit showed the same element correctly styled — light background, black
text. Repeat testing ruled out Specular's own pipeline as the cause
(headless vs. headed Chromium, `navigator.webdriver`, animation-disabling,
wait duration, and locale all made no difference across the trials); the
likely explanation is that the page itself serves more than one rendering
of this component, and Specular's single-capture-per-page methodology
consistently landed on the broken one. A finding like this accurately
describes what Specular's capture actually saw — it isn't necessarily
what every visitor sees.

Two real bugs were found and fixed during this validation (not synthetic
fixtures, genuinely surfaced by messy real-world pages):

1. `border-radius` can resolve to a percentage (e.g. `50%` on a circular
   avatar) instead of px: the scale matcher now skips non-px values
   rather than crashing.
2. Heavy real sites often never reach Playwright's `networkidle` state
   (persistent analytics/chat-widget connections): navigation now uses
   `domcontentloaded` with a best-effort, non-fatal `networkidle` attempt
   afterward, rather than a hard timeout that silently marked every page
   unstable.

A third, more structural bug was caught by comparing on-spec vs. real-app
scores against each other: the instance score was a flat mean across every
pushed property, and spacing structurally contributes far more entries
(8: four padding + four margin sides) than any other category, so it
diluted color/typography deviations almost to invisibility. Fixed by
averaging *category* means (color, spacing, typography, radius) instead of
a flat per-property mean, confirmed by the on-spec/real-app score
ordering becoming directionally correct (real-app now scores at or above
its own on-spec baseline, not below it).

Each target's `reports/<key>/` also has an HTML overlay (captured
screenshot with flagged deviations boxed and color-coded by category, plus
failing WCAG contrast findings boxed in a fifth, distinct amber) and a
corrected-render PNG (same page, layout-safe properties: color,
background-color, border-color, border-radius, font-family, patched to
their nearest token in the same live session, before the page closes) per
crawled page, linked from that target's `summary.md` and embedded directly
in `report.html`. Box tooltips are plain-English sentences (the same
humanizer used for the worst-offenders table), not raw property/value/token
dumps: hover any box for "top-left corner radius is 3px, should be 2px"
rather than a distance number.

Deliberately unresolved for now (deployment/integration decisions, not
blocking the core math):

1. **Integration surface**: CI gate vs. periodic dashboard/monitoring.
2. **First render target**: Storybook instance vs. a live running app.
3. **Spec bootstrap**: hard-require a pre-existing token spec, or also
   support inferring one from a company's most consistent existing pages.
