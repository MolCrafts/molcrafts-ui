# @molcrafts/ui

## 0.1.0-alpha.0

### Minor Changes

- 4a4e686: Default to comfortable 40px controls and platform UI fonts. Compact density requires an explicit constraint. Large controls are 48px; monospace is reserved for code and identifiers.
- d2306e8: Prepare the initial MolCrafts UI package family: owned Fluent 2 tokens, scoped React themes, compiled CSS and an independent managed Web Components runtime. Replace the old package names directly; no compatibility aliases. This initial alpha covers foundations and preview components; complete component contracts and real-product integration remain subsequent work.
- 606108a: Add the generic dashboard blocks products used to vendor: WorkbenchShell, WorkbenchHeader and useWorkbenchDock, ExplorerPanel, WorkSurface, ContentSection, MetaStrip and MeasureBand, MetricList, StatusInline, BandSkeleton and RowsSkeleton, plus StatusMark (the nine-word status vocabulary), Meter, NavList and a controlled ThemeToggle. ResizableHandle now draws row dividers inside vertical groups. Dialog and Sheet close buttons are 40px and no longer carry a tooltip, so Escape closes the overlay on the first press.

### Patch Changes

- 6ab0276: Add optional native Vega View and shared Vega-Lite compiler adapters, lifecycle/theme/data/signal/export contracts and consumer stories. Keep core UI independent of plotting runtimes. Constrain ScrollArea content sizing for wide tables.
- Updated dependencies [4a4e686]
- Updated dependencies [d2306e8]
  - @molcrafts/ui-tokens@0.1.0-alpha.0
