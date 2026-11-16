import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { TabsList, TabsTrigger } from "./tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export interface IconTabItem {
  value: string;
  label: string;
  icon: ReactNode;
}

export interface IconTabStripProps {
  items: IconTabItem[];
  label: string;
  disabled?: boolean;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  className?: string;
}

/** Glyph-only tabs that share the row width evenly. */
export function IconTabStrip({ items, label, disabled = false, tooltipSide = "bottom", className }: IconTabStripProps) {
  return (
    <TabsList
      variant="line"
      aria-label={label}
      className={cn(
        "flex h-full w-full min-h-0 min-w-0 gap-0 overflow-hidden rounded-none border-0 bg-transparent p-0",
        "group-data-[orientation=horizontal]/tabs:h-full",
        className,
      )}
    >
      {items.map((item) => (
        <Tooltip key={item.value}>
          <TooltipTrigger asChild>
            <TabsTrigger
              value={item.value}
              aria-label={item.label}
              disabled={disabled}
              className={cn(
                "h-full min-w-0 flex-1 basis-0 self-stretch rounded-none border-0 bg-transparent px-0 shadow-none",
                "text-muted-foreground hover:text-foreground",
                "focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
                "focus-visible:bg-interactive/60",
                "aria-selected:text-accent",
                "group-data-[orientation=horizontal]/tabs:after:inset-x-2 group-data-[orientation=horizontal]/tabs:after:bottom-0 group-data-[orientation=horizontal]/tabs:after:h-px",
                "aria-selected:after:opacity-100 after:bg-accent",
              )}
            >
              <span className="flex size-4 items-center justify-center [&_svg]:size-4" aria-hidden>
                {item.icon}
              </span>
            </TabsTrigger>
          </TooltipTrigger>
          <TooltipContent side={tooltipSide}>{item.label}</TooltipContent>
        </Tooltip>
      ))}
    </TabsList>
  );
}
