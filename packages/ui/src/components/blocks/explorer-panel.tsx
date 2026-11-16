/**
 * Explorer panel: a titled, scrollable navigator column.
 *
 * Domain-free block. Products own the list and the actions; this block owns
 * the toolbar-height header, the heading, and the scroller.
 */

import type { JSX, ReactNode } from "react";
import { cn } from "../../lib/utils";
import { ScrollArea } from "../ui/scroll-area";

export interface ExplorerPanelProps {
  title: string;
  /** Icon buttons right of the title. */
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function ExplorerPanel({ title, actions, children, className, bodyClassName }: ExplorerPanelProps): JSX.Element {
  return (
    <div data-slot="explorer-panel" className={cn("flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", className)}>
      <header className="flex h-toolbar shrink-0 items-center justify-between gap-2 border-b border-border px-3">
        <h2 className="min-w-0 truncate text-body-lg font-semibold text-foreground">{title}</h2>
        {actions ? <div className="flex shrink-0 items-center gap-0.5">{actions}</div> : null}
      </header>
      <ScrollArea className="min-h-0 flex-1">
        <div className={cn("min-h-full p-3", bodyClassName)}>{children}</div>
      </ScrollArea>
    </div>
  );
}
