# Acceptance — molcrafts-ui-chart-element-01

Binding contract. Status 2026-10-15: the element, its `./element` entry and `browser.js` bundle are implemented; AC-001/002/009/010 hold by package manifests and diff review. AC-003 to AC-008 have no browser test yet, so the spec is in progress, not done. `<molplot-chart>` remains the docs runtime.

| id | type | criterion | verify |
|----|------|-----------|--------|
| AC-001 | structural | `<molcrafts-chart>` is registered from `@molcrafts/ui-vega-lite` and is absent from `@molcrafts/ui` and `@molcrafts/ui-web-components` | package exports and dependency graph |
| AC-002 | structural | `@molcrafts/ui` and `@molcrafts/ui-web-components` still have no `vega` or `vega-lite` dependency | package.json |
| AC-003 | behavior | A child `<script type="application/json">` Vega-Lite spec renders one view | browser test |
| AC-004 | behavior | Empty and invalid JSON show an inline error and do not throw | browser test |
| AC-005 | behavior | `aspect` changes the height relative to the container width; the default is 4/3 | browser test |
| AC-006 | behavior | `interactive="false"` renders the figure without pan or zoom bindings | browser test |
| AC-007 | a11y | `label` is the accessible name; `label-hidden` does not draw the title | browser test |
| AC-008 | behavior | Loading, empty data, and failure each replace the plot with their own status | browser test |
| AC-009 | scope | MolPlot `RawChart`, `<molplot-chart>`, the docs formatter, and CI `VegaLiteView` are unchanged | diff review |
| AC-010 | scope | No `appendPoint` / `setSeries` / `setWindow` surface and no matplotlib API | public types |

## Non-criteria

- Replacing `<molplot-chart>` in molpy or the Zensical formatter
- Moving MolPlot's editor or streaming line-chart API
- Publishing the package

## Done when

AC-001–AC-010 pass in a later implementation. This document's existence does not satisfy them.
