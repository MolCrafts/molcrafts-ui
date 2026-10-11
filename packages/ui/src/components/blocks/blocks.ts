/**
 * Product-pattern blocks (domain-free). Settings chrome first.
 */
export { SettingsShell, type SettingsNavEntry } from "./settings-shell";
export { SettingsRow, SettingsSection } from "./settings-section";
export {
  EdgePanel,
  type EdgePanelProps,
  type EdgeSide,
} from "./edge-panel";
export { ContentSection, type ContentSectionProps } from "./content-section";
export { ExplorerPanel, type ExplorerPanelProps } from "./explorer-panel";
export { BandSkeleton, RowsSkeleton, type BandSkeletonProps, type RowsSkeletonProps } from "./loading-patterns";
export { MeasureBand, MetaStrip, type Measure, type MeasureBandProps, type MetaFact, type MetaStripProps } from "./meta-strip";
export { MetricList, type Metric, type MetricListProps } from "./metric-list";
export { StatusInline, type StatusInlineProps, type StatusSegment } from "./status-inline";
export { WorkSurface, type WorkSurfaceProps } from "./work-surface";
export {
  WorkbenchHeader,
  WorkbenchShell,
  useWorkbenchDock,
  type WorkbenchDock,
  type WorkbenchHeaderProps,
  type WorkbenchRegionLabels,
  type WorkbenchShellProps,
} from "./workbench-shell";
