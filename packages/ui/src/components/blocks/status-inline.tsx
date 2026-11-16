/**
 * Status distribution: how a set of children is doing, in one line.
 *
 * Domain-free block. Products map their verdicts to the status vocabulary and
 * pass counts; this block owns the stacked bar, legend, and accessible summary.
 */

import type { JSX } from "react";
import { cn } from "../../lib/utils";
import { StatusMark, statusFill, type Status } from "../ui/status-mark";

export interface StatusSegment {
  status: Status;
  count: number;
  /** The word shown beside the count. */
  label: string;
}

export interface StatusInlineProps {
  /** What is counted, already phrased: "4 records", "187 tests". */
  total: string;
  segments: StatusSegment[];
  className?: string;
}

export const StatusInline = ({ total, segments, className }: StatusInlineProps): JSX.Element => {
  const shown = segments.filter(segment => segment.count > 0);
  const sum = shown.reduce((acc, segment) => acc + segment.count, 0);

  return (
    <div data-slot="status-inline" className={cn("flex flex-wrap items-center gap-x-4 gap-y-2", className)}>
      <span className="whitespace-nowrap text-label text-muted-foreground">{total}</span>
      {sum > 0 && (
        <div
          role="img"
          aria-label={shown.map(segment => `${segment.count} ${segment.label}`).join(", ")}
          className="flex h-1 w-40 overflow-hidden rounded-full bg-muted"
        >
          {shown.map(segment => (
            <span key={segment.status} className={statusFill[segment.status]} style={{ width: `${(segment.count / sum) * 100}%` }} />
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {shown.map(segment => (
          <span key={segment.status} className="inline-flex items-center gap-1 text-label">
            <StatusMark status={segment.status} />
            <span className="tabular-nums text-foreground">{segment.count}</span>
            <span className="text-muted-foreground">{segment.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
