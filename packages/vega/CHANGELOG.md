# @molcrafts/ui-vega

## 0.1.0-alpha.1

### Minor Changes

- `@molcrafts/ui-vega/preset` applies MolPlot's scienceplots figure theme as an opt-in, and `@molcrafts/ui-vega/view` exposes the framework-free renderer. `@molcrafts/ui-vega-lite/element` and the self-contained `browser.js` register `<molcrafts-chart>`, which renders one Vega-Lite JSON spec without React. Tooltips show a single anonymous `tooltip` field as its text and stay inside the chart.

### Patch Changes

- @molcrafts/ui-tokens@0.1.0-alpha.1

## 0.1.0-alpha.0

### Minor Changes

- 606108a: VegaView and VegaLiteView render `label` as a visible figure title and `description` as a caption shown once the chart is ready. Add `labelHidden` to keep the label as the accessible name without drawing it. An explicit `width` now includes the frame padding instead of clipping the plot. The default error alert shows the caught message. Axis titles use regular weight.
- 6ab0276: Add optional native Vega View and shared Vega-Lite compiler adapters, lifecycle/theme/data/signal/export contracts and consumer stories. Keep core UI independent of plotting runtimes. Constrain ScrollArea content sizing for wide tables.

### Patch Changes

- Updated dependencies [4a4e686]
- Updated dependencies [d2306e8]
  - @molcrafts/ui-tokens@0.1.0-alpha.0
