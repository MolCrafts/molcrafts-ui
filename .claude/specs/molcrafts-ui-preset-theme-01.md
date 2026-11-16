---
slug: molcrafts-ui-preset-theme-01
title: Scienceplots chart theme for the optional Vega viewers
status: implemented
created: 2026-10-11
product: molcrafts-ui
language: en
---

# molcrafts-ui-preset-theme-01 — Preset chart theme

## Summary

Let `@molcrafts/ui-vega` and `@molcrafts/ui-vega-lite` apply MolPlot's scienceplots chart look without copying the preset. The canonical file stays `molplot/presets/molplot.json`. Fluent product chrome, used by CI and MolPlot controls, stays separate from this figure theme.

This spec does not move the preset and does not generate matplotlib style files. `<molcrafts-chart preset="molplot">` consumes the generated snapshot.

## Domain basis

MolPlot's `molplot` preset is the single hand-edited source. It matches scienceplots' `science` base plus `no-latex`:

- categorical cycle of seven colors: `#0c5da5`, `#00b945`, `#ff9500`, `#ff2c00`, `#845b97`, `#474747`, `#9e9e9e`
- serif face: Times New Roman, Times, Nimbus Roman, serif
- type sizes: base and axis label 10pt, title 12pt, tick and legend 9pt
- line width 1pt
- light axes are black on a white figure face; dark axes are `#e5e5e5` on `#111113`
- default figure proportion 3.5 by 2.625 inches (4/3)

`scripts/build-presets.mjs` compiles that JSON into MolPlot's TypeScript, Python, and `.mplstyle` artifacts. Those generated files are MolPlot's. A second hand-edited copy in molcrafts-ui would split the source of truth.

The UI viewers already theme marks from inherited CSS tokens and `createChartConfig(theme)`. That Fluent theme is the product chrome. It is not the scienceplots figure theme. CI's trend chart should keep the product theme.

## Design

### Ownership

| Piece | Owner |
|------|------|
| `presets/molplot.json` and its schema | MolPlot |
| matplotlib / scienceplots rcParams and `.mplstyle` | MolPlot |
| Vega config for the same tokens, consumed as data | `@molcrafts/ui-vega` |
| Choice to apply it | the caller (`preset="molplot"` on the future chart element, or a prop on the React viewers) |

The UI package does not import MolPlot. A reviewed snapshot of the preset tokens may be checked into the Vega package only as a generated artifact with a drift check against the MolPlot JSON. Hand-editing that snapshot is not allowed. If the snapshot cannot be refreshed from the MolPlot file in the same change, the theme is not added.

### Theme contents

The Vega config produced from the preset sets, for both light and dark:

- the seven-color categorical cycle and the default mark color `#0c5da5`
- serif axis, title, and legend type at the preset point sizes
- line stroke width of 1pt
- axis domain and tick color from the preset mode
- transparent chart background and the preset figure face
- no Fluent control font and no product primary color on marks

A spec that sets its own `config` or encoding colors wins, matching MolPlot's rule that an author-supplied config is kept.

### What stays on the Fluent theme

`VegaLiteView` without a preset, including the CI sparkline, continues to use inherited product tokens. Applying the scienceplots theme is opt-in.

## Files

A later implementation may add a theme module and a drift check under `packages/vega`, plus a `preset` prop on the React viewers. It may then be selected by [molcrafts-ui-chart-element-01](molcrafts-ui-chart-element-01.md). It does not edit `presets/*.json`.

## Out of scope

Moving the preset out of MolPlot, twin axes, paper DPI, the Python renderer, and restyling CI charts.
