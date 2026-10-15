/**
 * Product-pattern blocks (domain-free). Settings chrome first.
 */
export { SettingsShell, type SettingsNavEntry, type SettingsShellProps } from "./settings-shell";
export { SettingsRow, SettingsSection } from "./settings-section";
export {
  EdgePanel,
  type EdgePanelProps,
  type EdgeSide,
} from "./edge-panel";
export { ContentSection, type ContentSectionProps } from "./content-section";
export { NodeInspector, type NodeInspectorProps } from "./node-inspector";
export { NodeInspectorRow, type NodeInspectorRowProps } from "./node-inspector-row";
export { NodeInspectorSection, type NodeInspectorSectionProps } from "./node-inspector-section";
export {
  ParameterField,
  type ParameterFieldDescriptor,
  type ParameterFieldProps,
} from "./parameter-field";
export { ParameterGroup, type ParameterGroupProps } from "./parameter-group";
export {
  WorkbenchAction,
  type WorkbenchActionKind,
  type WorkbenchActionProps,
  WorkbenchDismissAction,
  type WorkbenchDismissActionProps,
  WorkbenchIconAction,
  type WorkbenchIconActionProps,
  WorkbenchRetryAction,
  type WorkbenchRetryActionProps,
  WorkbenchToggleAction,
} from "./workbench-action";
export { WorkbenchHeartbeat, type WorkbenchHeartbeatProps } from "./workbench-heartbeat";
export {
  type WorkbenchOperationKind,
  WorkbenchOperationState,
  type WorkbenchOperationStateProps,
} from "./workbench-operation-state";
export { WorkbenchTag, type WorkbenchTagMeaning, type WorkbenchTagProps } from "./workbench-tag";
export {
  WorkbenchStatusStrip,
  type StatusLineKind,
  type WorkbenchStatusStripProps,
} from "./workbench-status-strip";
export {
  WorkflowNode,
  type WorkflowNodeCanvasRole,
  type WorkflowNodeProps,
  type WorkflowNodeRole,
} from "./workflow-node";
export { Field, type FieldProps } from "./field";
export { InspectorSection, type InspectorSectionProps } from "./inspector-section";
export { ExplorerPanel, type ExplorerPanelProps } from "./explorer-panel";
export {
  DocumentDock,
  type DocumentDockProps,
  type DocumentMove,
  type DocumentPane,
  type DocumentTab,
} from "./document-dock";
export { ConsolePane, type ConsoleLine, type ConsolePaneProps } from "./console-pane";
export { FileExplorer, type ExplorerFile, type FileExplorerProps } from "./file-explorer";
export { KernelStatus, type KernelPhase, type KernelStatusProps } from "./kernel-status";
export {
  Notebook,
  type NotebookCellModel,
  type NotebookCellPhase,
  type NotebookProps,
} from "./notebook";
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
