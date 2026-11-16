/**
 * Kbd: one shortcut chip. The product supplies the key text.
 */

import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";

export function Kbd({ className, ...props }: ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "inline-flex shrink-0 items-center rounded-control border border-border bg-muted px-1.5 font-mono text-micro leading-5 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
