# Acceptance — molcrafts-ui-preset-theme-01

Binding contract. Status 2026-10-15: AC-003 to AC-007 pass in `pnpm test:charts` (packages/vega/tests). AC-009 is `node scripts/check-scienceplots-preset.mjs`; it reads the sibling `molplot` checkout, so it runs locally and not in CI.

| id | type | criterion | verify |
|----|------|-----------|--------|
| AC-001 | structural | `molplot/presets/molplot.json` remains the only hand-edited preset | diff review |
| AC-002 | structural | `@molcrafts/ui-vega` does not depend on MolPlot or matplotlib | package.json |
| AC-003 | behavior | The opt-in theme uses the seven scienceplots colors, in that order | unit test against the preset JSON |
| AC-004 | behavior | Axis, title, and legend use the serif stack and the preset point sizes (10 / 12 / 9) | unit test of the Vega config |
| AC-005 | behavior | Default line width is 1pt | unit test of the Vega config |
| AC-006 | behavior | Light and dark modes use the preset foreground and figure face | unit test |
| AC-007 | behavior | An author-supplied spec `config` or encoding color is preserved | unit test |
| AC-008 | behavior | `VegaLiteView` without a preset still uses the inherited product theme | existing CI or storybook chart test |
| AC-009 | structural | Any checked-in snapshot fails the drift check when it disagrees with `presets/molplot.json` | script exit code |

## Non-criteria

- Regenerating MolPlot's Python or `.mplstyle` outputs
- Changing CI sparkline colors
- Publishing

## Done when

AC-001–AC-009 pass in a later implementation. This document's existence does not satisfy them.
