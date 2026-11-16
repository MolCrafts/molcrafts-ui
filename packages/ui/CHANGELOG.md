# @molcrafts/ui

## 0.1.0-alpha.1

### Minor Changes

- Add DocumentDock, a controlled multi-document tab strip. Tabs drag to reorder, to move into another pane, or to open a pane. Arrow keys switch documents, and Ctrl+Shift+Arrow moves the active document to the neighboring pane.
- Add InspectorSection, Field, Callout, Kbd, and IconAction. SettingsShell accepts `chrome="plain"` so a dialog can keep its own title.
- Add the playground surface blocks: Notebook (cell chrome with editor and output slots), FileExplorer (tree, rename, and delete confirmation), KernelStatus, and ConsolePane.
- Re-export `usePanelRef` and `PanelImperativeHandle` (also as `ResizablePanelHandle`) from the resizable panels so a product can collapse a rail through `@molcrafts/ui` without importing `react-resizable-panels`.
- Add the shared workbench controls molvis consumes: ConfirmDialog, IconTabStrip, PlaybackControls (with `PLAYBACK_SPEED_STEPS`), StatusBadge and `canonicalStatusFor`, ThinkingBlock, ToggleAction, ToolButton, ToolCallRow, Tree, NodeInspector (with its row and section), ParameterField, ParameterGroup, the Workbench action/heartbeat/operation-state/status-strip/tag blocks, and WorkflowNode. Add the `@molcrafts/ui/workflow` entry with WorkflowCanvas, an editable free-layout workflow canvas. `ResizablePanelHandle` names the imperative panel handle. Outline buttons and the active tab no longer draw a border. Secondary buttons keep a 1px `input` border (hover `input-hover`, disabled `disabled-border`): their `neutral` fill equals `surface`, so without it they disappear on cards, dialogs and notebooks.
- Slider draws one thumb per value, so two values make a range slider, and supports `orientation="vertical"`. `thumbLabels` names each thumb. The rail is the neutral accessible stroke instead of a translucent brand color; thumbs have hover and pressed states, the `.mol-focus` indicator, a 44px touch target, and use the disabled slots when the slider is disabled (the previous `disabled:` classes never matched, because a thumb is not a form control).

### Patch Changes

- @molcrafts/ui-tokens@0.1.0-alpha.1

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
