/**
 * Icon action: an icon button with a required accessible name and tooltip.
 *
 * The product owns which icon and what the action does. Selected state is a
 * quiet secondary fill. A filled accent tool stays a product control.
 */

import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Kbd } from "./kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export interface IconActionProps
  extends Omit<
    ComponentProps<typeof Button>,
    "variant" | "size" | "children" | "aria-label" | "title" | "aria-pressed"
  > {
  icon: ReactNode;
  /** Accessible name and tooltip. */
  label: string;
  selected?: boolean;
  /** One key that runs the action, e.g. "F". Shown in the tooltip. */
  shortcut?: string;
  tooltipSide?: ComponentProps<typeof TooltipContent>["side"];
}

export function IconAction({
  icon,
  label,
  selected,
  shortcut,
  tooltipSide = "bottom",
  className,
  ...props
}: IconActionProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={selected ? "secondary" : "ghost"}
          size="icon-sm"
          aria-label={label}
          aria-pressed={selected === undefined ? undefined : selected}
          aria-keyshortcuts={shortcut}
          className={cn("size-control-compact [&_svg]:size-4", className)}
          {...props}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide}>
        {label}
        {shortcut && <Kbd className="ml-2">{shortcut.toUpperCase()}</Kbd>}
      </TooltipContent>
    </Tooltip>
  );
}
