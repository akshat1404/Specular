import type { CrawlTarget } from "./types.js";
import type { RegisteredTarget } from "./registry.js";
import { gestaltAdapter } from "../adapters/gestalt.js";

// gestalt.pinterest.systems/robots.txt itself redirects to an Okta sign-in
// page rather than serving a real robots.txt (the path isn't a defined
// route on their Next.js app, unlike the actual documentation pages below,
// which are genuinely public) — treated as "no crawl restrictions
// declared", same as atlassian.design's 404 case.
//
// The root site (gestalt.pinterest.systems/) is a "Gestalt 2.0" splash page
// that requires employee login (a visible "Login" link, and its own
// component/foundation sections aren't reachable as plain links) — not
// usable as a public on-spec baseline. What IS public: the "/v1/..."
// legacy docs, explicitly banner'd "This is Gestalt's legacy documentation
// ... might be outdated", but genuinely real — its color-palette page
// renders real Gestalt token values inline (checked directly: e.g. the
// swatch backgrounds on /v1/foundations/color/palette resolve to exactly
// gestalt-design-tokens' color-red-pushpin-0 through -900, not
// approximations). Component example pages (/v1/web/<component>) render
// their live examples inside a cross-origin CodeSandbox iframe our
// extractor can't reach, so those are skipped in favor of foundation pages
// that render real swatches/typography samples directly in the page's own
// DOM (confirmed no sandboxed iframe on each of the URLs below, or — for
// typography — real inline font-size samples in the main frame even though
// other, skipped sandboxes exist further down that same page).
// Scores 3.7/100 — near-zero, same as the other on-spec targets. The
// entire signal is one homogeneous category: unstyled prose text (plain
// <p> nodes in the legacy docs' markdown-rendered body copy) falling back
// to the browser default "Times New Roman" instead of the token's
// "-apple-system" stack. Doc-site-shell CSS reset, not component drift —
// same category of disclosed noise as carbon-onspec's.
const onSpec: CrawlTarget = {
  key: "pinterest-onspec",
  label: "Pinterest Gestalt (gestalt.pinterest.systems)",
  kind: "on-spec",
  urls: [
    "https://gestalt.pinterest.systems/v1/foundations/overview",
    "https://gestalt.pinterest.systems/v1/foundations/color/palette",
    "https://gestalt.pinterest.systems/v1/foundations/typography",
    "https://gestalt.pinterest.systems/v1/foundations/design_tokens/overview",
    "https://gestalt.pinterest.systems/v1/get_started/about_us",
  ],
};

// www.pinterest.com/robots.txt has a blanket "User-agent: * / Disallow: /"
// catch-all for any bot not on its explicit per-crawler allowlist (ours
// isn't) — the actual consumer product (feed, pins, boards) is off-limits
// to crawl regardless of login status, not just gated behind
// personalization. business.pinterest.com is the genuinely public
// Pinterest-owned surface instead ("User-agent: * / Allow: /", only
// /search-results? and the Bytespider AI-scraper disallowed) — same
// fallback reasoning the brief called for (a smaller, genuinely accessible
// target beats one padded with login-walled URLs), same spirit as skipping
// admin.shopify.com entirely for Polaris. All five pages redirect
// server-side to the /en-in/ locale regardless of which locale path is
// requested (geo-routed by request origin, confirmed directly rather than
// assumed) — using the URLs that actually resolve, same as Jira's
// /projects/<KEY>/summary choice over the redirecting /browse/<KEY>.
const realApp: CrawlTarget = {
  key: "pinterest-real-app",
  label: "Pinterest Business (business.pinterest.com)",
  kind: "real-app",
  urls: [
    "https://business.pinterest.com/en-in/",
    "https://business.pinterest.com/en-in/how-pinterest-works/",
    "https://business.pinterest.com/en-in/advertise/",
    "https://business.pinterest.com/en-in/success-stories/",
    "https://business.pinterest.com/en-in/guides-and-education/",
  ],
};

export const pinterestTargets: RegisteredTarget[] = [
  { target: onSpec, adapter: gestaltAdapter },
  { target: realApp, adapter: gestaltAdapter },
];
