import type { JSX } from "react";
import { cn } from "../../lib/utils";

/**
 * The MolCrafts status vocabulary. A new word is a constitution change, not a
 * product decision; products map their own verdicts onto these nine.
 */
export type Status =
  | "draft"
  | "ready"
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled"
  | "cached"
  | "warning";

/** Literal classes so Tailwind can see every status fill. */
export const statusFill: Record<Status, string> = {
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

export interface StatusMarkProps {
  status: Status;
  className?: string;
}

/**
 * The status dot. Decorative: color alone is unreadable in grayscale and to
 * colorblind readers, so every caller pairs it with the status word.
 */
export const StatusMark = ({ status, className }: StatusMarkProps): JSX.Element => (
  <span
    aria-hidden="true"
    data-slot="status-mark"
    data-status={status}
    className={cn("size-1.5 shrink-0 rounded-full", statusFill[status], className)}
  />
);
