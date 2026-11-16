/**
 * Metric list: the scalar fields of one object, label left and quantity right.
 *
 * Domain-free block. A property list, not a table of records: values are
 * tabular so digits line up down the column.
 */

import type { JSX } from "react";
import { cn } from "../../lib/utils";

export interface Metric {
  label: string;
  /** Already formatted. This block does not decide precision. */
  value: string;
  unit?: string;
}

export interface MetricListProps {
  metrics: Metric[];
  /** Two columns from the small breakpoint, once a single column would be tall. Default 2. */
  columns?: 1 | 2;
  className?: string;
}

export function MetricList({ metrics, columns = 2, className }: MetricListProps): JSX.Element {
  return (
    <dl data-slot="metric-list" className={cn("grid gap-x-8", columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1", className)}>
      {metrics.map(metric => (
        <div key={metric.label} className="flex min-h-control-compact items-baseline justify-between gap-4 border-b border-border py-1">
          <dt className="min-w-0 truncate text-label text-muted-foreground">{metric.label}</dt>
          <dd className="shrink-0 text-body tabular-nums text-foreground">
            {metric.value}
            {metric.unit && <span className="ml-1 text-label text-muted-foreground">{metric.unit}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}
