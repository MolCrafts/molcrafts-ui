import type { JSX } from "react";
import { cn } from "../../lib/utils";
import { Badge } from "./badge";
import { ProgressSpinner } from "./progress-spinner";
import { type CanonicalStatus, canonicalStatusFor } from "./status";

export type StatusBadgeSize = "sm" | "md";
export type StatusTone = CanonicalStatus;

const TONE_CLASSES: Record<CanonicalStatus, string> = {
  draft: "bg-status-draft/10 text-muted-foreground",
  ready: "bg-status-ready/10 text-status-ready-foreground",
  queued: "bg-status-queued/10 text-foreground",
  running: "bg-status-running-soft text-status-running-foreground hover:bg-status-running-soft",
  completed: "bg-status-completed-soft text-status-completed-foreground hover:bg-status-completed-soft",
  failed: "bg-status-failed-soft text-status-failed-foreground hover:bg-status-failed-soft",
  cancelled: "bg-status-cancelled/10 text-muted-foreground",
  cached: "bg-status-cached/10 text-foreground",
  warning: "bg-status-warning-soft text-status-warning-foreground hover:bg-status-warning-soft",
};

const DOT_CLASSES: Record<CanonicalStatus, string> = {
  draft: "bg-status-draft",
  ready: "bg-status-ready",
  queued: "bg-status-queued",
  running: "bg-status-running",
  completed: "bg-status-completed",
  failed: "bg-status-failed",
  cancelled: "bg-status-cancelled",
  cached: "bg-status-cached",
  warning: "bg-status-warning",
};

const SIZE_CLASSES: Record<StatusBadgeSize, string> = {
  sm: "px-2 py-0 text-micro font-medium",
  md: "px-2 py-1 text-label font-medium",
};

export interface StatusBadgeProps {
  status: string | null | undefined;
  size?: StatusBadgeSize;
  /** Leading dot. `running` always uses a spinner instead. */
  dot?: boolean;
  showLabel?: boolean;
}

export function statusToneFor(status: string | null | undefined): CanonicalStatus {
  return canonicalStatusFor(status) ?? "ready";
}

export function statusDotClass(status: string | null | undefined): string {
  return DOT_CLASSES[statusToneFor(status)];
}

export function StatusBadge({
  status,
  size = "md",
  dot = false,
  showLabel = true,
}: StatusBadgeProps): JSX.Element | null {
  if (!status) return null;
  const tone = statusToneFor(status);
  const label = tone;
  const sourceStatus = status.toLowerCase();
  const title = sourceStatus === label ? label : `Reported as ${sourceStatus}`;

  if (tone === "running") {
    return (
      <Badge
        variant="outline"
        aria-label={showLabel ? undefined : label}
        title={title}
        className={cn(TONE_CLASSES.running, SIZE_CLASSES[size], "inline-flex items-center gap-2", size === "sm" ? "px-1" : "px-2")}
      >
        <ProgressSpinner className="text-status-running" size={size === "sm" ? "sm" : "md"} label={label} />
        {showLabel ? <span>{label}</span> : null}
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      aria-label={showLabel ? undefined : label}
      title={title}
      className={cn(TONE_CLASSES[tone], SIZE_CLASSES[size], "mol-motion-state inline-flex items-center gap-2")}
    >
      {dot ? <span aria-hidden="true" className={cn("inline-block size-1.5 rounded-full", DOT_CLASSES[tone])} /> : null}
      {showLabel ? <span>{label}</span> : null}
    </Badge>
  );
}
