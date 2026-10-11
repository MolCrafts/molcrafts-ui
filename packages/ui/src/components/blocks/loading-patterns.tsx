/**
 * Loading patterns built from the same structure as what they stand in for,
 * so a surface does not jump when its data arrives. Loading never reads as empty.
 *
 * Domain-free block. Pair each pattern with a status or aria-busy region in the product.
 */

import type { JSX } from "react";
import { cn } from "../../lib/utils";
import { Skeleton } from "../ui/skeleton";

export interface BandSkeletonProps {
  /** `facts` mirrors MetaStrip; `measures` adds MeasureBand's meter. */
  variant?: "facts" | "measures";
  className?: string;
}

export const BandSkeleton = ({ variant = "facts", className }: BandSkeletonProps): JSX.Element => (
  <div aria-hidden="true" data-slot="band-skeleton" className={cn("flex border-b border-border pb-3", className)}>
    {Array.from({ length: variant === "facts" ? 5 : 4 }, (_, i) => (
      <div key={i} className="flex flex-1 flex-col gap-1 px-4 first:pl-0 [&+&]:border-l [&+&]:border-border">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-4 w-20" />
        {variant === "measures" && <Skeleton className="mt-1 h-1 w-full" />}
      </div>
    ))}
  </div>
);

export interface RowsSkeletonProps {
  rows?: number;
  /** `row` matches a table or list row; `line` matches a log line. */
  density?: "row" | "line";
  className?: string;
}

export const RowsSkeleton = ({ rows = 4, density = "row", className }: RowsSkeletonProps): JSX.Element => (
  <div aria-hidden="true" data-slot="rows-skeleton" className={cn("flex flex-col gap-1", className)}>
    {Array.from({ length: rows }, (_, i) => (
      <Skeleton key={i} className={density === "row" ? "h-8" : "h-3"} />
    ))}
  </div>
);
