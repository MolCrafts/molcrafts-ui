import {
  ArrowRepeatAllRegular,
  BranchRegular,
  CircleHintRegular,
  CircleRegular,
  FlowRegular,
  LayerRegular,
  SquareRegular,
} from "@fluentui/react-icons";
import type { FluentIcon } from "@fluentui/react-icons";
import type { JSX, ReactNode } from "react";
import { cn } from "../../lib/utils";

export type WorkflowNodeRole = "action" | "initial" | "final" | "branch" | "loop";
export type WorkflowNodeCanvasRole = "input" | "output" | "task";

export interface WorkflowNodeProps {
  title: string;
  taskType?: string | null;
  /** Product-rendered status. The node does not know run vocabulary. */
  status?: ReactNode;
  role?: WorkflowNodeRole;
  canvasRole?: WorkflowNodeCanvasRole;
  parallel?: boolean;
  subworkflow?: boolean;
  error?: string | null;
  selected?: boolean;
  onActivate?: () => void;
  footer?: ReactNode;
  className?: string;
  density?: "default" | "compact";
}

const ROLE_ICON: Record<WorkflowNodeRole, FluentIcon> = {
  action: SquareRegular,
  initial: CircleHintRegular,
  final: CircleRegular,
  branch: BranchRegular,
  loop: ArrowRepeatAllRegular,
};

const CANVAS_ICON: Record<WorkflowNodeCanvasRole, FluentIcon> = {
  input: CircleHintRegular,
  output: CircleRegular,
  task: SquareRegular,
};

/** Chrome for one workflow node. The graph engine owns drag, ports, and edges. */
export function WorkflowNode({
  title,
  taskType,
  status,
  role = "action",
  canvasRole,
  parallel,
  subworkflow,
  error,
  selected,
  onActivate,
  footer,
  className,
  density,
}: WorkflowNodeProps): JSX.Element {
  const compact = density === "compact" || Boolean(canvasRole);
  const NodeRoot = onActivate ? "button" : "div";
  const RoleIcon = canvasRole ? CANVAS_ICON[canvasRole] : ROLE_ICON[role];

  return (
    <NodeRoot
      type={onActivate ? "button" : undefined}
      onClick={onActivate}
      aria-current={selected ? "true" : undefined}
      className={cn(
        "relative w-full rounded-panel border border-border bg-surface text-left shadow-none",
        "transition-[background-color,border-color] duration-(--motion-base) ease-standard",
        compact ? "min-w-40 max-w-64 px-3 py-2" : "min-w-56 p-3",
        selected && "border-accent/60 bg-accent/5 ring-1 ring-accent/20",
        onActivate &&
          "cursor-pointer hover:bg-interactive/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <RoleIcon aria-hidden className="size-4 flex-none text-muted-foreground" />
        <span className="min-w-0 flex-1 truncate text-body font-medium text-foreground">{title}</span>
        {status}
      </div>
      {taskType ? <p className="mt-1 truncate pl-6 font-mono text-micro text-muted-foreground">{taskType}</p> : null}
      {parallel || subworkflow ? (
        <div className="mt-2 flex flex-wrap items-center gap-2 pl-6 text-micro text-muted-foreground">
          {parallel ? (
            <span className="inline-flex items-center gap-1">
              <LayerRegular aria-hidden className="size-3.5" />
              parallel
            </span>
          ) : null}
          {subworkflow ? (
            <span className="inline-flex items-center gap-1">
              <FlowRegular aria-hidden className="size-3.5" />
              subflow
            </span>
          ) : null}
        </div>
      ) : null}
      {error ? (
        <p className="mt-2 line-clamp-2 border-t border-status-failed/30 pt-2 font-mono text-micro text-status-failed-foreground leading-tight">
          {error}
        </p>
      ) : null}
      {footer ? <div className="mt-2 border-t border-border/70 pt-2">{footer}</div> : null}
    </NodeRoot>
  );
}
