import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export interface ToolButtonProps
  extends Omit<ComponentProps<typeof Button>, "variant" | "size" | "aria-label" | "aria-pressed" | "title"> {
  label: string;
  selected?: boolean;
  tooltip?: ReactNode;
  tooltipSide?: ComponentProps<typeof TooltipContent>["side"];
  children: ReactNode;
}

/** Compact icon tool. Selected state is a filled accent button. */
export function ToolButton({
  label,
  selected,
  tooltip = label,
  tooltipSide = "bottom",
  className,
  children,
  ...props
}: ToolButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={selected ? "default" : "ghost"}
          size="icon-sm"
          aria-label={label}
          aria-pressed={selected === undefined ? undefined : selected}
          data-active={selected ? "true" : "false"}
          className={cn(
            "size-control-compact [&_svg]:size-4",
            selected && "ring-2 ring-accent-foreground/80 ring-inset hover:bg-accent-hover",
            className,
          )}
          {...props}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide}>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
