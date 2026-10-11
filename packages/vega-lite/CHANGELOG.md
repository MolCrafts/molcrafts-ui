# @molcrafts/ui-vega-lite

## 0.1.0-alpha.0

### Minor Changes

- 606108a: VegaView and VegaLiteView render `label` as a visible figure title and `description` as a caption shown once the chart is ready. Add `labelHidden` to keep the label as the accessible name without drawing it. An explicit `width` now includes the frame padding instead of clipping the plot. The default error alert shows the caught message. Axis titles use regular weight.
- 6ab0276: Add optional native Vega View and shared Vega-Lite compiler adapters, lifecycle/theme/data/signal/export contracts and consumer stories. Keep core UI independent of plotting runtimes. Constrain ScrollArea content sizing for wide tables.

### Patch Changes

- Updated dependencies [606108a]
- Updated dependencies [6ab0276]
  - @molcrafts/ui-vega@0.1.0-alpha.0
