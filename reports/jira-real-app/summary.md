# Jira (jira.atlassian.com) (real-app)

[**View the full report**](./report.html) — one self-contained file with the score, plain-English breakdown, and screenshots; opens directly in a browser from anywhere, no other files needed.

**Score: 22.2 / 100** — 0 is fully on-spec, 100 is maximally deviant.

Pages scored: 3, excluded as unstable: 1

## Unstable pages (excluded from score)
- https://jira.atlassian.com/

## Visual diagnostics

Per page: an overlay of the captured screenshot with flagged deviations boxed and color-coded by category, and a corrected render — the same page with every color/background-color/border-color/border-radius/font-family deviation patched to its nearest spec value in place (spacing, font-size, and font-weight are left alone since correcting them can reflow the layout).

- https://jira.atlassian.com/projects/JRACLOUD/summary — [overlay](./jira-atlassian-com-projects-JRACLOUD-summary-41375c9b-overlay.html) · [as it should have looked](./jira-atlassian-com-projects-JRACLOUD-summary-41375c9b-corrected.png)
- https://jira.atlassian.com/projects/CONFCLOUD/summary — [overlay](./jira-atlassian-com-projects-CONFCLOUD-summary-17d837f4-overlay.html) · [as it should have looked](./jira-atlassian-com-projects-CONFCLOUD-summary-17d837f4-corrected.png)
- https://jira.atlassian.com/projects/JSWCLOUD/summary — [overlay](./jira-atlassian-com-projects-JSWCLOUD-summary-0e9f5c04-overlay.html) · [as it should have looked](./jira-atlassian-com-projects-JSWCLOUD-summary-0e9f5c04-corrected.png)

## Breakdown by property

| property | mean deviation | n |
|---|---|---|
| font-family | 1.00 | 75 |
| color | 0.17 | 75 |
| border-radius | 0.16 | 75 |
| border-color | 0.13 | 6 |
| spacing | 0.10 | 600 |
| background-color | 0.03 | 15 |
| font-weight | 0.03 | 75 |
| font-size | 0.00 | 75 |

## Worst offenders

| what's wrong | page | component | instance | raw value | nearest token | normalized |
|---|---|---|---|---|---|---|
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | nav | bef0ff3e | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |
| padding-right is 10px, should be 8px | https://jira.atlassian.com/projects/JRACLOUD/summary | nav | bef0ff3e | spacing (padding-right): 10 | spacing:8 | 1.00 |
| padding-left is 10px, should be 8px | https://jira.atlassian.com/projects/JRACLOUD/summary | nav | bef0ff3e | spacing (padding-left): 10 | spacing:8 | 1.00 |
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | span/text | 7e0e6678 | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | span/text | 715483ea | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | span/text | 144f366f | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | 9438a088 | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |
| padding-left is 10px, should be 8px | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | 9438a088 | spacing (padding-left): 10 | spacing:8 | 1.00 |
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | a23c9f94 | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |
| padding-right is 10px, should be 8px | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | a23c9f94 | spacing (padding-right): 10 | spacing:8 | 1.00 |
| padding-left is 10px, should be 8px | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | a23c9f94 | spacing (padding-left): 10 | spacing:8 | 1.00 |
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | bf8bfb8e | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | 813db131 | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |
| padding-left is 29px, should be 32px | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | 813db131 | spacing (padding-left): 29 | spacing:32 | 1.00 |
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | ae3f4c59 | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | b4a4a935 | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | 0cbbebf7 | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |
| margin-right is 426.5px, should be 80px | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | 0cbbebf7 | spacing (margin-right): 426.5 | spacing:80 | 1.00 |
| margin-left is 426.5px, should be 80px | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | 0cbbebf7 | spacing (margin-left): 426.5 | spacing:80 | 1.00 |
| top-left corner radius is 3px, should be 2px | https://jira.atlassian.com/projects/JRACLOUD/summary | input | dcbe219d | border-radius (border-top-left-radius): 3 | border-radius:2 | 1.00 |
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | input | dcbe219d | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |
| padding-right is 10px, should be 8px | https://jira.atlassian.com/projects/JRACLOUD/summary | input | dcbe219d | spacing (padding-right): 10 | spacing:8 | 1.00 |
| padding-left is 30px, should be 32px | https://jira.atlassian.com/projects/JRACLOUD/summary | input | dcbe219d | spacing (padding-left): 30 | spacing:32 | 1.00 |
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | section/text | 9e197e04 | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | div | 4ea1a090 | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | div | ce1074b8 | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |
| padding-right is 10px, should be 8px | https://jira.atlassian.com/projects/JRACLOUD/summary | div | ce1074b8 | spacing (padding-right): 10 | spacing:8 | 1.00 |
| padding-left is 10px, should be 8px | https://jira.atlassian.com/projects/JRACLOUD/summary | div | ce1074b8 | spacing (padding-left): 10 | spacing:8 | 1.00 |
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | div | 83b7b4c0 | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |
| padding-left is 280px, should be 80px | https://jira.atlassian.com/projects/JRACLOUD/summary | div | 83b7b4c0 | spacing (padding-left): 280 | spacing:80 | 1.00 |

## Accessibility — WCAG contrast

_Separate from the deviation score above: this checks captured text against WCAG 2.1's own contrast thresholds, independent of the brand spec — an element can be on-spec and still fail contrast, or off-spec and still pass._

Checked: 54, passing: 54, failing: 0

