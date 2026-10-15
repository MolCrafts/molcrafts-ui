/**
 * Callout: a compact status line with an icon and a live region.
 *
 * AlertDialog remains the confirm dialog. This is the inline notice.
 */

import { ErrorCircleRegular, InfoRegular, WarningRegular } from "@fluentui/react-icons";
import type { JSX, ReactNode } from "react";
import { cn } from "../../lib/utils";

export type CalloutTone = "info" | "warning" | "error";

const TONE: Record<CalloutTone, { box: string; icon: string; Icon: typeof InfoRegular }> = {
  info: {
    box: "border-border/70 bg-muted/30 text-muted-foreground",
    icon: "text-muted-foreground",
    Icon: InfoRegular,
  },
  warning: {
    box: "border-status-warning/25 bg-status-warning-soft text-status-warning-foreground",
    icon: "text-status-warning",
    Icon: WarningRegular,
  },
  error: {
    box: "border-status-failed/25 bg-status-failed-soft text-status-failed-foreground",
    icon: "text-status-failed-foreground",
    Icon: ErrorCircleRegular,
  },
};

export interface CalloutProps {
  tone?: CalloutTone;
  children: ReactNode;
  className?: string;
}

export function Callout({ tone = "info", children, className }: CalloutProps): JSX.Element {
  const { box, icon, Icon } = TONE[tone];
  return (
    <p
      data-slot="callout"
      role={tone === "error" ? "alert" : "status"}
      aria-live={tone === "error" ? "assertive" : "polite"}
      aria-atomic="true"
      className={cn(
        "mt-2 flex items-start gap-2 rounded-md border px-2 py-2 text-micro leading-snug",
        box,
        className,
      )}
    >
      <Icon className={cn("mt-px size-3 shrink-0", icon)} />
      <span className="min-w-0">{children}</span>
    </p>
  );
}
