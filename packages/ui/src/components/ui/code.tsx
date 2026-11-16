import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../../lib/utils";

/**
 * Mono text for machine syntax (coordinates, digests, paths).
 * `inline` for prose/table cells; `block` for copyable multi-line blobs.
 */
const codeVariants = cva("rounded-control bg-muted font-mono text-foreground", {
  variants: {
    variant: {
      inline: "px-1 py-px font-medium",
      block: "block w-full overflow-x-auto px-3 py-2 text-body",
    },
    wrap: {
      none: "",
      anywhere: "[overflow-wrap:anywhere]",
    },
  },
  compoundVariants: [
    { variant: "inline", wrap: "none", class: "whitespace-nowrap" },
    { variant: "block", wrap: "none", class: "whitespace-pre" },
    { variant: "block", wrap: "anywhere", class: "whitespace-pre-wrap" },
  ],
  defaultVariants: {
    variant: "inline",
    wrap: "none",
  },
});

function Code({
  className,
  variant,
  wrap,
  ...props
}: React.ComponentProps<"code"> & VariantProps<typeof codeVariants>) {
  return (
    <code data-slot="code" className={cn(codeVariants({ variant, wrap }), className)} {...props} />
  );
}

export { Code, codeVariants };