| finding | page | component | ratio | level | spec-token fix |
|---|---|---|---|---|---|
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/projects/JRACLOUD/summary | button/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/projects/CONFCLOUD/summary | button/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/projects/CONFCLOUD/summary | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/projects/CONFCLOUD/summary | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/projects/CONFCLOUD/summary | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/projects/CONFCLOUD/summary | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/projects/JSWCLOUD/summary | button/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/projects/JSWCLOUD/summary | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/projects/JSWCLOUD/summary | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/projects/JSWCLOUD/summary | a/text | 5.2:1 | AA | — |
| text here passes AAA at 7.2:1 | https://jira.atlassian.com/projects/JRACLOUD/summary | span/text | 7.2:1 | AAA | — |
| text here passes AAA at 7.2:1 | https://jira.atlassian.com/projects/CONFCLOUD/summary | span/text | 7.2:1 | AAA | — |
| text here passes AAA at 7.2:1 | https://jira.atlassian.com/projects/JSWCLOUD/summary | span/text | 7.2:1 | AAA | — |
| text here passes AAA at 7.7:1 | https://jira.atlassian.com/projects/JRACLOUD/summary | li/text | 7.7:1 | AAA | — |
| text here passes AAA at 7.7:1 | https://jira.atlassian.com/projects/CONFCLOUD/summary | li/text | 7.7:1 | AAA | — |
| text here passes AAA at 7.7:1 | https://jira.atlassian.com/projects/JSWCLOUD/summary | li/text | 7.7:1 | AAA | — |
| text here passes AAA at 8.5:1 | https://jira.atlassian.com/projects/JRACLOUD/summary | span/text | 8.5:1 | AAA | — |
| text here passes AAA at 8.5:1 | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | 8.5:1 | AAA | — |
| text here passes AAA at 8.5:1 | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | 8.5:1 | AAA | — |
| text here passes AAA at 8.5:1 | https://jira.atlassian.com/projects/CONFCLOUD/summary | span/text | 8.5:1 | AAA | — |
| text here passes AAA at 8.5:1 | https://jira.atlassian.com/projects/CONFCLOUD/summary | a/text | 8.5:1 | AAA | — |
| text here passes AAA at 8.5:1 | https://jira.atlassian.com/projects/CONFCLOUD/summary | a/text | 8.5:1 | AAA | — |
| text here passes AAA at 8.5:1 | https://jira.atlassian.com/projects/JSWCLOUD/summary | span/text | 8.5:1 | AAA | — |
| text here passes AAA at 8.5:1 | https://jira.atlassian.com/projects/JSWCLOUD/summary | a/text | 8.5:1 | AAA | — |
| text here passes AAA at 8.5:1 | https://jira.atlassian.com/projects/JSWCLOUD/summary | a/text | 8.5:1 | AAA | — |
| text here passes AAA at 13.3:1 | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | 13.3:1 | AAA | — |
| text here passes AAA at 13.3:1 | https://jira.atlassian.com/projects/CONFCLOUD/summary | a/text | 13.3:1 | AAA | — |
| text here passes AAA at 13.3:1 | https://jira.atlassian.com/projects/JSWCLOUD/summary | a/text | 13.3:1 | AAA | — |
| text here passes AAA at 14.1:1 | https://jira.atlassian.com/projects/JRACLOUD/summary | section/text | 14.1:1 | AAA | — |
| text here passes AAA at 14.1:1 | https://jira.atlassian.com/projects/JRACLOUD/summary | span/text | 14.1:1 | AAA | — |
| text here passes AAA at 14.1:1 | https://jira.atlassian.com/projects/JRACLOUD/summary | iframe/text | 14.1:1 | AAA | — |
| text here passes AAA at 14.1:1 | https://jira.atlassian.com/projects/JRACLOUD/summary | dt/text | 14.1:1 | AAA | — |
| text here passes AAA at 14.1:1 | https://jira.atlassian.com/projects/JRACLOUD/summary | dt/text | 14.1:1 | AAA | — |
| text here passes AAA at 14.1:1 | https://jira.atlassian.com/projects/JRACLOUD/summary | dd/text | 14.1:1 | AAA | — |
| text here passes AAA at 14.1:1 | https://jira.atlassian.com/projects/CONFCLOUD/summary | section/text | 14.1:1 | AAA | — |
| text here passes AAA at 14.1:1 | https://jira.atlassian.com/projects/CONFCLOUD/summary | span/text | 14.1:1 | AAA | — |
| text here passes AAA at 14.1:1 | https://jira.atlassian.com/projects/CONFCLOUD/summary | h3/text | 14.1:1 | AAA | — |
| text here passes AAA at 14.1:1 | https://jira.atlassian.com/projects/CONFCLOUD/summary | p/text | 14.1:1 | AAA | — |
| text here passes AAA at 14.1:1 | https://jira.atlassian.com/projects/CONFCLOUD/summary | b/text | 14.1:1 | AAA | — |
| text here passes AAA at 14.1:1 | https://jira.atlassian.com/projects/CONFCLOUD/summary | iframe/text | 14.1:1 | AAA | — |
| text here passes AAA at 14.1:1 | https://jira.atlassian.com/projects/CONFCLOUD/summary | dt/text | 14.1:1 | AAA | — |
| text here passes AAA at 14.1:1 | https://jira.atlassian.com/projects/CONFCLOUD/summary | dt/text | 14.1:1 | AAA | — |
| text here passes AAA at 14.1:1 | https://jira.atlassian.com/projects/CONFCLOUD/summary | dd/text | 14.1:1 | AAA | — |
| text here passes AAA at 14.1:1 | https://jira.atlassian.com/projects/JSWCLOUD/summary | section/text | 14.1:1 | AAA | — |
| text here passes AAA at 14.1:1 | https://jira.atlassian.com/projects/JSWCLOUD/summary | span/text | 14.1:1 | AAA | — |
| text here passes AAA at 14.1:1 | https://jira.atlassian.com/projects/JSWCLOUD/summary | div/text | 14.1:1 | AAA | — |
