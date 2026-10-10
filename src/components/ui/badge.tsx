import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-control border px-2 py-0.5 text-label font-semibold",
  {
    variants: {
      variant: {
        default: "border-transparent bg-accent-muted text-accent-muted-foreground",
        secondary:
          "border-transparent bg-muted text-secondary-foreground",
        destructive:
          "border-transparent bg-status-failed-soft text-status-failed-foreground",
        success: "border-transparent bg-status-completed-soft text-status-completed-foreground",
        warning: "border-transparent bg-status-warning-soft text-status-warning-foreground",
        info: "border-transparent bg-status-running-soft text-status-running-foreground",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
