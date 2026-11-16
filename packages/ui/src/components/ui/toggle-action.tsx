import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";

export interface ToggleActionProps extends Omit<ComponentProps<typeof Button>, "variant" | "size" | "aria-pressed"> {
  selected: boolean;
}

/** Compact text toggle. Selected state is the secondary fill. */
export function ToggleAction({ selected, className, ...props }: ToggleActionProps) {
  return (
    <Button
      variant={selected ? "secondary" : "ghost"}
      size="sm"
      aria-pressed={selected}
      className={cn("[&_svg]:size-4", className)}
      {...props}
    />
  );
}
