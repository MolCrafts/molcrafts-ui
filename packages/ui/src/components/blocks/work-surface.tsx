/**
 * Work surface: the one scroller every workbench tab renders into.
 *
 * Domain-free block. Padding, gap, and scroll chrome live here so switching
 * tabs never shifts the first row.
 */

import type { JSX, ReactNode } from "react";
import { cn } from "../../lib/utils";
import { ScrollArea } from "../ui/scroll-area";

export interface WorkSurfaceProps {
  children: ReactNode;
  className?: string;
}

export function WorkSurface({ children, className }: WorkSurfaceProps): JSX.Element {
  return (
    <ScrollArea data-slot="work-surface" className="min-h-0 flex-1">
      <div className={cn("flex flex-col gap-4 p-4", className)}>{children}</div>
    </ScrollArea>
  );
}
