import {
  CheckmarkRegular,
  ErrorCircleRegular,
  InfoRegular,
  SpinnerIosRegular,
  WarningRegular,
} from "@fluentui/react-icons";
import type { JSX } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { WorkbenchHeartbeat } from "./workbench-heartbeat";

export type StatusLineKind = "info" | "error" | "success" | "warning";

export interface WorkbenchStatusStripProps {
  className?: string;
  beat?: number;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  text?: string;
  kind?: StatusLineKind;
  progress?: number;
  /** Changes when a new message arrives, so the line remounts. */
  pulse?: number;
  onDismiss?: () => void;
}

function ActivityIcon({ kind, progress, running }: { kind: StatusLineKind; progress?: number; running?: boolean }): JSX.Element {
  const className = "size-3 shrink-0";
  if (kind === "error") return <ErrorCircleRegular className={cn(className, "text-status-failed")} />;
  if (kind === "warning") return <WarningRegular className={cn(className, "text-status-warning")} />;
  if (kind === "success") return <CheckmarkRegular className={cn(className, "text-status-completed")} />;
  if (progress !== undefined || running) {
    return <SpinnerIosRegular className={cn(className, "mol-motion-progress-spin text-muted-foreground")} />;
  }
  return <InfoRegular className={cn(className, "text-muted-foreground")} />;
}

function activityTextClass(kind: StatusLineKind): string {
  switch (kind) {
    case "error":
      return "text-status-failed-foreground";
    case "warning":
      return "text-status-warning-foreground";
    case "success":
      return "text-status-completed-foreground";
    default:
      return "text-muted-foreground";
  }
}

/** Heartbeat plus one activity line. The product supplies the message. */
export function WorkbenchStatusStrip({
  className,
  beat = 0,
  onRefresh,
  isRefreshing = false,
  text = "",
  kind = "info",
  progress,
  pulse = 0,
  onDismiss,
}: WorkbenchStatusStripProps): JSX.Element {
  const hasText = text.length > 0;
  const showSyncing = !hasText && isRefreshing;
  const lineText = hasText ? text : showSyncing ? "Syncing…" : "";
  const lineKind: StatusLineKind = hasText ? kind : "info";
  const isAlert = hasText && (kind === "error" || kind === "warning");

  return (
    <div className={cn("flex h-statusbar min-w-0 flex-none items-center gap-1 border-t border-border bg-background px-1", className)}>
      <WorkbenchHeartbeat
        beat={beat}
        label={isRefreshing ? "Syncing…" : "Live sync — click to refresh"}
        running={isRefreshing}
        onClick={onRefresh}
        disabled={isRefreshing || !onRefresh}
      />
      <span className="mx-1 h-3.5 w-px flex-none bg-border" aria-hidden />
      <div
        role="status"
        aria-live={lineKind === "error" ? "assertive" : "polite"}
        className="min-w-0 flex-1 overflow-hidden px-2 font-mono text-micro tabular-nums"
      >
        {lineText && isAlert ? (
          <Button
            key={pulse}
            type="button"
            variant="ghost"
            size="content"
            className="flex w-full min-w-0 cursor-pointer justify-start gap-1.5 overflow-hidden rounded-none p-0 text-left font-mono text-micro tabular-nums hover:bg-transparent"
            title={`${lineText} (click to dismiss)`}
            onClick={onDismiss}
          >
            <ActivityIcon kind={lineKind} progress={progress} />
            <span className={cn("min-w-0 truncate leading-none", activityTextClass(lineKind))}>{lineText}</span>
          </Button>
        ) : lineText ? (
          <div key={hasText ? pulse : "syncing"} className="flex min-w-0 items-center gap-1.5 overflow-hidden" title={lineText}>
            <ActivityIcon kind={lineKind} progress={progress} running={showSyncing} />
            <span className={cn("min-w-0 truncate leading-none", activityTextClass(lineKind))}>{lineText}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
